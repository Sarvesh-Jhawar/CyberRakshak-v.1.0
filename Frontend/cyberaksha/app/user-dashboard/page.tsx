"use client"

import { useState } from "react"
import { UserLayout } from "@/components/dashboard/user-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  History,
  BookOpen,
  HelpCircle,
  Shield,
  AlertTriangle,
  Plus,
  Mic,
  Send,
  Paperclip,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function UserDashboard() {
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: number; type: "user" | "ai"; content: string; showComplaintOption?: boolean }>
  >([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = { id: Date.now(), type: "user" as const, content: message }
    setChatMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai" as const,
        content: getAIResponse(message),
        showComplaintOption: true,
      }
      setChatMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const getAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()
    if (lowerMessage.includes("phishing") || lowerMessage.includes("suspicious email")) {
      return "I understand you've received a suspicious email. This could be a phishing attempt. Here's what you should do immediately: 1) Don't click any links or download attachments, 2) Forward the email to your IT security team, 3) Delete the email from your inbox. Would you like me to help you file a formal complaint about this incident?"
    }
    if (lowerMessage.includes("malware") || lowerMessage.includes("virus")) {
      return "A potential malware infection is a serious security concern. Please: 1) Disconnect from the network immediately, 2) Run a full system scan, 3) Contact your IT support team. I can help you document this incident properly."
    }
    if (lowerMessage.includes("password") || lowerMessage.includes("account")) {
      return "Account security issues require immediate attention. Please: 1) Change your password immediately, 2) Enable two-factor authentication, 3) Check for unauthorized access. Let me help you file a security incident report."
    }
    return "I'm here to help with your cybersecurity concerns. Based on your description, I recommend documenting this incident for proper tracking and resolution. Would you like assistance filing a formal complaint?"
  }

  const handleFileComplaint = () => {
    // Simulate filing complaint
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "ai" as const,
        content:
          "✅ Your complaint has been successfully filed! Complaint ID: CYB-2024-" +
          Math.floor(Math.random() * 10000) +
          ". You can track its status in the Complaint Status section.",
      },
    ])
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome to Your Security Dashboard</h1>
            <p className="text-muted-foreground mt-2">Stay protected with real-time monitoring and instant support</p>
          </div>
        </div>

        {/* Sudarshan Chakra AI Assistant */}
        <Card className="cyber-border">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Image
                src="/model logo.png"
                alt="Model Logo"
                width={32}
                height={32}
              />
              <div>
                <CardTitle>Sudarshan Chakra AI Assistant</CardTitle>
                <CardDescription>Describe your cybersecurity concerns and get instant guidance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Chat Messages */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Image
                    src="/model logo.png"
                    alt="Model Logo"
                    width={48}
                    height={48}
                    className="mx-auto mb-4"
                  />
                  <p className="text-muted-foreground">What's your cybersecurity concern today?</p>
                </div>
              )}

              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    {msg.showComplaintOption && (
                      <Button size="sm" className="mt-2 cyber-glow" onClick={handleFileComplaint}>
                        File Complaint
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="text-sm">Analyzing your concern...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Describe your cybersecurity issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={handleSendMessage} disabled={!message.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest security interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phishing Email Report</p>
                    <p className="text-sm text-muted-foreground">Submitted 2 hours ago</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  In Progress
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Security Training Completed</p>
                    <p className="text-sm text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Completed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  )
}
