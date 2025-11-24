const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

interface AnalysisResponse {
  status: string
  report: {
    metadata: {
      file_name: string
      analysis_timestamp: string
      analyzer_version: string
    }
    summary: {
      total_vulnerabilities: number
      critical: number
      high: number
      medium: number
      low: number
    }
    stride_distribution: Record<string, number>
    recommendation_summary: string
    vulnerabilities: Array<{
      id: string
      name: string
      description: string
      severity: string
      line_number?: number
      code_snippet: string
      remediation: string
      stride_categories: string[]
    }>
  }
}

export async function uploadAndAnalyze(file: File): Promise<{ report: any }> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: `API error: ${response.status}` }))
      throw new Error(error.detail || `API error: ${response.status}`)
    }

    const data: AnalysisResponse = await response.json()
    return { report: data.report }
  } catch (error) {
    console.error("Upload failed:", error)
    throw error
  }
}

export async function fetchDiagramSVG(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/diagram.svg`)

    if (!response.ok) {
      throw new Error(`Failed to fetch diagram: ${response.status}`)
    }

    return await response.text()
  } catch (error) {
    console.error("Diagram fetch failed:", error)
    throw error
  }
}

export async function generateSTRIDE(findings: { findings: string[] }): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/stride`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(findings),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("STRIDE generation failed:", error)
    throw error
  }
}

export async function downloadReport(report: any): Promise<void> {
  try {
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2)))
    element.setAttribute("download", `security-report-${Date.now()}.json`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  } catch (error) {
    console.error("Report download failed:", error)
    throw error
  }
}
