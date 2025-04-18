"use client";
import { useState } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

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
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Groq Career Chatbot</h1>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`${msg.role === "user" ? "text-right" : "text-left"}`}>
            <div className={`inline-block px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-blue-200" : "bg-gray-200"}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button 
          onClick={handleSend} 
          disabled={loading} 
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "..." : "Send"}
        </button>
        <button 
          onClick={startListening} 
          className="bg-green-500 text-white px-2 rounded hover:bg-green-600"
        >
          🎤
        </button>
      </div>
    </div>
  );
}