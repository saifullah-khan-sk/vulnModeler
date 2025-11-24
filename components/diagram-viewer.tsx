"use client"

import { useEffect, useState } from "react"
import { fetchDiagramSVG } from "@/lib/api"
import { Loader2, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function DiagramViewer() {
  const [svg, setSvg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDiagram() {
      try {
        const data = await fetchDiagramSVG()
        setSvg(data)
      } catch (err: any) {
        setError(err.message || "Failed to load diagram")
      } finally {
        setLoading(false)
      }
    }
    loadDiagram()
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-96 gap-3">
          <Loader2 className="animate-spin text-primary h-6 w-6" />
          <span className="text-muted-foreground">Loading diagram...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3">
          <AlertCircle className="text-destructive flex-shrink-0 h-5 w-5 mt-0.5" />
          <p className="text-destructive text-sm">{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card border border-border">
      <h2 className="text-2xl font-semibold text-foreground mb-4">System Architecture</h2>
      <div className="bg-background/50 rounded-lg border border-border overflow-auto max-h-[600px] p-4">
        {svg && <div dangerouslySetInnerHTML={{ __html: svg }} className="mx-auto" />}
      </div>
    </Card>
  )
}
