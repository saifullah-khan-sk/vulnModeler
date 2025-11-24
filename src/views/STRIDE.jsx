"use client"

import { useState, useEffect } from "react"
import { Shield, Bug, Lock, Users, Database, Network } from "lucide-react"

const STRIDE_CATEGORIES = [
  {
    name: "Spoofing",
    icon: Users,
    color: "text-danger",
    bgColor: "bg-danger",
    description: "Identity spoofing and impersonation threats",
  },
  {
    name: "Tampering",
    icon: Lock,
    color: "text-warning",
    bgColor: "bg-warning",
    description: "Data or code modification attacks",
  },
  {
    name: "Repudiation",
    icon: Shield,
    color: "text-accent",
    bgColor: "bg-accent",
    description: "Denial of actions taken by users",
  },
  {
    name: "Information Disclosure",
    icon: Database,
    color: "text-warning",
    bgColor: "bg-warning",
    description: "Unauthorized information exposure",
  },
  {
    name: "Denial of Service",
    icon: Network,
    color: "text-danger",
    bgColor: "bg-danger",
    description: "System availability disruption",
  },
  {
    name: "Elevation of Privilege",
    icon: Bug,
    color: "text-danger",
    bgColor: "bg-danger",
    description: "Unauthorized privilege escalation",
  },
]

export default function STRIDE() {
  const [strideData, setStrideData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadSTRIDEData = async () => {
      const savedData = localStorage.getItem("strideData")
      if (savedData) {
        setStrideData(JSON.parse(savedData))
      }
    }
    loadSTRIDEData()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">STRIDE Threat Modeling</h1>
        <p className="text-muted-light">Microsoft's threat classification framework for identifying security threats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STRIDE_CATEGORIES.map((category) => {
          const Icon = category.icon
          const data = strideData[category.name] || []

          return (
            <div key={category.name} className="card card-hover group">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                <div
                  className={`p-2.5 ${category.bgColor} bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all`}
                >
                  <Icon className={`w-5 h-5 ${category.color}`} />
                </div>
              </div>
              <p className="text-muted text-sm mb-4">{category.description}</p>

              {Array.isArray(data) && data.length > 0 ? (
                <div className="space-y-2">
                  {data.map((threat, idx) => (
                    <div key={idx} className="p-2 bg-card-border bg-opacity-30 rounded text-xs text-muted-light">
                      • {threat}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-xs italic">No threats identified</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
