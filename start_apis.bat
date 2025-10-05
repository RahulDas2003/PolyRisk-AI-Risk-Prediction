@echo off
echo Starting PolyRisk AI APIs...
echo.

echo Starting Main API (Port 8000)...
start "Main API" cmd /k "cd backend && python patient_api.py"

timeout /t 3 /nobreak > nul

echo Starting Analytics API (Port 8001)...
start "Analytics API" cmd /k "cd backend && python analytics_api.py"

timeout /t 2 /nobreak > nul

echo.
echo ✅ Both APIs are starting...
echo 📊 Main API: http://localhost:8000
echo 📈 Analytics API: http://localhost:8001
echo.
echo Press any key to exit...
pause > nul
