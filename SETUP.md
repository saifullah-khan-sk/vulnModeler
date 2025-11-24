# VulnModeler - Complete Setup Guide

This guide will walk you through setting up the complete VulnModeler security analysis platform.

## Prerequisites

### System Requirements
- Node.js 18+ and npm 8+
- Python 3.8+
- Git

### Optional
- Graphviz (for enhanced architecture diagrams)
  - Ubuntu: `sudo apt-get install graphviz`
  - macOS: `brew install graphviz`
  - Windows: Download from https://graphviz.org/download/

## Installation Steps

### 1. Clone or Extract the Project

\`\`\`bash
# If you have the project as a ZIP
unzip vulnmodeler.zip
cd vulnmodeler
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (optional, for custom configuration)
cp .env.example .env

# Test the backend
python main.py
# You should see: Uvicorn running on http://0.0.0.0:8000
\`\`\`

The backend will be available at:
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/openapi.json

### 3. Frontend Setup

\`\`\`bash
# Navigate back to root and into frontend
cd ..

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
# You should see: ▲ Next.js 16.0.3
\`\`\`

The frontend will be available at: http://localhost:3000

## Running the Application

### Start Both Services

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
npm run dev
\`\`\`

Then open http://localhost:3000 in your browser.

## Quick Test

1. Go to http://localhost:3000
2. Click "Scanner" in the sidebar
3. Create a test Python file with some vulnerable code:
   \`\`\`python
   import os
   password = "mypassword123"
   os.system(f"ls {user_input}")
   \`\`\`
4. Upload the file
5. View the analysis results

## Environment Configuration

### Frontend (.env.local)

\`\`\`bash
# API endpoint - change if backend is on different host/port
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

### Backend (.env)

\`\`\`bash
# CORS origins - add your frontend URL
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Maximum file size in bytes (default: 10MB)
MAX_FILE_SIZE=10485760

# Allowed file extensions
ALLOWED_EXTENSIONS=py,js,ts,jsx,tsx,java,cpp,c,go,rs
\`\`\`

## Building for Production

### Frontend

\`\`\`bash
# Build the Next.js app
npm run build

# Start production server
npm start
\`\`\`

### Backend

\`\`\`bash
# Install production dependencies
pip install -r requirements.txt

# Run with production settings
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
\`\`\`

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
\`\`\`bash
# On Linux/macOS, find and kill the process
lsof -i :8000
kill -9 <PID>

# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
\`\`\`

**ModuleNotFoundError: No module named 'fastapi'**
\`\`\`bash
# Make sure virtual environment is activated and requirements installed
pip install -r requirements.txt
\`\`\`

**graphviz not installed:**
\`\`\`bash
# The app will still work, but use fallback SVG diagrams
# To install graphviz:
# Linux: sudo apt-get install graphviz
# macOS: brew install graphviz
# Windows: https://graphviz.org/download/
\`\`\`

### Frontend Issues

**CORS errors:**
- Check that CORS_ORIGINS in backend/.env includes your frontend URL
- Restart the backend after changing .env
- Ensure frontend is accessing the correct API URL

**API not reachable:**
\`\`\`bash
# Test if backend is running
curl http://localhost:8000/health

# You should see: {"status":"healthy","service":"VulnModeler API"}
\`\`\`

**Modules not found:**
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

## Project Structure Overview

\`\`\`
vulnmodeler/
├── backend/
│   ├── main.py           - FastAPI app with endpoints
│   ├── analyzer.py       - Vulnerability detection
│   ├── threat_model.py   - STRIDE threat modeling
│   ├── diagrams.py       - Architecture diagram generation
│   ├── models.py         - Data models
│   ├── config.py         - Configuration
│   ├── requirements.txt  - Python dependencies
│   └── .env.example      - Environment template
│
├── app/
│   ├── page.tsx         - Main app component
│   ├── layout.tsx       - Root layout
│   └── globals.css      - Global styles
│
├── pages/
│   ├── dashboard.tsx     - Dashboard view
│   ├── scanner.tsx       - Upload and analysis
│   ├── vulnerabilities.tsx - Detailed findings
│   └── diagram-page.tsx  - Architecture view
│
├── components/
│   ├── sidebar.tsx       - Navigation
│   ├── upload-card.tsx   - File upload
│   ├── vulnerabilities-table.tsx - Findings display
│   ├── quick-stats.tsx   - Statistics
│   └── diagram-viewer.tsx - Diagram display
│
└── lib/
    └── api.ts           - API client
\`\`\`

## Key Features

- **20+ Vulnerability Patterns** - Comprehensive security detection
- **STRIDE Threat Modeling** - Professional threat classification
- **Architecture Diagrams** - Visual system representation
- **Real-time Analysis** - Instant vulnerability feedback
- **Modern UI** - Professional, responsive interface
- **Multi-Language Support** - Python, JS, TS, Java, C++, Go, Rust, etc.

## Performance Notes

- File uploads limited to 10MB (configurable)
- Typical analysis time: < 2 seconds
- Supports concurrent analysis requests
- No database required (JSON file-based)

## Next Steps

1. Read the main README.md for feature details
2. Check API documentation at http://localhost:8000/docs
3. Upload and analyze your own code
4. Review the threat models and recommendations
5. Download security reports for further analysis

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error messages in console
3. Ensure both backend and frontend are running
4. Verify network connectivity between services

Happy analyzing!
