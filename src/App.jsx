import React, { useState, useEffect, useRef } from 'react';
import { Activity, Heart, Scale, Ruler, Droplet, Printer, Cpu, MessageCircle, X, Send, ShieldCheck, ChevronRight, Stethoscope, Bot, User, LayoutDashboard, LogOut } from 'lucide-react';

export default function HealthSystemApp() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'register', 'dashboard'
  
  // Authentication & Data State
  const [currentUser, setCurrentUser] = useState(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const initialMessage = `Hello! I'm **HealthBot**.
  
I can explain our System, or if you create an account, I can securely analyze your personal vitals!`;

  const [messages, setMessages] = useState([{ id: 1, text: initialMessage, isBot: true }]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isChatOpen]);

  // --- THE MAGIC FORMATTER: Turns AI [Text] into Navigation Links ---
  const MessageFormatter = ({ text, isBot }) => {
    if (!text) return null;
    const lines = text.split('\n');
    
    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, i) => {
          if (!line.trim()) return <div key={i} className="h-1"></div>;

          const isList = /^[-*]\s/.test(line.trim());
          let content = isList ? line.trim().replace(/^[-*]\s/, '') : line;

          // Split by bold OR bracketed links
          const parts = content.split(/(\*\*.*?\*\*|\[.*?\])/g);
          
          const formattedParts = parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
            }
            // AI Action Link detected!
            if (part.startsWith('[') && part.endsWith(']')) {
              const linkText = part.slice(1, -1);
              return (
                <button 
                  key={j}
                  onClick={() => {
                    if (currentUser) setCurrentPage('dashboard');
                    else setCurrentPage('register');
                  }}
                  className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 underline decoration-blue-300 underline-offset-2 transition-colors cursor-pointer bg-blue-50 px-1 rounded"
                >
                  {linkText} ↗
                </button>
              );
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

  const sendMessageToBot = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), text: textToSend, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Pass the user's data to the backend if logged in!
        body: JSON.stringify({ 
          message: textToSend,
          userData: currentUser 
        })
      });

      const result = await response.json();
      const botResponseText = result.reply || result.error || "System error.";

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponseText, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "System connection offline.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- VIEWS ---

  const renderRegister = () => (
    <div className="pt-24 pb-20 px-4 max-w-md mx-auto min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Create Patient Account</h2>
        <p className="text-center text-slate-500 text-sm mb-8">Register to instantly track your hardware vitals.</p>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const name = e.target.name.value;
          // Simulate fetching vitals from the hardware database upon registration
          setCurrentUser({
            name: name,
            vitals: { bp: '142/92', hr: 88, bmi: 26.5, spo2: 97, sugar: 105, height: '175cm', weight: '81kg' }
          });
          setCurrentPage('dashboard');
          setIsChatOpen(true);
          sendMessageToBot(`Hi, I just registered as ${name}. Give me a quick summary of my overall vitals and health.`);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input name="name" required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Juan Dela Cruz" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input required type="email" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="juan@example.com" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
            Register & Scan Vitals
          </button>
        </form>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Patient Dashboard</h2>
          <p className="text-slate-500">Welcome back, {currentUser?.name}. Here are your latest metrics.</p>
        </div>
        <button onClick={() => { setCurrentUser(null); setCurrentPage('home'); }} className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-lg font-medium transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Blood Pressure', val: currentUser?.vitals.bp, icon: <Heart className="w-5 h-5 text-rose-500" />, status: 'Elevated' },
          { label: 'Heart Rate', val: currentUser?.vitals.hr + ' bpm', icon: <Activity className="w-5 h-5 text-indigo-500" />, status: 'Normal' },
          { label: 'SpO2 Level', val: currentUser?.vitals.spo2 + '%', icon: <Droplet className="w-5 h-5 text-cyan-500" />, status: 'Normal' },
          { label: 'Blood Sugar', val: currentUser?.vitals.sugar, icon: <Activity className="w-5 h-5 text-amber-500" />, status: 'Normal' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3 font-medium">
              {stat.icon} {stat.label}
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{stat.val}</div>
            <div className={`text-xs font-semibold px-2 py-1 inline-block rounded-md w-max ${stat.status === 'Normal' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {stat.status}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4">
        <div className="bg-blue-600 text-white p-3 rounded-xl"><Bot className="w-6 h-6" /></div>
        <div>
          <h3 className="font-bold text-blue-900 mb-1">AI Health Analysis Available</h3>
          <p className="text-blue-800 text-sm mb-3">HealthBot has access to your latest scan. Open the chat module to ask specific questions about your readings.</p>
          <button onClick={() => setIsChatOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">
            Ask HealthBot Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Dynamic Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-blue-900">VitalsKiosk<span className="text-blue-500">.AI</span></span>
            </div>
            
            <div className="flex items-center gap-4">
              {!currentUser ? (
                <button onClick={() => setCurrentPage('register')} className="hidden sm:flex text-sm font-semibold text-slate-600 hover:text-blue-600">Register</button>
              ) : (
                <button onClick={() => setCurrentPage('dashboard')} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                  <LayoutDashboard className="w-4 h-4" /> My Data
                </button>
              )}
              <button onClick={() => setIsChatOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Ask AI
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Router */}
      {currentPage === 'home' && (
        <>
          <header className="relative overflow-hidden bg-white">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-blue-50 rounded-l-full opacity-50 transform translate-x-1/3"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
              <div className="md:w-2/3">
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-6 uppercase">Capstone Project 2026</div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                  The Future of <span className="text-blue-600">Automated</span> Health Monitoring.
                </h1>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
                  An all-in-one smart kiosk designed to deliver highly accurate vital signs, instant physical printouts, and personalized AI-driven medical guidance.
                </p>
                <button onClick={() => setCurrentPage('register')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  Create Patient Account <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>
          {/* Features Grid */}
          <main className="py-20 bg-slate-50 max-w-7xl mx-auto px-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { icon: <Heart className="text-rose-500 w-8 h-8"/>, title: "Blood Pressure" },
                 { icon: <Scale className="text-blue-500 w-8 h-8"/>, title: "BMI & Weight" },
                 { icon: <Droplet className="text-red-500 w-8 h-8"/>, title: "Blood Sugar" },
                 { icon: <Activity className="text-indigo-500 w-8 h-8"/>, title: "SpO2 Oxygen" }
               ].map((f, i) => (
                 <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-slate-50 rounded-xl flex justify-center items-center mb-4">{f.icon}</div>
                    <h3 className="font-bold text-slate-800">{f.title}</h3>
                 </div>
               ))}
             </div>
          </main>
        </>
      )}

      {currentPage === 'register' && renderRegister()}
      {currentPage === 'dashboard' && currentUser && renderDashboard()}

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all z-50">
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chatbot Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] sm:w-[420px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-50">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">HealthBot AI</h3>
                <p className="text-xs text-blue-100 font-medium">{currentUser ? `Analyzing: ${currentUser.name}` : 'System Online'}</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} items-end gap-2`}>
                {msg.isBot && <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm"><Bot className="w-4 h-4 text-blue-600" /></div>}
                <div className={`max-w-[78%] p-3.5 text-sm ${msg.isBot ? 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm' : 'bg-blue-600 text-white rounded-2xl rounded-br-sm shadow-md'}`}>
                  <MessageFormatter text={msg.text} isBot={msg.isBot} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm"><Bot className="w-4 h-4 text-blue-600" /></div>
                 <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-sm flex gap-1.5 h-[42px]"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300"></div></div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Contextual Chips */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-3 pb-2 flex flex-wrap gap-2 bg-white pt-2 border-t border-slate-100">
              {(currentUser ? ["What is my Blood Pressure?", "Is my BMI healthy?", "Review my vitals"] : ["How to register?", "Who are the engineers?"]).map((q, idx) => (
                <button key={idx} onClick={() => sendMessageToBot(q)} className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); sendMessageToBot(inputText); }} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ask about your health data..." className="flex-1 bg-slate-100/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-full px-5 py-2.5 text-sm outline-none transition-all" />
            <button type="submit" disabled={!inputText.trim() || isLoading} className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"><Send className="w-4 h-4 ml-0.5" /></button>
          </form>
        </div>
      )}
    </div>
  );
}