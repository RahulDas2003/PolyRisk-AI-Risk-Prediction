#!/usr/bin/env python3
"""
Start the Analytics API server
"""

import subprocess
import sys
import os

def start_analytics_api():
    """Start the analytics API server"""
    try:
        print("🚀 Starting PolyRisk AI Analytics API...")
        print("📊 Analytics API: http://localhost:8001")
        print("📈 Model Accuracy: GET /api/model-accuracy")
        print("📊 Live Analytics: GET /api/live-analytics")
        print("📋 Dashboard Metrics: GET /api/dashboard-metrics")
        print("=" * 50)
        
        # Change to backend directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Start the analytics API
        subprocess.run([sys.executable, "analytics_api.py"], check=True)
        
    except KeyboardInterrupt:
        print("\n🛑 Analytics API stopped by user")
    except Exception as e:
        print(f"❌ Error starting Analytics API: {e}")

if __name__ == "__main__":
    start_analytics_api()
