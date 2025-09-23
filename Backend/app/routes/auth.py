from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Dict, Any, Optional
from app.utils.auth import (
    authenticate_user, create_access_token, get_password_hash,
    get_current_user, generate_user_id, validate_email_domain,
)
from app.utils.firebase import db, get_timestamp
from app.config import settings
from app.models.user import UserCreate, UserLogin, Token, User, UserRole
from app.models.response import StandardResponse
from pydantic import BaseModel, EmailStr

class UserResponse(BaseModel):
    id: str
    name: str
    service_id: str
    relation: str
    email: EmailStr
    phone: str
    unit: str
    clearance_level: str
    role: UserRole
    is_active: bool

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    service_id: Optional[str] = None
    relation: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    unit: Optional[str] = None
    clearance_level: Optional[str] = None

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=StandardResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        # Validate email domain
        if not validate_email_domain(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email must be from a trusted domain (defence.mil, army.mil, etc.)"
            )
        
        # Check if user already exists
        existing_users = db.query_documents("users", "email", "==", user_data.email)
        if existing_users:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Check if service ID already exists
        existing_service_ids = db.query_documents("users", "service_id", "==", user_data.service_id)
        if existing_service_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this service ID already exists"
            )
        
        # Generate user ID
        user_id = generate_user_id(user_data.email)
        
        # Create user document
        user_doc = {
            "id": user_id,
            "name": user_data.name,
            "service_id": user_data.service_id,
            "relation": user_data.relation,
            "email": user_data.email,
            "phone": user_data.phone,
            "unit": user_data.unit,
            "clearance_level": user_data.clearance_level,
            "password_hash": get_password_hash(user_data.password),
            "role": UserRole.USER,
            "is_active": True,
            "created_at": get_timestamp(),
            "updated_at": get_timestamp(),
            "last_login": None
        }
        
        # Save to database
        success = db.create_document("users", user_id, user_doc)
        
        if success:
            return StandardResponse(
                success=True,
                message="User registered successfully",
                data={"user_id": user_id, "email": user_data.email}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user account"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    """Authenticate user and return access token"""
    try:
        # Authenticate user
        user = authenticate_user(login_data.email, login_data.password)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["email"], "user_id": user["id"]},
            expires_delta=access_token_expires
        )
        
        # Update last login
        db.update_document("users", user["id"], {
            "last_login": get_timestamp()
        })
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            role=user.get("role", UserRole.USER),
            user_id=user.get("id")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/logout", response_model=StandardResponse)
async def logout(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Logout user (client-side token removal)"""
    try:
        # In a stateless JWT system, logout is handled client-side
        # We could implement token blacklisting here if needed
        
        return StandardResponse(
            success=True,
            message="Logged out successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user information"""
    try:
        # Remove sensitive information
        user_info = current_user.copy()
        user_info.pop("password_hash", None)

        return UserResponse(**user_info)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user info: {str(e)}"
        )

@router.put("/me", response_model=StandardResponse)
async def update_current_user_profile(
    profile_data: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update current user's profile information"""
    try:
        user_id = current_user["id"]
        
        # Prepare update data, excluding unset fields
        update_data = profile_data.dict(exclude_unset=True)
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No update data provided"
            )
            
        update_data["updated_at"] = get_timestamp()
        
        # Update user document
        success = db.update_document("users", user_id, update_data)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update profile in database.")

        # Fetch the updated user to return
        updated_user = db.get_document("users", user_id)
        updated_user.pop("password_hash", None)

        return StandardResponse(success=True, message="Profile updated successfully", data=updated_user)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Refresh access token"""
    try:
        # Create new access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user["email"], "user_id": current_user["id"]},
            expires_delta=access_token_expires
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            role=UserRole(current_user.get("role", "USER")),
            user_id=current_user["id"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )
