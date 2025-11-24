"use client"

import { Home, Upload, BarChart3, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  selected: string
  onSelect: (name: string) => void
}

export default function Sidebar({ selected, onSelect }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: Home },
    { name: "Scanner", icon: Upload },
    { name: "Vulnerabilities", icon: BarChart3 },
    { name: "Diagram", icon: Zap },
  ]

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-[#e50914]">
          VulnModeler
        </h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Vulnerability Detection & STRIDE Based
Threat Modeling Tool</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = selected === item.name
          return (
            <Button
              key={item.name}
              onClick={() => onSelect(item.name)}
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-10"
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-s text-sidebar-foreground/60">v1.0</p>
        {/* <p className="text-xs text-sidebar-foreground/40 mt-1">Powered by VulnModeler</p> */}
      </div>
    </aside>
  )
}
