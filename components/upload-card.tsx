"use client"

import { useState } from "react"
import { uploadAndAnalyze } from "@/lib/api"
import { Upload, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface UploadCardProps {
  onAnalysisComplete: (data: any) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export default function UploadCard({ onAnalysisComplete, loading, setLoading }: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const data = await uploadAndAnalyze(file)
      onAnalysisComplete(data)
    } catch (err: any) {
      setError(err.message || "Failed to analyze code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-card border border-border flex flex-col">
      {/* Icon */}
      <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
        <Upload className="text-primary h-6 w-6" />
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-foreground mb-1">Upload Code</h2>
      <p className="text-xs text-muted-foreground mb-6">Analyze for security vulnerabilities</p>

      {/* File Input */}
      <label className="flex-1 mb-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={loading}
          className="block w-full text-sm text-muted-foreground
            file:mr-4 file:py-2 file:px-3
            file:rounded-lg file:border-0
            file:text-xs file:font-semibold
            file:bg-primary/10 file:text-primary
            hover:file:bg-primary/20
            cursor-pointer disabled:opacity-50"
        />
      </label>

      {file && <p className="text-xs text-muted-foreground mb-4 truncate">Selected: {file.name}</p>}

      {/* Upload Button */}
      <Button onClick={handleUpload} disabled={!file || loading} className="w-full mb-4" size="sm">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Start Analysis"
        )}
      </Button>

      {/* Error */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-lg flex gap-2">
          <AlertCircle className="text-destructive flex-shrink-0 h-4 w-4 mt-0.5" />
          <p className="text-destructive text-xs">{error}</p>
        </div>
      )}
    </Card>
  )
}
