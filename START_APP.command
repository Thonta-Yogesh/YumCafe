#!/bin/bash
# Smart-Cart Food App Startup Script
# Double-click this file in Finder to start the app

cd "$(dirname "$0")"

# Start backend in background
cd backend
echo "🚀 Starting backend server..."
node server.js &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 3

# Start frontend
cd ../frontend
echo "🚀 Starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "  Smart-Cart Food App is starting..."
echo "  Backend PID: $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo "============================================"
echo ""
echo "  Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
