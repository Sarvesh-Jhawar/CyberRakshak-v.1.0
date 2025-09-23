"use client"

import { useState, useEffect, useRef } from "react"
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
  X,
} from "lucide-react"
import Link from "next/link"
import { api, getAuthHeaders } from "@/lib/api"
import { toast } from "sonner"
import Image from "next/image"

interface Incident {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
}

export default function UserDashboard() {
  const [message, setMessage] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const [chatMessages, setChatMessages] = useState<
    Array<{ id: number; type: "user" | "ai"; content: string | React.ReactNode; showComplaintOption?: boolean }>
  >([])
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAiTyping, setIsAiTyping] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved":
      case "closed":
        return "outline-green"
      case "pending":
      case "under review":
        return "outline-yellow"
      default:
        return "outline"
    }
  }

  useEffect(() => {
    // Scroll to the bottom of the chat container when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages, isAiTyping])

  const handleSendMessage = async () => {
    if (!message.trim() && !file) return

    let userMessageContent: React.ReactNode = message
    if (file) {
      userMessageContent = (
        <>
          {message}
          <div className="mt-2 text-xs flex items-center gap-2 p-2 bg-black/20 rounded-md">
            <Paperclip className="h-3 w-3" /> {file.name}
          </div>
        </>
      )
    }

    const userMessage = { id: Date.now(), type: "user" as const, content: userMessageContent }
    setChatMessages((prev) => [...prev, userMessage])
    setMessage("")
    setFile(null)
    setIsAiTyping(true)

    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
      
      const response = await fetch(api.chat.sudarshan, {
        method: "POST",
        headers,
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("AI assistant is not responding. Please try again later.");
      }

      const aiData = await response.json();
      
      // Display both response and recommendation if available
      const aiResponseContent = (
        <>
          <p>{aiData.response}</p>
          {aiData.recommendation && (
            <p className="mt-2 text-sm text-primary">
              Recommendation: {aiData.recommendation}
            </p>
          )}
        </>
      );

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai" as const,
        content: aiResponseContent,
        showComplaintOption: !!aiData.recommendation,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("[SUDARSHAN CHAKRA] Error:", error);
      toast.error("AI Assistant Error", { description: error.message });
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai" as const,
        content: "Sorry, I encountered an error and couldn't process your request. Please try again."
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false)
    }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      // Optionally, you can show a toast notification
      toast.info(`File "${e.target.files[0].name}" attached.`)
    }
  }

  const handleVoiceInput = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          const audioUrl = URL.createObjectURL(audioBlob)
          // For now, let's just log it. Later this can be sent to a speech-to-text API.
          console.log("Recorded audio:", audioUrl, audioBlob)
          toast.success("Voice input recorded. Processing is not yet implemented.")
          // Clean up stream tracks
          stream.getTracks().forEach((track) => track.stop())
        }

        mediaRecorder.start()
        setIsRecording(true)
        toast.info("Recording started... Click again to stop.")
      } catch (error) {
        console.error("Error accessing microphone:", error)
        toast.error("Could not access microphone.", {
          description: "Please ensure you have a microphone and have granted permission.",
        })
      }
    }
  }

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const headers = getAuthHeaders()
        const response = await fetch(api.incidents.list, { headers })
        if (!response.ok) {
          throw new Error("Failed to fetch recent activity.")
        }
        const data = await response.json()
        // Get the 2 most recent incidents
        setRecentIncidents(data.slice(0, 2))
      } catch (error: any) {
        toast.error("Could not load activity", { description: error.message })
      }
    }
    fetchRecentActivity()
  }, [])

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
            <div ref={chatContainerRef} className="space-y-4 mb-6 h-96 overflow-y-auto p-2">
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
                    <div className="text-sm">{msg.content}</div>
                    {msg.showComplaintOption && (
                      <Button size="sm" className="mt-2 cyber-glow" onClick={handleFileComplaint}>
                        File Complaint
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="text-sm">Generating response...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="relative">
              {file && (
                <div className="absolute bottom-full left-0 mb-2 w-full">
                  <div className="p-2 bg-muted rounded-md flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setFile(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Describe your cybersecurity issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="pr-10"
                />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <Button variant="outline" size="icon" onClick={triggerFileSelect}>
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleVoiceInput} className={isRecording ? "bg-red-500/20 text-red-500" : ""}>
                {isRecording ? (
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button onClick={handleSendMessage} disabled={(!message.trim() && !file) || isAiTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
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
              {recentIncidents.length > 0 ? (
                recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{incident.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted {new Date(incident.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(incident.status) as any}>
                      {incident.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  )
}
