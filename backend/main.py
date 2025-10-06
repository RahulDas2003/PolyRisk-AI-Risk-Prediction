from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
from pathlib import Path
from datetime import datetime
import uvicorn

app = FastAPI(title="PolyRisk AI Patient Data API", version="1.0.0")

# Allow frontend requests (adjust origin accordingly)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to JSON file
FILE_PATH = Path("patient_data.json")
BACKUP_PATH = Path("patient_data_backup.json")

# Pydantic models for validation
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

class RealTimeAnalysis(BaseModel):
    extracted_data: PatientData
    risk_indicators: List[str]
    clinical_alerts: List[str]
    monitoring_suggestions: List[str]
    confidence_score: int

class PatientPayload(BaseModel):
    patient_data: PatientData
    real_time_analysis: RealTimeAnalysis
    export_timestamp: str
    version: str

class AnalysisResult(BaseModel):
    patient_data: PatientData
    analysis_result: Dict[str, Any]
    timestamp: str

# Utility functions
def load_existing_data():
    """Load existing patient data from file"""
    if FILE_PATH.exists():
        try:
            with open(FILE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading existing data: {e}")
            return {"patients": [], "analyses": []}
    return {"patients": [], "analyses": []}

def save_data(data):
    """Save data to file with backup"""
    try:
        # Create backup
        if FILE_PATH.exists():
            with open(FILE_PATH, "r", encoding="utf-8") as f:
                backup_data = f.read()
            with open(BACKUP_PATH, "w", encoding="utf-8") as f:
                f.write(backup_data)
        
        # Save new data
        with open(FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return True
    except Exception as e:
        print(f"Error saving data: {e}")
        return False

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "PolyRisk AI Patient Data API",
        "version": "1.0.0",
        "endpoints": {
            "save_patient": "POST /save-patient",
            "save_analysis": "POST /save-analysis", 
            "get_patients": "GET /patients",
            "get_analyses": "GET /analyses",
            "clear_data": "DELETE /clear-data"
        }
    }

@app.post("/save-patient")
async def save_patient(data: PatientPayload):
    """Save patient data to JSON file"""
    try:
        all_data = load_existing_data()
        
        # Add new patient data
        patient_entry = {
            "id": f"patient_{len(all_data['patients']) + 1}_{int(datetime.now().timestamp())}",
            "saved_at": datetime.now().isoformat(),
            "data": data.dict()
        }
        
        all_data["patients"].append(patient_entry)
        
        # Save to file
        if save_data(all_data):
            return {
                "status": "success", 
                "message": "Patient data saved successfully!",
                "patient_id": patient_entry["id"],
                "total_patients": len(all_data["patients"])
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to save data to file")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving patient data: {str(e)}")

@app.post("/save-analysis")
async def save_analysis(data: AnalysisResult):
    """Save analysis result to JSON file"""
    try:
        all_data = load_existing_data()
        
        # Add new analysis
        analysis_entry = {
            "id": f"analysis_{len(all_data['analyses']) + 1}_{int(datetime.now().timestamp())}",
            "saved_at": datetime.now().isoformat(),
            "data": data.dict()
        }
        
        all_data["analyses"].append(analysis_entry)
        
        # Save to file
        if save_data(all_data):
            return {
                "status": "success", 
                "message": "Analysis result saved successfully!",
                "analysis_id": analysis_entry["id"],
                "total_analyses": len(all_data["analyses"])
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to save analysis to file")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving analysis: {str(e)}")

@app.get("/patients")
async def get_patients():
    """Get all saved patient data"""
    try:
        all_data = load_existing_data()
        return {
            "status": "success",
            "total_patients": len(all_data["patients"]),
            "patients": all_data["patients"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving patients: {str(e)}")

@app.get("/analyses")
async def get_analyses():
    """Get all saved analysis results"""
    try:
        all_data = load_existing_data()
        return {
            "status": "success",
            "total_analyses": len(all_data["analyses"]),
            "analyses": all_data["analyses"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving analyses: {str(e)}")

@app.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    """Get specific patient data by ID"""
    try:
        all_data = load_existing_data()
        patient = next((p for p in all_data["patients"] if p["id"] == patient_id), None)
        
        if patient:
            return {"status": "success", "patient": patient}
        else:
            raise HTTPException(status_code=404, detail="Patient not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving patient: {str(e)}")

@app.delete("/clear-data")
async def clear_data():
    """Clear all patient data (for testing)"""
    try:
        empty_data = {"patients": [], "analyses": []}
        if save_data(empty_data):
            return {"status": "success", "message": "All data cleared successfully!"}
        else:
            raise HTTPException(status_code=500, detail="Failed to clear data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing data: {str(e)}")

@app.get("/stats")
async def get_stats():
    """Get statistics about saved data"""
    try:
        all_data = load_existing_data()
        
        # Calculate some basic stats
        total_patients = len(all_data["patients"])
        total_analyses = len(all_data["analyses"])
        
        # Count polypharmacy cases
        polypharmacy_count = sum(1 for p in all_data["patients"] 
                               if p["data"]["patient_data"]["polypharmacy_risk"])
        
        # Age distribution
        ages = [p["data"]["patient_data"]["age"] for p in all_data["patients"]]
        avg_age = sum(ages) / len(ages) if ages else 0
        
        return {
            "status": "success",
            "statistics": {
                "total_patients": total_patients,
                "total_analyses": total_analyses,
                "polypharmacy_cases": polypharmacy_count,
                "average_age": round(avg_age, 1),
                "file_size_kb": round(FILE_PATH.stat().st_size / 1024, 2) if FILE_PATH.exists() else 0
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating stats: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
