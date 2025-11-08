#!/bin/bash

echo "========================================"
echo "ChronoFlow - Quick Start"
echo "========================================"
echo ""

# Start Flask backend in background
echo "Starting Flask backend..."
python3 app.py &

# Wait a moment for server to start
sleep 3

echo ""
echo "========================================"
echo "Server is running!"
echo "Open http://localhost:8000 in your browser"
echo "Or run: python3 -m http.server 8000"
echo "========================================"
echo ""

# Open browser (uncomment for your OS)
# macOS:
# open http://localhost:8000

# Linux:
# xdg-open http://localhost:8000

echo "Press Ctrl+C to stop the server"
wait

