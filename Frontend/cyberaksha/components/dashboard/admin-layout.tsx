"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Shield, List, BarChart3, Bell, Settings, LogOut, User, Menu, X, Monitor, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "admin") {
        router.push("/user-dashboard")
        return
      }
      setUser(parsedUser)
    } else {
      router.push("/login")
    }
  }, [router])

  const navigation = [
    { name: "Dashboard", href: "/admin-dashboard", icon: Monitor },
    { name: "Incident List", href: "/admin-dashboard/incidents", icon: List },
    { name: "Risk Analytics", href: "/admin-dashboard/analytics", icon: BarChart3 },
    { name: "Notifications", href: "/admin-dashboard/notifications", icon: Bell },
    { name: "Admin Tools", href: "/admin-dashboard/tools", icon: Settings },
    { name: "Profile", href: "/admin-dashboard/profile", icon: User },
  ]

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const isActive = (href: string) => pathname === href

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-sidebar-accent cyber-glow" />
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">CERT-Army</h1>
                <p className="text-xs text-sidebar-foreground/70">Admin Portal</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="px-4 py-3 border-b border-sidebar-border">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-red-500">23</div>
                <div className="text-sidebar-foreground/70">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-500">45</div>
                <div className="text-sidebar-foreground/70">Pending</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground cyber-glow"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                  {user?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || "Admin"}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">CERT Administrator</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation Bar */}
        <header className="bg-card border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-foreground">CERT-Army Command Center</h2>
                <p className="text-sm text-muted-foreground">Monitor • Analyze • Respond</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-muted-foreground">3 Critical Alerts</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">System Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
