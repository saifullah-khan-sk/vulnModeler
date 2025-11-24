import re
from typing import List, Tuple
from models import Vulnerability, SeverityLevel, STRIDECategory

def analyze_code(code: str) -> List[Vulnerability]:
    """
    Enhanced multi-language static analyzer for security vulnerabilities.
    Returns structured vulnerability objects with severity and STRIDE mapping.
    """
    vulnerabilities = []
    
    # Pattern definitions with severity and STRIDE mapping
    patterns = [
        # Credential/Secret Exposure (Information Disclosure)
        (r"(?i)(api[_-]?key|secret|password|token|private[_-]?key)\s*[:=]\s*['\"`][A-Za-z0-9\-_=+/]{8,}['\"`]",
         "Hardcoded Credentials", "Credentials, API keys, or tokens are hardcoded in source code.",
         SeverityLevel.CRITICAL, [STRIDECategory.INFORMATION_DISCLOSURE]),
        
        # Code Execution Risks (Elevation of Privilege, Tampering)
        (r"\b(eval|exec|compile|__import__|subprocess\.call|os\.system)\s*\(",
         "Remote Code Execution", "Use of eval/exec allows arbitrary code execution.",
         SeverityLevel.CRITICAL, [STRIDECategory.ELEVATION_OF_PRIVILEGE, STRIDECategory.TAMPERING]),
        
        # SQL Injection (Tampering, Elevation of Privilege)
        (r"(?i)(select|update|delete|insert).*[+\s].*['\"]|query\s*\(\s*['\"].*[+]|execute\s*\(\s*['\"].*[+]",
         "SQL Injection", "String concatenation in SQL queries allows SQL injection attacks.",
         SeverityLevel.CRITICAL, [STRIDECategory.TAMPERING, STRIDECategory.ELEVATION_OF_PRIVILEGE]),
        
        # Command Injection (Tampering, Elevation of Privilege)
        (r"(?i)(subprocess|os\.popen|shell=True)",
         "Command Injection", "Shell command execution with user input can lead to command injection.",
         SeverityLevel.CRITICAL, [STRIDECategory.TAMPERING, STRIDECategory.ELEVATION_OF_PRIVILEGE]),
        
        # Weak Cryptography (Information Disclosure, Tampering)
        (r"(?i)(md5|sha1|des|rc4|crc32)\s*\(|hashlib\.md5|hashlib\.sha1",
         "Weak Cryptography", "Weak cryptographic algorithms (MD5, SHA1, DES) should not be used.",
         SeverityLevel.HIGH, [STRIDECategory.INFORMATION_DISCLOSURE, STRIDECategory.TAMPERING]),
        
        # Weak Random (Information Disclosure)
        (r"(?i)random\s*\(|math\.random\s*\(",
         "Weak Random Number Generation", "Non-cryptographic random number generator used for security.",
         SeverityLevel.HIGH, [STRIDECategory.INFORMATION_DISCLOSURE]),
        
        # Insecure Deserialization (Elevation of Privilege)
        (r"(?i)(pickle\.load|yaml\.load|json\.load|marshal\.load)\s*\(|eval\s*\(json",
         "Insecure Deserialization", "Unsafe deserialization can lead to arbitrary code execution.",
         SeverityLevel.CRITICAL, [STRIDECategory.ELEVATION_OF_PRIVILEGE]),
        
        # XSS Vulnerability (Tampering, Information Disclosure)
        (r"(?i)(innerHTML|document\.write|eval.*user|innerHTML\s*=.*\+)",
         "Cross-Site Scripting (XSS)", "Unsafe DOM manipulation can lead to XSS attacks.",
         SeverityLevel.HIGH, [STRIDECategory.TAMPERING, STRIDECategory.INFORMATION_DISCLOSURE]),
        
        # Unencrypted HTTP (Spoofing, Information Disclosure, Tampering)
        (r"http://[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(?!t)",
         "Unencrypted Communication", "HTTP should be replaced with HTTPS for secure communication.",
         SeverityLevel.HIGH, [STRIDECategory.SPOOFING, STRIDECategory.INFORMATION_DISCLOSURE, STRIDECategory.TAMPERING]),
        
        # SSL Verification Disabled (Spoofing, Tampering)
        (r"(?i)(verify=false|ssl.*disable|insecure|verify_ssl.*=.*false)",
         "SSL/TLS Verification Disabled", "Disabling SSL/TLS verification allows man-in-the-middle attacks.",
         SeverityLevel.HIGH, [STRIDECategory.SPOOFING, STRIDECategory.TAMPERING]),
        
        # Information Disclosure (Debugging)
        (r"(?i)(debug\s*=\s*true|debug_mode|traceback|stacktrace|print\(.*password|print.*secret)",
         "Debug Information Exposed", "Debug mode or stack traces exposed in production.",
         SeverityLevel.MEDIUM, [STRIDECategory.INFORMATION_DISCLOSURE]),
        
        # PII Handling (Information Disclosure)
        (r"(?i)(email|ssn|social.?security.?number|phone.?number|credit.?card|dob|date.?of.?birth)\s*[:=]",
         "Personally Identifiable Information (PII)", "PII is stored or logged without proper protection.",
         SeverityLevel.HIGH, [STRIDECategory.INFORMATION_DISCLOSURE]),
        
        # Path Traversal (Tampering)
        (r"(?i)(open|pathlib|path\.join).*\+.*\.\.|filepath.*\+.*\.\.|path.*\+.*user",
         "Path Traversal", "User input in file paths without validation enables path traversal.",
         SeverityLevel.HIGH, [STRIDECategory.TAMPERING]),
        
        # Denial of Service (DoS)
        (r"\bwhile\s+True\b|\bwhile\s+1\b|for\s+[^:]*in.*range\s*$$\s*-?\d*\s*$$|infinite.*loop",
         "Potential Denial of Service", "Unbounded loops or processing can lead to resource exhaustion.",
         SeverityLevel.MEDIUM, [STRIDECategory.DENIAL_OF_SERVICE]),
        
        # ReDoS Attack (DoS)
        (r"re\.compile.*\(\s*['\"].*\*.*\*.*['\"]|regex.*ReDoS",
         "Regular Expression Denial of Service", "Regex with catastrophic backtracking can cause DoS.",
         SeverityLevel.MEDIUM, [STRIDECategory.DENIAL_OF_SERVICE]),
        
        # Race Condition (TOCTOU)
        (r"(?i)(check.*then.*act|toctou|time.of.check|exists.*then.*open)",
         "Race Condition (TOCTOU)", "Time-of-check-time-of-use vulnerability.",
         SeverityLevel.MEDIUM, [STRIDECategory.DENIAL_OF_SERVICE, STRIDECategory.TAMPERING]),
        
        # Hardcoded Configuration (Information Disclosure)
        (r"(?i)(database|db).*url\s*[:=].*(?:postgresql|mysql|mongodb)",
         "Hardcoded Database Configuration", "Database credentials/URLs hardcoded instead of in environment.",
         SeverityLevel.HIGH, [STRIDECategory.INFORMATION_DISCLOSURE]),
        
        # Missing Authentication (Spoofing, Elevation of Privilege)
        (r"@app\.(?:get|post|put|delete)\(|@router\.(?:get|post|put|delete)\(.*\n.*(?!auth|permission|login|jwt)",
         "Missing Authentication", "Endpoint may lack proper authentication/authorization checks.",
         SeverityLevel.HIGH, [STRIDECategory.SPOOFING, STRIDECategory.ELEVATION_OF_PRIVILEGE]),
    ]
    
    for idx, (pattern, name, description, severity, stride_cats) in enumerate(patterns):
        if re.search(pattern, code):
            cvss_score = calculate_cvss_score(severity, name, stride_cats)
            vuln = Vulnerability(
                id=f"VULN_{idx:03d}",
                name=name,
                description=description,
                severity=severity,
                code_snippet="[Pattern matched in code]",
                remediation=get_remediation(name),
                stride_categories=stride_cats,
                cvss_score=cvss_score
            )
            vulnerabilities.append(vuln)
    
    return vulnerabilities if vulnerabilities else []

def calculate_cvss(severity: str) -> float:
    """
    Calculate CVSS v3.1 Base Score from severity using CVSS base vectors.
    Returns a score between 0.0 and 10.0 rounded to one decimal place.
    """
    # CVSS base vector mappings
    vectors = {
        "critical": "AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
        "high": "AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:L",
        "medium": "AV:N/AC:L/PR:L/UI:R/S:U/C:L/I:L/A:L",
        "low": "AV:N/AC:L/PR:L/UI:R/S:U/C:N/I:N/A:N",
    }
    
    # Get vector for severity (case insensitive)
    severity_lower = severity.lower() if isinstance(severity, str) else severity.value.lower()
    vector = vectors.get(severity_lower, vectors["medium"])
    
    # Parse vector values
    av_map = {"N": 0.85, "A": 0.62, "L": 0.55, "P": 0.20}
    ac_map = {"L": 0.77, "H": 0.44}
    pr_map = {"N": 0.85, "L": 0.62, "H": 0.27}
    ui_map = {"N": 0.85, "R": 0.62}
    cia_map = {"H": 0.56, "L": 0.22, "N": 0.0}
    
    # Extract values from vector
    parts = vector.split("/")
    av = ac = pr = ui = s = c = i = a = None
    
    for part in parts:
        if part.startswith("AV:"):
            av = av_map.get(part[3:], 0.85)
        elif part.startswith("AC:"):
            ac = ac_map.get(part[3:], 0.77)
        elif part.startswith("PR:"):
            pr = pr_map.get(part[3:], 0.62)
        elif part.startswith("UI:"):
            ui = ui_map.get(part[3:], 0.62)
        elif part.startswith("S:"):
            s = part[3:] == "C"  # Changed = True, Unchanged = False
        elif part.startswith("C:"):
            c = cia_map.get(part[2:], 0.0)
        elif part.startswith("I:"):
            i = cia_map.get(part[2:], 0.0)
        elif part.startswith("A:"):
            a = cia_map.get(part[2:], 0.0)
    
    # Default values if not found
    av = av or 0.85
    ac = ac or 0.77
    pr = pr or 0.62
    ui = ui or 0.62
    s = s if s is not None else False
    c = c or 0.0
    i = i or 0.0
    a = a or 0.0
    
    # Calculate impact
    impact = 1 - ((1 - c) * (1 - i) * (1 - a))
    
    # Calculate exploitability
    exploitability = 8.22 * av * ac * pr * ui
    
    # Calculate total score
    if s:  # Scope Changed
        total = min((impact * 1.08) + exploitability, 10.0)
    else:  # Scope Unchanged
        total = min(impact + exploitability, 10.0)
    
    # Round to one decimal place
    return round(total, 1)

def calculate_cvss_score(severity: SeverityLevel, vuln_name: str, stride_cats: List) -> float:
    """
    Calculate CVSS v3.1 Base Score based on severity using proper CVSS vectors.
    Returns a score between 0.0 and 10.0
    """
    return calculate_cvss(severity.value)

def get_remediation(vulnerability_name: str) -> str:
    """Provide remediation advice for specific vulnerabilities."""
    mitigations = {
        "Hardcoded Credentials": "Use environment variables, secure vaults (AWS Secrets Manager, HashiCorp Vault), or secure CI/CD pipelines.",
        "Remote Code Execution": "Avoid eval/exec. Use safe alternatives like AST parsing, templating engines, or sandboxed interpreters.",
        "SQL Injection": "Use parameterized queries/prepared statements. Never concatenate user input into SQL.",
        "Command Injection": "Avoid shell=True. Use array-based command execution or escape all inputs carefully.",
        "Weak Cryptography": "Use strong algorithms: SHA-256+, AES-256, elliptic curve cryptography.",
        "Weak Random Number Generation": "Use cryptographic RNG: secrets module (Python), crypto.getRandomBytes (Node.js).",
        "Insecure Deserialization": "Validate all input before deserialization. Use JSON instead of pickle/yaml.load.",
        "Cross-Site Scripting (XSS)": "Use textContent instead of innerHTML. Encode output. Use CSP headers.",
        "Unencrypted Communication": "Always use HTTPS. Redirect HTTP to HTTPS. Use HSTS headers.",
        "SSL/TLS Verification Disabled": "Enable certificate verification. Use proper certificate management.",
        "Debug Information Exposed": "Disable debug mode in production. Remove stack traces from error responses.",
        "Personally Identifiable Information (PII)": "Encrypt PII at rest/transit. Implement access controls. Use data masking.",
        "Path Traversal": "Validate file paths. Use allowlists. Prevent ../ sequences.",
        "Potential Denial of Service": "Add timeouts, rate limiting, resource quotas, and input validation.",
        "Regular Expression Denial of Service": "Use regex timeouts. Test regex performance. Avoid nested quantifiers.",
        "Race Condition (TOCTOU)": "Use atomic operations. Implement proper locking mechanisms.",
        "Hardcoded Database Configuration": "Store in environment variables or secure configuration files.",
        "Missing Authentication": "Implement authentication/authorization. Use JWT, OAuth2, or session-based auth.",
    }
    return mitigations.get(vulnerability_name, "Review security best practices for this vulnerability type.")
