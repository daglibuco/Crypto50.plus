
import React from 'react';
import { CheckCircle, CreditCard, Sparkles, Info, ShieldCheck, Zap, FileText, Calendar, ArrowRight } from 'lucide-react';

interface PricingProps {
  onJoinClick: (plan: string, amount: number) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onJoinClick }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-32 animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none">
          Professional <span className="text-blue-600">Intelligence</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          Transparent pricing for the Revolut generation. Our credits cover high-performance AI costs and data indexing for your custom reports.
        </p>
      </div>

      {/* MAIN SUBSCRIPTION PLAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 items-stretch">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border-2 border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="p-8 md:p-12 flex-grow">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Primary Access</h3>
            <p className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-8">Comprehensive Educational Tools</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-slate-700 font-bold">Unlimited Trading Simulator</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-slate-700 font-bold">24/7 AI Mentor Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-slate-700 font-bold">Advanced Neural View</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-slate-700 font-bold">Verified Watchlist Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-slate-700 font-bold">Project Utility Insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-slate-700 font-bold">Pattern Alert Notifications</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
               <div className="flex items-center gap-2 mb-2 text-slate-800">
                 <ShieldCheck className="w-5 h-5 text-blue-600" />
                 <span className="font-black text-xs uppercase tracking-widest">Truth-Based Standard</span>
               </div>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">
                 We do not accept payments from crypto projects for promotion. Your credits fund unbiased, independent AI analysis and real-time computation.
               </p>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 md:p-12 md:w-80 shrink-0 flex flex-col justify-center items-center text-center border-l-4 border-blue-600">
            <div className="mb-8">
              <div className="text-5xl font-black mb-1">9.90</div>
              <div className="text-xl font-black text-slate-500 uppercase tracking-widest">CHF / Month</div>
            </div>
            <div className="bg-blue-600/20 text-blue-400 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border border-blue-600/30 mb-8">
              Includes 50 Free Credits
            </div>
            <button onClick={() => onJoinClick('Primary Membership', 9.90)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
              Activate Membership
            </button>
          </div>
        </div>

        {/* CREDIT PACKS */}
        <div className="bg-white rounded-[3rem] border-2 border-slate-200 shadow-xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-600" /> Refill Tiers
            </h3>
            <div className="space-y-4">
              <div 
                onClick={() => onJoinClick('50 Credits Pack', 10.00)}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-400 transition-colors cursor-pointer group"
              >
                <div>
                  <div className="text-lg font-black text-slate-900">50 Credits</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard Refill</div>
                </div>
                <div className="text-xl font-black text-blue-600">CHF 10.-</div>
              </div>
              <div 
                onClick={() => onJoinClick('100 Credits Pack', 15.00)}
                className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-600 group relative cursor-pointer"
              >
                <div className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-md">Best Value</div>
                <div>
                  <div className="text-lg font-black text-slate-900">100 Credits</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Popular Choice</div>
                </div>
                <div className="text-xl font-black text-blue-600">CHF 15.-</div>
              </div>
              <div 
                onClick={() => onJoinClick('200 Credits Pack', 20.00)}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-400 transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-lg font-black text-slate-900">200 Credits</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Power User Pack</div>
                </div>
                <div className="text-xl font-black text-blue-600">CHF 20.-</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 text-white/60 p-4 rounded-2xl mt-6">
            <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
              Credits cover AI token consumption & server fees. 1 Document = 1 Credit. No expiry for active members.
            </p>
          </div>
        </div>
      </div>

      {/* TRANSPARENCY BLOCK */}
      <div className="bg-blue-600 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Info className="w-64 h-64" />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">Transparency:<br/>Why Credits?</h3>
            <p className="text-xl text-blue-100 leading-relaxed font-medium mb-8">
              Advanced situational awareness requires heavy computational lifting. Every credit you spend directly funds:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <Zap className="w-6 h-6 text-yellow-300 mb-2" />
                <h4 className="font-black text-sm uppercase mb-2">Real-Time Tokens</h4>
                <p className="text-xs text-blue-100 font-medium">We process millions of tokens monthly using Gemini 3 Pro to give you factual reports.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <Calendar className="w-6 h-6 text-blue-300 mb-2" />
                <h4 className="font-black text-sm uppercase mb-2">Validated Data</h4>
                <p className="text-xs text-blue-100 font-medium">Reports are built using institutional-grade data feeds, not social media rumors.</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-slate-900 shadow-2xl">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Standard Usage (1 Credit)</h4>
             <ul className="space-y-6">
               <li className="flex gap-4">
                 <div className="bg-yellow-100 p-2 h-fit rounded-lg"><Zap className="w-5 h-5 text-yellow-600 fill-current" /></div>
                 <div>
                   <div className="font-black text-sm uppercase">Flash News & Sentiment</div>
                   <p className="text-xs text-slate-500 font-medium mt-1">Cross-referencing live events with asset price movement.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="bg-blue-100 p-2 h-fit rounded-lg"><FileText className="w-5 h-5 text-blue-600" /></div>
                 <div>
                   <div className="font-black text-sm uppercase">Whitepaper Deep Scan</div>
                   <p className="text-xs text-slate-500 font-medium mt-1">Extracting core utility and identifying project red flags.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="bg-indigo-100 p-2 h-fit rounded-lg"><Calendar className="w-5 h-5 text-indigo-600" /></div>
                 <div>
                   <div className="font-black text-sm uppercase">Automated Reports</div>
                   <p className="text-xs text-slate-500 font-medium mt-1">Scheduled Daily, Weekly, or Monthly situational summaries.</p>
                 </div>
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
