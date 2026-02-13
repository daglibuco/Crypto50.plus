
import React, { useState } from 'react';
import { 
  Monitor, Activity, ImagePlus, BookOpen, PlayCircle, Bot, Layers, Sparkles, 
  AlertCircle, CheckCircle, GraduationCap, Microscope, ShieldCheck, Zap, 
  BrainCircuit, Wallet, ChevronRight, Info, TrendingUp, Search
} from 'lucide-react';

export const Tutorial: React.FC = () => {
  const [activeModule, setActiveModule] = useState<number>(0);

  const modules = [
    {
      id: 0,
      title: "Foundations",
      icon: <GraduationCap />,
      subtitle: "The Science vs. Gamble Philosophy",
      content: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10"><Microscope className="w-32 h-32" /></div>
            <h3 className="text-4xl font-black mb-6 uppercase tracking-tight">The Core Secret</h3>
            <p className="text-xl md:text-2xl leading-relaxed font-medium opacity-90">
              Professional trading is not about "guessing" which coin will go up. It is about separating the <strong>Science</strong> from the <strong>Gamble</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl">
               <div className="flex items-center gap-3 mb-6">
                 <div className="bg-green-100 p-3 rounded-2xl text-green-700"><CheckCircle className="w-8 h-8" /></div>
                 <h4 className="text-2xl font-black text-slate-900 uppercase">The Science</h4>
               </div>
               <p className="text-slate-600 text-lg leading-relaxed font-medium">
                 This is the <strong>Real Value</strong>. It includes the technology (Whitepaper), the team, and real-world utility. Science-based decisions are for the long-term.
               </p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl">
               <div className="flex items-center gap-3 mb-6">
                 <div className="bg-red-100 p-3 rounded-2xl text-red-700"><AlertCircle className="w-8 h-8" /></div>
                 <h4 className="text-2xl font-black text-slate-900 uppercase">The Gamble</h4>
               </div>
               <p className="text-slate-600 text-lg leading-relaxed font-medium">
                 This is <strong>Hype and Noise</strong>. It includes social media trends, celebrity tweets, and "get rich quick" promises. We use the platform to ignore this noise.
               </p>
            </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-[2.5rem] border-4 border-slate-200">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Mastery Milestone</h4>
             <p className="text-2xl font-black text-slate-800 leading-tight">
               "On Crypto50.plus, our goal is to help you build a portfolio based on 90% Science and 10% calculated tactical movement."
             </p>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Market Scan",
      icon: <Search />,
      subtitle: "Navigating the Verified Watchlist",
      content: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-6">
                <h3 className="text-3xl font-black text-slate-900 uppercase">The Verified Filter</h3>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  We maintain a list of 300+ assets specifically available on high-security platforms like Revolut. Every asset has a <strong>Volatility Traffic Light</strong>.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-6 p-6 bg-green-50 rounded-2xl border-2 border-green-100">
                    <div className="w-12 h-12 rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
                    <div>
                      <h5 className="font-black text-slate-900 uppercase">Green: Stable Corridor</h5>
                      <p className="text-sm text-slate-500">Low volatility. Ideal for long-term building.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-100">
                    <div className="w-12 h-12 rounded-full bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]"></div>
                    <div>
                      <h5 className="font-black text-slate-900 uppercase">Yellow: Caution Zone</h5>
                      <p className="text-sm text-slate-500">Moderate swings. Requires active monitoring.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 bg-red-50 rounded-2xl border-2 border-red-100">
                    <div className="w-12 h-12 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
                    <div>
                      <h5 className="font-black text-slate-900 uppercase">Red: Tactical Extreme</h5>
                      <p className="text-sm text-slate-500">High volatility. Only for experienced audit simulations.</p>
                    </div>
                  </div>
                </div>
             </div>
             <div className="bg-slate-900 rounded-[3rem] p-8 text-white flex flex-col justify-between">
                <div>
                  <Zap className="w-12 h-12 text-blue-400 mb-6" />
                  <h4 className="text-xl font-black uppercase mb-4">Neural Recon</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    Use the <strong>Flash News</strong> and <strong>Utility Scan</strong> buttons in the market list to get instant AI-grounded reports before you trade.
                  </p>
                </div>
                <button className="bg-blue-600 py-4 rounded-xl font-black text-xs uppercase tracking-widest">Go to Market</button>
             </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Simulator",
      icon: <Monitor />,
      subtitle: "The $100 Audit Strategy",
      content: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white border-2 border-slate-100 p-10 rounded-[3rem] shadow-xl">
              <h3 className="text-3xl font-black text-slate-900 uppercase mb-6">Why $100?</h3>
              <p className="text-xl text-slate-600 leading-relaxed font-medium mb-8">
                We simulate every trade with a fixed <strong>$100 Audit</strong>. This allows you to track percentage growth objectively without the emotional stress of real capital.
              </p>
              <div className="flex flex-col md:flex-row gap-8">
                 <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-1.5 rounded-lg text-white font-black text-xs">1</div>
                      <h5 className="font-black uppercase text-slate-800">Initiate Audit</h5>
                    </div>
                    <p className="text-sm text-slate-500">Click "Initiate $100 Audit" to start a paper position at the real-world current price.</p>
                 </div>
                 <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-1.5 rounded-lg text-white font-black text-xs">2</div>
                      <h5 className="font-black uppercase text-slate-800">Monitor Drift</h5>
                    </div>
                    <p className="text-sm text-slate-500">Watch the "Simulation Equity" change. Use indicators like RSI to see if the asset is overbought.</p>
                 </div>
                 <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-1.5 rounded-lg text-white font-black text-xs">3</div>
                      <h5 className="font-black uppercase text-slate-800">Settle & Log</h5>
                    </div>
                    <p className="text-sm text-slate-500">Close the position to record your P&L. Review your success in the Trade Journal at the bottom.</p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-12 text-white">
              <div className="shrink-0 bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl">
                 <Bot className="w-20 h-20" />
              </div>
              <div>
                 <h4 className="text-2xl font-black uppercase mb-4 text-blue-400">Coach Crypto: Your Mentor</h4>
                 <p className="text-lg opacity-80 leading-relaxed font-medium">
                   Don't know what a "Golden Cross" or "RSI Divergence" is? Simply ask the Coach in the Simulator. It reads the current chart and explains the technical science in plain English.
                 </p>
              </div>
           </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Revolut Strategy",
      icon: <Wallet />,
      subtitle: "Moving from Practice to Action",
      content: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10"><ShieldCheck className="w-48 h-48" /></div>
             <h3 className="text-4xl font-black mb-8 uppercase tracking-tighter">The Revolut Blueprint</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <div className="bg-white/10 p-6 rounded-3xl border border-white/20">
                      <h5 className="font-black uppercase mb-2">Step 1: Simulation Mastery</h5>
                      <p className="text-sm opacity-80">Achieve a positive P&L over 5 consecutive $100 Audits on our platform.</p>
                   </div>
                   <div className="bg-white/10 p-6 rounded-3xl border border-white/20">
                      <h5 className="font-black uppercase mb-2">Step 2: Signal Confirmation</h5>
                      <p className="text-sm opacity-80">Use the Whisper AI to verify your strategy has a confidence score over 80%.</p>
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="bg-white/10 p-6 rounded-3xl border border-white/20">
                      <h5 className="font-black uppercase mb-2">Step 3: Tactical Execution</h5>
                      <p className="text-sm opacity-80">Log into your Revolut app and execute the trade with the confidence of a professional.</p>
                   </div>
                   <div className="bg-white/10 p-6 rounded-3xl border border-white/20">
                      <h5 className="font-black uppercase mb-2">Step 4: Continuous Learning</h5>
                      <p className="text-sm opacity-80">Return to the Intelligence Hub to read your Weekly situational reports.</p>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="bg-slate-50 border-2 border-slate-200 p-8 rounded-[2.5rem] flex items-center justify-between">
             <div className="flex items-center gap-4">
                <Info className="w-8 h-8 text-blue-600" />
                <span className="text-lg font-black text-slate-800 uppercase tracking-tight">Security Reminder: We never ask for your wallet keys or real money.</span>
             </div>
             <TrendingUp className="w-10 h-10 text-slate-200" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-12 pb-32 font-sans animate-in fade-in duration-700">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8 border-b-8 border-slate-900 pb-12">
        <div className="max-w-2xl">
          <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest inline-block mb-4">Member Curriculum</div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Trading <span className="text-blue-600">Masterclass</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium mt-6 leading-relaxed">
            From zero-knowledge to high-confidence trading. Follow the path to financial literacy.
          </p>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-l-8 border-blue-600 text-white hidden lg:block min-w-[300px]">
           <div className="flex items-center gap-4 mb-4">
             <BrainCircuit className="w-8 h-8 text-blue-400" />
             <span className="text-xs font-black uppercase tracking-widest">Progress: Module {activeModule + 1}/4</span>
           </div>
           <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(activeModule + 1) * 25}%` }}></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* NAVIGATION SIDEBAR */}
        <div className="lg:col-span-3 space-y-4">
          {modules.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(idx)}
              className={`w-full flex items-center gap-5 p-6 rounded-3xl transition-all border-2 text-left group ${activeModule === idx ? 'bg-white border-blue-600 shadow-xl scale-105' : 'bg-transparent border-transparent hover:bg-slate-100'}`}
            >
              <div className={`p-4 rounded-2xl transition-all ${activeModule === idx ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                {React.cloneElement(m.icon as React.ReactElement, { className: "w-6 h-6" })}
              </div>
              <div className="flex-grow">
                <div className={`text-[10px] font-black uppercase tracking-widest ${activeModule === idx ? 'text-blue-600' : 'text-slate-400'}`}>Module {idx + 1}</div>
                <div className={`text-xl font-black uppercase tracking-tight ${activeModule === idx ? 'text-slate-900' : 'text-slate-500'}`}>{m.title}</div>
              </div>
              <ChevronRight className={`w-6 h-6 transition-all ${activeModule === idx ? 'text-blue-600 translate-x-1' : 'text-slate-200'}`} />
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="lg:col-span-9">
           <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{modules[activeModule].title}</h2>
                <p className="text-xl text-blue-600 font-bold mt-2">{modules[activeModule].subtitle}</p>
              </div>
              <div className="flex gap-4">
                <button 
                  disabled={activeModule === 0}
                  onClick={() => setActiveModule(prev => prev - 1)}
                  className="px-8 py-4 rounded-2xl bg-slate-100 text-slate-400 font-black uppercase tracking-widest text-xs border-2 border-transparent hover:border-slate-200 disabled:opacity-30"
                >
                  Previous
                </button>
                <button 
                  disabled={activeModule === modules.length - 1}
                  onClick={() => setActiveModule(prev => prev + 1)}
                  className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-lg hover:bg-blue-500 disabled:opacity-30"
                >
                  Next Module
                </button>
              </div>
           </div>

           <div className="min-h-[600px]">
              {modules[activeModule].content}
           </div>
        </div>
      </div>
    </div>
  );
};
