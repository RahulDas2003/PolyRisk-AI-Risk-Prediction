# PolyRisk AI - Patient Risk Analyzer System

## Overview

This comprehensive system uses Gemini AI to analyze patient data from `patient_data.json` and provides real-time risk assessment based on:

- **Age-based risk scoring**: 60-70 (+1), 70-80 (+2), 80+ (+3)
- **Organ function risk**: Kidney impairment (+1), Liver impairment (+1)
- **Drug interactions**: Analyzed using Gemini AI with Google search integration
- **Side effects**: AI-powered analysis of medication side effects
- **Risk levels**: Low (≤4), Moderate (5-6), High (>6)

## System Components

### 1. TypeScript Patient Data Analyzer (`src/lib/patientDataAnalyzer.ts`)

**Features:**
- Integrates with existing Gemini AI system
- Calculates risk scores according to exact criteria
- Processes patient data from JSON files
- Provides comprehensive analysis results

**Key Functions:**
- `calculateBaseRiskScore()` - Calculates age and organ function risk
- `analyzePatientWithGemini()` - Full AI analysis using Gemini
- `processAllPatientsFromJSON()` - Batch processing
- `loadAndAnalyzePatientData()` - API integration

### 2. React Component (`src/components/PatientRiskAnalyzer.tsx`)

**Features:**
- Beautiful UI with tabbed interface
- Real-time analysis progress
- Export functionality
- Detailed patient views
- Risk score visualization

**Key Components:**
- Risk score breakdown display
- Patient list with risk levels
- Detailed analysis views
- Export to JSON functionality

### 3. Python Analyzer (`backend/analyze_patients.py`)

**Features:**
- Standalone patient data analysis
- Risk score calculation
- Comprehensive reporting
- JSON export functionality

**Usage:**
```bash
cd backend
python analyze_patients.py
```

### 4. FastAPI Backend (`backend/patient_api.py`)

**Features:**
- RESTful API for patient data
- CORS enabled for frontend integration
- Summary statistics endpoint
- Health check endpoint

**Endpoints:**
- `GET /api/patient-data` - All patients
- `GET /api/patient-data/{id}` - Specific patient
- `GET /api/patient-data/summary` - Statistics
- `GET /api/health` - Health check

## Installation & Setup

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install fastapi uvicorn python-multipart
```

### 2. Environment Variables

Create `.env` file in project root:
```
REACT_APP_SUPABASE_URL=https://jahlgqavwdxvwrjwlpem.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphaGxncWF2d2R4dndyandscGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTI1MDEsImV4cCI6MjA3NTA4ODUwMX0.ve38Kc86UQAgFHH8pASLneWWw4atx_-npVf9orYNFic
REACT_APP_GEMINI_API_KEY=AIzaSyCRfKwrBVo9aMj6mrXsRpvwPIkMCwd3Bpw
```

### 3. Start the System

**Backend API:**
```bash
cd backend
python start_api.py
# OR
python patient_api.py
```

**Frontend:**
```bash
npm start
```

## Usage

### 1. Dashboard Integration

The analyzer is integrated into the Dashboard with a tab system:
- **Analytics Tab**: Original dashboard with charts and analytics
- **Risk Analyzer Tab**: New comprehensive patient risk analyzer

### 2. Patient Analysis

**Individual Analysis:**
1. Go to Dashboard → Risk Analyzer tab
2. Click "Analyze All Patients" to process all data
3. View detailed results for each patient
4. Export results as JSON

**Batch Analysis:**
```bash
cd backend
python analyze_patients.py
```

### 3. API Integration

**Get All Patients:**
```bash
curl http://localhost:8000/api/patient-data
```

**Get Patient Summary:**
```bash
curl http://localhost:8000/api/patient-data/summary
```

## Risk Scoring System

### Base Risk Calculation
- **Age 60-69**: +1 point
- **Age 70-79**: +2 points  
- **Age 80+**: +3 points
- **Kidney Impairment**: +1 point
- **Liver Impairment**: +1 point

### Additional Risk Factors
- **Drug Interactions**: Analyzed by Gemini AI
- **Side Effects**: AI-powered assessment
- **Polypharmacy**: 5+ medications = high risk

### Risk Levels
- **Low Risk**: ≤4 points
- **Moderate Risk**: 5-6 points
- **High Risk**: >6 points

## Sample Analysis Results

```
Patient: Pranjal Khali (65 years)
- Age Risk: 1 point
- Kidney Risk: 1 point (mild impairment)
- Liver Risk: 1 point (moderate impairment)
- Base Score: 3/10
- Risk Level: LOW
- Medications: 4 (Warfarin, Metformin, Nitroaspirin, Digoxin)
```

## Features

### ✅ Completed
- [x] TypeScript patient data analyzer
- [x] React component with beautiful UI
- [x] Python standalone analyzer
- [x] FastAPI backend integration
- [x] Risk scoring system implementation
- [x] Gemini AI integration
- [x] Dashboard tab system
- [x] Export functionality
- [x] Comprehensive reporting

### 🔄 In Progress
- [ ] Real-time Google search integration
- [ ] Advanced drug interaction mapping
- [x] Patient data persistence
- [x] Risk visualization charts

## File Structure

```
src/
├── lib/
│   ├── patientDataAnalyzer.ts    # Main analyzer logic
│   └── geminiAI.ts               # Gemini AI integration
├── components/
│   └── PatientRiskAnalyzer.tsx   # React component
└── pages/
    └── Dashboard.tsx              # Updated dashboard

backend/
├── patient_api.py                 # FastAPI server
├── analyze_patients.py           # Python analyzer
├── start_api.py                  # Startup script
└── patient_data.json             # Patient data file
```

## API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patient-data` | Get all patients |
| GET | `/api/patient-data/{id}` | Get specific patient |
| GET | `/api/patient-data/summary` | Get statistics |
| GET | `/api/health` | Health check |

### Response Format

```json
{
  "success": true,
  "patients": [...],
  "total_count": 3,
  "timestamp": "2025-10-05T11:25:12"
}
```

## Troubleshooting

### Common Issues

1. **Gemini AI not working**: Check API key in `.env`
2. **Patient data not loading**: Ensure `patient_data.json` exists
3. **CORS errors**: Check backend is running on port 8000
4. **Encoding errors**: Use UTF-8 encoding for Python scripts

### Debug Commands

```bash
# Check backend health
curl http://localhost:8000/api/health

# Test patient data
curl http://localhost:8000/api/patient-data

# Run Python analyzer
cd backend && python analyze_patients.py
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the PolyRisk AI system for healthcare risk assessment.
