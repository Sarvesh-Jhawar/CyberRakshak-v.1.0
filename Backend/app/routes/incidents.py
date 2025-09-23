from fastapi import APIRouter, HTTPException, status, Depends, Query, File, UploadFile, Form
from typing import List, Optional, Dict, Any
from datetime import datetime
import shutil
from app.models.incident import (
    IncidentCreate, IncidentUpdate, Incident, IncidentResponse, CommentCreate,
    IncidentStatus, IncidentSeverity, IncidentCategory, EvidenceType
)
from app.models.response import StandardResponse, PaginatedResponse
from app.utils.auth import get_current_active_user, require_admin
from app.utils.firebase import db, get_timestamp
from app.utils.helpers import generate_incident_id, get_risk_level
from app.utils.ml_models import ml_manager

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.post("/", response_model=StandardResponse, status_code=status.HTTP_201_CREATED)
async def create_incident(
    title: str = Form(...),
    category: IncidentCategory = Form(...),
    description: str = Form(...),
    evidence_type: Optional[EvidenceType] = Form(None),
    evidence_text: Optional[str] = Form(None),
    evidence_url: Optional[str] = Form(None),
    evidence: Optional[UploadFile] = File(None),
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Create a new incident report"""
    try:
        # Generate incident ID
        incident_id = generate_incident_id()

        evidence_filename = None
        if evidence and evidence.filename:
            # Sanitize filename and save the uploaded file
            safe_filename = f"{incident_id}_{evidence.filename.replace(' ', '_')}"
            file_location = f"media/{safe_filename}"
            with open(file_location, "wb+") as file_object:
                shutil.copyfileobj(evidence.file, file_object)
            evidence_filename = safe_filename

        # Perform ML analysis to get risk level BEFORE creating the document
        analysis_data = {
            "title": title,
            "category": category,
            "description": description,
            "evidence_text": evidence_text,
            "evidence_url": evidence_url,
        }
        risk_level = get_risk_level(analysis_data)

        # Create incident document
        incident_doc = {
            "id": incident_id,
            "title": title,
            "category": category,
            "description": description,
            "evidence_type": evidence_type,
            "evidence_text": evidence_text,
            "evidence_url": evidence_url,
            "evidence_files": [evidence_filename] if evidence_filename else [],
            "reporter_id": current_user["id"],
            "reporter_name": current_user["name"],
            "unit": current_user.get("unit"),
            "reporter_email": current_user["email"],
            "status": IncidentStatus.PENDING,
            "severity": IncidentSeverity(risk_level),
            "assigned_to": None,
            "admin_notes": "",
            "resolution_notes": None,
            "created_at": get_timestamp(),
            "updated_at": get_timestamp(),
            "resolved_at": None
        }
        
        # Save to database
        success = db.create_document("incidents", incident_id, incident_doc)
        
        if success:
            ml_analysis = None
            if evidence_text or evidence_url:
                ml_analysis = ml_manager.analyze_incident(analysis_data)
                
                # Update incident with ML analysis
                db.update_document("incidents", incident_id, {
                    "ml_analysis": ml_analysis,
                    "updated_at": get_timestamp()
                })
            
            # Create notifications for all admins
            admins = db.get_collection("users", [("role", "==", "ADMIN")])
            for admin in admins:
                db.create_document("notifications", None, {
                    "user_id": admin["id"],
                    "message": f"New incident '{incident_id}' reported by {current_user['name']}.",
                    "incident_id": incident_id,
                    "is_read": False,
                    "created_at": get_timestamp()
                })

            return StandardResponse(
                success=True,
                message="Incident reported successfully",
                data={
                    "incident_id": incident_id,
                    "status": IncidentStatus.PENDING,
                    "severity": risk_level,
                    "ml_analysis": ml_analysis
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create incident report"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create incident: {str(e)}"
        )

@router.get("/", response_model=List[IncidentResponse])
async def get_incidents(
    current_user: Dict[str, Any] = Depends(get_current_active_user),
    status_filter: Optional[IncidentStatus] = Query(None, description="Filter by status"),
    category_filter: Optional[IncidentCategory] = Query(None, description="Filter by category"),
    severity_filter: Optional[IncidentSeverity] = Query(None, description="Filter by severity"),
    limit: int = Query(50, ge=1, le=100, description="Number of incidents to return"),
    offset: int = Query(0, ge=0, description="Number of incidents to skip")
):
    """Get incidents (user sees their own, admin sees all)"""
    try:
        # Build filters
        filters = []
        
        # If user is not admin, only show their incidents
        if current_user.get("role") != "ADMIN":
            filters.append(("reporter_id", "==", current_user["id"]))
        
        # Apply additional filters
        if status_filter:
            filters.append(("status", "==", status_filter))
        if category_filter:
            filters.append(("category", "==", category_filter))
        if severity_filter:
            filters.append(("severity", "==", severity_filter))
        
        # Get incidents from database
        incidents = db.get_collection("incidents", filters)
        
        # Sort by created_at descending (newest first)
        incidents.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        
        # Apply pagination
        paginated_incidents = incidents[offset:offset + limit]
        
        # Convert to response format
        incident_responses = []
        for incident in paginated_incidents:
            incident_responses.append(IncidentResponse(
                id=incident["id"],
                title=incident.get("title", "Untitled Incident"),
                category=incident["category"],
                description=incident["description"],
                status=incident["status"],
                severity=incident["severity"],
                reporter_name=incident["reporter_name"],
                created_at=incident["created_at"],
                updated_at=incident["updated_at"],
                assigned_to=incident.get("assigned_to"),
                unit=incident.get("unit")
            ))
        
        return incident_responses
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get incidents: {str(e)}"
        )

@router.get("/{incident_id}", response_model=Incident)
async def get_incident(
    incident_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Get a specific incident by ID"""
    try:
        # Get incident from database
        incident = db.get_document("incidents", incident_id)
        
        if not incident:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Incident not found"
            )
        
        # Check permissions (user can only see their own incidents unless admin)
        if (current_user.get("role") != "ADMIN" and 
            incident.get("reporter_id") != current_user["id"]):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Ensure comments are included, even if the field is missing in the DB
        if "comments" not in incident:
            incident["comments"] = []
            
        return Incident(**incident)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get incident: {str(e)}"
        )

@router.put("/{incident_id}", response_model=StandardResponse)
async def update_incident(
    incident_id: str,
    incident_update: IncidentUpdate,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Update an incident (admin only)"""
    try:
        # Check if incident exists
        incident = db.get_document("incidents", incident_id)
        if not incident:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Incident not found"
            )
        
        # Prepare update data
        update_data = {}
        for field, value in incident_update.dict(exclude_unset=True).items():
            if value is not None:
                update_data[field] = value
        
        # Add updated timestamp
        update_data["updated_at"] = get_timestamp()
        
        # If status is being changed to resolved, set resolved_at
        if incident_update.status == IncidentStatus.RESOLVED:
            update_data["resolved_at"] = get_timestamp()
        
        # Update incident
        success = db.update_document("incidents", incident_id, update_data)
        
        if success:
            return StandardResponse(
                success=True,
                message="Incident updated successfully",
                data={"incident_id": incident_id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update incident"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update incident: {str(e)}"
        )

@router.delete("/{incident_id}", response_model=StandardResponse)
async def delete_incident(
    incident_id: str,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Delete an incident (admin only)"""
    try:
        # Check if incident exists
        incident = db.get_document("incidents", incident_id)
        if not incident:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Incident not found"
            )
        
        # Delete incident
        success = db.delete_document("incidents", incident_id)
        
        if success:
            return StandardResponse(
                success=True,
                message="Incident deleted successfully"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete incident"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete incident: {str(e)}"
        )

@router.post("/{incident_id}/comments", response_model=StandardResponse)
async def add_comment_to_incident(
    incident_id: str,
    comment_data: CommentCreate,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Add a comment to an incident (admin only)"""
    try:
        # Check if incident exists
        incident = db.get_document("incidents", incident_id)
        if not incident:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Incident not found"
            )

        # Create comment document
        new_comment = {
            "author_id": current_user["id"],
            "author_name": current_user["name"],
            "text": comment_data.text,
            "created_at": get_timestamp()
        }

        # Get existing comments or initialize an empty list
        existing_comments = incident.get("comments", [])
        existing_comments.append(new_comment)

        # Update the incident with the new comments list and an updated timestamp
        success = db.update_document("incidents", incident_id, {"comments": existing_comments, "updated_at": get_timestamp()})

        if success:
            # Create a notification for the user who reported the incident
            db.create_document("notifications", None, {
                "user_id": incident["reporter_id"],
                "message": f"A new comment has been added to your incident report {incident_id}.",
                "incident_id": incident_id,
                "is_read": False,
                "created_at": get_timestamp()
            })
            return StandardResponse(success=True, message="Comment added successfully")
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to add comment"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add comment: {str(e)}"
        )

@router.get("/stats/summary", response_model=Dict[str, Any])
async def get_incident_stats(
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Get incident statistics"""
    try:
        # Get all incidents (filtered by user if not admin)
        filters = []
        if current_user.get("role") != "ADMIN":
            filters.append(("reporter_id", "==", current_user["id"]))
        
        incidents = db.get_collection("incidents", filters)
        
        # Calculate statistics
        total_incidents = len(incidents)
        pending_incidents = len([i for i in incidents if i.get("status") == IncidentStatus.PENDING])
        under_review = len([i for i in incidents if i.get("status") == IncidentStatus.UNDER_REVIEW])
        resolved_incidents = len([i for i in incidents if i.get("status") == IncidentStatus.RESOLVED])
        closed_incidents = len([i for i in incidents if i.get("status") == IncidentStatus.CLOSED])
        
        # Category breakdown
        category_stats = {}
        for incident in incidents:
            category = incident.get("category", "unknown")
            category_stats[category] = category_stats.get(category, 0) + 1
        
        # Severity breakdown
        severity_stats = {}
        for incident in incidents:
            severity = incident.get("severity", "unknown")
            severity_stats[severity] = severity_stats.get(severity, 0) + 1
        
        return {
            "total_incidents": total_incidents,
            "pending_incidents": pending_incidents,
            "under_review": under_review,
            "resolved_incidents": resolved_incidents,
            "closed_incidents": closed_incidents,
            "category_breakdown": category_stats,
            "severity_breakdown": severity_stats
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get incident statistics: {str(e)}"
        )
