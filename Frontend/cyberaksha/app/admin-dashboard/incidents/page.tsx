"use client"

import { AdminLayout } from "@/components/dashboard/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Search, Eye, MessageSquare, Clock, User } from "lucide-react"
import { useState } from "react"

const incidents = [
  {
    id: "INC-2024-001",
    title: "Malware Detection in IT Division",
    type: "Malware",
    severity: "Critical",
    status: "Active",
    reporter: "John Doe",
    unit: "IT Division",
    reportedAt: "2024-01-15 09:30",
    description: "Suspicious executable detected on multiple workstations",
    evidence: ["screenshot.png", "log_file.txt"],
  },
  {
    id: "INC-2024-002",
    title: "Phishing Email Campaign",
    type: "Phishing",
    severity: "High",
    status: "Under Investigation",
    reporter: "Sarah Smith",
    unit: "HR Department",
    reportedAt: "2024-01-15 08:15",
    description: "Multiple employees received suspicious emails requesting credentials",
    evidence: ["email_headers.txt"],
  },
  {
    id: "INC-2024-003",
    title: "Unauthorized Access Attempt",
    type: "Unauthorized Access",
    severity: "High",
    status: "Resolved",
    reporter: "Mike Johnson",
    unit: "Finance",
    reportedAt: "2024-01-14 16:45",
    description: "Failed login attempts detected from foreign IP addresses",
    evidence: ["access_logs.csv"],
  },
  {
    id: "INC-2024-004",
    title: "Data Exfiltration Attempt",
    type: "Data Breach",
    severity: "Critical",
    status: "Active",
    reporter: "Lisa Chen",
    unit: "R&D",
    reportedAt: "2024-01-14 14:20",
    description: "Large data transfer detected to external server",
    evidence: ["network_logs.txt", "file_list.csv"],
  },
  {
    id: "INC-2024-005",
    title: "Suspicious Network Activity",
    type: "Network Anomaly",
    severity: "Medium",
    status: "Under Investigation",
    reporter: "David Wilson",
    unit: "Operations",
    reportedAt: "2024-01-14 11:30",
    description: "Unusual traffic patterns detected on internal network",
    evidence: ["traffic_analysis.pdf"],
  },
]

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIncident, setSelectedIncident] = useState<any>(null)

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.reporter.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || incident.severity.toLowerCase() === severityFilter
    const matchesStatus = statusFilter === "all" || incident.status.toLowerCase().replace(" ", "-") === statusFilter

    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive"
      case "High":
        return "secondary"
      case "Medium":
        return "outline"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-red-500"
      case "Under Investigation":
        return "text-yellow-500"
      case "Resolved":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incident Management</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage all cybersecurity incidents</p>
        </div>

        {/* Filters */}
        <Card className="cyber-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search incidents, IDs, or reporters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under-investigation">Under Investigation</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Incidents List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incidents Table */}
          <div className="lg:col-span-1">
            <Card className="cyber-border">
              <CardHeader>
                <CardTitle>Incidents ({filteredIncidents.length})</CardTitle>
                <CardDescription>Click on an incident to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                        selectedIncident?.id === incident.id ? "bg-muted border-primary" : "bg-card"
                      }`}
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle
                              className={`h-4 w-4 ${
                                incident.severity === "Critical"
                                  ? "text-red-500"
                                  : incident.severity === "High"
                                    ? "text-orange-500"
                                    : "text-yellow-500"
                              }`}
                            />
                            <span className="font-medium text-sm">{incident.id}</span>
                            <Badge variant={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                          </div>
                          <h3 className="font-medium text-sm mb-1">{incident.title}</h3>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{incident.reporter}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{incident.reportedAt}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-medium ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{incident.unit}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incident Details */}
          <div className="lg:col-span-1">
            <Card className="cyber-border">
              <CardHeader>
                <CardTitle>Incident Details</CardTitle>
                <CardDescription>
                  {selectedIncident
                    ? "Detailed information about the selected incident"
                    : "Select an incident to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedIncident ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedIncident.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedIncident.id}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Severity</p>
                        <Badge variant={getSeverityColor(selectedIncident.severity)}>{selectedIncident.severity}</Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className={`text-sm ${getStatusColor(selectedIncident.status)}`}>
                          {selectedIncident.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Reporter</p>
                        <p className="text-sm">{selectedIncident.reporter}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Unit</p>
                        <p className="text-sm">{selectedIncident.unit}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Description</p>
                      <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Evidence Files</p>
                      <div className="space-y-2">
                        {selectedIncident.evidence.map((file: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Comment
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Update Status
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select an incident from the list to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
