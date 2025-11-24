from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from enum import Enum

class SeverityLevel(str, Enum):
    """Severity levels for vulnerabilities"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class STRIDECategory(str, Enum):
    """STRIDE threat model categories"""
    SPOOFING = "Spoofing"
    TAMPERING = "Tampering"
    REPUDIATION = "Repudiation"
    INFORMATION_DISCLOSURE = "Information Disclosure"
    DENIAL_OF_SERVICE = "Denial of Service"
    ELEVATION_OF_PRIVILEGE = "Elevation of Privilege"

class Vulnerability(BaseModel):
    """Vulnerability finding"""
    id: str
    name: str
    description: str
    severity: SeverityLevel
    line_number: Optional[int] = None
    code_snippet: str
    remediation: str
    stride_categories: List[STRIDECategory]
    cvss_score: Optional[float] = None

class SecurityReport(BaseModel):
    """Complete security analysis report"""
    file_name: str
    total_vulnerabilities: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    vulnerabilities: List[Vulnerability]
    stride_distribution: Dict[str, int]
    analysis_timestamp: str
    recommendation_summary: str

class DiagramData(BaseModel):
    """Architecture diagram data"""
    svg: str
    components: List[str]
    data_flows: List[Dict[str, str]]
    trust_zones: List[str]
