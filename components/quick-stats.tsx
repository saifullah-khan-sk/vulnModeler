"use client"

import { AlertCircle, Shield, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function QuickStats({ report }: { report: any }) {
  const summary = report?.summary || {}

  const getRiskLevel = (critical: number, high: number) => {
    if (critical > 0) return { level: "Critical", color: "text-red-500" }
    if (high > 2) return { level: "High", color: "text-orange-500" }
    if (high > 0) return { level: "Medium", color: "text-yellow-500" }
    return { level: "Low", color: "text-green-500" }
  }

  const risk = getRiskLevel(summary.critical || 0, summary.high || 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4 bg-card border border-border">
        <p className="text-xs font-semibold text-muted-foreground mb-2">TOTAL VULNS</p>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-foreground">{summary.total_vulnerabilities || 0}</p>
          <AlertCircle className="text-red-500 h-5 w-5" />
        </div>
      </Card>

      <Card className="p-4 bg-card border border-border">
        <p className="text-xs font-semibold text-muted-foreground mb-2">CRITICAL</p>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-red-500">{summary.critical || 0}</p>
          <Zap className="text-red-500 h-5 w-5" />
        </div>
      </Card>

      <Card className="p-4 bg-card border border-border">
        <p className="text-xs font-semibold text-muted-foreground mb-2">HIGH</p>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-orange-500">{summary.high || 0}</p>
          <Shield className="text-orange-500 h-5 w-5" />
        </div>
      </Card>

      <Card className="p-4 bg-card border border-border">
        <p className="text-xs font-semibold text-muted-foreground mb-2">RISK LEVEL</p>
        <div className="flex items-end justify-between">
          <p className={`text-3xl font-bold ${risk.color}`}>{risk.level}</p>
          <Zap className={`h-5 w-5 ${risk.color}`} />
        </div>
      </Card>
    </div>
  )
}
