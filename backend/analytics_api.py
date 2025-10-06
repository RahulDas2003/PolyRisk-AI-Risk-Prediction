#!/usr/bin/env python3
"""
PolyRisk AI - Analytics API
Provides live analytics data for the dashboard
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json
import os
from accuracy_calculator import PolyRiskAccuracyCalculator

# ==========================================================
# ⚙️ FastAPI Configuration
# ==========================================================
app = FastAPI(title="PolyRisk AI Analytics API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize accuracy calculator
calculator = PolyRiskAccuracyCalculator()

# ==========================================================
# 📊 Analytics Endpoints
# ==========================================================
@app.get("/")
async def root():
    return {
        "message": "PolyRisk AI Analytics API is Running",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/model-accuracy")
async def get_model_accuracy():
    """Get model accuracy data"""
    try:
        accuracy_data = calculator.calculate_model_accuracy()
        return {
            "success": True,
            "data": accuracy_data,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating model accuracy: {str(e)}")

@app.get("/api/live-analytics")
async def get_live_analytics(user_id: str = None):
    """Get live analytics data for dashboard"""
    try:
        analytics_data = calculator.get_live_analytics(user_id)
        return {
            "success": True,
            "data": analytics_data,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating analytics: {str(e)}")

@app.get("/api/dashboard-metrics")
async def get_dashboard_metrics(user_id: str = None):
    """Get comprehensive dashboard metrics"""
    try:
        analytics = calculator.get_live_analytics(user_id)
        accuracy = calculator.calculate_model_accuracy()
        
        return {
            "success": True,
            "data": {
                "model_accuracy": accuracy,
                "live_metrics": {
                    "total_analyses": analytics["total_analyses"],
                    "high_risk_patients": analytics["high_risk_patients"],
                    "avg_risk_score": analytics["avg_risk_score"],
                    "this_month": analytics["this_month"]
                },
                "charts": {
                    "risk_distribution": analytics["risk_distribution"],
                    "age_groups": analytics["age_groups"],
                    "monthly_trends": analytics["monthly_trends"]
                },
                "recent_reports": analytics["recent_reports"]
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating dashboard metrics: {str(e)}")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "PolyRisk AI Analytics API", "timestamp": datetime.now().isoformat()}

# ==========================================================
# 🚀 Run Server
# ==========================================================
if __name__ == "__main__":
    import uvicorn
    print("Starting PolyRisk AI Analytics API...")
    print("Analytics API: http://localhost:8001")
    print("Model Accuracy: GET /api/model-accuracy")
    print("Live Analytics: GET /api/live-analytics")
    print("Dashboard Metrics: GET /api/dashboard-metrics")
    uvicorn.run("analytics_api:app", host="0.0.0.0", port=8001, reload=True)
