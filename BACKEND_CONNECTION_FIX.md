# Backend Connection Issue - Fixed!

## Problems Found
1. ❌ `src/api.js` was using `REACT_APP_API_URL` (wrong for Next.js)
2. ❌ Default port was still `8000` in API files
3. ❌ `.env.local` file was missing

## Fixes Applied
✅ Updated `src/api.js` to use `NEXT_PUBLIC_API_URL` (Next.js environment variable)
✅ Changed default port from `8000` to `8001` in both API files
✅ Created `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8001`

## Next Steps

### 1. Restart the Frontend
Since we changed environment variables, you need to restart Next.js:
```powershell
# Stop the current server (Ctrl+C)
npm run dev
```

### 2. Make Sure Backend is Running
In a separate terminal:
```powershell
cd backend
.\venv\Scripts\activate
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
```

### 3. Test the Connection
Once both are running:
- Frontend: http://localhost:3000
- Backend: http://localhost:8001
- Health check: http://localhost:8001/health

## Files Updated
- `src/api.js` - Changed to use `NEXT_PUBLIC_API_URL` and port 8001
- `lib/api.ts` - Changed default port to 8001
- `.env.local` - Created with correct API URL

## Important Note
Next.js requires environment variables to be prefixed with `NEXT_PUBLIC_` to be accessible in the browser. The old `REACT_APP_API_URL` was for Create React App, not Next.js.

