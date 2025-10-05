#!/bin/bash

echo "Starting PolyRisk AI Application..."
echo

echo "Installing frontend dependencies..."
npm install

echo
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt

echo
echo "Starting backend server..."
python run.py &
BACKEND_PID=$!

echo
echo "Waiting for backend to start..."
sleep 5

echo
echo "Starting frontend development server..."
cd ..
npm start &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
