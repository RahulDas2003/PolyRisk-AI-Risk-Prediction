#!/usr/bin/env python3
"""
Simple FastAPI server for PolyRisk AI
This is a simplified version that should work reliably
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json
from pathlib import Path
from datetime import datetime

# Create FastAPI app
app = FastAPI(title="PolyRisk AI Simple Server", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data file path
FILE_PATH = Path("patient_data.json")

# Simple models
class Medication(BaseModel):
    name: str
    dose: str
    frequency: str
    category: str

class PatientData(BaseModel):
    patient_name: str
    age: int
    gender: str
    kidney_function: str
    liver_function: str
    medications: List[Medication]
    polypharmacy_risk: bool
    medication_count: int
    timestamp: str
    risk_factors: List[str]
    clinical_notes: str

class PatientPayload(BaseModel):
    patient_data: PatientData
    real_time_analysis: Dict[str, Any]
    export_timestamp: str
    version: str

# Load existing data
def load_data():
    if FILE_PATH.exists():
        try:
            with open(FILE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return {"patients": []}
    return {"patients": []}

# Save data
def save_data(data):
    try:
        with open(FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving data: {e}")
        return False

# Routes
@app.get("/")
def root():
    return {
        "message": "PolyRisk AI Backend Server",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/save-patient", "/patients", "/stats"]
    }

@app.post("/save-patient")
def save_patient(data: PatientPayload):
    try:
        all_data = load_data()
        
        # Create patient entry
        patient_entry = {
            "id": f"patient_{len(all_data['patients']) + 1}_{int(datetime.now().timestamp())}",
            "saved_at": datetime.now().isoformat(),
            "data": data.dict()
        }
        
        all_data["patients"].append(patient_entry)
        
        if save_data(all_data):
            return {
                "status": "success",
                "message": "Patient data saved successfully!",
                "patient_id": patient_entry["id"],
                "total_patients": len(all_data["patients"])
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to save data")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/patients")
def get_patients():
    try:
        all_data = load_data()
        return {
            "status": "success",
            "total_patients": len(all_data["patients"]),
            "patients": all_data["patients"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
def get_stats():
    try:
        all_data = load_data()
        total_patients = len(all_data["patients"])
        
        # Calculate some basic stats
        polypharmacy_count = 0
        total_age = 0
        
        for patient in all_data["patients"]:
            if patient["data"]["patient_data"]["polypharmacy_risk"]:
                polypharmacy_count += 1
            total_age += patient["data"]["patient_data"]["age"]
        
        avg_age = total_age / total_patients if total_patients > 0 else 0
        
        return {
            "status": "success",
            "statistics": {
                "total_patients": total_patients,
                "polypharmacy_cases": polypharmacy_count,
                "average_age": round(avg_age, 1),
                "file_exists": FILE_PATH.exists(),
                "file_size_kb": round(FILE_PATH.stat().st_size / 1024, 2) if FILE_PATH.exists() else 0
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting PolyRisk AI Simple Server...")
    print("📍 Server: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    print("🛑 Press Ctrl+C to stop")
    print("-" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
