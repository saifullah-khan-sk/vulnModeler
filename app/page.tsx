"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Dashboard from "@/src/views/Dashboard"
import Scanner from "@/src/views/Scanner"
import VulnerabilitiesPage from "@/src/views/Vulnerabilities"
import DiagramPage from "@/src/views/DiagramPage"

export default function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard")
  const [reportData, setReportData] = useState<any>(null)

  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard reportData={reportData} onNavigate={setCurrentPage} />
      case "Scanner":
        return (
          <Scanner
            onAnalysisComplete={(data) => {
              setReportData(data)
              setCurrentPage("Vulnerabilities")
            }}
          />
        )
      case "Vulnerabilities":
        return <VulnerabilitiesPage reportData={reportData} />
      case "Diagram":
        return <DiagramPage />
      default:
        return <Dashboard reportData={reportData} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar selected={currentPage} onSelect={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}
