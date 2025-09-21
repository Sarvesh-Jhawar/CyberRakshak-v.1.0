"use client"

import { AdminLayout } from "@/components/dashboard/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Target, Activity } from "lucide-react"

const monthlyData = [
  { month: "Jan", incidents: 45, resolved: 42, critical: 8, high: 15, medium: 22 },
  { month: "Feb", incidents: 52, resolved: 48, critical: 12, high: 18, medium: 22 },
  { month: "Mar", incidents: 38, resolved: 35, critical: 6, high: 12, medium: 20 },
  { month: "Apr", incidents: 61, resolved: 58, critical: 15, high: 21, medium: 25 },
  { month: "May", incidents: 55, resolved: 52, critical: 11, high: 19, medium: 25 },
  { month: "Jun", incidents: 67, resolved: 63, critical: 18, high: 24, medium: 25 },
]

const threatTypes = [
  { name: "Malware", value: 35, color: "#ef4444" },
  { name: "Phishing", value: 28, color: "#f97316" },
  { name: "Data Breach", value: 18, color: "#eab308" },
  { name: "Network Attack", value: 12, color: "#22c55e" },
  { name: "Social Engineering", value: 7, color: "#3b82f6" },
]

const departmentRisk = [
  { department: "IT Division", risk: 85, incidents: 23, trend: "up" },
  { department: "Finance", risk: 72, incidents: 18, trend: "down" },
  { department: "HR", risk: 68, incidents: 15, trend: "up" },
  { department: "Operations", risk: 45, incidents: 12, trend: "stable" },
  { department: "R&D", risk: 38, incidents: 8, trend: "down" },
  { department: "Admin", risk: 25, incidents: 5, trend: "stable" },
]

const responseTimeData = [
  { week: "Week 1", avgTime: 3.2, target: 2.0 },
  { week: "Week 2", avgTime: 2.8, target: 2.0 },
  { week: "Week 3", avgTime: 2.4, target: 2.0 },
  { week: "Week 4", avgTime: 2.1, target: 2.0 },
]

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Risk Analytics</h1>
          <p className="text-muted-foreground mt-2">Comprehensive threat analysis and security metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Threat Level</p>
                  <p className="text-3xl font-bold text-red-500">High</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">+15% this week</span>
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                  <p className="text-3xl font-bold text-green-500">94.2%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+2.1% improvement</span>
                  </div>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <p className="text-3xl font-bold text-yellow-500">2.1h</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">-0.7h faster</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prevention Score</p>
                  <p className="text-3xl font-bold text-primary">87%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary">+5% this month</span>
                  </div>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incident Trends */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>Incident Trends</CardTitle>
              <CardDescription>Monthly incident reports and resolution patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="incidents"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stackId="2"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Threat Distribution */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>Threat Type Distribution</CardTitle>
              <CardDescription>Breakdown of incident types over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={threatTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {threatTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Severity Trends */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>Severity Trends</CardTitle>
              <CardDescription>Critical, high, and medium severity incidents over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Response Time Analysis */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>Response Time Performance</CardTitle>
              <CardDescription>Average response time vs target (2 hours)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgTime" fill="#3b82f6" name="Avg Response Time (hrs)" />
                  <Bar dataKey="target" fill="#22c55e" name="Target (hrs)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Risk Heatmap */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle>Department Risk Assessment</CardTitle>
            <CardDescription>Risk levels and incident counts across organizational units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentRisk.map((dept) => (
                <div
                  key={dept.department}
                  className={`p-4 rounded-lg border transition-all hover:scale-105 ${
                    dept.risk >= 70
                      ? "bg-red-500/20 border-red-500"
                      : dept.risk >= 50
                        ? "bg-orange-500/20 border-orange-500"
                        : dept.risk >= 30
                          ? "bg-yellow-500/20 border-yellow-500"
                          : "bg-green-500/20 border-green-500"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{dept.department}</h3>
                    <Badge variant={dept.risk >= 70 ? "destructive" : dept.risk >= 50 ? "secondary" : "outline"}>
                      {dept.risk}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{dept.incidents} incidents</span>
                    <div className="flex items-center space-x-1">
                      {dept.trend === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                      {dept.trend === "down" && <TrendingDown className="h-4 w-4 text-green-500" />}
                      {dept.trend === "stable" && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                      <span className="text-muted-foreground capitalize">{dept.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
