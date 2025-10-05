@echo off
echo Starting Analytics API...
cd backend
python -m uvicorn analytics_api:app --host 0.0.0.0 --port 8001
pause
