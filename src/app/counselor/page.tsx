"use client"

import type React from "react"

import { useState } from "react"
import {
  Send,
  Loader2,
  Briefcase,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Zap,
  BarChart,
  Compass,
  Menu,
  X,
  Plus,
  Archive,
  Star,
  Clock,
} from "lucide-react"

export default function CareerCounselor() {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([])
  const [archivedChats, setArchivedChats] = useState<
    { id: string; date: Date; preview: string; messages: { role: string; content: string }[] }[]
  >([])
  const [showArchive, setShowArchive] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) return

    setIsLoading(true)

    // Add user question to chat history
    const updatedHistory = [...chatHistory, { role: "user", content: question }]

    setChatHistory(updatedHistory)

    try {
      const result = await fetch("/api/career-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedHistory,
        }),
      })

      const data = await result.json()

      // Add AI response to chat history
      setChatHistory([...updatedHistory, { role: "assistant", content: data.response }])

      setQuestion("")
    } catch (error) {
      console.error("Error fetching career advice:", error)
      setChatHistory([
        ...updatedHistory,
        { role: "assistant", content: "Sorry, there was an error processing your request. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function archiveAndClearChat() {
    if (chatHistory.length > 0) {
      // Create a preview from the first user message or first few characters
      const userMessage = chatHistory.find((msg) => msg.role === "user")?.content || ""
      const preview = userMessage.length > 30 ? userMessage.substring(0, 30) + "..." : userMessage

      // Create a new archived chat
      const newArchivedChat = {
        id: Date.now().toString(),
        date: new Date(),
        preview: preview || "Conversation",
        messages: [...chatHistory],
      }

      // Add to archived chats
      setArchivedChats((prev) => [newArchivedChat, ...prev])
    }

    // Clear current chat
    setChatHistory([])
    setQuestion("")
  }

  function restoreChat(chatId: string) {
    // Find the chat to restore
    const chatToRestore = archivedChats.find((chat) => chat.id === chatId)

    if (chatToRestore) {
      // If there's a current conversation, archive it first
      if (chatHistory.length > 0) {
        archiveAndClearChat()
      }

      // Restore the selected chat
      setChatHistory(chatToRestore.messages)

      // Remove from archived chats
      setArchivedChats((prev) => prev.filter((chat) => chat.id !== chatId))
    }
  }

  // Simplified formatMessage function with clean formatting and only highlight headings
  const formatMessage = (content: string) => {
    let formattedContent = content

    // Format emphasis (colons) but with more subtle styling
    formattedContent = formattedContent.replace(/:([^:]+):/g, '<span class="font-medium text-purple-700">$1</span>')

    // Format special sections with simpler styling
    formattedContent = formattedContent
      .replace(
        /ACTION: (.*?)(?=\n|$)/g,
        '<div class="bg-purple-50/50 p-3 my-2 rounded-lg border-l-2 border-purple-400 backdrop-blur-sm shadow-sm"><span class="font-medium">Action:</span> $1</div>',
      )
      .replace(
        /TIP: (.*?)(?=\n|$)/g,
        '<div class="bg-teal-50/50 p-3 my-2 rounded-lg border-l-2 border-teal-400 backdrop-blur-sm shadow-sm"><span class="font-medium">Tip:</span> $1</div>',
      )
      .replace(
        /NOTE: (.*?)(?=\n|$)/g,
        '<div class="bg-blue-50/50 p-3 my-2 rounded-lg border-l-2 border-blue-400 backdrop-blur-sm shadow-sm"><span class="font-medium">Note:</span> $1</div>',
      )
      .replace(
        /EXAMPLE: (.*?)(?=\n|$)/g,
        '<div class="bg-amber-50/50 p-3 my-2 rounded-lg border-l-2 border-amber-400 backdrop-blur-sm shadow-sm"><span class="font-medium">Example:</span> $1</div>',
      )

    // Clean up formatting for lists
    const processList = (text: string) => {
      const lines = text.split("\n")

      for (let i = 0; i < lines.length; i++) {
        // Fix empty bullet points
        if (lines[i].match(/^-\s*$/)) {
          lines[i] = "- [This point needs attention]"
        }

        // Fix empty numbered list items
        const match = lines[i].match(/^(\d+)\.\s*$/)
        if (match) {
          lines[i] = `${match[1]}. [This point needs attention]`
        }
      }

      return lines.join("\n")
    }

    formattedContent = processList(formattedContent)

    // Format bullet lists with simpler styling
    formattedContent = formattedContent
      .replace(/^- (.*?)$/gm, "<li>$1</li>")
      .replace(/(<li>.*?<\/li>(?:\r?\n|)+)+/g, '<ul class="list-disc pl-5 my-2 space-y-1">$&</ul>')

    // Format numbered lists with simpler styling
    formattedContent = formattedContent
      .replace(/^\d+\. (.*?)$/gm, "<li>$1</li>")
      .replace(/(<li>.*?<\/li>(?:\r?\n|)+)+/g, (match) => {
        // Only convert to ordered list if it hasn't already been wrapped in a ul
        if (!match.includes('<ul class="list-disc')) {
          return '<ol class="list-decimal pl-5 my-2 space-y-1">' + match + "</ol>"
        }
        return match
      })

    // Highlight headings with a clean style
    formattedContent = formattedContent
      .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold mt-3 mb-2 text-purple-700">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2 text-purple-800">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-3 text-purple-900">$1</h1>')

    // Format paragraphs with reasonable spacing
    formattedContent = formattedContent.replace(
      /^(?!<[houil][l123]|<li|<div|<p|<h[123])(.+?)$/gm,
      '<p class="mb-2">$1</p>',
    )

    // Clean up any remaining newlines between HTML elements
    formattedContent = formattedContent.replace(/>\n+</g, "><")

    return formattedContent
  }

  // Add custom scrollbar styles
  const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c4b5fd;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a78bfa;
  }
  `

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <style jsx>{customScrollbarStyles}</style>
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 shadow-lg sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm mr-3">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">PathPILOT</h1>
              <div className="hidden md:flex items-center text-xs text-purple-100">
                <Sparkles className="h-3 w-3 mr-1" />
                <p>AI-powered career guidance</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={archiveAndClearChat}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all backdrop-blur-sm border border-white/10"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden bg-purple-500/20 p-2 rounded-lg" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-purple-700 shadow-lg p-4 z-20 flex flex-col space-y-3 border-t border-white/10">
            <button
              onClick={() => {
                archiveAndClearChat();
                setMobileMenuOpen(false);
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </button>
            <button
              onClick={() => {
                setShowArchive(!showArchive);
                setMobileMenuOpen(false);
              }}
              className="bg-purple-500/20 hover:bg-purple-600/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <Archive className="h-4 w-4" />
              <span>Archives</span>
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 container mx-auto p-4 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 relative">
          <div className="relative z-10">
            <div className="flex flex-col space-y-6 mb-6">
              {chatHistory.length === 0 && (
                <div className="text-center py-12 px-4">
                  <div className="inline-flex items-center justify-center p-4 bg-purple-50 rounded-full mb-4">
                    <Lightbulb className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Your Career Journey Starts Here</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Ask about career paths, skill development, interview preparation, or any professional guidance you need.
                  </p>
                </div>
              )}

              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`rounded-xl relative ${
                    message.role === "user" ? "ml-4 md:ml-12" : "mr-4 md:mr-12"
                  }`}
                >
                  <div
                    className={`p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-teal-50 to-teal-100/50 border border-teal-100"
                        : "bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-100"
                    } rounded-xl shadow-sm`}
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-teal-500 to-teal-600"
                            : "bg-gradient-to-br from-purple-500 to-purple-600"
                        } text-white font-medium mr-3`}
                      >
                        {message.role === "user" ? "U" : "AI"}
                      </div>
                      <p className="font-medium text-gray-800">
                        {message.role === "user" ? "You" : "Career Advisor"}
                      </p>
                      <div
                        className={`ml-auto text-xs px-2 py-1 rounded-md ${
                          message.role === "user" ? "bg-teal-100 text-teal-700" : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>

                    <div
                      className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about career paths, skills, interviews..."
                className="w-full p-4 pl-5 pr-16 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-70 flex items-center justify-center w-10 h-10"
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </form>
          </div>
        </div>

        {/* Previous Conversations Section */}
        {archivedChats.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="relative z-10">
              <button
                onClick={() => setShowArchive(!showArchive)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-teal-500 p-2 rounded-lg mr-4">
                    <Archive className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Previous Conversations</h2>
                    <p className="text-gray-500 text-sm">
                      {archivedChats.length} archived {archivedChats.length === 1 ? "conversation" : "conversations"}
                    </p>
                  </div>
                </div>
                <div className="bg-purple-100 rounded-lg p-1">
                  <ChevronRight
                    className={`h-5 w-5 text-purple-600 transition-transform duration-300 ${showArchive ? "rotate-90" : ""}`}
                  />
                </div>
              </button>

              {showArchive && (
                <div className="space-y-3 mt-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {archivedChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => restoreChat(chat.id)}
                      className="w-full p-4 rounded-lg transition-all bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 text-left flex items-center justify-between group"
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 mb-1 line-clamp-1">{chat.preview}</div>
                          <div className="text-xs text-gray-500">
                            {chat.date.toLocaleDateString()} at{" "}
                            {chat.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                      <div className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-teal-500 p-2 rounded-lg mr-4">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Trending Topics</h2>
                <p className="text-gray-500 text-sm">Explore popular career questions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Career transitions", icon: <Zap className="h-4 w-4" /> },
                { title: "Resume building", icon: <BarChart className="h-4 w-4" /> },
                { title: "Interview preparation", icon: <MessageSquare className="h-4 w-4" /> },
                { title: "Skill development", icon: <TrendingUp className="h-4 w-4" /> },
                { title: "Industry trends", icon: <BarChart className="h-4 w-4" /> },
                { title: "Salary negotiation", icon: <Zap className="h-4 w-4" /> },
                { title: "Work-life balance", icon: <Compass className="h-4 w-4" /> },
                { title: "Entrepreneurship", icon: <Lightbulb className="h-4 w-4" /> },
                { title: "Remote work", icon: <Briefcase className="h-4 w-4" /> },
              ].map((topic, index) => (
                <button
                  key={index}
                  className="group p-4 text-left rounded-lg transition-all bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 flex items-center justify-between"
                  onClick={() => setQuestion(`I need advice on ${topic.title.toLowerCase()}`)}
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-purple-500">{topic.icon}</div>
                    <span className="text-gray-800 font-medium">{topic.title}</span>
                  </div>
                  <div className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-6 px-6 mt-6">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center mb-3">
            <div className="bg-gradient-to-r from-purple-500 to-teal-500 p-2 rounded-lg">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <h3 className="ml-2 text-lg font-bold text-gray-800">PathPILOT</h3>
          </div>
          <p className="text-gray-500 mb-1">© {new Date().getFullYear()} PathPILOT | Personalized career guidance</p>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Powered by advanced AI technology to help you navigate your professional journey
          </p>
        </div>
      </footer>
    </div>
  )
}