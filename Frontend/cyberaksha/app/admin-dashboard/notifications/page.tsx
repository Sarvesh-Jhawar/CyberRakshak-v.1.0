"use client"

import { AdminLayout } from "@/components/dashboard/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Bell, CheckCircle, Clock, User, MessageSquare, Shield, Eye } from "lucide-react"
import { useState } from "react"

const notifications = [
  {
    id: "1",
    type: "critical",
    title: "Critical Malware Detection",
    message: "Multiple workstations in IT Division infected with ransomware variant",
    user: "John Doe",
    unit: "IT Division",
    timestamp: "2 minutes ago",
    read: false,
    incidentId: "INC-2024-001",
  },
  {
    id: "2",
    type: "high",
    title: "Phishing Campaign Alert",
    message: "15+ employees reported suspicious emails with credential harvesting attempts",
    user: "Sarah Smith",
    unit: "HR Department",
    timestamp: "15 minutes ago",
    read: false,
    incidentId: "INC-2024-002",
  },
  {
    id: "3",
    type: "medium",
    title: "Suspicious Network Activity",
    message: "Unusual outbound traffic detected from Finance department workstations",
    user: "Mike Johnson",
    unit: "Finance",
    timestamp: "1 hour ago",
    read: true,
    incidentId: "INC-2024-003",
  },
  {
    id: "4",
    type: "info",
    title: "Security Training Completion",
    message: "Monthly cybersecurity training completed by 95% of staff",
    user: "System",
    unit: "HR Department",
    timestamp: "2 hours ago",
    read: true,
    incidentId: null,
  },
  {
    id: "5",
    type: "critical",
    title: "Data Exfiltration Attempt",
    message: "Large file transfer to external server blocked by DLP system",
    user: "Lisa Chen",
    unit: "R&D",
    timestamp: "3 hours ago",
    read: false,
    incidentId: "INC-2024-004",
  },
  {
    id: "6",
    type: "high",
    title: "Failed Login Attempts",
    message: "Multiple failed admin login attempts from foreign IP addresses",
    user: "David Wilson",
    unit: "IT Division",
    timestamp: "4 hours ago",
    read: true,
    incidentId: "INC-2024-005",
  },
  {
    id: "7",
    type: "medium",
    title: "Policy Violation",
    message: "Unauthorized software installation detected on Operations workstation",
    user: "Emma Brown",
    unit: "Operations",
    timestamp: "6 hours ago",
    read: true,
    incidentId: "INC-2024-006",
  },
  {
    id: "8",
    type: "info",
    title: "System Update Complete",
    message: "Security patches successfully deployed to all endpoints",
    user: "System",
    unit: "IT Division",
    timestamp: "8 hours ago",
    read: true,
    incidentId: null,
  },
]

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")
  const [notificationList, setNotificationList] = useState(notifications)

  const filteredNotifications = notificationList.filter((notification) => {
    if (filter === "unread") return !notification.read
    if (filter === "critical") return notification.type === "critical"
    if (filter === "high") return notification.type === "high"
    return true
  })

  const markAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "high":
        return <Shield className="h-5 w-5 text-orange-500" />
      case "medium":
        return <Bell className="h-5 w-5 text-yellow-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge variant="secondary">High</Badge>
      case "medium":
        return <Badge variant="outline">Medium</Badge>
      default:
        return <Badge variant="default">Info</Badge>
    }
  }

  const unreadCount = notificationList.filter((n) => !n.read).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-2">Real-time alerts and updates from users ({unreadCount} unread)</p>
          </div>
          <Button onClick={markAllAsRead} variant="outline">
            Mark All as Read
          </Button>
        </div>

        {/* Filter Tabs */}
        <Card className="cyber-border">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Notifications", count: notificationList.length },
                { key: "unread", label: "Unread", count: unreadCount },
                {
                  key: "critical",
                  label: "Critical",
                  count: notificationList.filter((n) => n.type === "critical").length,
                },
                {
                  key: "high",
                  label: "High Priority",
                  count: notificationList.filter((n) => n.type === "high").length,
                },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={filter === tab.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(tab.key)}
                  className="flex items-center space-x-2"
                >
                  <span>{tab.label}</span>
                  <Badge variant="secondary" className="ml-2">
                    {tab.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cyber-border transition-all hover:bg-muted/50 ${
                !notification.read ? "border-primary bg-primary/5" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground">{notification.title}</h3>
                        {getNotificationBadge(notification.type)}
                        {!notification.read && <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{notification.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-3">{notification.message}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{notification.user}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="h-4 w-4" />
                          <span>{notification.unit}</span>
                        </div>
                        {notification.incidentId && (
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{notification.incidentId}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {notification.incidentId && (
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Incident
                          </Button>
                        )}
                        {!notification.read && (
                          <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <Card className="cyber-border">
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No notifications found</h3>
              <p className="text-muted-foreground">
                {filter === "unread" ? "All notifications have been read" : "No notifications match the current filter"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
