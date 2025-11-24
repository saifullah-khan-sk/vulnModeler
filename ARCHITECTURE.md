# VulnModeler Architecture

## System Overview

VulnModeler is a modern, full-stack security analysis platform with clear separation between frontend and backend services.

## Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                     Client Browser                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Next.js Frontend (React 19)                   │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │           Dashboard / Scanner / Reports          │    │  │
│  │  │  - Modern UI with Tailwind CSS & shadcn/ui      │    │  │
│  │  │  - Real-time analysis feedback                  │    │  │
│  │  │  - Interactive visualization                     │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API (FastAPI)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              API Layer (FastAPI)                         │  │
│  │  - /analyze - Code vulnerability analysis             │  │
│  │  - /diagram.svg - Architecture visualization         │  │
│  │  - /health - Service health check                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Analysis Engine                              │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Analyzer                                          │ │  │
│  │  │  - 20+ vulnerability patterns                     │ │  │
│  │  │  - Multi-language support                         │ │  │
│  │  │  - Pattern matching & heuristics                  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Threat Model                                      │ │  │
│  │  │  - STRIDE categorization                          │ │  │
│  │  │  - Severity calculation                           │ │  │
│  │  │  - Remediation mapping                            │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Diagram Generator                                │ │  │
│  │  │  - System architecture visualization             │ │  │
│  │  │  - Trust boundaries & data flows                 │ │  │
│  │  │  - Graphviz integration                          │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Component Architecture

### Frontend (Next.js)

**Layout:**
- Root layout with theme setup
- Global styles with design system
- Responsive sidebar navigation

**Pages:**
- `dashboard.tsx` - Overview and quick stats
- `scanner.tsx` - Code upload and analysis
- `vulnerabilities.tsx` - Detailed vulnerability view
- `diagram-page.tsx` - Architecture visualization

**Components:**
- `sidebar.tsx` - Navigation
- `upload-card.tsx` - File upload interface
- `vulnerabilities-table.tsx` - Results display
- `quick-stats.tsx` - Key metrics
- `diagram-viewer.tsx` - SVG visualization

**API Layer:**
- `lib/api.ts` - Centralized API client with typed responses

### Backend (FastAPI)

**Configuration:**
- `config.py` - Settings management
- Environment-based configuration
- CORS and security settings

**Models:**
- `models.py` - Pydantic data classes
- Vulnerability model
- STRIDE categories
- Report structures

**Analysis Engine:**
- `analyzer.py` - Pattern-based vulnerability detection
- 20+ security patterns
- Multi-language support
- Severity classification

**Threat Modeling:**
- `threat_model.py` - STRIDE threat categorization
- Remediation suggestions
- Report generation

**Visualization:**
- `diagrams.py` - Architecture diagram generation
- Graphviz integration
- Fallback SVG support

**API:**
- `main.py` - FastAPI application
- /analyze endpoint
- /diagram.svg endpoint
- /health endpoint

## Data Flow

### Analysis Flow

\`\`\`
1. User uploads code file
   ↓
2. Frontend sends multipart request
   ↓
3. Backend validates file (size, extension, encoding)
   ↓
4. Analyzer runs pattern matching
   ↓
5. Threat model maps findings to STRIDE
   ↓
6. Report is generated with JSON structure
   ↓
7. Frontend displays results with visualization
\`\`\`

### Request/Response Structure

**POST /analyze Request:**
\`\`\`
Content-Type: multipart/form-data
Body:
- file: <source code file>
\`\`\`

**Response:**
\`\`\`json
{
  "status": "success",
  "report": {
    "metadata": {
      "file_name": "app.py",
      "analysis_timestamp": "2025-01-23T10:30:00",
      "analyzer_version": "1.0.0"
    },
    "summary": {
      "total_vulnerabilities": 5,
      "critical": 1,
      "high": 2,
      "medium": 1,
      "low": 1
    },
    "stride_distribution": {
      "Tampering": 2,
      "Information Disclosure": 2,
      "Elevation of Privilege": 1
    },
    "recommendation_summary": "Fix critical vulnerabilities immediately",
    "vulnerabilities": [...]
  }
}
\`\`\`

## Security Considerations

### Input Validation
- File size limits (10MB default)
- File type restrictions
- Encoding validation

### API Security
- CORS configuration
- No credential exposure
- Proper HTTP status codes

### Data Handling
- No persistent storage of analyzed code
- Temporary file handling
- Memory cleanup

### Error Handling
- User-friendly error messages
- No stack traces in production
- Proper exception handling

## Scalability

### Frontend
- Client-side state management
- No backend sessions needed
- Can be deployed to any static host

### Backend
- Stateless API design
- Can run multiple instances
- Load balancer compatible
- No database dependencies

### Performance
- File analysis typically < 2 seconds
- Minimal memory footprint
- Efficient pattern matching
- Optimized for typical file sizes

## Deployment Architecture

### Development
\`\`\`
Developer Machine
├── Frontend: http://localhost:3000
├── Backend: http://localhost:8000
└── Both running with hot-reload
\`\`\`

### Production
\`\`\`
Production Environment
├── Frontend
│  └── Next.js on Vercel / Node.js
├── Backend
│  ├── FastAPI on Uvicorn
│  ├── Multiple workers for concurrency
│  └── Optional: Docker container
└── Reverse Proxy (nginx / load balancer)
\`\`\`

## Technology Choices

### Frontend
- **Next.js 16** - Production-ready React framework
- **React 19** - Latest UI library
- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - Accessible component library
- **TypeScript** - Type safety

### Backend
- **FastAPI** - Modern, fast Python framework
- **Pydantic** - Data validation
- **Graphviz** - Diagram generation
- **Python 3.8+** - Mature language

### Why These Choices?
- Type safety across stack
- Developer experience
- Performance and scalability
- Easy deployment
- Modern best practices
- Active community support

## Future Architecture Improvements

- Database integration for report history
- WebSocket for real-time analysis
- Async job queue for large files
- Microservices for specialized analysis
- Machine learning for pattern detection
- API versioning for backward compatibility
- Caching layer for common patterns
