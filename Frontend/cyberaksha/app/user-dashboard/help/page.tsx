"use client"

import { UserLayout } from "@/components/dashboard/user-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Phone, Mail, MessageSquare, ExternalLink, Shield, Clock } from "lucide-react"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I report a cybersecurity incident?",
      answer:
        "Navigate to the 'File a Complaint' section from the sidebar menu. Fill out the incident report form with detailed information about the threat, including category, description, and any evidence. Submit the form and you'll receive a confirmation with your incident ID.",
    },
    {
      question: "What should I do if I clicked on a suspicious link?",
      answer:
        "Immediately disconnect from the network, change your passwords, and report the incident through the portal. Do not enter any personal information on suspicious websites. Follow the Phishing Attack Response playbook for detailed steps.",
    },
    {
      question: "How can I check the status of my reported incident?",
      answer:
        "Go to 'Complaint Status / History' in the sidebar menu. You can search for your incident by ID, view current status, and see updates from the CERT-Army team. You'll also receive email notifications for status changes.",
    },
    {
      question: "Who has access to the CERT-Army Dashboard?",
      answer:
        "The CERT-Army Dashboard is restricted to authorized cybersecurity personnel and administrators. Access is granted based on security clearance and role requirements. Contact your security officer for access requests.",
    },
    {
      question: "What information should I include in an incident report?",
      answer:
        "Include as much detail as possible: incident type, date/time, description of what happened, any suspicious emails or files, screenshots, and immediate actions taken. The more information provided, the better we can respond to the threat.",
    },
    {
      question: "How long does it take to resolve cybersecurity incidents?",
      answer:
        "Response times vary by severity: Critical incidents receive immediate attention (within 1 hour), High priority within 4 hours, Medium within 24 hours, and Low priority within 72 hours. Complex investigations may take longer.",
    },
    {
      question: "Can family members use this portal?",
      answer:
        "Yes, family members of defence personnel can register and use the portal to report cybersecurity incidents that may affect defence operations or personnel. They should select 'Family' during registration.",
    },
    {
      question: "What should I do if I suspect espionage or insider threats?",
      answer:
        "Do not confront suspected individuals. Immediately contact the Counter-Intelligence hotline at 1-800-CI-ALERT or report through the portal using the Espionage category. Follow the Espionage Threat Response playbook.",
    },
  ]

  const contacts = [
    {
      title: "24/7 Cyber Security Hotline",
      description: "Immediate assistance for critical cybersecurity incidents",
      contact: "1-800-CYBER-SEC",
      type: "phone",
      availability: "24/7",
    },
    {
      title: "CERT-Army Operations Center",
      description: "Computer Emergency Response Team for defence networks",
      contact: "cert@defence.mil",
      type: "email",
      availability: "24/7",
    },
    {
      title: "IT Support Desk",
      description: "General IT support and technical assistance",
      contact: "1-800-IT-HELP",
      type: "phone",
      availability: "Mon-Fri 0800-1700",
    },
    {
      title: "Security Investigations",
      description: "Report security violations and suspicious activities",
      contact: "investigations@defence.mil",
      type: "email",
      availability: "24/7",
    },
    {
      title: "Counter-Intelligence",
      description: "Report espionage threats and insider risks",
      contact: "1-800-CI-ALERT",
      type: "phone",
      availability: "24/7",
    },
    {
      title: "Information Security Office",
      description: "OPSEC guidance and information protection",
      contact: "infosec@defence.mil",
      type: "email",
      availability: "Mon-Fri 0800-1700",
    },
  ]

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <HelpCircle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
            <p className="text-muted-foreground">Get assistance with cybersecurity incidents and portal usage</p>
          </div>
        </div>

        {/* Emergency Banner */}
        <Card className="cyber-border border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-destructive" />
              <div>
                <h3 className="font-bold text-destructive">Emergency Cybersecurity Incident?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  For immediate assistance with critical threats, call the 24/7 Cyber Security Hotline:{" "}
                  <span className="font-mono font-bold text-destructive">1-800-CYBER-SEC</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Frequently Asked Questions</span>
            </CardTitle>
            <CardDescription>Common questions about cybersecurity incidents and portal usage</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-primary" />
              <span>Contact Information</span>
            </CardTitle>
            <CardDescription>Direct contact details for cybersecurity support and assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contacts.map((contact, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {contact.type === "phone" ? (
                        <Phone className="h-4 w-4 text-primary" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary" />
                      )}
                      <h3 className="font-medium text-foreground">{contact.title}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{contact.availability}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{contact.description}</p>
                  <div className="font-mono text-sm text-primary bg-primary/10 px-3 py-2 rounded border border-primary/20">
                    {contact.contact}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              <span>Additional Resources</span>
            </CardTitle>
            <CardDescription>External resources and documentation for cybersecurity awareness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                <div className="text-left">
                  <div className="font-medium">Defence Cybersecurity Guidelines</div>
                  <div className="text-sm text-muted-foreground">Official cybersecurity policies and procedures</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                <div className="text-left">
                  <div className="font-medium">Security Awareness Training</div>
                  <div className="text-sm text-muted-foreground">Online training modules and certifications</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                <div className="text-left">
                  <div className="font-medium">Threat Intelligence Reports</div>
                  <div className="text-sm text-muted-foreground">Latest threat assessments and advisories</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                <div className="text-left">
                  <div className="font-medium">Incident Response Procedures</div>
                  <div className="text-sm text-muted-foreground">Detailed response protocols and checklists</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  )
}
