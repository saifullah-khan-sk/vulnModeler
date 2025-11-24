"use client"

import { useState, useRef, useEffect } from "react"
import { uploadAndAnalyze, checkHealth } from "../api"
import { Upload, AlertCircle, CheckCircle, Loader } from "lucide-react"

export default function Scanner({ onAnalysisComplete }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [backendStatus, setBackendStatus] = useState("checking")
  const fileInputRef = useRef(null)

  useEffect(() => {
    checkHealth().then((health) => {
      setBackendStatus(health.status === "healthy" ? "healthy" : "error")
    })
  }, [])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError("")
      setResult(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setLoading(true)
    setError("")
    try {
      const result = await uploadAndAnalyze(file)
      setResult(result)

      // Save to localStorage
      const recentScans = JSON.parse(localStorage.getItem("recentScans") || "[]")
      const criticalCount = result.summary?.critical || 0
      const severity = criticalCount > 0 ? "Critical" : (result.summary?.high || 0) > 0 ? "High" : (result.summary?.medium || 0) > 0 ? "Medium" : "Low"
      
      recentScans.push({
        fileName: file.name,
        timestamp: new Date().toLocaleString(),
        severity: severity,
        report: result.report || result,
        summary: result.summary,
        riskScore: result.riskScore || 0,
        criticalCount: criticalCount,
        cvssScore: result.cvssScore || result.report?.summary?.overall_cvss_score || result.summary?.overall_cvss_score || 0,
      })
      localStorage.setItem("recentScans", JSON.stringify(recentScans.slice(-10)))
      
      // Update stats in localStorage
      const cvssScore = result.cvssScore || result.report?.summary?.overall_cvss_score || result.summary?.overall_cvss_score || 0
      const existingStats = JSON.parse(localStorage.getItem("vulnStats") || '{"totalScans":0,"criticalVulns":0,"avgRiskScore":0,"filesAnalyzed":0,"avgCvssScore":0,"riskScores":[],"cvssScores":[]}')
      const newStats = {
        totalScans: existingStats.totalScans + 1,
        criticalVulns: existingStats.criticalVulns + criticalCount,
        filesAnalyzed: existingStats.filesAnalyzed + 1,
        riskScores: [...(existingStats.riskScores || []), result.riskScore || 0].slice(-50), // Keep last 50 scores
        cvssScores: [...(existingStats.cvssScores || []), cvssScore].filter(s => s > 0).slice(-50), // Keep last 50 scores
      }
      newStats.avgRiskScore = newStats.riskScores.length > 0 
        ? Math.round(newStats.riskScores.reduce((a, b) => a + b, 0) / newStats.riskScores.length)
        : 0
      newStats.avgCvssScore = newStats.cvssScores.length > 0
        ? parseFloat((newStats.cvssScores.reduce((a, b) => a + b, 0) / newStats.cvssScores.length).toFixed(1))
        : 0.0
      localStorage.setItem("vulnStats", JSON.stringify(newStats))
      
      // Also save CVSS score to the scan record
      recentScans[recentScans.length - 1].cvssScore = cvssScore
      localStorage.setItem("recentScans", JSON.stringify(recentScans.slice(-10)))
      
      // Call onAnalysisComplete callback if provided
      // Pass the full report data for VulnerabilitiesPage
      if (onAnalysisComplete) {
        onAnalysisComplete(result.report || result)
      }
    } catch (err) {
      setError(err.message || "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Code Scanner</h1>
        <p className="text-muted-light">Upload source code for automated vulnerability analysis</p>
      </div>

      {backendStatus === "error" && (
        <div className="card border-l-4 border-danger bg-danger bg-opacity-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Backend Connection Issue</p>
              <p className="text-muted text-sm">
                Please ensure the backend is running at{" "}
                <code className="bg-card-border px-2 py-1 rounded text-xs">
                  {process.env.REACT_APP_API_URL || "http://localhost:8000"}
                </code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="card card-hover border-2 border-dashed border-card-border hover:border-accent transition-all cursor-pointer group"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rb,.php,.cs"
          className="hidden"
        />

        <div className="text-center py-12">
          <div className="p-4 bg-accent bg-opacity-10 rounded-full w-fit mx-auto mb-4 group-hover:bg-opacity-20 transition-all">
            <Upload className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{file ? file.name : "Upload Source Code"}</h3>
          <p className="text-muted mb-4">
            {file ? "File selected. Click to change." : "Drag and drop or click to select file"}
          </p>
          <p className="text-xs text-muted-light">Supports: JS, TS, Python, Java, C++, Go, Ruby, PHP, C#</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card border-l-4 border-danger bg-danger bg-opacity-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Error</p>
              <p className="text-muted text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!file || loading || backendStatus === "error"}
        className={`w-full btn-primary py-3 flex items-center justify-center gap-2 font-medium text-lg transition-all ${
          !file || loading || backendStatus === "error"
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg hover:shadow-accent/20"
        }`}
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            Start Analysis
          </>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="card border-l-4 border-accent">
          <h2 className="text-lg font-semibold text-foreground mb-4">Analysis Results</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-card-border bg-opacity-30 rounded-lg">
              <span className="text-muted">Total Findings:</span>
              <span className="text-2xl font-bold text-accent">{result.findings?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-card-border bg-opacity-30 rounded-lg">
              <span className="text-muted">CVSS Score:</span>
              <span className="text-2xl font-bold text-[#e50914]">{result.cvssScore || result.summary?.overall_cvss_score || result.report?.summary?.overall_cvss_score || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-card-border bg-opacity-30 rounded-lg">
              <span className="text-muted">Risk Score:</span>
              <span className="text-2xl font-bold text-warning">{result.riskScore || "N/A"}%</span>
            </div>
            {result.summary && (
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-card-border">
                <div className="p-2 bg-card-border bg-opacity-20 rounded text-center">
                  <p className="text-xs text-muted mb-1">Critical</p>
                  <p className="text-lg font-bold text-danger">{result.summary.critical || 0}</p>
                </div>
                <div className="p-2 bg-card-border bg-opacity-20 rounded text-center">
                  <p className="text-xs text-muted mb-1">High</p>
                  <p className="text-lg font-bold text-warning">{result.summary.high || 0}</p>
                </div>
                <div className="p-2 bg-card-border bg-opacity-20 rounded text-center">
                  <p className="text-xs text-muted mb-1">Medium</p>
                  <p className="text-lg font-bold text-info">{result.summary.medium || 0}</p>
                </div>
                <div className="p-2 bg-card-border bg-opacity-20 rounded text-center">
                  <p className="text-xs text-muted mb-1">Low</p>
                  <p className="text-lg font-bold text-success">{result.summary.low || 0}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
