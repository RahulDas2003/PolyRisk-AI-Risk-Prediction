#!/usr/bin/env python3
"""
PolyRisk AI - FastAPI backend for serving patient data and Gemini AI analysis
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# FileResponse import removed (DOCX functionality removed)
from datetime import datetime
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv
# DOCX functionality removed as per user request

# ==========================================================
# ⚙️ Load Environment Variables
# ==========================================================
# Use the provided API key directly
API_KEY = "AIzaSyCRfKwrBVo9aMj6mrXsRpvwPIkMCwd3Bpw"
genai.configure(api_key=API_KEY)

# ==========================================================
# ⚙️ FastAPI Configuration
# ==========================================================
app = FastAPI(title="PolyRisk AI Patient Data API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# 📂 Utility Function
# ==========================================================
DATA_FILE = "patient_data.json"

def load_patient_data() -> dict:
    """Load patient data from JSON file"""
    if not os.path.exists(DATA_FILE):
        return {"patients": []}  # return empty if file missing
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading patient data: {str(e)}")

def save_patient_to_file(new_patient: dict):
    """Append patient data to JSON file"""
    data = load_patient_data()
    data["patients"].append(new_patient)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ==========================================================
# 🩺 Core Endpoints
# ==========================================================
@app.get("/")
async def root():
    return {
        "message": "PolyRisk AI Backend is Running",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/patient-data")
async def get_all_patients():
    data = load_patient_data()
    return {
        "success": True,
        "patients": data.get("patients", []),
        "total_count": len(data.get("patients", [])),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/save-patient")
async def save_patient_data(patient_data: dict):
    """Save patient data to file"""
    try:
        patient_id = f"patient_{len(load_patient_data().get('patients', [])) + 1}_{int(datetime.now().timestamp())}"
        new_patient = {
            "id": patient_id,
            "saved_at": datetime.now().isoformat(),
            "data": patient_data
        }
        save_patient_to_file(new_patient)
        return {"success": True, "message": "Patient data saved.", "patient_id": patient_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save patient: {str(e)}")

# ==========================================================
# 🧠 AI Analysis Endpoint (Gemini Integration)
# ==========================================================
@app.post("/analyze_patient")
async def analyze_patient():
    """Performs polypharmacy risk analysis using Gemini AI"""
    try:
        data = load_patient_data()
        patients = data.get("patients", [])
        if not patients:
            raise HTTPException(status_code=404, detail="No patients found in data file.")

        # Use latest patient
        latest_patient = patients[-1]
        patient = latest_patient["data"]["patient_data"]
        meds = patient["medications"]
        kidney = patient["kidney_function"].lower()
        liver = patient["liver_function"].lower()

        # === Calculate Base Risk Score ===
        base_score = 0
        
        # Age-based scoring
        if 60 <= patient['age'] < 70:
            base_score += 0.5
        elif 70 <= patient['age'] < 80:
            base_score += 1.0
        elif patient['age'] >= 80:
            base_score += 1.5
        
        # Kidney function scoring
        kidney_scores = {"normal": 0, "mild": 0.5, "moderate": 1.0, "severe": 1.5}
        base_score += kidney_scores.get(kidney, 0)
        
        # Liver function scoring
        liver_scores = {"normal": 0, "mild": 0.5, "moderate": 1.0, "severe": 1.5}
        base_score += liver_scores.get(liver, 0)
        
        # === Build Gemini Prompt ===
        prompt = f"""
        You are a clinical pharmacology AI assistant with access to up-to-date medical literature.
        Analyze this patient's data and medications for drug–drug interactions, organ toxicity, and risk.

        Patient Details:
        - Name: {patient['patient_name']}
        - Age: {patient['age']}
        - Gender: {patient['gender']}
        - Kidney function: {kidney}
        - Liver function: {liver}
        - Medications: {json.dumps(meds, indent=2)}

        BASE RISK SCORE CALCULATION:
        - Age {patient['age']}: {base_score - kidney_scores.get(kidney, 0) - liver_scores.get(liver, 0):.1f} points
        - Kidney function ({kidney}): +{kidney_scores.get(kidney, 0):.1f} points
        - Liver function ({liver}): +{liver_scores.get(liver, 0):.1f} points
        - BASE SCORE: {base_score:.1f}/10

        For each medication, evaluate:
        1. Drug-drug interaction risks with other medications
        2. Side effects and their severity
        3. Organs affected (kidney, liver, heart, etc.)
        4. Individual risk contribution to overall score

        ADDITIONAL SCORING RULES:
        - For each drug that affects kidney function AND patient has kidney impairment: +1.0
        - For each drug that affects liver function AND patient has liver impairment: +1.0
        - For each drug-drug interaction with risk_score ≥60: +0.5
        - For each drug-drug interaction with risk_score ≥80: +1.0
        - For polypharmacy (≥5 medications): +1.0

        Output a structured JSON report with:
        {{
          "patient_name": "{patient['patient_name']}",
          "age": {patient['age']},
          "base_risk_score": {base_score:.1f},
          "risk_summary": {{
            "overall_risk_score": "<calculated 0–10>",
            "risk_level": "Low | Moderate | High",
            "scoring_breakdown": {{
              "age_contribution": "<age points>",
              "kidney_contribution": "<kidney points>",
              "liver_contribution": "<liver points>",
              "drug_interactions": "<interaction points>",
              "organ_effects": "<organ effect points>",
              "polypharmacy": "<polypharmacy points>"
            }},
            "notes": "Detailed explanation of risk factors and scoring"
          }},
          "drug_analysis": [
            {{
              "name": "<Drug>",
              "category": "<Drug category/class>",
              "interaction_risks": [
                {{
                  "drug": "<Other drug>", 
                  "interaction": "<Detailed interaction description>", 
                  "risk_score": <0–100>,
                  "clinical_impact": "<Severity and clinical implications>"
                }}
              ],
              "side_effects": [
                {{
                  "effect": "<Side effect name>",
                  "severity": "<Mild/Moderate/Severe>",
                  "frequency": "<Common/Uncommon/Rare>"
                }}
              ],
              "organs_affected": [
                {{
                  "organ": "<Organ name>",
                  "effect": "<Type of effect>",
                  "severity": "<Mild/Moderate/Severe>"
                }}
              ],
              "individual_risk_score": "<calculated 0-10>",
              "risk_contribution": "<How this drug contributes to overall risk>"
            }}
          ],
          "drug_alternatives": [
            {{
              "original_drug": "<Drug>",
              "alternatives": [
                {{
                  "alternative_name": "<Drug>",
                  "advantages": ["Benefits"],
                  "disadvantages": ["Drawbacks"],
                  "dosing_recommendation": "<Suggested dose>",
                  "monitoring_parameters": ["Labs to monitor"],
                  "risk_reduction": "<How much this reduces overall risk>"
                }}
              ]
            }}
          ],
          "clinical_recommendations": [
            "List of key recommendations for safer prescribing and monitoring."
          ]
        }}

        FINAL SCORING GUIDELINES:
        - 0–3.0 = Low Risk
        - 3.1–6.0 = Moderate Risk  
        - 6.1–10.0 = High Risk
        - Provide detailed breakdown of how each factor contributes to the final score
        """

        # === Call Gemini 2.5 Flash ===
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)

        try:
            parsed_result = json.loads(response.text)
        except:
            parsed_result = {"raw_text": response.text.strip()}

        # Create patient_analysis_data folder if it doesn't exist
        analysis_folder = "patient_analysis_data"
        if not os.path.exists(analysis_folder):
            os.makedirs(analysis_folder)
        
        # Save analysis to file with patient name in filename
        patient_name_clean = patient["patient_name"].replace(" ", "_").replace("/", "_").replace("\\", "_")
        analysis_file = f"{analysis_folder}/ai_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{patient_name_clean}.json"
        with open(analysis_file, "w", encoding="utf-8") as f:
            json.dump({
                "patient_name": patient["patient_name"],
                "analysis": parsed_result,
                "timestamp": datetime.now().isoformat()
            }, f, indent=2, ensure_ascii=False)

        return {
            "status": "success",
            "patient_name": patient["patient_name"],
            "analysis": parsed_result,
            "timestamp": datetime.now().isoformat(),
            "analysis_file": analysis_file
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================================
# 📁 Patient Analysis Data Management
# ==========================================================
@app.get("/api/analysis-files")
async def get_analysis_files():
    """Get all patient analysis files from the patient_analysis_data folder"""
    try:
        analysis_folder = "patient_analysis_data"
        if not os.path.exists(analysis_folder):
            return {"status": "success", "files": [], "message": "No analysis folder found"}
        
        files = []
        for filename in os.listdir(analysis_folder):
            if filename.endswith('.json'):
                file_path = os.path.join(analysis_folder, filename)
                file_stats = os.stat(file_path)
                files.append({
                    "filename": filename,
                    "size": file_stats.st_size,
                    "created": datetime.fromtimestamp(file_stats.st_ctime).isoformat(),
                    "modified": datetime.fromtimestamp(file_stats.st_mtime).isoformat()
                })
        
        # Sort by creation time (newest first)
        files.sort(key=lambda x: x['created'], reverse=True)
        
        return {
            "status": "success",
            "files": files,
            "total_count": len(files),
            "folder": analysis_folder
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading analysis files: {str(e)}")

@app.get("/api/analysis-files/{filename}")
async def get_analysis_file(filename: str):
    """Get a specific patient analysis file"""
    try:
        analysis_folder = "patient_analysis_data"
        file_path = os.path.join(analysis_folder, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Analysis file not found")
        
        with open(file_path, "r", encoding="utf-8") as f:
            analysis_data = json.load(f)
        
        return {
            "status": "success",
            "filename": filename,
            "data": analysis_data
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading analysis file: {str(e)}")

# ==========================================================
# 📄 DOCX Report Generation Endpoints
# ==========================================================
# DOCX endpoints removed as per user request

# ==========================================================
# ❤️ Health Check
# ==========================================================
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "PolyRisk AI API", "timestamp": datetime.now().isoformat()}

# ==========================================================
# 🚀 Run Server
# ==========================================================
if __name__ == "__main__":
    import uvicorn
    print("Starting PolyRisk AI Backend...")
    print("API Docs: http://localhost:8000/docs")
    print("Analyze Endpoint: POST /analyze_patient")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)