
import React, { useState } from 'react';
import { Activity, Shield, TrendingUp, Users, Brain, CheckCircle, ArrowRight, Wallet, Globe, Mail, X, UserPlus, Gift, LogIn, CreditCard, Sparkles } from 'lucide-react';
import { saveRegistration } from '../services/crmService';

interface WelcomeProps {
  onStart: () => void;
  onLoginClick: () => void;
  onPricingClick: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart, onLoginClick, onPricingClick }) => {
  const [showRegistration, setShowRegistration] = useState(false);
  
  // Registration Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.dob || !formData.email) {
      alert("Please fill in all fields to start your free access.");
      return;
    }

    const success = saveRegistration(formData);
    if (success) {
      setShowRegistration(false);
      onStart(); // Enter the app
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you! You are subscribed to our news updates.`);
  };

  return (
    <div className="font-sans relative">
      
      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white pt-20 pb-24 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 mb-8 shadow-xl">
            <Activity className="w-6 h-6 text-blue-400" />
            <span className="font-bold tracking-wide text-blue-100">Crypto50.plus</span>
            <span className="bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded shadow-sm">BETA</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Financial Freedom <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Has No Age Limit</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            The safe, senior-first platform to master digital assets. 
            Designed specifically for the <strong>Revolut Generation</strong>.
          </p>

          <div className="flex flex-col items-center gap-4">
            <button 
                onClick={() => setShowRegistration(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg shadow-blue-900/50 hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
            >
                Join Free Beta <ArrowRight className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-medium">
                <span className="text-blue-200">Free Access Until End of Year</span>
                <span className="hidden md:inline text-blue-200/40">•</span>
                <button 
                    onClick={onLoginClick}
                    className="flex items-center gap-1 text-blue-300 hover:text-white transition-colors underline decoration-blue-300/50 hover:decoration-white"
                >
                    <LogIn className="w-4 h-4" /> Already a member? Login
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* MISSION & VISION */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why Now? The 50+ Advantage</h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
            <p>
              We are living longer than ever before. But with longevity comes a challenge: 
              <strong> Financial Insecurity.</strong> Traditional jobs are disappearing, and savings accounts no longer pay interest.
            </p>
            <p>
              The 50+ generation holds the largest share of global wealth, yet is often ignored by the crypto industry.
              <strong> Crypto50.plus</strong> is here to change that. We believe digital assets are not just for the young—they are a crucial tool for generating alternative income and preserving wealth in a changing world.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <Users className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="font-bold text-slate-900 text-lg">Growing Community</h3>
                <p className="text-slate-500 text-sm">The fastest-growing demographic in tech adoption.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <TrendingUp className="w-10 h-10 text-green-600 mb-3" />
                <h3 className="font-bold text-slate-900 text-lg">Wealth Holders</h3>
                <p className="text-slate-500 text-sm">Preserving purchasing power against inflation.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <Shield className="w-10 h-10 text-indigo-600 mb-3" />
                <h3 className="font-bold text-slate-900 text-lg">Safety First</h3>
                <p className="text-slate-500 text-sm">Tools designed to prevent costly mistakes.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <Brain className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="font-bold text-slate-900 text-lg">Lifelong Learning</h3>
                <p className="text-slate-500 text-sm">Mastering new skills for the digital age.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY REVOLUT? */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 rounded-full"></div>
                        <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="bg-green-100 p-2 h-fit rounded-full"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Bank-Grade Security</h4>
                                        <p className="text-slate-500">Regulated entity with strict safety protocols.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="bg-blue-100 p-2 h-fit rounded-full"><Wallet className="w-6 h-6 text-blue-600" /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Integrated Banking</h4>
                                        <p className="text-slate-500">Move seamlessly between Cash (Fiat) and Crypto.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="bg-indigo-100 p-2 h-fit rounded-full"><Globe className="w-6 h-6 text-indigo-600" /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Curated Selection</h4>
                                        <p className="text-slate-500">Revolut pre-selects reliable assets, filtering out dangerous scams.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">The Revolut Strategy</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                        We recommend <strong>Revolut</strong> as your trading platform. Why? Because complexity is the enemy of security.
                    </p>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Revolut offers a safe, walled garden. 
                        <strong> Crypto50.plus</strong> provides the advanced intelligence, AI analysis, and training that Revolut lacks, giving you the best of both worlds: 
                        <strong> Institutional Security + Professional Insight.</strong>
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* PRICING PREVIEW SECTION */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Master the Markets</h2>
        <p className="text-slate-500 text-lg mb-12 font-medium max-w-2xl mx-auto">Get full access to our technical analysis tools, expert AI coach, and recurring situational reports.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Membership Highlights */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border-2 border-slate-200 text-left flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase mb-6 tracking-tight flex items-center gap-3">
                    <Activity className="w-7 h-7 text-blue-600" /> Core Benefits
                  </h3>
                  <ul className="space-y-4 mb-8 text-slate-600 font-bold">
                      <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Unlimited "Practice Sandbox" Trades</li>
                      <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> 24/7 "Coach Crypto" AI Guidance</li>
                      <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Unlimited Chart Upload Analysis</li>
                      <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Advanced Multi-Indicator overlays</li>
                      <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Situational Awareness Dashboard</li>
                  </ul>
                </div>
                <button onClick={onPricingClick} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                    View Full Details
                </button>
            </div>

            {/* Price Preview Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-white flex flex-col justify-between relative overflow-hidden border-[6px] border-slate-800">
                <div className="absolute top-0 right-0 bg-yellow-400 text-slate-900 font-black px-6 py-2 rounded-bl-2xl text-[10px] uppercase tracking-widest z-10 shadow-lg">
                    Best Value
                </div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">Full Access</h3>
                    <p className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-8">Monthly Intelligence Plan</p>
                    
                    <div className="mb-10">
                        <div className="flex items-end gap-2 justify-center">
                            <span className="text-6xl font-black">9.90</span>
                            <span className="text-2xl font-black text-slate-500 pb-2">CHF</span>
                        </div>
                        <p className="text-slate-400 font-bold mt-2">includes 50 Monthly Credits</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
                        <div className="flex items-center gap-3 mb-2 text-blue-300">
                            <CreditCard className="w-5 h-5" />
                            <span className="font-black text-xs uppercase tracking-widest">About Credits</span>
                        </div>
                        <p className="text-[11px] leading-relaxed font-medium text-slate-300">
                            Credits cover token expenses for advanced AI models and premium database fees used to generate Situational, News, and Utility reports.
                        </p>
                    </div>
                </div>

                <button 
                    onClick={onPricingClick}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                    <Sparkles className="w-5 h-5 text-yellow-300" /> Start Free Beta
                </button>
            </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-indigo-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <Mail className="w-12 h-12 mx-auto mb-6 text-indigo-300" />
            <h2 className="text-3xl font-bold mb-4">Stay Ahead of the Curve</h2>
            <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">
                Join our newsletter to receive weekly market summaries, safety alerts, and educational tips specifically for the 50+ community.
            </p>

            <form onSubmit={handleNewsletter} className="max-w-lg mx-auto bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/20 flex flex-col md:flex-row gap-2">
                <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    required
                    className="flex-grow bg-white text-slate-900 px-6 py-3 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <button type="submit" className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-3 rounded-xl transition-colors">
                    Subscribe
                </button>
            </form>
        </div>
      </section>

      {/* REGISTRATION MODAL */}
      {showRegistration && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                <button 
                    onClick={() => setShowRegistration(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                        <UserPlus className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Activate Free Access</h3>
                    <p className="text-slate-500 mt-2">
                        Welcome to the <span className="text-yellow-600 font-bold">Beta Program</span>. 
                        Please register to unlock full access until the end of the year.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
                            <input 
                                type="text" 
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.firstName}
                                onChange={e => setFormData({...formData, firstName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                            <input 
                                type="text" 
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.lastName}
                                onChange={e => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                        <input 
                            type="date" 
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.dob}
                            onChange={e => setFormData({...formData, dob: e.target.value})}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                        <input 
                            type="email" 
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg mt-6 transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        Start Learning Now <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Your data is secure and used only for platform access.
                    </p>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};
