"use client"

import { useState } from "react"
import { UserLayout } from "@/components/dashboard/user-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Search, Filter, Eye, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"

export default function StatusPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")

  const complaints = [
    {
      id: "INC-001",
      category: "Phishing Attack",
      description: "Suspicious email received with malicious links",
      status: "Under Review",
      riskLevel: "Medium",
      dateSubmitted: "2024-01-15",
      lastUpdated: "2024-01-16",
      assignedTo: "CERT-Army Team Alpha",
    },
    {
      id: "INC-002",
      category: "Malware Detection",
      description: "Suspicious file detected on workstation",
      status: "Resolved",
      riskLevel: "High",
      dateSubmitted: "2024-01-14",
      lastUpdated: "2024-01-15",
      assignedTo: "CERT-Army Team Beta",
    },
    {
      id: "INC-003",
      category: "Fraud Attempt",
      description: "Attempted unauthorized access to secure systems",
      status: "Pending",
      riskLevel: "Low",
      dateSubmitted: "2024-01-13",
      lastUpdated: "2024-01-13",
      assignedTo: "Pending Assignment",
    },
    {
      id: "INC-004",
      category: "OPSEC Risk",
      description: "Potential information disclosure via social media",
      status: "Closed",
      riskLevel: "Critical",
      dateSubmitted: "2024-01-12",
      lastUpdated: "2024-01-14",
      assignedTo: "CERT-Army Team Gamma",
    },
    {
      id: "INC-005",
      category: "Espionage Threat",
      description: "Suspicious network activity detected",
      status: "Under Review",
      riskLevel: "High",
      dateSubmitted: "2024-01-11",
      lastUpdated: "2024-01-16",
      assignedTo: "CERT-Army Team Alpha",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Under Review":
        return <AlertTriangle className="h-4 w-4" />
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />
      case "Closed":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Under Review":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Closed":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "risk-low"
      case "Medium":
        return "risk-medium"
      case "High":
        return "risk-high"
      case "Critical":
        return "risk-critical"
      default:
        return "risk-low"
    }
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesRisk = riskFilter === "all" || complaint.riskLevel === riskFilter

    return matchesSearch && matchesStatus && matchesRisk
  })

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <History className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Complaint Status & History</h1>
            <p className="text-muted-foreground">Track your cybersecurity incident reports</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, category, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Level</label>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredComplaints.length} of {complaints.length} complaints
          </p>
        </div>

        {/* Complaints Table */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle>Incident Reports</CardTitle>
            <CardDescription>Your submitted cybersecurity incident reports and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm font-medium text-primary">{complaint.id}</span>
                        <Badge variant="outline" className={getStatusColor(complaint.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(complaint.status)}
                            <span>{complaint.status}</span>
                          </div>
                        </Badge>
                        <Badge variant="outline" className={getRiskColor(complaint.riskLevel)}>
                          {complaint.riskLevel}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="font-medium text-foreground">{complaint.category}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{complaint.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">Submitted:</span> {complaint.dateSubmitted}
                        </div>
                        <div>
                          <span className="font-medium">Last Updated:</span> {complaint.lastUpdated}
                        </div>
                        <div>
                          <span className="font-medium">Assigned To:</span> {complaint.assignedTo}
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}

              {filteredComplaints.length === 0 && (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No complaints found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all" || riskFilter !== "all"
                      ? "Try adjusting your search criteria"
                      : "You haven't submitted any incident reports yet"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  )
}
