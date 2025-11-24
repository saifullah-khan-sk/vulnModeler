"use client"

import { AlertCircle, Info, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface VulnerabilitiesTableProps {
  report: any
  loading: boolean
}

export default function VulnerabilitiesTable({ report, loading }: VulnerabilitiesTableProps) {
  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center h-64 gap-3">
        <Loader2 className="animate-spin text-primary h-6 w-6" />
        <span className="text-muted-foreground">Analyzing code...</span>
      </Card>
    )
  }

  if (!report) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Info className="mx-auto text-muted-foreground mb-3 h-10 w-10" />
          <p className="text-muted-foreground">Upload a file to see results</p>
        </div>
      </Card>
    )
  }

  const vulns = report.vulnerabilities || []

  return (
    <Card className="p-6 bg-card border border-border space-y-6">
      {/* Vulnerabilities Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertCircle className="text-red-500 h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Vulnerabilities
            <span className="text-red-500 ml-3 font-bold">{vulns.length}</span>
          </h3>
        </div>

        {/* Vulnerability Items */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {vulns.length > 0 ? (
            vulns.slice(0, 5).map((vuln: any, i: number) => (
              <div
                key={i}
                className="flex gap-3 p-3 bg-background/50 rounded-lg border border-border hover:border-red-500/30 transition"
              >
                <Badge variant="outline" className="flex-shrink-0 h-fit capitalize">
                  {vuln.severity}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{vuln.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{vuln.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground p-3">No vulnerabilities found</p>
          )}
          {vulns.length > 5 && (
            <p className="text-xs text-muted-foreground p-3">+{vulns.length - 5} more vulnerabilities</p>
          )}
        </div>
      </div>

      {/* STRIDE Distribution */}
      {report.stride_distribution && Object.keys(report.stride_distribution).length > 0 && (
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">STRIDE Distribution</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(report.stride_distribution).map(([category, count]: [string, any]) => (
              <div key={category} className="bg-background/50 p-3 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">{category}</p>
                <p className="text-xl font-bold text-primary">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
