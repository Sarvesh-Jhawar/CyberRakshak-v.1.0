'use client'

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
} from "lucide-react"
import Link from "next/link"
import { api, getAuthHeaders, analyzeWithLlm } from "@/lib/api"
import { toast } from "sonner"
import Image from "next/image"
import { AIResponse } from "@/components/dashboard/AIResponse"
import ReactMarkdown from "react-markdown"
import { useRouter } from "next/navigation"

interface Incident {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  analysis?: any;
  intent?: 'analyze_threat' | 'general_question' | 'request_information' | 'complaint_ready';
  summary?: any;
  question?: string;
  attachment?: string;
}

// Add this interface to handle the SpeechRecognition API
interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

export default function UserDashboard() {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([])
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [isFilingComplaint, setIsFilingComplaint] = useState(false);
  const [complaintData, setComplaintData] = useState(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);


  const chatContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter();


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

  // Load chat history from localStorage on initial render
  useEffect(() => {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      setChatMessages(JSON.parse(savedChat));
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  useEffect(() => {
    // Scroll to the bottom of the chat container when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages, isAiTyping])

  useEffect(() => {
    if (attachment) {
      handleSendMessage("", attachment);
    }
  }, [attachment]);

  const handleSendMessage = async (messageContent?: string, attachment?: File) => {
    const textToSend = messageContent || message;
    if (!textToSend.trim() && !attachment) return;

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: textToSend,
      attachment: attachment ? URL.createObjectURL(attachment) : undefined,
    };
    const updatedChatMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedChatMessages);

    setMessage("");
    setAttachment(null);
    setIsAiTyping(true);

    try {
      const history: { role: 'user' | 'assistant'; content: string }[] = updatedChatMessages.slice(0, -1).map(msg => {
        if (msg.role === 'assistant') {
          const assistantResponse = {
            intent: msg.intent,
            analysis: msg.analysis,
            answer: msg.content,
            summary: msg.summary,
            question: msg.question,
          };
          return { role: 'assistant', content: JSON.stringify(assistantResponse) };
        }
        return { role: 'user', content: msg.content };
      });

      const result = await analyzeWithLlm(textToSend, history, attachment || undefined);

      const newAiMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.answer || result.response || result.question || result.message || '',
        analysis: result.intent === 'complaint_ready' || result.intent === 'analyze_threat' ? {
          detection_summary: result.detection_summary,
          user_alert: result.user_alert,
          playbook: result.playbook,
          evidence_to_collect: result.evidence_to_collect,
          severity: result.severity,
          cert_alert: result.cert_alert,
          technical_details: result.technical_details,
          ui_labels: result.ui_labels,
        } : result.analysis,
        intent: result.intent,
        summary: result.summary,
        question: result.question,
      };

      if (result.intent === 'complaint_ready') {
        setComplaintData(result.summary);
        setIsFilingComplaint(false);
      }

      setChatMessages((prev) => [...prev, newAiMessage]);
    } catch (error: any) {
      console.error("[Analyze] Error:", error);
      toast.error("Analysis Error", { description: error.message });
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sorry, I encountered an error and couldn't process your request. Please try again.",
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const startComplaintProcess = () => {
    setIsFilingComplaint(true);
    handleSendMessage("ACTION:START_COMPLAINT");
  }

  const handleProceedToComplaint = () => {
    if (!complaintData) return;

    const queryParams = new URLSearchParams(complaintData);
    router.push(`/user-dashboard/complaint?${queryParams.toString()}`);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleNewChat = () => {
    setChatMessages([]);
    localStorage.removeItem('chatHistory');
    toast.success("New chat started!");
  };

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
            <div className="flex items-center justify-between w-full">
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
              <Button variant="outline" size="sm" onClick={handleNewChat}>
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
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
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="text-sm prose dark:prose-invert">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                      {msg.attachment && (
                        <Image
                          src={msg.attachment}
                          alt="Attachment"
                          width={200}
                          height={200}
                          className="mt-2 rounded-lg"
                        />
                      )}
                    </div>
                    {msg.role === 'assistant' && msg.intent === 'analyze_threat' && (
                      <Button size="sm" className="mt-2 cyber-glow" onClick={startComplaintProcess}>
                        File Complaint
                      </Button>
                    )}
                    {msg.role === 'assistant' && msg.intent === 'complaint_ready' && (
                      <div className="mt-4 space-y-2">
                        {msg.analysis && (
                          <div>
                            <h4 className="font-bold text-lg mb-2">Threat Analysis Report</h4>
                            <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                              <div><strong>Severity:</strong> <Badge variant={msg.analysis.severity?.toLowerCase() === 'high' ? 'destructive' : 'default'}>{msg.analysis.severity}</Badge></div>
                              <p><strong>Category:</strong> {msg.analysis.ui_labels?.category}</p>
                              <p><strong>Summary:</strong> {msg.analysis.detection_summary}</p>
                              <p className="text-amber-400"><strong>Action:</strong> {msg.analysis.user_alert}</p>
                            </div>
                          </div>
                        )}
                        <Button size="sm" className="mt-2 cyber-glow" onClick={handleProceedToComplaint}>
                          Review and Submit Complaint
                        </Button>
                      </div>
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
              <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Describe your cybersecurity issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(message, attachment)}
                  className="pr-10"
                />
                 <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleAttachmentChange}
                    accept="image/*"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="icon" asChild>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </label>
                </div>
              </div>
              <Button onClick={() => handleSendMessage(message, attachment)} disabled={!message.trim() && !attachment || isAiTyping}>
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