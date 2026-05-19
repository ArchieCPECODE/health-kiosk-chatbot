import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Droplet,
  FileText,
  Heart,
  HeartPulse,
  History,
  Info,
  LayoutDashboard,
  Lock,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  Send,
  ShieldCheck,
  Stethoscope,
  User,
  X,
} from 'lucide-react';

const AuthForm = ({ onComplete, usersDb, setUsersDb }) => {
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setError('');

    const email = e.target.email.value.toLowerCase().trim();
    const password = e.target.password.value;

    if (mode === 'login') {
      const existingUser = usersDb[email];
      if (existingUser && existingUser.password === password) {
        onComplete(existingUser);
      } else {
        setError('Invalid email or password. Please try again.');
      }
      return;
    }

    if (usersDb[email]) {
      setError('An account with this email already exists. Please log in.');
      return;
    }

    setFormData({ name: e.target.name.value.trim(), email, password });
    setStep(2);
  };

  const handleOTP = (e) => {
    e.preventDefault();

    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      vitals: {
        bp: '142/92',
        hr: 88,
        bmi: 26.5,
        spo2: 97,
        sugar: 105,
        height: '175cm',
        weight: '81kg',
      },
      conditions: [
        {
          title: 'Stage 2 Hypertension',
          type: 'warning',
          desc: 'Your blood pressure is highly elevated (142/92). Please consult a healthcare professional.',
          advice: 'Avoid high-sodium foods and rest.',
        },
        {
          title: 'Overweight',
          type: 'info',
          desc: 'Your BMI is 26.5. Maintaining a healthy weight reduces cardiovascular risks.',
          advice: 'Consider a balanced diet.',
        },
      ],
      history: {},
    };

    const updatedDb = { ...usersDb, [formData.email]: newUser };
    setUsersDb(updatedDb);
    onComplete(newUser);
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-md mx-auto min-h-[70vh]">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
            step === 1 ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
          }`}
        >
          {step === 1 ? <User className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
          {step === 1 ? (mode === 'login' ? 'Patient Login' : 'Patient Registration') : 'Security Verification'}
        </h2>
        <p className="text-center text-slate-500 text-sm mb-6">
          {step === 1 ? 'Access your secure hardware vitals.' : `Enter the 6-digit OTP sent to ${formData.email}`}
        </p>

        {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  name="name"
                  required
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Juan Dela Cruz"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                name="email"
                required
                type="email"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="patient@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  name="password"
                  required
                  type="password"
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md mt-2"
            >
              {mode === 'login' ? 'Secure Login' : 'Continue Securely'}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                  setStep(1);
                }}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                {mode === 'login' ? "Don't have an account? Register" : 'Already registered? Log in'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-center">One-Time Password (OTP)</label>
              <input
                name="otp"
                required
                type="text"
                maxLength="6"
                className="w-full px-4 py-3 text-center tracking-widest text-2xl font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="123456"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-md mt-2"
            >
              Verify & Access Data
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-slate-500 text-sm hover:text-slate-700 mt-2 font-medium"
            >
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
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello! I'm **Chatbot Eugene**, the assistant for the Health Monitoring System.\n\nI can help you understand the project. If you register or log in, I can also analyze your personal vitals and health history.\n\nHow can I assist you today?`,
      isBot: true,
    },
  ]);

  const messagesEndRef = useRef(null);

  const [usersDb, setUsersDb] = useState(() => {
    if (typeof window === 'undefined') return {};

    try {
      const savedDb = localStorage.getItem('vitalsKioskDb');
      return savedDb ? JSON.parse(savedDb) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vitalsKioskDb', JSON.stringify(usersDb));
    } catch {
      // Ignore storage errors in restricted environments.
    }
  }, [usersDb]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isChatOpen]);

  const createMessageId = () => Date.now() + Math.floor(Math.random() * 1000);

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'auth' || page === 'dashboard' || page === 'medical-history') {
      setIsChatOpen(true);
    }
  };

  const MessageFormatter = ({ text, isBot }) => {
    if (!text) return null;

    const lines = text.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, i) => {
          if (!line.trim()) return <div key={i} className="h-1" />;

          const isList = /^[-*•]\s/.test(line.trim());
          const content = isList ? line.trim().replace(/^[-*•]\s/, '') : line;

          const parts = content.split(/(\*\*.*?\*\*|\[.*?\])/g);
          const formattedParts = parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={j} className="font-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }

            if (part.startsWith('[') && part.endsWith(']')) {
              const linkText = part.slice(1, -1);
              const lowerLink = linkText.toLowerCase();
              const isAlert = lowerLink === 'health alert';

              return (
                <button
                  key={j}
                  onClick={() => {
                    if (lowerLink === 'register' || lowerLink === 'login') {
                      setCurrentPage('auth');
                      setIsChatOpen(true);
                    } else if (lowerLink === 'dashboard') {
                      setCurrentPage('dashboard');
                      setIsChatOpen(true);
                    } else if (lowerLink === 'medical history') {
                      setCurrentPage('medical-history');
                      setIsChatOpen(true);
                    } else if (currentUser) {
                      setCurrentPage('dashboard');
                      setIsChatOpen(true);
                    } else {
                      setCurrentPage('auth');
                      setIsChatOpen(true);
                    }
                  }}
                  className={`inline-flex items-center font-bold underline underline-offset-2 transition-colors cursor-pointer px-1 rounded mx-0.5 ${
                    isAlert
                      ? 'text-rose-600 hover:text-rose-800 decoration-rose-300 bg-rose-50'
                      : 'text-blue-600 hover:text-blue-800 decoration-blue-300 bg-blue-50'
                  }`}
                >
                  {isAlert && <AlertTriangle className="w-3 h-3 mr-1" />}
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

  const appendBotMessage = (text) => {
    setMessages((prev) => [...prev, { id: createMessageId(), text, isBot: true }]);
  };

  const sendMessageToBot = async (textToSend) => {
    const message = textToSend.trim();
    if (!message || isLoading) return;

    setMessages((prev) => [...prev, { id: createMessageId(), text: message, isBot: false }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userData: currentUser }),
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      const botResponseText =
        result.reply ||
        result.error ||
        'This query is not related to the project. Please ask about the Health Monitoring System, kiosk usage, medical history, login, or navigation.';

      appendBotMessage(botResponseText);
    } catch {
      appendBotMessage(
        `I could not connect to the chatbot service.\n\nPlease try again or ask a project-related question such as:\n• Medical history\n• Kiosk usage\n• Website navigation\n• Blood pressure\n• Heart rate\n• BMI\n• Oxygen level\n• Sugar level`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessageToBot(inputText);
  };

  const handleAuthComplete = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
    setIsChatOpen(true);
    sendMessageToBot(`Hi Eugene, I just successfully logged in as ${user.name}. Please give me a quick summary of my vitals.`);
  };

  const handleSaveMedicalHistory = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const formData = new FormData(e.target);

    const conditionsList = [
      'hypertension',
      'diabetes',
      'heartCondition',
      'asthma',
      'seizures',
      'cancer',
      'arthritis',
      'kidneyDisease',
      'thyroid',
      'mentalHealth',
      'liverDisease',
      'stroke',
    ];

    const conditionsObj = {};
    conditionsList.forEach((condition) => {
      conditionsObj[condition] = formData.get(condition) === 'on';
    });

    const historyData = {
      lifestyle: {
        occupation: formData.get('occupation'),
        smoker: formData.get('smoker'),
        exercise: formData.get('exercise'),
      },
      conditions: conditionsObj,
      details: {
        allergies: formData.get('allergies'),
        medications: formData.get('medications'),
        surgeries: formData.get('surgeries'),
      },
    };

    const updatedUser = { ...currentUser, history: historyData };
    setCurrentUser(updatedUser);
    setUsersDb((prev) => ({ ...prev, [currentUser.email]: updatedUser }));
    setCurrentPage('dashboard');
    setIsChatOpen(true);
    sendMessageToBot('I just updated my Medical History profile. Please acknowledge.');
  };

  const renderMedicalHistory = () => (
    <div className="pt-16 pb-20 px-4 max-w-4xl mx-auto min-h-[70vh]">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => setCurrentPage('dashboard')} className="text-slate-500 hover:text-blue-600 transition-colors">
          ← Back to Dashboard
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Clinical Intake Form</h2>
        <p className="text-slate-500">Please update your comprehensive medical background to assist our AI analysis.</p>
      </div>

      <form onSubmit={handleSaveMedicalHistory} className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-5 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" /> Lifestyle & Demographics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Occupation / Type of Work</label>
              <input
                name="occupation"
                defaultValue={currentUser?.history?.lifestyle?.occupation || ''}
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="e.g. Student, Sitting, Lifting..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Do you currently smoke?</label>
              <select
                name="smoker"
                defaultValue={currentUser?.history?.lifestyle?.smoker || 'No'}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
                <option value="Former">Former Smoker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Regular Exercise Level</label>
              <select
                name="exercise"
                defaultValue={currentUser?.history?.lifestyle?.exercise || '0 days'}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="0 days">0 days/week</option>
                <option value="1-2 days">1-2 days/week</option>
                <option value="3-5 days">3-5 days/week</option>
                <option value="6-7 days">6-7 days/week</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-5 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500" /> Past Medical History
          </h3>
          <p className="text-sm text-slate-500 mb-4">Do you currently have or have you ever had a history of:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'hypertension', label: 'High Blood Pressure' },
              { id: 'diabetes', label: 'Diabetes' },
              { id: 'heartCondition', label: 'Heart Condition / Disease' },
              { id: 'asthma', label: 'Asthma / Respiratory' },
              { id: 'seizures', label: 'Seizures / Epilepsy' },
              { id: 'cancer', label: 'Cancer / Chemotherapy' },
              { id: 'arthritis', label: 'Osteoarthritis' },
              { id: 'kidneyDisease', label: 'Kidney Disease' },
              { id: 'thyroid', label: 'Thyroid Disorder' },
              { id: 'mentalHealth', label: 'Depression / Anxiety' },
              { id: 'liverDisease', label: 'Liver Disease / Hepatitis' },
              { id: 'stroke', label: 'Stroke' },
            ].map((condition) => (
              <label key={condition.id} className="flex items-center gap-3 cursor-pointer p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  name={condition.id}
                  defaultChecked={currentUser?.history?.conditions?.[condition.id]}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">{condition.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-5 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Clinical Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Known Allergies</label>
              <textarea
                name="allergies"
                defaultValue={currentUser?.history?.details?.allergies || ''}
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm h-28 resize-none"
                placeholder="List any food, drug, or environmental allergies..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Current Medications</label>
              <textarea
                name="medications"
                defaultValue={currentUser?.history?.details?.medications || ''}
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm h-28 resize-none"
                placeholder="List current medications and dosages..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Previous Surgeries or Major Hospitalizations</label>
              <textarea
                name="surgeries"
                defaultValue={currentUser?.history?.details?.surgeries || ''}
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
                placeholder="Please specify year, location, and type of procedure..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-blue-600 text-white font-bold py-4 px-10 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2 text-lg">
            <CheckCircle2 className="w-6 h-6" /> Secure & Save Profile
          </button>
        </div>
      </form>
    </div>
  );

  const renderDashboard = () => (
    <div className="pt-16 pb-20 px-4 max-w-5xl mx-auto min-h-[70vh]">
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Patient Dashboard</h2>
          <p className="text-slate-500">Welcome back, {currentUser?.name}.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setCurrentPage('medical-history')}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <History className="w-4 h-4 text-blue-600" /> Edit History
          </button>
          <button
            onClick={() => {
              setCurrentUser(null);
              setCurrentPage('home');
              setIsChatOpen(false);
            }}
            className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
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
          { label: 'Blood Pressure', val: currentUser?.vitals?.bp, icon: <Heart className="w-5 h-5 text-rose-500" />, status: 'Elevated' },
          { label: 'Heart Rate', val: `${currentUser?.vitals?.hr ?? 'N/A'} bpm`, icon: <Activity className="w-5 h-5 text-indigo-500" />, status: 'Normal' },
          { label: 'SpO2 Level', val: `${currentUser?.vitals?.spo2 ?? 'N/A'}%`, icon: <Droplet className="w-5 h-5 text-cyan-500" />, status: 'Normal' },
          { label: 'Blood Sugar', val: currentUser?.vitals?.sugar ?? 'N/A', icon: <Activity className="w-5 h-5 text-amber-500" />, status: 'Normal' },
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
    </div>
  );

  const quickPrompts = currentUser
    ? ['Review my vitals', 'What is my health condition?', 'Show my medical history']
    : ['How to register?', 'How to log in?', 'Where are you located?', 'How to use the kiosk?'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-blue-900">
                VitalsKiosk<span className="text-blue-500">.AI</span>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
              <button onClick={() => setCurrentPage('home')} className="hover:text-blue-600 transition-colors">
                Home
              </button>
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="hover:text-blue-600 transition-colors"
              >
                Features
              </button>

              {!currentUser ? (
                <button onClick={() => setCurrentPage('auth')} className="hover:text-blue-600 text-blue-600 font-bold transition-colors">
                  Login / Register
                </button>
              ) : (
                <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
              )}
            </div>

            <button onClick={() => setIsChatOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Ask AI
            </button>
          </div>
        </div>
      </nav>

      {currentPage === 'home' && (
        <>
          <header className="relative overflow-hidden bg-white">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-blue-50 rounded-l-full opacity-50 transform translate-x-1/3" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
              <div className="md:w-2/3">
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-6 uppercase">
                  Capstone Project 2026
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                  The Future of <span className="text-blue-600">Automated</span> Health Monitoring.
                </h1>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
                  An all-in-one smart kiosk designed to deliver highly accurate vital signs, instant physical printouts, and AI-driven medical guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setCurrentPage('auth')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    Access Patient Portal <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main id="features" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Metric Tracking</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: <Heart className="w-8 h-8 text-rose-500" />, title: 'Blood Pressure & Heart Rate' },
                  { icon: <Scale className="w-8 h-8 text-blue-500" />, title: 'BMI & Weight' },
                  { icon: <Activity className="w-8 h-8 text-indigo-500" />, title: 'Oxygen Level (SpO2)' },
                  { icon: <Droplet className="w-8 h-8 text-red-500" />, title: 'Blood Sugar Level' },
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-xl transition-all">
                    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <section id="location" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Visit Our Kiosk</h2>
              </div>
              <div className="bg-slate-50 rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
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
                  />
                </div>
                <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white">
                  <div className="flex-1 w-full flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <p className="text-slate-800 font-bold mb-1">St. John Paul II College of Davao</p>
                      <p className="text-slate-600 text-sm">Ecoland Dr, Matina, Davao City</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-px h-16 bg-slate-200" />
                  <div className="flex-1 w-full flex items-center gap-3">
                    <Phone className="w-6 h-6 text-blue-600" />
                    <p className="text-slate-600 font-medium text-lg">(082) 297 8755</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
              <p>© 2026 VitalsKiosk.AI. All rights reserved.</p>
              <p className="mt-2 text-slate-500">
                System Engineers: <span className="text-blue-400">Archie Abona</span>, <span className="text-blue-400">Jarold Camino</span> & <span className="text-blue-400">Kiervy Lawas</span>
              </p>
            </div>
          </footer>
        </>
      )}

      {currentPage === 'auth' && <AuthForm onComplete={handleAuthComplete} usersDb={usersDb} setUsersDb={setUsersDb} />}
      {currentPage === 'dashboard' && currentUser && renderDashboard()}
      {currentPage === 'medical-history' && currentUser && renderMedicalHistory()}

      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all z-50">
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] sm:w-[420px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-50">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Chatbot Eugene</h3>
                <p className="text-xs text-blue-100">{currentUser ? `Analyzing: ${currentUser.name}` : 'System Online'}</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} items-end gap-2`}>
                {msg.isBot && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center border shadow-sm">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div className={`max-w-[78%] p-3.5 text-sm ${msg.isBot ? 'bg-white text-slate-700 border rounded-2xl rounded-bl-sm shadow-sm' : 'bg-blue-600 text-white rounded-2xl rounded-br-sm shadow-md'}`}>
                  <MessageFormatter text={msg.text} isBot={msg.isBot} />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center border shadow-sm">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-white border p-4 rounded-2xl rounded-bl-sm flex items-center gap-1.5 h-[42px]">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-1" />
          </div>

          {messages.length <= 2 && !isLoading && (
            <div className="px-3 pb-2 flex flex-wrap gap-2 bg-white pt-2 border-t border-slate-100">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessageToBot(q)}
                  className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Eugene..."
              className="flex-1 bg-slate-100 border focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-full px-4 py-2.5 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}