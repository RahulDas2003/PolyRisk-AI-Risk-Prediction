@echo off
echo ========================================
echo Starting PolyRisk AI - All Services
echo ========================================
echo.
echo Starting Main API (Port 8000)...
start "Main API" cmd /k "cd backend && python patient_api.py"
timeout /t 2 /nobreak >nul

echo Starting Analytics API (Port 8001)...
start "Analytics API" cmd /k "cd backend && python analytics_api.py"
timeout /t 2 /nobreak >nul

echo Starting Chatbot API (Port 8002)...
start "Chatbot API" cmd /k "cd backend && python chatbot_api.py"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo All APIs Started Successfully!
echo ========================================
echo.
echo Main API:      http://localhost:8000
echo Analytics API: http://localhost:8001
echo Chatbot API:   http://localhost:8002
echo.
echo Press any key to exit...
pause >nul
