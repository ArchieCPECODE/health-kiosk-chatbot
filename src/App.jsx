import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Heart, 
  Scale, 
  Ruler, 
  Droplet, 
  Thermometer, 
  Printer, 
  Cpu, 
  MessageCircle, 
  X, 
  Send, 
  ShieldCheck,
  ChevronRight,
  Stethoscope,
  Bot
} from 'lucide-react';

// Custom lightweight line-by-line formatter for Markdown rendering inside chat bubbles
const MessageFormatter = ({ text, isBot }) => {
  if (!text) return null;
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1"></div>;

        // Detect list items (bullet points)
        const isList = /^[-*]\s/.test(line.trim());
        let content = isList ? line.trim().replace(/^[-*]\s/, '') : line;

        // Parse bold text snippets
        const parts = content.split(/(\*\*.*?\*\*)/g);
        const formattedParts = parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        if (isList) {
          return (
            <div key={i} className="flex gap-2 ml-1 mt-1">
              <span className={`${isBot ? 'text-blue-500' : 'text-blue-200'} font-bold`}>•</span>
              <span>{formattedParts}</span>
            </div>
          );
        }

        return <div key={i}>{formattedParts}</div>;
      })}
    </div>
  );
};

export default function HealthSystemApp() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const initialMessage = `Hello! I'm **HealthBot**, the assistant for the Health Monitoring System.

I can help you understand our capstone project, including:
* How we measure **Blood Pressure**, **Heart Rate**, and **BMI**.
* How the **instant printing** feature works.
* Details about our **hardware architecture**.

How can I assist you today?`;

  const [messages, setMessages] = useState([
    { id: 1, text: initialMessage, isBot: true }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      // Routes seamlessly to your internal secure serverless backend function
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });

      const result = await response.json();
      
      // Grabs the response message parsed from the backend core logic
      const botResponseText = result.reply || result.error || "System encountered an unhandled communication fault.";

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponseText, isBot: true }]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "System connection offline. Please verify Vercel serverless functions state.", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Heart className="w-8 h-8 text-rose-500" />, title: "Blood Pressure & Heart Rate", desc: "Clinical-grade cuffs and sensors for real-time cardiovascular monitoring." },
    { icon: <Scale className="w-8 h-8 text-blue-500" />, title: "BMI & Weight", desc: "Precision load cells paired with instant Body Mass Index calculations." },
    { icon: <Ruler className="w-8 h-8 text-teal-500" />, title: "Automated Height", desc: "Ultrasonic sensors for touchless, accurate height measurement." },
    { icon: <Activity className="w-8 h-8 text-indigo-500" />, title: "Oxygen Level (SpO2)", desc: "Optical sensors to instantly read blood oxygen saturation." },
    { icon: <Droplet className="w-8 h-8 text-red-500" />, title: "Blood Sugar Level", desc: "Integrated smart-reader for rapid, painless glucose monitoring." },
    { icon: <Printer className="w-8 h-8 text-slate-600" />, title: "Instant Printing", desc: "Physical receipts of all vitals printed instantly for the user's records." },
    { icon: <Cpu className="w-8 h-8 text-purple-500" />, title: "Hardware AI", desc: "On-board local AI that answers concerns verbally at the kiosk." },
    { icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />, title: "Data Privacy", desc: "All local processing ensures patient data remains private and secure." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-blue-900">VitalsKiosk<span className="text-blue-500">.AI</span></span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
              <a href="#features" className="hover:text-blue-600 transition-colors">System Features</a>
              <a href="#about" className="hover:text-blue-600 transition-colors">About Project</a>
            </div>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Ask AI
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-blue-50 rounded-l-full opacity-50 transform translate-x-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <div className="md:w-2/3">
            <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-6 uppercase">
              Capstone Project 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              The Future of <span className="text-blue-600">Automated</span> Health Monitoring.
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
              An all-in-one smart kiosk designed to deliver highly accurate vital signs, instant physical printouts, and AI-driven medical guidance—bridging the gap between technology and primary care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#features" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Explore Features <ChevronRight className="w-5 h-5" />
              </a>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-white text-blue-600 border-2 border-blue-100 px-8 py-4 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition-all">
                Talk to Support AI
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Grid Features Section */}
      <main id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Metric Tracking</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our hardware utilizes state-of-the-art sensors to provide 7 crucial health metrics in under 2 minutes, paired with immediate physical printouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all group">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer id="about" className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-xl tracking-tight text-white">VitalsKiosk.AI</span>
            </div>
            <p className="text-sm leading-relaxed">
              A healthcare capstone solution engineered to make basic clinical diagnostic metrics accessible, rapid, and intelligent for primary care support.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs">Clinical Framework Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Medical Metric Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Biomedical Sensor Architecture</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Vitals Data Exchange Specs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs">Patient Protocols</h4>
            <p className="text-sm mb-1.5"><span className="text-slate-200 font-medium">Measurement Window:</span> Rest 5 minutes prior to screening.</p>
            <p className="text-sm mb-1.5"><span className="text-slate-200 font-medium">Diagnostic Intent:</span> Preventative metrics & baseline check.</p>
            <p className="text-sm"><span className="text-slate-200 font-medium">Clinical Guideline:</span> Results are reference data, not a doctor diagnosis.</p>
          </div>
        </div>

        {/* System Creators Panel Subfooter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 VitalsKiosk.AI. All rights reserved. Medical Diagnostic Kiosk Interface.</p>
          <p className="bg-slate-800/50 border border-slate-700/50 text-slate-300 px-3 py-1.5 rounded-md text-center sm:text-left">
            System Engineers: <span className="text-blue-400 font-semibold">Archie Abona</span>, <span className="text-blue-400 font-semibold">Jarold Camino</span> & <span className="text-blue-400 font-semibold">Kiervy Lawas</span>
          </p>
        </div>
      </footer>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all z-50">
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chatbot Window Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] sm:w-[420px] h-[550px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 duration-300">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">HealthBot AI</h3>
                <p className="text-xs text-blue-100 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  System Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-5 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} items-end gap-2`}>
                
                {/* Bot Avatar */}
                {msg.isBot && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center border border-blue-200 mb-1 shadow-sm">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[78%] p-3.5 text-sm ${
                  msg.isBot 
                    ? 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm' 
                    : 'bg-blue-600 text-white rounded-2xl rounded-br-sm shadow-md'
                }`}>
                  <MessageFormatter text={msg.text} isBot={msg.isBot} />
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center border border-blue-200 mb-1 shadow-sm">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                <div className="bg-white text-slate-500 border border-slate-200 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 h-[42px]">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Chat Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about the project..."
              className="flex-1 bg-slate-100/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-full px-5 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-sm flex-shrink-0">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}