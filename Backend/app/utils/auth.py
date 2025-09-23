from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
from app.models.user import TokenData, UserRole
from app.utils.firebase import db
import hashlib

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token handling
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[TokenData]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        if email is None or user_id is None:
            return None
        return TokenData(email=email, user_id=user_id)
    except JWTError:
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    token_data = verify_token(token)
    if token_data is None:
        raise credentials_exception
    
    # Get user from database
    user_data = db.get_document("users", token_data.user_id)
    if user_data is None:
        raise credentials_exception
    
    return user_data

def get_current_active_user(current_user: dict = Depends(get_current_user)):
    """Get current active user"""
    if not current_user.get("is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def require_admin(current_user: dict = Depends(get_current_active_user)):
    """Require admin role"""
    if current_user.get("role") != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

def authenticate_user(email: str, password: str) -> Optional[dict]:
    """Authenticate a user with email and password"""
    # Query user by email
    users = db.query_documents("users", "email", "==", email)
    if not users:
        return None
    
    user = users[0]
    if not verify_password(password, user.get("password_hash", "")):
        return None
    
    return user

def generate_incident_id() -> str:
    """Generate a unique incident ID"""
    import time
    timestamp = str(int(time.time()))
    return f"INC-{timestamp[-6:]}"

def generate_user_id(email: str) -> str:
    """Generate a unique user ID based on email"""
    return hashlib.md5(email.encode()).hexdigest()

def validate_email_domain(email: str) -> bool:
    """Validate if email is from a trusted domain"""
    trusted_domains = ["defence.mil", "army.mil", "navy.mil", "airforce.mil", "test.com", "gmail.com"]
    domain = email.split("@")[-1].lower()
    return domain in trusted_domains
