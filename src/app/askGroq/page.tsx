'use client';
import { useState, useRef, useEffect } from "react";
import { Mic, Send } from 'lucide-react';

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages([...messages, userMsg]);
    setLoading(true);
  
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });
  
      const data = await res.json();
  
      // Clean markdown formatting
      const cleanAnswer = data.answer
        .replace(/[*_`#>-]/g, '')
        .replace(/\n{2,}/g, '\n\n');
  
      const botMsg = { role: "bot", content: cleanAnswer };
      setMessages((prev) => [...prev, botMsg]);
      setInput("");
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMsg = { role: "bot", content: "Sorry, I couldn't process your request." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    // Check if the browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition");
      return;
    }
    
    // Use the standard SpeechRecognition interface if available, otherwise use webkitSpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    // Full-width and full-height background container with no padding/margin
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center overflow-auto">
      {/* Content container with fixed width */}
      <div className="w-full max-w-3xl p-6 relative">
        {/* Decorative elements */}
        <div className="absolute top-[-100px] right-[-50px] w-64 h-64 rounded-full bg-purple-500/20 blur-3xl z-0"></div>
        <div className="absolute bottom-[-100px] left-[-50px] w-80 h-80 rounded-full bg-teal-500/20 blur-3xl z-0"></div>
        
        {/* Header */}
        <div className="mb-8 text-center relative z-10 left-30">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
            Groq Career Chatbot
          </h1>
          
          <div className="h-1 w-24 bg-gradient-to-r from-teal-400 to-purple-500 mx-auto mt-2 rounded-full"></div>
          <p className="text-xl text-indigo-100 leading-relaxed mt-2">
                Get Instant Answers to all your Career Queries
              </p>
        </div>
        
        {/* Chat container */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl relative z-10 left-30">
          {/* Messages area */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-6 pr-2 custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p className="italic">Start a conversation...</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div 
                  className={`max-w-[80%] px-5 py-3 rounded-2xl ${
                    msg.role === "user" 
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white" 
                      : "bg-gradient-to-r from-teal-500 to-teal-400 text-white"
                  }`}
                >
                 <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="max-w-[80%] px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-400 text-white">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="flex items-center space-x-3 bg-gray-700/50 rounded-xl p-2 border border-gray-600/50">
            <input
              type="text"
              className="flex-grow p-3 bg-transparent outline-none placeholder-gray-400"
              placeholder="Type/Record your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            
            <button 
              onClick={startListening}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 text-white"
            >
              <Mic size={20} />
            </button>
            
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()} 
              className={`p-3 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 transition-all duration-300 text-white ${
                (loading || !input.trim()) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}