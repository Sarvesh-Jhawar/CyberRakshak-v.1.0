from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.utils.auth import get_current_active_user, require_admin
from app.utils.firebase import db, get_timestamp
from app.models.response import StandardResponse

router = APIRouter()

# Get all notifications
@router.get("/notifications", response_model=List[Dict[str, Any]])
async def get_notifications(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """Get all notifications for the current user"""
    try:
        # Get notifications for the current user
        notifications = db.query_documents("notifications", "user_id", "==", current_user["id"])
        
        # Sort by timestamp (newest first)
        notifications.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        
        return notifications
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch notifications: {str(e)}"
        )

# Mark notification as read
@router.put("/notifications/{notification_id}/read", response_model=StandardResponse)
async def mark_notification_read(
    notification_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Mark a notification as read"""
    try:
        # Get the notification
        notification = db.get_document("notifications", notification_id)
        if not notification:
            raise HTTPException(
                status_code=404,
                detail="Notification not found"
            )
        
        # Check if user owns this notification
        if notification.get("user_id") != current_user["id"]:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to modify this notification"
            )
        
        # Update notification
        update_data = {
            "is_read": True,
            "read_at": get_timestamp()
        }
        
        success = db.update_document("notifications", notification_id, update_data)
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Failed to update notification"
            )
        
        return StandardResponse(
            success=True,
            message="Notification marked as read"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to mark notification as read: {str(e)}"
        )

# Delete notification
@router.delete("/notifications/{notification_id}", response_model=StandardResponse)
async def delete_notification(
    notification_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Delete a notification"""
    try:
        # Get the notification
        notification = db.get_document("notifications", notification_id)
        if not notification:
            raise HTTPException(
                status_code=404,
                detail="Notification not found"
            )
        
        # Check if user owns this notification
        if notification.get("user_id") != current_user["id"]:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to delete this notification"
            )
        
        # Delete notification
        success = db.delete_document("notifications", notification_id)
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Failed to delete notification"
            )
        
        return StandardResponse(
            success=True,
            message="Notification deleted successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete notification: {str(e)}"
        )

# Mark all notifications as read
@router.put("/notifications/read-all", response_model=StandardResponse)
async def mark_all_notifications_read(
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Mark all notifications as read for the current user"""
    try:
        # Get all unread notifications for the user
        notifications = db.query_documents("notifications", "user_id", "==", current_user["id"])
        unread_notifications = [n for n in notifications if not n.get("is_read", False)]
        
        # Update each notification
        updated_count = 0
        for notification in unread_notifications:
            update_data = {
                "is_read": True,
                "read_at": get_timestamp()
            }
            if db.update_document("notifications", notification["id"], update_data):
                updated_count += 1
        
        return StandardResponse(
            success=True,
            message=f"Marked {updated_count} notifications as read"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to mark notifications as read: {str(e)}"
        )

# Get notification count
@router.get("/notifications/count", response_model=Dict[str, Any])
async def get_notification_count(
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Get notification count for the current user"""
    try:
        # Get all notifications for the user
        notifications = db.query_documents("notifications", "user_id", "==", current_user["id"])
        
        total_count = len(notifications)
        unread_count = len([n for n in notifications if not n.get("is_read", False)])
        
        return {
            "total": total_count,
            "unread": unread_count,
            "read": total_count - unread_count
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get notification count: {str(e)}"
        )
