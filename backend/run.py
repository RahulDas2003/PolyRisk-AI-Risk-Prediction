#!/usr/bin/env python3
"""
PolyRisk AI Backend Server
Flask application for drug interaction analysis
"""

from app import app

if __name__ == '__main__':
    print("Starting PolyRisk AI Backend Server...")
    print("API Documentation: http://localhost:5000/api/health")
    print("Frontend should connect to: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
