#!/usr/bin/env python3
"""
Startup script for PolyRisk AI Patient Data API
"""

import subprocess
import sys
import os
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = ['fastapi', 'uvicorn', 'python-multipart']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"Missing required packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        for package in missing_packages:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
        print("Dependencies installed successfully!")

def start_api():
    """Start the FastAPI server"""
    print("Starting PolyRisk AI Patient Data API...")
    print("=" * 50)
    
    # Check if patient_data.json exists
    if not os.path.exists('patient_data.json'):
        print("Warning: patient_data.json not found in current directory")
        print("Please ensure the file exists for the API to work properly")
    
    try:
        # Start the API server
        subprocess.run([
            sys.executable, '-m', 'uvicorn', 
            'patient_api:app', 
            '--host', '0.0.0.0', 
            '--port', '8000', 
            '--reload'
        ])
    except KeyboardInterrupt:
        print("\nAPI server stopped.")
    except Exception as e:
        print(f"Error starting API server: {e}")

if __name__ == "__main__":
    print("PolyRisk AI - Patient Data API Startup")
    print("=" * 50)
    
    # Check and install dependencies
    check_dependencies()
    
    # Start the API
    start_api()
