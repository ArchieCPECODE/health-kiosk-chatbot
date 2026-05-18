import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Heart, Scale, Ruler, Droplet, Printer, Cpu, 
  MessageCircle, X, Send, ShieldCheck, ChevronRight, Stethoscope, Bot, User, LayoutDashboard, LogOut, Lock, AlertTriangle, Info, MapPin, Phone 
} from 'lucide-react';

const RegisterForm = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleStep1 = (e) => {
    e.preventDefault();
    setFormData({
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value
    });
    setStep(2); 
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    onComplete(formData.name); 
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-md mx-auto min-h-[70vh]">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${step === 1 ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
          {step === 1 ? <User className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
          {step === 1 ? 'Patient Registration' : 'Security Verification'}
        </h2>
        <p className="text-center text-slate-500 text-sm mb-8">
          {step === 1 ? 'Create a secure account to track your hardware vitals.' : `Enter the 6-digit OTP sent to ${formData.email}`}
        </p>
        
        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input name="name" required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Juan Dela Cruz" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input name="email" required type="email" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="juan@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input name="password" required type="password" className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md mt-2">
              Continue securely
            </button>
          </form>
        ) : (
          <form onSubmit={handleStep2} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-center">One-Time Password (OTP)</label>
              <input name="otp" required type="text" maxLength="6" className="w-full px-4 py-3 text-center tracking-widest text-2xl font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="123456" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-md mt-2">
              Verify & Scan Vitals
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 text-sm hover:text-slate-700 mt-2 font-medium">
              Go Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default function HealthSystemApp() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: `Hello! I'm **HealthBot**, the assistant for the Health Monitoring System.\n\nI can help you understand our System, including:\n* How we measure **Blood Pressure**, **Heart Rate**, and **BMI**.\n* How the **instant printing** feature works.\n* Details about our **hardware architecture**.\n\nIf you register an account, I can also analyze your personal vitals!\n\nHow can I assist you today?`, 
      isBot: true 
    }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isChatOpen]);

  const MessageFormatter = ({ text, isBot }) => {
    if (!text) return null;
    const lines = text.split('\n');
    
    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, i) => {
          if (!line.trim()) return <div key={i} className="h-1"></div>;
          const isList = /^[-*]\s/.test(line.trim());
          let content = isList ? line.trim().replace(/^[-*]\s/, '') : line;
          
          const parts = content.split(/(\*\*.*?\*\*|\[.*?\])/g);
          const formattedParts = parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
            if (part.startsWith('[') && part.endsWith(']')) {
              const linkText = part.slice(1, -1);
              const isAlert = linkText.toLowerCase() === 'health alert';
              return (
                <button 
                  key={j}
                  onClick={() => {
                    if (linkText.toLowerCase() === 'register') {
                      setCurrentPage('register');
                    } else if (currentUser) {
                      setCurrentPage('dashboard');
                    } else {
                      setCurrentPage('register');
                    }
                  }}
                  className={`inline-flex items-center font-bold underline underline-offset-2 transition-colors cursor-pointer px-1 rounded mx-0.5 ${isAlert ? 'text-rose-600 hover:text-rose-800 decoration-rose-300 bg-rose-50' : 'text-blue-600 hover:text-blue-800 decoration-blue-300 bg-blue-50'}`}
                >
                  {isAlert && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {linkText} ↗
                </button>
              );
            }
            return part;
          });

          if (isList) return <div key={i} className="flex gap-2 ml-1 mt-1"><span className={`${isBot ? 'text-blue-500' : 'text-blue-200'} font-bold`}>•</span><span>{formattedParts}</span></div>;
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
        body: JSON.stringify({ message: textToSend, userData: currentUser })
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessageToBot(inputText);
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

  const suggestedQuestions = currentUser 
    ? ["Review my vitals", "What is my Blood Pressure?", "Is my BMI healthy?"] 
    : ["How to register?", "Where are you located?", "Who are the engineers?"];

  const handleRegistrationComplete = (userName) => {
    setCurrentUser({
      name: userName,
      vitals: { bp: '142/92', hr: 88, bmi: 26.5, spo2: 97, sugar: 105, height: '175cm', weight: '81kg' },
      conditions: [
        { title: "Stage 2 Hypertension", type: "warning", desc: "Your blood pressure is highly elevated (142/92). Please consult a healthcare professional immediately.", advice: "Avoid high-sodium foods and rest." },
        { title: "Overweight", type: "info", desc: "Your BMI is 26.5. Maintaining a healthy weight reduces cardiovascular risks.", advice: "Consider a balanced diet and 30 mins of daily exercise." }
      ]
    });
    setCurrentPage('dashboard');
    setIsChatOpen(true);
    sendMessageToBot(`Hi, I just securely registered and verified my OTP as ${userName}. Please evaluate my vitals, issue a [Health Alert] if there are any issues, and give me advice.`);
  };

  const renderDashboard = () => (
    <div className="pt-16 pb-20 px-4 max-w-5xl mx-auto min-h-[70vh]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Patient Dashboard</h2>
          <p className="text-slate-500">Welcome back, {currentUser?.name}. Here are your latest metrics.</p>
        </div>
        <button onClick={() => { setCurrentUser(null); setCurrentPage('home'); }} className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-lg font-medium transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {currentUser?.conditions && currentUser.conditions.length > 0 && (
        <div className="mb-8 animate-in slide-in-from-bottom-2">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> Detected Health Conditions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser.conditions.map((cond, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border flex gap-4 items-start ${cond.type === 'warning' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
                <div className={`p-2 rounded-full mt-0.5 ${cond.type === 'warning' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                  {cond.type === 'warning' ? <Activity className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className={`font-bold mb-1 ${cond.type === 'warning' ? 'text-rose-900' : 'text-amber-900'}`}>{cond.title}</h4>
                  <p className={`text-sm mb-2 ${cond.type === 'warning' ? 'text-rose-800' : 'text-amber-800'}`}>{cond.desc}</p>
                  <p className={`text-xs font-semibold px-2 py-1 rounded-md inline-block ${cond.type === 'warning' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>Advice: {cond.advice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold text-slate-900 mb-4">Raw Vital Signs</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Blood Pressure', val: currentUser?.vitals.bp, icon: <Heart className="w-5 h-5 text-rose-500" />, status: 'Elevated' },
          { label: 'Heart Rate', val: currentUser?.vitals.hr + ' bpm', icon: <Activity className="w-5 h-5 text-indigo-500" />, status: 'Normal' },
          { label: 'SpO2 Level', val: currentUser?.vitals.spo2 + '%', icon: <Droplet className="w-5 h-5 text-cyan-500" />, status: 'Normal' },
          { label: 'Blood Sugar', val: currentUser?.vitals.sugar, icon: <Activity className="w-5 h-5 text-amber-500" />, status: 'Normal' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3 font-medium">{stat.icon} {stat.label}</div>
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
          <button onClick={() => setIsChatOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">Ask HealthBot Now</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-blue-900">VitalsKiosk<span className="text-blue-500">.AI</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
              <button onClick={() => setCurrentPage('home')} className="hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="hover:text-blue-600 transition-colors">System Features</button>
              <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="hover:text-blue-600 transition-colors">About Project</button>
              
              {!currentUser ? (
                <button onClick={() => setCurrentPage('register')} className="hover:text-blue-600 text-blue-600 font-bold transition-colors">Register Patient</button>
              ) : (
                <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  <LayoutDashboard className="w-4 h-4"/> My Data
                </button>
              )}
            </div>

            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Ask AI
            </button>
          </div>
        </div>
      </nav>

      {/* CONDITIONAL ROUTING */}
      {currentPage === 'home' && (
        <>
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
                  <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                    Explore Features <ChevronRight className="w-5 h-5" />
                  </button>
                  <button onClick={() => setIsChatOpen(true)} className="bg-white text-blue-600 border-2 border-blue-100 px-8 py-4 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition-all">
                    Talk to Support AI
                  </button>
                </div>
              </div>
            </div>
          </header>

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

          {/* NEW MAP & LOCATION SECTION - STACKED LAYOUT */}
          <section id="location" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Visit Our Kiosk</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Experience the VitalsKiosk.AI hardware prototype in person at our campus.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
                {/* Google Map Embed - Full Width Top */}
                <div className="w-full h-80 md:h-[450px]">
                  <iframe 
                    src="https://maps.google.com/maps?q=St.%20John%20Paul%20II%20College%20of%20Davao&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="St. John Paul II College of Davao Location"
                  ></iframe>
                </div>

                {/* Text Details - Full Width Bottom */}
                <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white">
                  
                  {/* Location Column */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900">Location</h3>
                    </div>
                    <div className="pl-13 md:pl-14">
                      <p className="text-slate-800 font-bold mb-1">St. John Paul II College of Davao</p>
                      <p className="text-slate-600 leading-relaxed">Ecoland Dr, Matina, Davao City,<br/>8000 Davao del Sur</p>
                    </div>
                  </div>
                  
                  {/* Divider (Desktop Only) */}
                  <div className="hidden md:block w-px h-24 bg-slate-200"></div>
                  
                  {/* Phone Column */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900">Contact</h3>
                    </div>
                    <div className="pl-13 md:pl-14">
                      <p className="text-slate-600 font-medium text-lg">(082) 297 8755</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <footer id="about" className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="w-6 h-6 text-blue-400" />
                  <span className="font-bold text-xl tracking-tight text-white">VitalsKiosk.AI</span>
                </div>
                <p className="text-sm leading-relaxed">A healthcare capstone solution engineered to make basic clinical diagnostic metrics accessible, rapid, and intelligent for primary care support.</p>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <p>© 2026 VitalsKiosk.AI. All rights reserved. Medical Diagnostic Kiosk Interface.</p>
              <p className="bg-slate-800/50 border border-slate-700/50 text-slate-300 px-3 py-1.5 rounded-md text-center sm:text-left">
                System Engineers: <span className="text-blue-400 font-semibold">Archie Abona</span>, <span className="text-blue-400 font-semibold">Jarold Camino</span> & <span className="text-blue-400 font-semibold">Kiervy Lawas</span>
              </p>
            </div>
          </footer>
        </>
      )}

      {currentPage === 'register' && <RegisterForm onComplete={handleRegistrationComplete} />}
      {currentPage === 'dashboard' && currentUser && renderDashboard()}

      {/* FLOATING CHAT BUTTON */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all z-50">
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* CHAT WINDOW */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] sm:w-[420px] h-[550px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"><Bot className="w-6 h-6 text-white" /></div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">HealthBot AI</h3>
                <p className="text-xs text-blue-100 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  {currentUser ? `Analyzing: ${currentUser.name}` : 'System Online'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-5 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} items-end gap-2`}>
                {msg.isBot && <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center border border-blue-200 shadow-sm"><Bot className="w-4 h-4 text-blue-600" /></div>}
                <div className={`max-w-[78%] p-3.5 text-sm ${msg.isBot ? 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm' : 'bg-blue-600 text-white rounded-2xl rounded-br-sm shadow-md'}`}>
                  <MessageFormatter text={msg.text} isBot={msg.isBot} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center border border-blue-200 shadow-sm"><Bot className="w-4 h-4 text-blue-600" /></div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 h-[42px]"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300"></div></div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {messages.length <= 2 && !isLoading && (
            <div className="px-3 pb-2 flex flex-wrap gap-2 bg-white pt-2 border-t border-slate-100">
              {suggestedQuestions.map((q, idx) => (
                <button key={idx} onClick={() => sendMessageToBot(q)} className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-colors text-left">{q}</button>
              ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ask about your health data..." className="flex-1 bg-slate-100/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-full px-5 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400" />
            <button type="submit" disabled={!inputText.trim() || isLoading} className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm flex-shrink-0"><Send className="w-4 h-4 ml-0.5" /></button>
          </form>
        </div>
      )}
    </div>
  );
}