const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

/**
 * Upload source code file and perform security analysis
 * @param {File} file - The source code file to analyze
 * @returns {Promise<Object>} Analysis results with findings and risk score
 */
export const uploadAndAnalyze = async (file) => {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const contentType = response.headers.get("content-type")
      if (contentType?.includes("text/html")) {
        throw new Error(
          `Backend error (${response.status}): ${response.statusText}. Is the backend running at ${API_BASE_URL}?`,
        )
      }
      try {
        const error = await response.json()
        throw new Error(error.detail || `HTTP ${response.status}`)
      } catch (e) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    }

    const data = await response.json()

    const report = data.report || {}
    const summary = report.summary || {}
    const findings = report.vulnerabilities || []

    // Calculate risk score based on severity counts
    const critical = summary.critical || 0
    const high = summary.high || 0
    const medium = summary.medium || 0
    const low = summary.low || 0
    const total = summary.total_vulnerabilities || 0
    const riskScore = total > 0 
      ? Math.round(((critical * 100 + high * 70 + medium * 40 + low * 10) / (total * 100)) * 100)
      : 0

    // Extract CVSS score
    const overallCvssScore = summary.overall_cvss_score || 0

    return {
      findings: findings,
      riskScore: riskScore,
      cvssScore: overallCvssScore, // Add CVSS score at top level for easy access
      summary: {
        total: total,
        critical: critical,
        high: high,
        medium: medium,
        low: low,
        overall_cvss_score: overallCvssScore, // Include in summary too
      },
      report: report, // Include full report for VulnerabilitiesPage
    }
  } catch (error) {
    console.error("[v0] API Error:", error)
    throw new Error(error.message || "Analysis request failed")
  }
}

/**
 * Fetch the architecture diagram SVG from the backend
 * @returns {Promise<string>} SVG content as string
 */
export const fetchDiagramSVG = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/diagram.svg`, {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch diagram (${response.status})`)
    }

    const contentType = response.headers.get("content-type")
    if (contentType?.includes("image/svg")) {
      return await response.text()
    }

    return "<svg></svg>"
  } catch (error) {
    console.error("[v0] Diagram Error:", error)
    throw new Error(error.message || "Diagram request failed")
  }
}

/**
 * Download a security report for a scanned file
 * @param {Object} report - Report object with fileName and timestamp
 * @returns {Promise<void>}
 */
export const downloadReport = async (report) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: report.fileName,
        timestamp: report.timestamp,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to download report (${response.status})`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${report.fileName}-report-${Date.now()}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("[v0] Download Error:", error)
    throw new Error(error.message || "Download request failed")
  }
}

/**
 * Fetch STRIDE threat categorization for findings
 * @param {Array} findings - Array of vulnerability findings
 * @returns {Promise<Object>} Threats organized by STRIDE category
 */
export const fetchThreats = async (findings) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stride`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ findings }),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch threats (${response.status})`)
    }

    const data = await response.json()
    return data.threats || {}
  } catch (error) {
    console.error("[v0] Threats Error:", error)
    throw new Error(error.message || "Threat mapping request failed")
  }
}

/**
 * Get health status of the backend API
 * @returns {Promise<Object>} Health check response with diagnostic info
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    if (response.ok) {
      return await response.json()
    }
    return { status: "unhealthy", error: `HTTP ${response.status}` }
  } catch (error) {
    return { status: "unreachable", error: error.message, url: API_BASE_URL }
  }
}
