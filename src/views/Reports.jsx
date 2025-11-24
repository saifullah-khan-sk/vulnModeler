"use client"

import { useState, useEffect } from "react"
import { downloadReport } from "../api"
import { FileText, Download, Calendar } from "lucide-react"

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = () => {
    const savedScans = JSON.parse(localStorage.getItem("recentScans") || "[]")
    setReports(savedScans.reverse())
  }

  const handleDownload = async (report) => {
    setLoading(true)
    try {
      await downloadReport(report)
    } catch (err) {
      console.error("Download failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Security Reports</h1>
        <p className="text-muted-light">Download comprehensive vulnerability assessment reports</p>
      </div>

      {reports.length === 0 ? (
        <div className="card text-center py-16">
          <FileText className="w-16 h-16 text-muted mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Reports Available</h3>
          <p className="text-muted">Run a code analysis to generate your first report</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report, idx) => (
            <div key={idx} className="card card-hover group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-accent bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.fileName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted mt-1">
                      <Calendar className="w-4 h-4" />
                      {report.timestamp}
                    </div>
                  </div>
                  <span className={`badge badge-${report.severity.toLowerCase()}`}>{report.severity}</span>
                </div>
                <button
                  onClick={() => handleDownload(report)}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 ml-4"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
