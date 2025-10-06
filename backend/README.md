# PolyRisk AI Backend Server

FastAPI backend server for persisting patient data and analysis results to JSON files.

## Features

- ✅ **Patient Data Persistence**: Saves structured JSON data to `patient_data.json`
- ✅ **Analysis Results**: Stores AI analysis results with timestamps
- ✅ **CORS Enabled**: Works with frontend applications
- ✅ **RESTful API**: Complete CRUD operations
- ✅ **Data Validation**: Pydantic models for type safety
- ✅ **Backup System**: Automatic backup before saving new data
- ✅ **Statistics**: API endpoints for data analytics

## Quick Start

### Option 1: Using the startup script (Recommended)
```bash
cd backend
python start_backend.py
```

### Option 2: Manual setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and available endpoints |
| POST | `/save-patient` | Save patient data and analysis |
| POST | `/save-analysis` | Save analysis results |
| GET | `/patients` | Get all saved patients |
| GET | `/patients/{id}` | Get specific patient by ID |
| GET | `/analyses` | Get all analysis results |
| GET | `/stats` | Get data statistics |
| DELETE | `/clear-data` | Clear all data (for testing) |

## Data Structure

The server saves data to `patient_data.json` with the following structure:

```json
{
  "patients": [
    {
      "id": "patient_1_1696345432",
      "saved_at": "2025-10-03T15:43:52.000Z",
      "data": {
        "patient_data": { ... },
        "real_time_analysis": { ... },
        "export_timestamp": "2025-10-03T15:43:52.000Z",
        "version": "1.0"
      }
    }
  ],
  "analyses": [
    {
      "id": "analysis_1_1696345432",
      "saved_at": "2025-10-03T15:43:52.000Z",
      "data": { ... }
    }
  ]
}
```

## Frontend Integration

The frontend automatically sends data to the backend when:
- Patient data is entered or modified
- "Analyze Drug Interactions" button is clicked
- Real-time analysis is performed

### Example Frontend Usage

```javascript
// Save patient data
const response = await fetch('http://localhost:8000/save-patient', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(patientData)
});

// Get all patients
const patients = await fetch('http://localhost:8000/patients');
```

## File Locations

- **Main Data File**: `patient_data.json`
- **Backup File**: `patient_data_backup.json`
- **Server Logs**: Console output

## Development

### Running in Development Mode
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

## Troubleshooting

### Common Issues

1. **Port 8000 already in use**
   - Change port in `main.py` or kill existing process
   - Use `lsof -ti:8000 | xargs kill -9` (macOS/Linux)

2. **CORS errors**
   - Backend is configured to allow all origins
   - Check that frontend is calling correct URL

3. **File permission errors**
   - Ensure write permissions in backend directory
   - Check disk space

### Logs
All operations are logged to console with emojis for easy identification:
- ✅ Success operations
- ❌ Error operations  
- 📊 Data operations
- 🔄 Processing operations

## Production Deployment

For production deployment, consider:
- Using a proper database (PostgreSQL, MongoDB)
- Implementing authentication
- Adding rate limiting
- Using environment variables for configuration
- Setting up proper logging
- Using HTTPS
