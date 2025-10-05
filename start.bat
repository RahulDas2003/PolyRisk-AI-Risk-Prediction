@echo off
echo Starting PolyRisk AI Application...
echo.

echo Installing frontend dependencies...
cd /d "%~dp0"
call npm install

echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && python -m pip install -r requirements.txt && python run.py"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting frontend development server...
start "Frontend Server" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
