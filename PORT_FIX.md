# Port 8000 Already in Use - Fixed!

## What Happened
Port 8000 was already being used by another process (PID 6100), preventing the backend from starting.

## Solution Applied
✅ Changed backend default port from **8000** to **8001**
✅ Updated `.env.local` to point to port **8001**

## How to Run Now

### Backend (Terminal 1)
```powershell
cd backend
.\venv\Scripts\activate
python main.py
```
Backend will now start on: **http://localhost:8001**

### Frontend (Terminal 2)
```powershell
npm run dev
```
Frontend will connect to backend on port 8001 automatically.

### Access Application
Open: **http://localhost:3000**

## If You Want to Use Port 8000 Instead

1. **Kill the process using port 8000:**
   ```powershell
   # Run PowerShell as Administrator
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   ```

2. **Change backend back to port 8000:**
   - Edit `backend/main.py` line 112: change `8001` to `8000`
   - Edit `.env.local`: change `8001` to `8000`

## Verify Port is Free
```powershell
netstat -ano | findstr :8001
```
If nothing shows, the port is free!

