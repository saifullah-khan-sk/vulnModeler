<<<<<<< HEAD
# vulnModeler
=======
# VulnModeler - Security Analysis Platform

A modern, web-based security analysis platform that automatically analyzes source code for vulnerabilities and generates comprehensive threat models.

## Features

- **Automated Code Analysis** - Detects 20+ security vulnerability patterns
- **STRIDE Threat Modeling** - Maps findings to STRIDE categories with mitigations
- **Architecture Diagrams** - Visualizes system architecture with trust boundaries
- **Detailed Reports** - Generates structured security reports in JSON format
- **Modern UI** - Professional dashboard with real-time analysis feedback
- **Multi-Language Support** - Python, JavaScript, TypeScript, Java, C++, Go, Rust, and more

## Quick Start

### Backend Setup

\`\`\`bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

Backend will be available at `http://localhost:8000` with API docs at `http://localhost:8000/docs`

### Frontend Setup

\`\`\`bash
# Install dependencies
npm install

# Set environment variables
export NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
\`\`\`

Frontend will be available at `http://localhost:3000`

## Project Structure

\`\`\`
vulnModeler/
├── backend/
│   ├── analyzer.py         # Static code analysis engine
│   ├── threat_model.py     # STRIDE threat modeling
│   ├── diagrams.py         # Architecture diagram generation
│   ├── models.py           # Pydantic data models
│   ├── config.py           # Configuration management
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
├── app/
│   ├── page.tsx            # Main app component
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles and design system
│
├── pages/
│   ├── dashboard.tsx       # Dashboard with quick stats
│   ├── scanner.tsx         # Code upload and analysis
│   ├── vulnerabilities.tsx # Detailed vulnerability view
│   └── diagram-page.tsx    # Architecture diagram view
│
├── components/
│   ├── sidebar.tsx         # Navigation sidebar
│   ├── upload-card.tsx     # File upload component
│   ├── vulnerabilities-table.tsx  # Vulnerabilities display
│   ├── diagram-viewer.tsx  # Diagram display
│   └── quick-stats.tsx     # Statistics cards
│
└── lib/
    └── api.ts              # API integration layer
\`\`\`

## API Endpoints

### POST /analyze
Upload source code for vulnerability analysis.

**Request:**
\`\`\`
Content-Type: multipart/form-data
file: <source code file>
\`\`\`

**Response:**
\`\`\`json
{
  "status": "success",
  "report": {
    "metadata": {...},
    "summary": {...},
    "stride_distribution": {...},
    "vulnerabilities": [...]
  }
}
\`\`\`

### GET /diagram.svg
Get system architecture diagram as SVG.

### GET /health
Check API health status.

## Vulnerability Detection

The analyzer detects 20+ security patterns including:

- Hardcoded credentials (API keys, passwords, tokens)
- Remote code execution (eval, exec, subprocess)
- SQL injection vulnerabilities
- Command injection risks
- Weak cryptography (MD5, SHA1, DES)
- Insecure deserialization
- Cross-Site Scripting (XSS)
- Unencrypted communication (HTTP)
- SSL/TLS verification disabled
- Debug information disclosure
- Path traversal vulnerabilities
- Denial of Service risks
- Regular expression ReDoS
- Race conditions (TOCTOU)
- Hardcoded database credentials
- Missing authentication/authorization

## STRIDE Threat Model

Threats are categorized into 6 categories:

1. **Spoofing** - Identity spoofing attacks
2. **Tampering** - Data modification attacks
3. **Repudiation** - Denial of actions
4. **Information Disclosure** - Unauthorized access
5. **Denial of Service** - Service interruption
6. **Elevation of Privilege** - Unauthorized access

## Environment Variables

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

### Backend (.env)
\`\`\`
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=py,js,ts,jsx,tsx,java,cpp,c,go,rs
\`\`\`

## Technologies

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Lucide Icons

### Backend
- FastAPI
- Pydantic
- Python 3.8+
- Graphviz (optional, for enhanced diagrams)

## Security Best Practices

VulnModeler itself follows security best practices:

- Input validation on all endpoints
- File size limits (10MB default)
- File type restrictions
- CORS configuration
- Error handling without stack traces
- No hardcoded secrets
- Environment-based configuration

## Performance

- Analyzes files up to 10MB
- Typical analysis time: < 2 seconds
- Scalable architecture ready for production deployment

## Roadmap

- Support for more programming languages
- Custom vulnerability rules
- Team collaboration features
- Historical report tracking
- Automated remediation suggestions
- Integration with CI/CD pipelines
- Advanced threat modeling visualizations

## Contributing

Contributions are welcome! Please ensure:
- Code follows project structure
- New vulnerability patterns include tests
- Documentation is updated
- Changes maintain backward compatibility

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or feature requests, please open an issue on GitHub or contact the development team.

---

Built with security in mind. Stay secure.
>>>>>>> 696c2ad (initial commit)
