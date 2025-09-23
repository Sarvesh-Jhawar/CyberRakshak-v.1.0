#!/usr/bin/env python3
"""
CyberRakshak Backend Server
Run this script to start the FastAPI server
"""

import uvicorn

if __name__ == "__main__":
    print("Starting CyberRakshak Backend Server...")
    print("API Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    
    uvicorn.run(
        "app.main:app",  # <-- pass as string "module:app"
        host="127.0.0.1", # safer than 0.0.0.0 for local dev
        port=8000,
        reload=True,
        log_level="info"
    )
