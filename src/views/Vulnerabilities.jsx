"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Download, FileText } from "lucide-react"

export default function VulnerabilitiesPage({ reportData }) {
  const [report, setReport] = useState(null)

  useEffect(() => {
    // If reportData is passed as prop, use it
    // Otherwise, try to get from localStorage
    if (reportData) {
      // If reportData has a report property, use that, otherwise use reportData directly
      setReport(reportData.report || reportData)
    } else {
      const savedScans = JSON.parse(localStorage.getItem("recentScans") || "[]")
      if (savedScans.length > 0) {
        // Get the most recent scan
        const latest = savedScans[savedScans.length - 1]
        // Use the report property if it exists, otherwise use the scan itself
        setReport(latest.report || latest)
      }
    }
  }, [reportData])

  const downloadReport = () => {
    if (!report) return
    
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2))
    )
    element.setAttribute("download", `security-report-${Date.now()}.json`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (!report) {
    return (
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Vulnerabilities</h1>
          <p className="text-muted-light">View detailed vulnerability analysis results</p>
        </div>
        <div className="card text-center py-16">
          <FileText className="w-16 h-16 text-muted mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Analysis Data</h3>
          <p className="text-muted">Run a code analysis to view vulnerabilities</p>
        </div>
      </div>
    )
  }

  const findings = report.vulnerabilities || report.findings || []
  const summary = report.summary || {}
  
  // Get CVSS score from various possible locations
  const overallCvssScore = summary.overall_cvss_score || 
                          report.summary?.overall_cvss_score || 
                          report.overall_cvss_score || 
                          (report.metadata && report.metadata.cvss_score) || 
                          "N/A"

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Vulnerabilities</h1>
          <p className="text-muted-light">Detailed vulnerability analysis results</p>
        </div>
        <button onClick={downloadReport} className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card">
          <p className="text-muted text-sm font-medium mb-1">Total Findings</p>
          <p className="text-3xl font-bold text-foreground">{findings.length}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm font-medium mb-1">CVSS Score</p>
          <p className="text-3xl font-bold text-[#e50914]">{overallCvssScore}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm font-medium mb-1">Critical</p>
          <p className="text-3xl font-bold text-danger">{summary.critical || 0}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm font-medium mb-1">High</p>
          <p className="text-3xl font-bold text-warning">{summary.high || 0}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm font-medium mb-1">Medium</p>
          <p className="text-3xl font-bold text-info">{summary.medium || 0}</p>
        </div>
      </div>

      {/* Findings List */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-danger bg-opacity-10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-danger" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Findings
            <span className="text-danger ml-3 font-bold">{findings.length}</span>
          </h2>
        </div>

        {findings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted">No vulnerabilities found in the analyzed code.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {findings.map((finding, idx) => (
              <div
                key={idx}
                className="p-4 bg-card-border bg-opacity-30 rounded-lg border-l-4 border-danger hover:bg-opacity-50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{finding.name || finding.id || `Finding ${idx + 1}`}</h3>
                    {finding.cvss_score && (
                      <p className="text-xs text-muted mt-1">
                        CVSS: <span className="font-bold text-[#e50914]">{finding.cvss_score}</span>
                      </p>
                    )}
                  </div>
                  <span className={`badge badge-${(finding.severity?.toLowerCase() || finding.severity_level?.toLowerCase() || "medium")}`}>
                    {finding.severity || finding.severity_level || "Medium"}
                  </span>
                </div>
                <p className="text-muted text-sm mb-3">{finding.description || "No description available"}</p>
                {finding.remediation && (
                  <div className="mt-3 pt-3 border-t border-card-border">
                    <p className="text-xs text-muted mb-1">Remediation:</p>
                    <p className="text-sm text-foreground">{finding.remediation}</p>
                  </div>
                )}
                {finding.line_number && (
                  <p className="text-xs text-muted mt-2">Line {finding.line_number}</p>
                )}
                {finding.code_snippet && (
                  <div className="mt-2 p-2 bg-card-border bg-opacity-20 rounded text-xs font-mono">
                    <code className="text-muted">{finding.code_snippet}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

