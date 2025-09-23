import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from app.config import settings
from app.routes import auth, incidents, admin, report, notifications
from app.utils.firebase import initialize_firebase
import uvicorn

# Create media directory if it doesn't exist
media_dir = "media"
if not os.path.exists(media_dir):
    os.makedirs(media_dir)

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CyberRakshak - Defence Cybersecurity Portal API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Mount static files directory to serve media files
app.mount("/media", StaticFiles(directory=media_dir), name="media")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase
try:
    initialize_firebase()
    print("Firebase initialized successfully")
except Exception as e:
    print(f"Warning: Firebase initialization failed: {e}")

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(incidents.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(report.router)
app.include_router(notifications.router, prefix="/api/v1")

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "CyberRakshak API",
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": "2024-01-16T10:30:00Z",
        "version": settings.VERSION
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "error": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Application startup event"""
    print(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    print("API Documentation available at /docs")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event"""
    print("Shutting down CyberRakshak API")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
