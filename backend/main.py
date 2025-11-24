from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel
import os
import logging
from typing import List
from analyzer import analyze_code
from threat_model import generate_security_report
from diagrams import build_svg_diagram
from config import settings

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".py", ".js", ".ts", ".java", ".cpp", ".c", ".cs", ".go", ".rb", ".php", ".txt"}
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION
)

# CORS middleware with configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_CREDENTIALS,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Request/Response models
class FindingsRequest(BaseModel):
    findings: List[str]

class ThreatRequest(BaseModel):
    findings: List[str]

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "VulnModeler API"}

@app.post("/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    """
    Analyze uploaded source code for vulnerabilities.
    Returns findings from static analysis.
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Filename required")
        
        _, ext = os.path.splitext(file.filename)
        if ext.lower() not in [f".{ext}" for ext in settings.ALLOWED_EXTENSIONS]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File type not supported")
        
        # Read and validate file size
        content = await file.read()
        if len(content) > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")
        
        if len(content) == 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is empty")
        
        # Decode content
        try:
            code = content.decode("utf-8")
        except UnicodeDecodeError:
            code = content.decode("latin-1", errors="ignore")
        
        # Analyze code
        vulnerabilities = analyze_code(code)
        report = generate_security_report(file.filename, vulnerabilities)
        
        logger.info(f"Analyzed {file.filename}: {report['summary']['total_vulnerabilities']} vulnerabilities found")
        
        return JSONResponse({
            "status": "success",
            "report": report
        })
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in analyze: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Analysis failed")

@app.get("/diagram.svg")
def diagram_endpoint():
    """Get system architecture diagram."""
    try:
        svg = build_svg_diagram()
        if not svg:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Diagram generation failed")
        return Response(content=svg, media_type="image/svg+xml")
    except Exception as e:
        logger.error(f"Error generating diagram: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Diagram generation failed")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8001))  # Use 8001 if 8000 is busy
    uvicorn.run(app, host="0.0.0.0", port=port)
