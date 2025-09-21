"use client"

import { AdminLayout } from "@/components/dashboard/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  Database,
  Settings,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Lock,
} from "lucide-react"
import { useState } from "react"

const systemStatus = [
  { service: "Threat Detection Engine", status: "online", uptime: "99.9%", lastCheck: "2 min ago" },
  { service: "Incident Management System", status: "online", uptime: "99.8%", lastCheck: "1 min ago" },
  { service: "User Authentication", status: "online", uptime: "100%", lastCheck: "30 sec ago" },
  { service: "Email Notification Service", status: "maintenance", uptime: "98.5%", lastCheck: "5 min ago" },
  { service: "Database Backup System", status: "online", uptime: "99.7%", lastCheck: "3 min ago" },
  { service: "Analytics Engine", status: "online", uptime: "99.9%", lastCheck: "1 min ago" },
]

const recentActions = [
  { action: "User account created", user: "admin", timestamp: "2 min ago", type: "user" },
  { action: "System backup completed", user: "system", timestamp: "15 min ago", type: "system" },
  { action: "Security policy updated", user: "admin", timestamp: "1 hour ago", type: "security" },
  { action: "Incident report exported", user: "admin", timestamp: "2 hours ago", type: "export" },
  { action: "Database maintenance", user: "system", timestamp: "6 hours ago", type: "system" },
]

export default function AdminToolsPage() {
  const [bulkMessage, setBulkMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleBulkNotification = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setBulkMessage("")
      alert("Bulk notification sent successfully!")
    }, 2000)
  }

  const handleSystemAction = (action: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert(`${action} completed successfully!`)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="default" className="bg-green-500">
            Online
          </Badge>
        )
      case "maintenance":
        return <Badge variant="secondary">Maintenance</Badge>
      default:
        return <Badge variant="destructive">Offline</Badge>
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4 text-blue-500" />
      case "system":
        return <Settings className="h-4 w-4 text-gray-500" />
      case "security":
        return <Shield className="h-4 w-4 text-green-500" />
      case "export":
        return <Download className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Tools</h1>
          <p className="text-muted-foreground mt-2">System management and administrative utilities</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">User Management</p>
                  <p className="text-sm text-muted-foreground">1,247 active users</p>
                </div>
              </div>
              <Button className="w-full mt-4" size="sm">
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Database className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-muted-foreground">Last backup: 2h ago</p>
                </div>
              </div>
              <Button
                className="w-full mt-4 bg-transparent"
                size="sm"
                variant="outline"
                onClick={() => handleSystemAction("Database backup")}
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                Backup Now
              </Button>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Download className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-muted-foreground">Generate reports</p>
                </div>
              </div>
              <Button
                className="w-full mt-4 bg-transparent"
                size="sm"
                variant="outline"
                onClick={() => handleSystemAction("Data export")}
                disabled={isLoading}
              >
                Export Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="font-medium">System Refresh</p>
                  <p className="text-sm text-muted-foreground">Clear cache & reload</p>
                </div>
              </div>
              <Button
                className="w-full mt-4 bg-transparent"
                size="sm"
                variant="outline"
                onClick={() => handleSystemAction("System refresh")}
                disabled={isLoading}
              >
                Refresh System
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Real-time status of all system components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemStatus.map((service) => (
                <div key={service.service} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="font-medium">{service.service}</p>
                      <p className="text-sm text-muted-foreground">
                        Uptime: {service.uptime} • Last check: {service.lastCheck}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bulk Notifications */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>Bulk Notifications</CardTitle>
              <CardDescription>Send notifications to all users or specific groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your message here..."
                value={bulkMessage}
                onChange={(e) => setBulkMessage(e.target.value)}
                rows={4}
              />
              <div className="flex space-x-2">
                <Button onClick={handleBulkNotification} disabled={!bulkMessage.trim() || isLoading} className="flex-1">
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                  Send to All Users
                </Button>
                <Button variant="outline" disabled={!bulkMessage.trim()}>
                  Send to Admins
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Admin Actions */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>Recent Admin Actions</CardTitle>
              <CardDescription>Latest administrative activities and system changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActions.map((action, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    {getActionIcon(action.type)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{action.action}</p>
                      <p className="text-xs text-muted-foreground">
                        by {action.user} • {action.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure system-wide security policies and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Timeout (minutes)</label>
                <Input type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Login Attempts</label>
                <Input type="number" defaultValue="5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password Min Length</label>
                <Input type="number" defaultValue="8" />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <Button>
                <Lock className="h-4 w-4 mr-2" />
                Update Security Settings
              </Button>
              <Button variant="outline">Reset to Defaults</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
