"use client"

import { AdminLayout } from "@/components/dashboard/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertTriangle, Users, TrendingUp, Clock } from "lucide-react"

const incidentData = [
  { month: "Jan", incidents: 45, resolved: 42 },
  { month: "Feb", incidents: 52, resolved: 48 },
  { month: "Mar", incidents: 38, resolved: 35 },
  { month: "Apr", incidents: 61, resolved: 58 },
  { month: "May", incidents: 55, resolved: 52 },
  { month: "Jun", incidents: 67, resolved: 63 },
]

const riskData = [
  { name: "Critical", value: 23, color: "#ef4444" },
  { name: "High", value: 45, color: "#f97316" },
  { name: "Medium", value: 78, color: "#eab308" },
  { name: "Low", value: 134, color: "#22c55e" },
]

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">CERT-Army Command Center</h1>
          <p className="text-muted-foreground mt-2">Real-time cybersecurity incident monitoring and response</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Incidents</p>
                  <p className="text-3xl font-bold text-red-500">23</p>
                  <p className="text-sm text-muted-foreground">+3 from yesterday</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold text-primary">1,247</p>
                  <p className="text-sm text-muted-foreground">+12% this month</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                  <p className="text-3xl font-bold text-green-500">94%</p>
                  <p className="text-sm text-muted-foreground">+2% improvement</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <p className="text-3xl font-bold text-yellow-500">2.4h</p>
                  <p className="text-sm text-muted-foreground">-0.3h from last week</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incident Trends */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>Incident Trends</CardTitle>
              <CardDescription>Monthly incident reports and resolution rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incidentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="incidents" fill="#ef4444" name="Incidents" />
                  <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>Current threat level breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Priority Incidents */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle>Priority Incidents</CardTitle>
            <CardDescription>High-priority incidents requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "INC-2024-001",
                  type: "Malware Detection",
                  unit: "IT Division",
                  severity: "Critical",
                  time: "2 min ago",
                },
                {
                  id: "INC-2024-002",
                  type: "Phishing Campaign",
                  unit: "HR Department",
                  severity: "High",
                  time: "15 min ago",
                },
                {
                  id: "INC-2024-003",
                  type: "Data Breach Attempt",
                  unit: "Finance",
                  severity: "Critical",
                  time: "1 hour ago",
                },
                {
                  id: "INC-2024-004",
                  type: "Suspicious Network Activity",
                  unit: "Operations",
                  severity: "High",
                  time: "2 hours ago",
                },
              ].map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <AlertTriangle
                      className={`h-5 w-5 ${incident.severity === "Critical" ? "text-red-500" : "text-orange-500"}`}
                    />
                    <div>
                      <p className="font-medium">{incident.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {incident.id} • {incident.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={incident.severity === "Critical" ? "destructive" : "secondary"}>
                      {incident.severity}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{incident.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Threat Heatmap */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle>Organizational Threat Heatmap</CardTitle>
            <CardDescription>Risk levels across different departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { unit: "IT Division", risk: "high", incidents: 12 },
                { unit: "HR Dept", risk: "medium", incidents: 8 },
                { unit: "Finance", risk: "critical", incidents: 15 },
                { unit: "Operations", risk: "low", incidents: 3 },
                { unit: "R&D", risk: "medium", incidents: 6 },
                { unit: "Admin", risk: "low", incidents: 2 },
              ].map((unit) => (
                <div
                  key={unit.unit}
                  className={`p-4 rounded-lg text-center transition-all hover:scale-105 ${
                    unit.risk === "critical"
                      ? "bg-red-500/20 border border-red-500"
                      : unit.risk === "high"
                        ? "bg-orange-500/20 border border-orange-500"
                        : unit.risk === "medium"
                          ? "bg-yellow-500/20 border border-yellow-500"
                          : "bg-green-500/20 border border-green-500"
                  }`}
                >
                  <p className="font-medium text-sm">{unit.unit}</p>
                  <p className="text-2xl font-bold mt-2">{unit.incidents}</p>
                  <p className="text-xs text-muted-foreground">incidents</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
