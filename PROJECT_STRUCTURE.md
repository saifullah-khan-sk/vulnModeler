# VulnModeler - Project File Structure

This document describes the organized file structure for the VulnModeler security analysis platform.

## Directory Layout

\`\`\`
vulnModeler/
│
├── 📄 Core Documentation
│   ├── README.md                    # Project overview & features
│   ├── SETUP.md                     # Installation & deployment guide
│   ├── ARCHITECTURE.md              # System design documentation
│   ├── GETTING_STARTED.md           # Quick start guide
│   ├── DEPLOYMENT_CHECKLIST.md      # Production deployment steps
│   ├── PROJECT_SUMMARY.md           # Rebuild overview
│   └── PROJECT_STRUCTURE.md         # This file
│
├── 📄 Configuration Files
│   ├── .env.example                 # Frontend env variables template
│   ├── .gitignore                   # Git ignore rules
│   ├── package.json                 # Node.js dependencies & scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── next.config.mjs              # Next.js configuration
│   └── postcss.config.mjs           # PostCSS & Tailwind config
│
├── 🐍 Backend (FastAPI/Python)
│   └── backend/
│       ├── .env.example             # Backend env variables template
│       ├── requirements.txt         # Python dependencies
│       ├── run.sh                   # Start script
│       ├── main.py                  # FastAPI app entry point
│       ├── config.py                # Configuration & settings
│       ├── models.py                # Pydantic request/response models
│       ├── analyzer.py              # Vulnerability detection engine
│       ├── threat_model.py          # STRIDE threat categorization
│       └── diagrams.py              # Architecture diagram generation
│
├── 🎨 Static Assets
│   └── public/
│       ├── placeholder-logo.svg     # Application logo
│       ├── placeholder.svg          # Generic placeholder
│       ├── apple-icon.png           # Apple touch icon
│       ├── icon-*.png               # Favicon variants
│       └── ...
│
├── ⚙️ Next.js Configuration (App Router)
│   └── app/
│       ├── layout.tsx               # Root layout component
│       ├── page.tsx                 # Home page (/)
│       └── globals.css              # Global styles & design tokens
│
├── 📄 Feature Pages
│   └── pages/
│       ├── dashboard.tsx            # Dashboard overview page
│       ├── scanner.tsx              # File upload & scanning page
│       ├── vulnerabilities.tsx      # Findings detail page
│       └── diagram-page.tsx         # Architecture diagram page
│
├── 🧩 Reusable Components
│   └── components/
│       ├── sidebar.tsx              # Navigation sidebar
│       ├── upload-card.tsx          # File upload component
│       ├── vulnerabilities-table.tsx # Findings table with filtering
│       ├── quick-stats.tsx          # Statistics cards
│       ├── diagram-viewer.tsx       # Diagram display component
│       ├── theme-provider.tsx       # Theme context provider
│       └── ui/                      # Pre-built shadcn/ui components
│           ├── button.tsx
│           ├── card.tsx
│           ├── table.tsx
│           ├── badge.tsx
│           ├── alert.tsx
│           ├── spinner.tsx
│           ├── dialog.tsx
│           ├── dropdown-menu.tsx
│           ├── tabs.tsx
│           └── ... (40+ more components)
│
├── 🛠️ Utilities & Helpers
│   └── lib/
│       ├── api.ts                   # API client with typed endpoints
│       └── utils.ts                 # Helper functions (cn utility)
│
├── 🎣 Custom React Hooks
│   └── hooks/
│       ├── use-mobile.ts            # Mobile viewport detection
│       └── use-toast.ts             # Toast notification hook
│
└── 📚 Read-Only Context
    └── user_read_only_context/
        ├── integration_examples/    # Integration templates
        └── text_attachments/        # Uploaded file references
\`\`\`

## File Organization by Purpose

### Backend Structure

| Layer | Files | Purpose |
|-------|-------|---------|
| **Entry Point** | `main.py` | FastAPI app, route handlers, CORS setup |
| **Configuration** | `config.py` | Environment variables, constants, settings |
| **Data Models** | `models.py` | Pydantic request/response schemas |
| **Analysis Engine** | `analyzer.py` | Vulnerability detection patterns (20+) |
| **Threat Mapping** | `threat_model.py` | STRIDE categorization with severity |
| **Visualization** | `diagrams.py` | Architecture diagram generation |

### Frontend Structure

| Layer | Files | Purpose |
|-------|-------|---------|
| **Root** | `app/layout.tsx` | HTML structure, metadata, fonts |
| **Styling** | `app/globals.css` | Tailwind v4 + design tokens |
| **Pages** | `pages/*.tsx` | Feature pages (5 routes) |
| **Components** | `components/*.tsx` | Reusable UI components |
| **UI Library** | `components/ui/*.tsx` | shadcn/ui pre-built components |
| **API** | `lib/api.ts` | Typed HTTP client |
| **Utilities** | `lib/utils.ts` | Helper functions |
| **Hooks** | `hooks/*.ts` | Custom React hooks |

## Key Files Explained

### Backend Entry Point
\`\`\`
backend/main.py
├── FastAPI application setup
├── CORS configuration
├── Route handlers:
│   ├── POST /analyze      → Code analysis
│   ├── POST /stride       → Threat mapping
│   ├── POST /diagram      → Diagram generation
│   └── GET /health        → Health check
└── Error handling & logging
\`\`\`

### Frontend Home Page
\`\`\`
app/page.tsx
└── Renders components:
    ├── Sidebar (navigation)
    ├── Dashboard (main content)
    ├── Quick stats
    ├── Recent vulnerabilities
    └── Quick action cards
\`\`\`

### API Client
\`\`\`
lib/api.ts
├── Base API URL configuration
├── Request/response types
├── Error handling
├── Loading states
└── Typed methods:
    ├── analyzeCode()
    ├── getThreats()
    ├── generateDiagram()
    └── getReports()
\`\`\`

## Important Conventions

### Naming Conventions
- **Components**: PascalCase (e.g., `UploadCard.tsx`)
- **Pages**: kebab-case (e.g., `dashboard.tsx`)
- **Functions**: camelCase (e.g., `analyzeCode()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

### Import Paths
- Absolute imports from root: `import { cn } from "@/lib/utils"`
- Components: `import Sidebar from "@/components/sidebar"`
- Utilities: `import { analyzeCode } from "@/lib/api"`

### File Size Guidelines
- Keep components < 300 lines
- Split large pages into smaller components
- One component per file (except ui components)

### Styling
- Use Tailwind CSS utility classes
- Define reusable styles in `app/globals.css`
- No inline CSS or CSS modules (unless necessary)
- Use CSS variables for theming

## Development Workflow

### Adding a New Page
1. Create file in `pages/` directory
2. Import necessary components from `components/`
3. Use API functions from `lib/api.ts`
4. Add route in app navigation

### Adding a New Component
1. Create file in `components/` directory
2. Keep component focused and reusable
3. Accept props for customization
4. Import UI components from `components/ui/`

### Adding a Backend Feature
1. Create model in `models.py`
2. Implement logic in appropriate module
3. Add route handler in `main.py`
4. Create API client method in `lib/api.ts`

## Deployment Structure

When deploying:

**Backend**: Deploy `backend/` directory
- Requires Python 3.8+
- Install dependencies: `pip install -r requirements.txt`
- Run: `python main.py` or `uvicorn backend.main:app`

**Frontend**: Deploy root directory
- Requires Node.js 16+
- Install dependencies: `npm install`
- Build: `npm run build`
- Run: `npm start`

## Environment Variables

### Backend (.env)
\`\`\`
CORS_ORIGINS=http://localhost:3000
API_PORT=8000
API_HOST=0.0.0.0
LOG_LEVEL=INFO
\`\`\`

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

This structure ensures scalability, maintainability, and clear separation of concerns.
