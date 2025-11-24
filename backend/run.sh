#!/bin/bash
# VulnModeler Backend Runner

echo "Starting VulnModeler Backend Server..."
echo "API will be available at http://localhost:8000"
echo "API Docs at http://localhost:8000/docs"

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
