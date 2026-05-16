import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { HeartPulse, Send, Bot, User, Activity } from 'lucide-react';

export default function HealthApp() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Welcome to the **Health Monitoring System**. I am **HealthBot**. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Note: This API endpoint will work once we deploy to Vercel and add the backend!
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "⚠️ Connection error. Please ensure the backend is connected." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Professional Header */}
      <header className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <HeartPulse className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">HealthMonitor <span className="text-blue-600">v1.0</span></h1>
        </div>
        <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
          <Activity size={16} className="animate-pulse" /> Kiosk Online
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                {msg.role === 'bot' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm leading-relaxed ${msg.role === 'bot' ? 'bg-white border border-slate-100 text-slate-800' : 'bg-blue-600 text-white'}`}>
                {/* FIX APPLIED HERE: Wrapped ReactMarkdown in a div */}
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="text-slate-400 text-sm italic ml-12">HealthBot is thinking...</div>}
        <div ref={scrollRef} />
      </main>

      {/* Modern Input */}
      <footer className="p-4 bg-white border-t">
        <div className="max-w-4xl mx-auto relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your BP, Sugar, or BMI..."
            className="w-full p-4 pr-16 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}