# Next.js Directory Conflict - Fixed!

## Problem
Next.js was throwing an error:
```
Error: > `pages` and `app` directories should be under the same folder
```

## Root Cause
Next.js detected both:
- `app/` directory (App Router)
- `src/pages/` directory (which Next.js thought was a Pages Router)

Next.js doesn't allow having both `pages/` and `app/` directories at the root level when using different routing systems.

## Solution Applied
✅ Renamed `src/pages/` → `src/views/`
✅ Updated imports in `app/page.tsx` to use `@/src/views/` instead of `@/src/pages/`

## Current Structure
```
project/
├── app/              # Next.js App Router
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
└── src/
    ├── api.js
    └── views/         # React components (renamed from pages/)
        ├── Dashboard.jsx
        ├── Scanner.jsx
        ├── Vulnerabilities.jsx
        └── DiagramPage.jsx
```

## Next Steps
1. Restart the Next.js dev server:
   ```powershell
   npm run dev
   ```

2. The error should be gone and the app should start successfully!

## Note
The `src/views/` directory contains React components, not Next.js pages. They're imported and used by `app/page.tsx` which is the actual Next.js page.

