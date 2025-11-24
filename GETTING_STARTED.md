# Getting Started with VulnModeler

Welcome to VulnModeler! This guide will help you get started with the security analysis platform.

## Quick Start (5 minutes)

### 1. Start the Backend

\`\`\`bash
cd backend
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
\`\`\`

✓ Backend running at http://localhost:8000

### 2. Start the Frontend

\`\`\`bash
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
\`\`\`

✓ Frontend running at http://localhost:3000

### 3. Analyze Code

1. Visit http://localhost:3000
2. Click "Scanner" in sidebar
3. Upload a Python, JavaScript, or Java file
4. View vulnerability analysis

## What VulnModeler Does

VulnModeler analyzes source code and:

1. **Detects Vulnerabilities** - 20+ security vulnerability patterns
2. **Classifies Threats** - STRIDE threat model categorization
3. **Suggests Remediation** - Specific mitigation strategies
4. **Visualizes Architecture** - System architecture diagrams
5. **Generates Reports** - Detailed JSON security reports

## Supported Languages

- Python
- JavaScript / TypeScript
- Java
- C / C++
- Go
- Rust
- PHP
- Ruby
- C#

## Key Features

### Dashboard
- Quick vulnerability statistics
- Risk level assessment
- Recent analysis history
- Real-time threat distribution

### Scanner
- Drag-and-drop file upload
- Real-time analysis feedback
- Detailed vulnerability list
- STRIDE classification
- JSON report download

### Vulnerabilities
- Comprehensive findings list
- Severity indicators (Critical/High/Medium/Low)
- STRIDE categories
- Remediation guidance
- Code snippet references

### Architecture Diagram
- System architecture visualization
- Trust boundaries
- Data flow mapping
- Component relationships

## Vulnerability Categories Detected

### Credential Exposure
- Hardcoded API keys
- Hardcoded passwords
- Database credentials
- Private keys in code

### Code Execution
- eval/exec usage
- Subprocess injection
- Command injection
- Unsafe deserialization

### Injection Attacks
- SQL injection
- XSS vulnerabilities
- XML injection
- Command injection

### Weak Cryptography
- MD5, SHA1, DES usage
- Weak random number generation
- Disabled SSL/TLS verification

### Other Issues
- Path traversal
- Race conditions
- Unencrypted communication
- Debug information exposure
- Missing authentication

## STRIDE Threat Model

Vulnerabilities are classified into 6 threat categories:

1. **Spoofing** - False identity claims
   - Missing authentication
   - Weak credentials
   - SSL/TLS issues

2. **Tampering** - Unauthorized modification
   - SQL injection
   - XSS attacks
   - Code injection

3. **Repudiation** - Denial of actions
   - Missing audit logs
   - No accountability

4. **Information Disclosure** - Unauthorized access
   - Hardcoded credentials
   - Debug information
   - PII exposure

5. **Denial of Service** - Service disruption
   - Infinite loops
   - Resource exhaustion
   - ReDoS attacks

6. **Elevation of Privilege** - Unauthorized access
   - Remote code execution
   - Unsafe deserialization
   - Privilege escalation

## Understanding the Reports

### Summary Section
\`\`\`json
{
  "total_vulnerabilities": 5,
  "critical": 1,
  "high": 2,
  "medium": 1,
  "low": 1
}
\`\`\`

### Vulnerability Entry
\`\`\`json
{
  "id": "VULN_001",
  "name": "SQL Injection",
  "description": "String concatenation in SQL queries allows SQL injection",
  "severity": "critical",
  "line_number": 42,
  "code_snippet": "query = f'SELECT * FROM users WHERE id = {user_id}'",
  "remediation": "Use parameterized queries/prepared statements",
  "stride_categories": ["Tampering", "Elevation of Privilege"]
}
\`\`\`

### STRIDE Distribution
\`\`\`json
{
  "Tampering": 2,
  "Elevation of Privilege": 2,
  "Information Disclosure": 1
}
\`\`\`

## Best Practices

### Before Analysis
1. Remove secrets from code (they'll be flagged)
2. Ensure file is valid code (not binary)
3. File should be < 10MB
4. Use appropriate file extension

### After Analysis
1. Review all Critical vulnerabilities first
2. Read remediation suggestions
3. Cross-reference with STRIDE categories
4. Check for context-specific false positives
5. Download and share the JSON report

### Using Results
- Share reports with development team
- Track vulnerability remediation
- Compare reports over time
- Integrate into CI/CD pipelines
- Use for security training

## Limitations and Notes

### What VulnModeler Can Do
- Fast pattern-based analysis
- Detect common vulnerabilities
- Provide remediation guidance
- Multi-language support
- Real-time feedback

### What VulnModeler Cannot Do
- Detect all possible vulnerabilities
- Perform runtime analysis
- Test application behavior
- Detect business logic flaws
- Assess infrastructure security

### Important
- VulnModeler is a static analysis tool
- Results may include false positives
- Context matters - review findings carefully
- Not a replacement for security review
- Should be part of comprehensive security approach

## Common Questions

**Q: Why did I get a false positive?**
A: VulnModeler uses pattern matching. Context matters. Review the code and remediation guidance. Some patterns are legitimate in certain contexts.

**Q: Can I use VulnModeler on production code?**
A: Yes, but remember it's static analysis. Consider:
- False positives/negatives
- Need for manual review
- Integration with other tools
- Regular re-analysis

**Q: What file size limit exists?**
A: Default is 10MB (configurable in backend/.env)

**Q: Does VulnModeler store my code?**
A: No. Code is analyzed and discarded. No persistence.

**Q: Can I run this on my own server?**
A: Yes! See SETUP.md for deployment instructions.

## Next Steps

1. Analyze sample code to get familiar
2. Read detailed documentation in README.md
3. Review the architecture in ARCHITECTURE.md
4. Set up production deployment (see SETUP.md)
5. Integrate with your development workflow

## Support and Resources

- Full API docs: http://localhost:8000/docs
- Architecture guide: ARCHITECTURE.md
- Setup guide: SETUP.md
- Main README: README.md

## Tips

- Use "Scanner" for quick analysis
- Download reports for team sharing
- Review STRIDE categories to understand threat types
- Use architecture diagram to understand system design
- Check remediation guidance for each finding

Happy secure coding!
