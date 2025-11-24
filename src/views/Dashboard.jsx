"use client"

import { useState, useEffect } from "react"
import { BarChart3, AlertCircle, TrendingUp, Clock, FileText, ArrowRight } from "lucide-react"

export default function Dashboard({ reportData, onNavigate }) {
  const [stats, setStats] = useState({
    totalScans: 0,
    criticalVulns: 0,
    avgRiskScore: 0,
    filesAnalyzed: 0,
    avgCvssScore: 0,
  })
  const [recentScans, setRecentScans] = useState([])
  const [loading, setLoading] = useState(false)

  // const updateStats = () => {
  //   // Load stats from localStorage
  //   let savedStats = JSON.parse(
  //     localStorage.getItem("vulnStats") || '{"totalScans":0,"criticalVulns":0,"avgRiskScore":0,"filesAnalyzed":0,"avgCvssScore":0,"riskScores":[],"cvssScores":[]}',
  //   )
    
  //   // If stats don't exist or are zero, calculate from recentScans
  //   const savedScans = JSON.parse(localStorage.getItem("recentScans") || "[]")
  //   if (savedStats.totalScans === 0 && savedScans.length > 0) {
  //     // Recalculate stats from recent scans
  //     const cvssScores = savedScans.map(scan => {
  //       return scan.cvssScore || 
  //              scan.report?.summary?.overall_cvss_score || 
  //              scan.summary?.overall_cvss_score || 
  //              0
  //     }).filter(score => score > 0 && score !== "N/A")
  //     savedStats = {
  //       totalScans: savedScans.length,
  //       criticalVulns: savedScans.reduce((sum, scan) => sum + (scan.criticalCount || 0), 0),
  //       filesAnalyzed: savedScans.length,
  //       riskScores: savedScans.map(scan => scan.riskScore || 0).filter(score => score > 0),
  //       cvssScores: cvssScores,
  //     }
  //     savedStats.avgRiskScore = savedStats.riskScores.length > 0
  //       ? Math.round(savedStats.riskScores.reduce((a, b) => a + b, 0) / savedStats.riskScores.length)
  //       : 0
  //     savedStats.avgCvssScore = cvssScores.length > 0
  //       ? parseFloat((cvssScores.reduce((a, b) => a + b, 0) / cvssScores.length).toFixed(1))
  //       : 0.0
  //     // Save recalculated stats
  //     localStorage.setItem("vulnStats", JSON.stringify(savedStats))
  //   } else if (savedStats.avgCvssScore === undefined || savedStats.avgCvssScore === 0) {
  //     // Calculate CVSS if missing
  //     const cvssScores = savedScans.map(scan => {
  //       return scan.cvssScore || 
  //              scan.report?.summary?.overall_cvss_score || 
  //              scan.summary?.overall_cvss_score || 
  //              0
  //     }).filter(score => score > 0 && score !== "N/A")
  //     savedStats.avgCvssScore = cvssScores.length > 0
  //       ? parseFloat((cvssScores.reduce((a, b) => a + b, 0) / cvssScores.length).toFixed(1))
  //       : 0.0
  //     savedStats.cvssScores = cvssScores
  //   }
    
  //   setStats(savedStats)
  //   setRecentScans(savedScans.slice(-5))
  // }

  const updateStats = () => {
    // Load stats from localStorage
    let savedStats = JSON.parse(
      localStorage.getItem("vulnStats") || '{"totalScans":0,"criticalVulns":0,"avgRiskScore":0,"filesAnalyzed":0,"avgCvssScore":0,"riskScores":[],"cvssScores":[]}',
    )
    
    // If stats don't exist or are zero, calculate from recentScans
    const savedScans = JSON.parse(localStorage.getItem("recentScans") || "[]")
    if (savedStats.totalScans === 0 && savedScans.length > 0) {
      // Recalculate stats from recent scans
      const cvssScores = savedScans.map(scan => {
        return scan.cvssScore || 
               scan.report?.summary?.overall_cvss_score || 
               scan.summary?.overall_cvss_score || 
               0
      }).filter(score => score > 0 && score !== "N/A")
      savedStats = {
        totalScans: savedScans.length,
        criticalVulns: savedScans.reduce((sum, scan) => sum + (scan.criticalCount || 0), 0),
        filesAnalyzed: savedScans.length,
        riskScores: savedScans.map(scan => scan.riskScore || 0).filter(score => score > 0),
        cvssScores: cvssScores,
      }
      savedStats.avgRiskScore = savedStats.riskScores.length > 0
        ? Math.round(savedStats.riskScores.reduce((a, b) => a + b, 0) / savedStats.riskScores.length)
        : 0
      savedStats.avgCvssScore = cvssScores.length > 0
        ? parseFloat((cvssScores.reduce((a, b) => a + b, 0) / cvssScores.length).toFixed(1))
        : 0.0
      // Save recalculated stats
      localStorage.setItem("vulnStats", JSON.stringify(savedStats))
    } else if (savedStats.avgCvssScore === undefined || savedStats.avgCvssScore === 0) {
      // Calculate CVSS if missing
      const cvssScores = savedScans.map(scan => {
        return scan.cvssScore || 
               scan.report?.summary?.overall_cvss_score || 
               scan.summary?.overall_cvss_score || 
               0
      }).filter(score => score > 0 && score !== "N/A")
      savedStats.avgCvssScore = cvssScores.length > 0
        ? parseFloat((cvssScores.reduce((a, b) => a + b, 0) / cvssScores.length).toFixed(1))
        : 0.0
      savedStats.cvssScores = cvssScores
    }
    
    setStats(savedStats)
    setRecentScans(savedScans.slice(-5))
  }

  useEffect(() => {
    updateStats()
    
    // Listen for storage changes to update when new scans are added
    const handleStorageChange = () => {
      updateStats()
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically (in case same tab updates localStorage)
    const interval = setInterval(updateStats, 1000)
    
    // Update when window gains focus (user returns to tab)
    const handleFocus = () => {
      updateStats()
    }
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [reportData])

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-light">Welcome back. Here's your security overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="card card-hover group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm font-medium">Total Scans</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.totalScans}</p>
            </div>
            <div className="p-3 bg-accent bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-muted text-xs mt-4">Completed analyses</p>
        </div>

        {/* Critical Vulnerabilities */}
        <div className="card card-hover group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm font-medium">Critical Issues</p>
              <p className="text-3xl font-bold text-danger mt-2">{stats.criticalVulns}</p>
            </div>
            <div className="p-3 bg-danger bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
              <AlertCircle className="w-6 h-6 text-danger" />
            </div>
          </div>
          <p className="text-muted text-xs mt-4">Requiring immediate attention</p>
        </div>

        {/* Avg Risk Score */}
        <div className="card card-hover group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm font-medium">Avg Risk Score</p>
              <p className="text-3xl font-bold text-warning mt-2">{stats.avgRiskScore}%</p>
            </div>
            <div className="p-3 bg-warning bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
              <TrendingUp className="w-6 h-6 text-warning" />
            </div>
          </div>
          <p className="text-muted text-xs mt-4">Across all analyses</p>
        </div>

        {/* Files Analyzed */}
        <div className="card card-hover group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm font-medium">Files Analyzed</p>
              <p className="text-3xl font-bold text-success mt-2">{stats.filesAnalyzed}</p>
            </div>
            <div className="p-3 bg-success bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
              <FileText className="w-6 h-6 text-success" />
            </div>
          </div>
          <p className="text-muted text-xs mt-4">Source files processed</p>
        </div>
      </div>

      {/* CVSS Score - Prominent Display */}
      <div className="card card-hover border-2 border-[#e50914]/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted text-sm font-medium mb-1">Average CVSS Score</p>
            <p className="text-4xl font-bold text-[#e50914]">{stats.avgCvssScore || 0.0}</p>
            <p className="text-muted text-xs mt-2">Common Vulnerability Scoring System (0.0 - 10.0)</p>
          </div>
          <div className="p-4 bg-[#e50914] bg-opacity-10 rounded-lg">
            <AlertCircle className="w-8 h-8 " />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Scans</h2>
          {recentScans.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
              <p className="text-muted">No scans yet. Upload a file to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-card-border bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-foreground font-medium text-sm">{scan.fileName}</p>
                      <p className="text-muted text-xs">{scan.timestamp}</p>
                    </div>
                  </div>
                  <span className={`badge badge-${scan.severity.toLowerCase()}`}>{scan.severity}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => {
                if (onNavigate) {
                  onNavigate("Scanner")
                }
              }}
              className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/90"
            >
              <FileText className="w-4 h-4" />
              Scan Code
            </button>
            <button 
              onClick={() => {
                if (onNavigate) {
                  onNavigate("Vulnerabilities")
                }
              }}
              className="w-full btn-secondary flex items-center justify-center gap-2 cursor-pointer hover:bg-secondary/80"
            >
              <ArrowRight className="w-4 h-4" />
              View Reports
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("recentScans");
                localStorage.setItem("vulnStats", JSON.stringify({
                  totalScans: 0,
                  criticalVulns: 0,
                  avgRiskScore: 0,
                  filesAnalyzed: 0,
                  avgCvssScore: 0,
                  riskScores: [],
                  cvssScores: []
                }));
                setStats({
                  totalScans: 0,
                  criticalVulns: 0,
                  avgRiskScore: 0,
                  filesAnalyzed: 0,
                  avgCvssScore: 0
                });
                setRecentScans([]);
              }}
              className="w-full btn-danger flex items-center justify-center gap-2 cursor-pointer hover:bg-danger/80"
            >
              <AlertCircle className="w-4 h-4" />
              Delete All Scans & Reset Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

  //   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
//           <p className="text-muted-light">Welcome back. Here's your security overview.</p>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Total Scans */}
//         <div className="card card-hover group">
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-muted text-sm font-medium">Total Scans</p>
//               <p className="text-3xl font-bold text-foreground mt-2">{stats.totalScans}</p>
//             </div>
//             <div className="p-3 bg-accent bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
//               <BarChart3 className="w-6 h-6 text-accent" />
//             </div>
//           </div>
//           <p className="text-muted text-xs mt-4">Completed analyses</p>
//         </div>

//         {/* Critical Vulnerabilities */}
//         <div className="card card-hover group">
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-muted text-sm font-medium">Critical Issues</p>
//               <p className="text-3xl font-bold text-danger mt-2">{stats.criticalVulns}</p>
//             </div>
//             <div className="p-3 bg-danger bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
//               <AlertCircle className="w-6 h-6 text-danger" />
//             </div>
//           </div>
//           <p className="text-muted text-xs mt-4">Requiring immediate attention</p>
//         </div>

//         {/* Avg Risk Score */}
//         <div className="card card-hover group">
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-muted text-sm font-medium">Avg Risk Score</p>
//               <p className="text-3xl font-bold text-warning mt-2">{stats.avgRiskScore}%</p>
//             </div>
//             <div className="p-3 bg-warning bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
//               <TrendingUp className="w-6 h-6 text-warning" />
//             </div>
//           </div>
//           <p className="text-muted text-xs mt-4">Across all analyses</p>
//         </div>

//         {/* Files Analyzed */}
//         <div className="card card-hover group">
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-muted text-sm font-medium">Files Analyzed</p>
//               <p className="text-3xl font-bold text-success mt-2">{stats.filesAnalyzed}</p>
//             </div>
//             <div className="p-3 bg-success bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
//               <FileText className="w-6 h-6 text-success" />
//             </div>
//           </div>
//           <p className="text-muted text-xs mt-4">Source files processed</p>
//         </div>
//       </div>

//       {/* CVSS Score - Prominent Display */}
//       <div className="card card-hover border-2 border-[#e50914]/30">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-muted text-sm font-medium mb-1">Average CVSS Score</p>
//             <p className="text-4xl font-bold text-[#e50914]">{stats.avgCvssScore || 0.0}</p>
//             <p className="text-muted text-xs mt-2">Common Vulnerability Scoring System (0.0 - 10.0)</p>
//           </div>
//           <div className="p-4 bg-[#e50914] bg-opacity-10 rounded-lg">
//             <AlertCircle className="w-8 h-8 text-[#e50914]" />
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 card">
//           <h2 className="text-lg font-semibold text-foreground mb-4">Recent Scans</h2>
//           {recentScans.length === 0 ? (
//             <div className="text-center py-8">
//               <Clock className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
//               <p className="text-muted">No scans yet. Upload a file to get started!</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {recentScans.map((scan, idx) => (
//                 <div
//                   key={idx}
//                   className="flex items-center justify-between p-3 bg-card-border bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all"
//                 >
//                   <div className="flex items-center gap-3 flex-1">
//                     <FileText className="w-5 h-5 text-accent" />
//                     <div>
//                       <p className="text-foreground font-medium text-sm">{scan.fileName}</p>
//                       <p className="text-muted text-xs">{scan.timestamp}</p>
//                     </div>
//                   </div>
//                   <span className={`badge badge-${scan.severity.toLowerCase()}`}>{scan.severity}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Quick Actions */}
//         <div className="card">
//           <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
//           <div className="space-y-3">
//             <button 
//               onClick={() => {
//                 if (onNavigate) {
//                   onNavigate("Scanner")
//                 }
//               }}
//               className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/90"
//             >
//               <FileText className="w-4 h-4" />
//               Scan Code
//             </button>
//             <button 
//               onClick={() => {
//                 if (onNavigate) {
//                   onNavigate("Vulnerabilities")
//                 }
//               }}
//               className="w-full btn-secondary flex items-center justify-center gap-2 cursor-pointer hover:bg-secondary/80"
//             >
//               <ArrowRight className="w-4 h-4" />
//               View Reports
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
