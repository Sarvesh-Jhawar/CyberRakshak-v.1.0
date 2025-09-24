from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CyberRakshak API"
    VERSION: str = "1.0.0"

    # LLM API Keys
    MISTRAL_API_KEY: str

    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Firebase Configuration
    FIREBASE_PROJECT_ID: str = "your-firebase-project-id"
    FIREBASE_PRIVATE_KEY_ID: str = "your-private-key-id"
    FIREBASE_PRIVATE_KEY: str = "your-private-key"
    FIREBASE_CLIENT_EMAIL: str = "your-client-email"
    FIREBASE_CLIENT_ID: str = "your-client-id"
    FIREBASE_AUTH_URI: str = "https://accounts.google.com/o/oauth2/auth"
    FIREBASE_TOKEN_URI: str = "https://oauth2.googleapis.com/token"
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL: str = "https://www.googleapis.com/oauth2/v1/certs"
    FIREBASE_CLIENT_X509_CERT_URL: str = "your-client-cert-url"
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: Optional[str] = None

    @property
    def cors_origins(self) -> list[str]:
        if self.BACKEND_CORS_ORIGINS:
            return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(',')]
        return []
    
    # Database Settings
    DATABASE_URL: str = "firestore"
    
    # ML Models Path
    ML_MODELS_PATH: str = "../models"
    ML_API_BASE_URL: str = "http://127.0.0.1:8000"
    
    # Debug Mode
    DEBUG: bool = True
    
    class Config:
        case_sensitive = True

settings = Settings()