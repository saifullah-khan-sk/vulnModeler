from typing import List, Dict
from models import Vulnerability, STRIDECategory, SeverityLevel
from datetime import datetime

def build_stride_distribution(vulnerabilities: List[Vulnerability]) -> Dict[str, int]:
    """Count vulnerabilities by STRIDE category."""
    distribution = {cat.value: 0 for cat in STRIDECategory}
    
    for vuln in vulnerabilities:
        for category in vuln.stride_categories:
            distribution[category.value] += 1
    
    return distribution

def get_mitigation_summary(vulnerabilities: List[Vulnerability]) -> str:
    """Generate priority mitigation recommendations."""
    critical_count = sum(1 for v in vulnerabilities if v.severity == SeverityLevel.CRITICAL)
    high_count = sum(1 for v in vulnerabilities if v.severity == SeverityLevel.HIGH)
    
    if critical_count > 0:
        return f"URGENT: Fix {critical_count} critical vulnerabilities immediately before deployment."
    elif high_count > 0:
        return f"Priority: Address {high_count} high-severity issues before production release."
    else:
        return "Review medium/low findings to improve overall security posture."

def calculate_overall_cvss(vulnerabilities: List[Vulnerability]) -> float:
    """Calculate overall CVSS score for the file (average of all vulnerabilities)."""
    if not vulnerabilities:
        return 0.0
    
    scores = [v.cvss_score for v in vulnerabilities if v.cvss_score is not None]
    if not scores:
        return 0.0
    
    # Use weighted average (critical vulnerabilities weighted more)
    weighted_sum = 0.0
    total_weight = 0.0
    
    for vuln in vulnerabilities:
        if vuln.cvss_score is not None:
            weight = 3.0 if vuln.severity == SeverityLevel.CRITICAL else \
                     2.0 if vuln.severity == SeverityLevel.HIGH else \
                     1.5 if vuln.severity == SeverityLevel.MEDIUM else 1.0
            weighted_sum += vuln.cvss_score * weight
            total_weight += weight
    
    if total_weight == 0:
        return 0.0
    
    overall_score = weighted_sum / total_weight
    return round(overall_score, 1)

def generate_security_report(
    file_name: str,
    vulnerabilities: List[Vulnerability]
) -> Dict:
    """Generate comprehensive security report."""
    
    overall_cvss = calculate_overall_cvss(vulnerabilities)
    
    return {
        "metadata": {
            "file_name": file_name,
            "analysis_timestamp": datetime.now().isoformat(),
            "analyzer_version": "1.0.0"
        },
        "summary": {
            "total_vulnerabilities": len(vulnerabilities),
            "critical": sum(1 for v in vulnerabilities if v.severity == SeverityLevel.CRITICAL),
            "high": sum(1 for v in vulnerabilities if v.severity == SeverityLevel.HIGH),
            "medium": sum(1 for v in vulnerabilities if v.severity == SeverityLevel.MEDIUM),
            "low": sum(1 for v in vulnerabilities if v.severity == SeverityLevel.LOW),
            "overall_cvss_score": overall_cvss,
        },
        "stride_distribution": build_stride_distribution(vulnerabilities),
        "recommendation_summary": get_mitigation_summary(vulnerabilities),
        "vulnerabilities": [v.model_dump() for v in vulnerabilities]
    }
