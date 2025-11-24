"use client"

import { useState, useEffect } from "react"
import { fetchDiagramSVG } from "../api"
import { Loader, Download, RefreshCw } from "lucide-react"

export default function DiagramPage() {
  const [svgContent, setSvgContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDiagram()
  }, [])

  const loadDiagram = async () => {
    setLoading(true)
    setError("")
    try {
      const svg = await fetchDiagramSVG()
      setSvgContent(svg)
    } catch (err) {
      setError("Failed to load diagram")
    } finally {
      setLoading(false)
    }
  }

  const downloadDiagram = () => {
    const link = document.createElement("a")
    link.href = `data:image/svg+xml;base64,${btoa(svgContent)}`
    link.download = "architecture-diagram.svg"
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Architecture Diagram</h1>
          <p className="text-muted-light">System architecture with trust zones and data flows</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadDiagram} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={downloadDiagram} disabled={!svgContent} className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-8 h-8 text-accent animate-spin mb-4" />
            <p className="text-muted">Loading diagram...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-danger font-medium mb-4">{error}</p>
            <button onClick={loadDiagram} className="btn-secondary">
              Try Again
            </button>
          </div>
        ) : svgContent ? (
          <div className="overflow-auto max-h-[600px] flex items-center justify-center bg-card-border bg-opacity-30 rounded-lg p-4">
            <div dangerouslySetInnerHTML={{ __html: svgContent }} />
          </div>
        ) : (
          <div className="text-center py-20 text-muted">No diagram available yet</div>
        )}
      </div>
    </div>
  )
}
