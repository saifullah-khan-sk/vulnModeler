# Quick Start Guide

## Issues Fixed

1. ✅ Fixed import paths in `app/page.tsx` to point to correct `src/pages/` location
2. ✅ Created `VulnerabilitiesPage` component to display vulnerability reports
3. ✅ Updated `Scanner` component to accept `onAnalysisComplete` prop
4. ✅ Updated `Dashboard` component to accept `reportData` prop
5. ✅ Fixed API response transformation in `src/api.js` to match backend structure
6. ✅ Created `.env.local` file (you may need to create this manually if it's blocked)

## How to Run

### Step 1: Start the Backend

Open a terminal and run:

```powershell
cd backend
.\venv\Scripts\activate
python main.py
```

The backend will start on `http://localhost:8000`

### Step 2: Start the Frontend

Open a **new terminal** and run:

```powershell
npm run dev
```

The frontend will start on `http://localhost:3000`

### Step 3: Access the Application

Open your browser and go to: `http://localhost:3000`

## Environment Variables

### Frontend (.env.local)
Create a file named `.env.local` in the root directory with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
The backend uses default values, but you can create `backend/.env` if needed:
```
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=py,js,ts,jsx,tsx,java,cpp,c,go,rs
```

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Module not found:**
```powershell
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use:**
- Next.js will automatically use the next available port (3001, 3002, etc.)

**API connection errors:**
- Make sure the backend is running on port 8000
- Check that `.env.local` has the correct API URL
- Verify CORS settings in `backend/config.py`

**Module not found:**
```powershell
npm install
```

## Testing

1. Go to http://localhost:3000
2. Click "Scanner" in the sidebar
3. Upload a test file (e.g., a Python file with some code)
4. Click "Start Analysis"
5. View results in the "Vulnerabilities" page

## Project Structure

- `app/page.tsx` - Main app entry point
- `src/pages/` - Page components (Dashboard, Scanner, Vulnerabilities, DiagramPage)
- `src/api.js` - API client for backend communication
- `backend/main.py` - FastAPI backend server
- `backend/analyzer.py` - Vulnerability detection logic
- `backend/threat_model.py` - STRIDE threat modeling

