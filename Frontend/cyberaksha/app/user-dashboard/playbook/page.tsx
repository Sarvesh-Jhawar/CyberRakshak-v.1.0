"use client"

import { useState } from "react"
import { UserLayout } from "@/components/dashboard/user-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  BookOpen,
  Search,
  AlertTriangle,
  Bug,
  CreditCard,
  Eye,
  Lock,
  CheckCircle,
  Clock,
  Phone,
  Mail,
} from "lucide-react"

export default function PlaybookPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const playbooks = [
    {
      id: "phishing",
      title: "Phishing Attack Response",
      category: "Phishing",
      icon: Mail,
      severity: "High",
      description: "Comprehensive guide for responding to phishing attacks and suspicious emails",
      estimatedTime: "15-30 minutes",
      steps: [
        {
          title: "Immediate Actions",
          priority: "Critical",
          actions: [
            "Do NOT click any links or download attachments from the suspicious email",
            "Do NOT enter credentials or personal information on any linked websites",
            "Take a screenshot of the suspicious email for evidence",
            "Forward the email to your IT security team immediately",
          ],
        },
        {
          title: "Secure Your Account",
          priority: "High",
          actions: [
            "Change your password immediately if you clicked any links",
            "Enable two-factor authentication (2FA) on all accounts",
            "Check recent login activity for unauthorized access",
            "Log out of all active sessions on compromised accounts",
          ],
        },
        {
          title: "Report and Document",
          priority: "Medium",
          actions: [
            "Report the incident through the Defence Cyber Portal",
            "Notify your immediate supervisor and IT department",
            "Document all actions taken and timeline of events",
            "Preserve all evidence including emails and screenshots",
          ],
        },
        {
          title: "Follow-up Actions",
          priority: "Low",
          actions: [
            "Monitor accounts for suspicious activity for 30 days",
            "Update security awareness training completion",
            "Review and update email filtering rules",
            "Share lessons learned with team members",
          ],
        },
      ],
      contacts: [
        { role: "IT Security Hotline", contact: "1-800-CYBER-SEC", type: "phone" },
        { role: "CERT-Army", contact: "cert@defence.mil", type: "email" },
      ],
    },
    {
      id: "malware",
      title: "Malware Detection & Removal",
      category: "Malware",
      icon: Bug,
      severity: "Critical",
      description: "Step-by-step guide for handling malware infections and system compromises",
      estimatedTime: "30-60 minutes",
      steps: [
        {
          title: "Immediate Isolation",
          priority: "Critical",
          actions: [
            "Disconnect the infected device from the network immediately",
            "Do NOT shut down the device - keep it running for analysis",
            "Isolate the device physically from other systems",
            "Take photos of any error messages or suspicious behavior",
          ],
        },
        {
          title: "System Assessment",
          priority: "High",
          actions: [
            "Run a full system scan with updated antivirus software",
            "Check running processes for suspicious activity",
            "Review recent file modifications and downloads",
            "Document all suspicious files and network connections",
          ],
        },
        {
          title: "Containment & Removal",
          priority: "High",
          actions: [
            "Boot from a clean antivirus rescue disk if available",
            "Remove identified malware using approved tools",
            "Clean temporary files and browser caches",
            "Update all software and security patches",
          ],
        },
        {
          title: "Recovery & Monitoring",
          priority: "Medium",
          actions: [
            "Restore clean backups if system is severely compromised",
            "Change all passwords after system is confirmed clean",
            "Monitor system behavior for 48-72 hours",
            "Update incident report with resolution details",
          ],
        },
      ],
      contacts: [
        { role: "Emergency IT Support", contact: "1-800-IT-HELP", type: "phone" },
        { role: "Malware Analysis Team", contact: "malware@defence.mil", type: "email" },
      ],
    },
    {
      id: "fraud",
      title: "Fraud Prevention & Response",
      category: "Fraud",
      icon: CreditCard,
      severity: "Medium",
      description: "Guidelines for preventing and responding to financial fraud attempts",
      estimatedTime: "20-45 minutes",
      steps: [
        {
          title: "Verify Legitimacy",
          priority: "Critical",
          actions: [
            "Never provide financial information over unsolicited calls/emails",
            "Verify the identity of requesters through official channels",
            "Check official websites directly, not through provided links",
            "Be suspicious of urgent requests for financial information",
          ],
        },
        {
          title: "Secure Financial Accounts",
          priority: "High",
          actions: [
            "Contact your bank immediately if you suspect fraud",
            "Monitor all financial accounts for unauthorized transactions",
            "Place fraud alerts on credit reports",
            "Change online banking passwords and PINs",
          ],
        },
        {
          title: "Document & Report",
          priority: "Medium",
          actions: [
            "Save all communications related to the fraud attempt",
            "File a report with local law enforcement if money was lost",
            "Report to the Federal Trade Commission (FTC)",
            "Notify your security officer and chain of command",
          ],
        },
        {
          title: "Prevention Measures",
          priority: "Low",
          actions: [
            "Set up account alerts for all financial transactions",
            "Use secure payment methods for online purchases",
            "Regularly review financial statements",
            "Educate family members about fraud prevention",
          ],
        },
      ],
      contacts: [
        { role: "Financial Crimes Unit", contact: "1-800-FRAUD-TIP", type: "phone" },
        { role: "Security Office", contact: "security@defence.mil", type: "email" },
      ],
    },
    {
      id: "espionage",
      title: "Espionage Threat Response",
      category: "Espionage",
      icon: Eye,
      severity: "Critical",
      description: "Protocol for handling suspected espionage activities and information security breaches",
      estimatedTime: "Immediate - Ongoing",
      steps: [
        {
          title: "Immediate Security Measures",
          priority: "Critical",
          actions: [
            "Do NOT confront suspected individuals directly",
            "Secure all classified materials immediately",
            "Document suspicious behavior without alerting suspects",
            "Contact security personnel through secure channels only",
          ],
        },
        {
          title: "Information Protection",
          priority: "Critical",
          actions: [
            "Change access codes and passwords for sensitive systems",
            "Review recent access logs for suspicious activity",
            "Limit access to need-to-know basis only",
            "Secure all physical documents and electronic files",
          ],
        },
        {
          title: "Investigation Support",
          priority: "High",
          actions: [
            "Cooperate fully with security investigations",
            "Provide detailed timeline of suspicious events",
            "Preserve all evidence without contamination",
            "Maintain operational security during investigation",
          ],
        },
        {
          title: "Ongoing Vigilance",
          priority: "Medium",
          actions: [
            "Increase security awareness and monitoring",
            "Report any additional suspicious activities",
            "Review and update security clearance requirements",
            "Conduct security briefings for affected personnel",
          ],
        },
      ],
      contacts: [
        { role: "Counter-Intelligence", contact: "1-800-CI-ALERT", type: "phone" },
        { role: "Security Investigations", contact: "investigations@defence.mil", type: "email" },
      ],
    },
    {
      id: "opsec",
      title: "OPSEC Risk Mitigation",
      category: "OPSEC",
      icon: Lock,
      severity: "High",
      description: "Operational Security guidelines to prevent information disclosure and maintain security",
      estimatedTime: "10-20 minutes",
      steps: [
        {
          title: "Assess Information Exposure",
          priority: "High",
          actions: [
            "Identify what sensitive information may have been disclosed",
            "Determine the scope and potential impact of the exposure",
            "Review social media posts and public communications",
            "Check for inadvertent disclosure in photos or documents",
          ],
        },
        {
          title: "Immediate Containment",
          priority: "High",
          actions: [
            "Remove or edit posts containing sensitive information",
            "Contact platforms to request content removal if necessary",
            "Notify affected personnel about potential exposure",
            "Implement additional security measures for exposed operations",
          ],
        },
        {
          title: "Damage Assessment",
          priority: "Medium",
          actions: [
            "Evaluate potential operational impact",
            "Identify personnel or operations at risk",
            "Review security protocols and procedures",
            "Document lessons learned for future prevention",
          ],
        },
        {
          title: "Prevention & Training",
          priority: "Low",
          actions: [
            "Conduct OPSEC refresher training for affected personnel",
            "Update social media and communication guidelines",
            "Implement regular OPSEC awareness campaigns",
            "Review and update information handling procedures",
          ],
        },
      ],
      contacts: [
        { role: "OPSEC Officer", contact: "1-800-OPSEC-HELP", type: "phone" },
        { role: "Information Security", contact: "infosec@defence.mil", type: "email" },
      ],
    },
  ]

  const filteredPlaybooks = playbooks.filter((playbook) => {
    const matchesSearch =
      playbook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playbook.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playbook.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || playbook.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "risk-critical"
      case "High":
        return "risk-high"
      case "Medium":
        return "risk-medium"
      case "Low":
        return "risk-low"
      default:
        return "risk-low"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "High":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Medium":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const categories = ["all", "Phishing", "Malware", "Fraud", "Espionage", "OPSEC"]

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security Playbooks</h1>
            <p className="text-muted-foreground">Step-by-step incident response and mitigation guides</p>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="cyber-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search playbooks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "cyber-glow" : ""}
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Playbooks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPlaybooks.map((playbook) => {
            const Icon = playbook.icon
            return (
              <Card key={playbook.id} className="cyber-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{playbook.title}</CardTitle>
                        <CardDescription className="mt-1">{playbook.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={getSeverityColor(playbook.severity)}>
                      {playbook.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{playbook.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>{playbook.steps.length} steps</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {playbook.steps.map((step, index) => (
                      <AccordionItem key={index} value={`step-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className={getPriorityColor(step.priority)} size="sm">
                              {step.priority}
                            </Badge>
                            <span>{step.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <ul className="space-y-2">
                              {step.actions.map((action, actionIndex) => (
                                <li key={actionIndex} className="flex items-start space-x-2">
                                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {/* Emergency Contacts */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-3">Emergency Contacts</h4>
                    <div className="space-y-2">
                      {playbook.contacts.map((contact, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{contact.role}</span>
                          <div className="flex items-center space-x-2">
                            {contact.type === "phone" ? (
                              <Phone className="h-4 w-4 text-primary" />
                            ) : (
                              <Mail className="h-4 w-4 text-primary" />
                            )}
                            <span className="font-mono text-foreground">{contact.contact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredPlaybooks.length === 0 && (
          <Card className="cyber-border">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No playbooks found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or category filter</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Reference */}
        <Card className="cyber-border border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <span>Quick Reference</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">Emergency Numbers</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Cyber Security Hotline: 1-800-CYBER-SEC</li>
                  <li>• IT Emergency Support: 1-800-IT-HELP</li>
                  <li>• Security Investigations: 1-800-SEC-ALERT</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Key Principles</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Act quickly but don't panic</li>
                  <li>• Document everything</li>
                  <li>• Follow chain of command</li>
                  <li>• Preserve evidence</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  )
}
