
import React, { useState, useEffect } from 'react';
import { Monitor, Activity, ImagePlus, Home, LogOut, Shield, Zap, CreditCard, Inbox, GraduationCap } from 'lucide-react';
import { getUserCredits } from '../services/crmService';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  setView, 
  isLoggedIn, 
  isAdmin, 
  onLoginClick, 
  onLogoutClick 
}) => {
  const [reportCount, setReportCount] = useState(0);
  const [credits, setCredits] = useState(50);

  const refreshData = () => {
    const saved = localStorage.getItem('crypto50_reports');
    if (saved) setReportCount(JSON.parse(saved).length);
    setCredits(getUserCredits());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('storage', refreshData);
    window.addEventListener('credits_updated', refreshData);
    const interval = setInterval(refreshData, 2000);
    return () => {
      window.removeEventListener('storage', refreshData);
      window.removeEventListener('credits_updated', refreshData);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('welcome')}>
              <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg"><Activity className="text-white w-5 h-5 md:w-6 md:h-6" /></div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-1.5">
                Crypto50<span className="text-blue-600">.plus</span>
              </h1>
            </div>
            
            <div className="flex md:hidden items-center gap-2">
              {isLoggedIn && (
                <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600 fill-current" />
                  <span className="text-[10px] font-black text-blue-700">{credits}</span>
                </div>
              )}
              {!isLoggedIn ? (
                  <button onClick={onLoginClick} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-black text-xs">Login</button>
              ) : (
                  <button onClick={onLogoutClick} className="p-2 text-slate-400"><LogOut className="w-5 h-5" /></button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <nav className="relative flex-grow overflow-hidden flex items-center bg-slate-100 rounded-xl p-1">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth w-full pr-8">
                  <button onClick={() => setView('welcome')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${currentView === 'welcome' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><Home className="w-3.5 h-3.5" /> Home</button>
                  {isLoggedIn && !isAdmin && (
                      <>
                          <button onClick={() => setView('tutorial')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${currentView === 'tutorial' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}><GraduationCap className="w-3.5 h-3.5" /> Masterclass</button>
                          <button onClick={() => setView('market')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${currentView === 'market' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><Monitor className="w-3.5 h-3.5" /> Market</button>
                          <button onClick={() => setView('reports')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all whitespace-nowrap relative ${currentView === 'reports' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                            <Inbox className="w-3.5 h-3.5" /> Intelligence
                            {reportCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] px-1 rounded-full">{reportCount}</span>}
                          </button>
                          <button onClick={() => setView('sandbox')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${currentView === 'sandbox' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><Activity className="w-3.5 h-3.5" /> Simulator</button>
                          <button onClick={() => setView('upload')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${currentView === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><ImagePlus className="w-3.5 h-3.5" /> Analyzer</button>
                          <button onClick={() => setView('whisper')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${currentView === 'whisper' ? 'bg-slate-900 text-blue-400' : 'text-slate-500'}`}><Zap className="w-3.5 h-3.5 fill-current" /> Whisper</button>
                      </>
                  )}
                  <button onClick={() => setView('pricing')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${currentView === 'pricing' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><CreditCard className="w-3.5 h-3.5" /> Pricing</button>
                  {isAdmin && <button onClick={() => setView('admin')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all whitespace-nowrap ${currentView === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}><Shield className="w-3.5 h-3.5" /> Admin</button>}
              </div>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn && (
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl group cursor-help" title="Active AI Credits">
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-blue-400 uppercase leading-none mb-1">Balance</span>
                      <span className="text-sm font-black text-blue-700 leading-none">{credits} Credits</span>
                   </div>
                   <Zap className="w-5 h-5 text-blue-600 fill-current group-hover:scale-110 transition-transform" />
                </div>
              )}
              {isLoggedIn ? (
                  <button onClick={onLogoutClick} className="p-3 bg-slate-100 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><LogOut className="w-5 h-5" /></button>
              ) : (
                  <button onClick={onLoginClick} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-black transition-all text-sm shadow-md">Login</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
