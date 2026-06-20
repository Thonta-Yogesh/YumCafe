#!/bin/bash
# Smart-Cart Food App Startup Script
# Double-click this file in Finder to start the app

cd "$(dirname "$0")"

# 1. Setup Backend
cd backend
if [ ! -d "node_modules" ] || [ ! -d "node_modules/nodemailer" ]; then
  echo "📦 Installing backend dependencies (this might take a moment)..."
  npm install
else
  echo "✅ Backend dependencies already installed."
fi

# Start backend in background
echo "🚀 Starting backend server..."
node server.js &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 3

# 2. Setup Frontend
cd ../frontend
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
else
  echo "✅ Frontend dependencies already installed."
fi

# Start frontend
echo "🚀 Starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "  Smart-Cart Food App is starting..."
echo "  Backend PID: $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo "  Backend URL: http://localhost:5001"
echo "  Frontend URL: http://localhost:3000"
echo "============================================"
echo ""
echo "  Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
