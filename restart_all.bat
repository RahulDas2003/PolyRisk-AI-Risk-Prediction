@echo off
echo Restarting PolyRisk AI - Frontend and Backend
echo ================================================

echo.
echo Stopping all processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul

echo.
echo Starting Main API (Port 8000)...
start "Main API" cmd /k "cd backend && python patient_api.py"

timeout /t 3 /nobreak > nul

echo Starting Analytics API (Port 8001)...
start "Analytics API" cmd /k "cd backend && python -m uvicorn analytics_api:app --host 0.0.0.0 --port 8001"

timeout /t 3 /nobreak > nul

echo Starting Frontend (Port 3000)...
start "Frontend" cmd /k "npm start"

echo.
echo ================================================
echo All services are starting...
echo.
echo Main API: http://localhost:8000
echo Analytics API: http://localhost:8001  
echo Frontend: http://localhost:3000
echo.
echo Check the terminal windows for startup status.
echo ================================================

pause
