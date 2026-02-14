
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Coin, IndicatorDefinition, Timeframe, ChartType, JournalEntry, ChatMessage, TraderProfile } from '../types';
import { getHistoricalData, calculateNetEquity, detectPatterns } from '../services/marketService';
import { generateBriefing, chatWithExpert } from '../services/geminiService';
import { INDICATORS } from '../constants';
import { MetaGlassView } from './MetaGlassView';
import { 
  ComposedChart, Line, Area, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Label, ResponsiveContainer, Legend
} from 'recharts';
import { 
  PlayCircle, Bot, RefreshCw, BookOpen, BarChart2, TrendingUp, History, Send, Sparkles, Glasses, ChevronLeft, Trash2, Layers, Activity, Settings2, Eye, EyeOff, BarChart3, Info, AlertTriangle, ShieldCheck, Wallet, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SimulatorProps {
  coin: Coin;
  onBack: () => void;
}

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '1Y'];
const INDICATOR_COLORS = ["#3b82f6", "#a855f7", "#f59e0b"]; 

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isBullish = data.close >= data.open;
    return (
      <div className="bg-slate-900 border-2 border-slate-700 p-5 rounded-2xl shadow-2xl text-white font-mono min-w-[200px]">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">
          {new Date(data.timestamp).toLocaleString()}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-slate-500 uppercase">Open</span>
            <span className="font-bold">${data.open.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-slate-500 uppercase">High</span>
            <span className="font-bold text-green-400">${data.high.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-slate-500 uppercase">Low</span>
            <span className="font-bold text-red-400">${data.low.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-slate-800 mt-2 pt-2">
            <span className="text-slate-400 uppercase text-xs">Close</span>
            <span className={`font-black text-lg ${isBullish ? 'text-green-500' : 'text-red-500'}`}>
              ${data.close.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const renderCandle = (props: any) => {
  const { x, y, width, height, open, close, low, high } = props;
  const isBullish = close >= open;
  const color = isBullish ? '#22c55e' : '#ef4444';
  const totalRange = high - low;
  if (totalRange <= 0) return null;
  const ratio = height / totalRange;
  const bodyTop = y + (high - Math.max(open, close)) * ratio;
  const bodyHeight = Math.max(Math.abs(open - close) * ratio, 1);
  return (
    <g>
      <line x1={x + width / 2} y1={y} x2={x + width / 2} y2={y + height} stroke={color} strokeWidth={1.5} />
      <rect x={x} y={bodyTop} width={width} height={bodyHeight} fill={color} />
    </g>
  );
};

export const Simulator: React.FC<SimulatorProps> = ({ coin: initialCoin, onBack }) => {
  const [currentCoin, setCurrentCoin] = useState<Coin>(initialCoin);
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartType, setChartType] = useState<ChartType>('candle');
  const [data, setData] = useState<any[]>([]); 
  const [currentPrice, setCurrentPrice] = useState(initialCoin?.price || 0);
  const [activeIndicators, setActiveIndicators] = useState<IndicatorDefinition[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [hoveredData, setHoveredData] = useState<any>(null);

  // Layout & View Options
  const [showGrid, setShowGrid] = useState(true);
  const [showPriceLine, setShowPriceLine] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showFib, setShowFib] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  
  // AI Components
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // SIMULATION CORE: THE JOURNAL
  const [trade, setTrade] = useState<{entry: number, equity: number} | null>(null);
  const [journal, setJournal] = useState<JournalEntry[]>([]);

  const currentEquity = useMemo(() => {
    if (!trade) return 100.00;
    return trade.equity * (currentPrice / trade.entry);
  }, [trade, currentPrice]);

  useEffect(() => {
    const saved = localStorage.getItem('crypto50_journal');
    if (saved) setJournal(JSON.parse(saved));
    
    setChatHistory([{ 
      role: 'model', 
      text: `Expert Node synchronized for **${currentCoin.name}**. I am reading the ${timeframe} structure. Your simulation journal is ready for new entries.`, 
      timestamp: Date.now() 
    }]);

    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const refresh = () => {
      const history = getHistoricalData(currentCoin.symbol, timeframe, activeIndicators);
      if (history && history.length > 0) {
        setData([...history]);
        // Only update current price if not in an active trade drift
        if (!trade) setCurrentPrice(history[history.length - 1].close);
        setHoveredData(history[history.length - 1]);
      }
    };
    refresh();
  }, [currentCoin, timeframe, activeIndicators]);

  // Real-time price drift to simulate live market feel for active positions
  useEffect(() => {
    const timer = setInterval(() => {
      if (trade) {
        setCurrentPrice(prev => prev + (prev * (Math.random() - 0.5) * 0.0002));
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [trade]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatHistory, isChatLoading]);

  const toggleTrade = () => {
    if (trade) {
      // Settle the trade
      const finalVal = currentEquity;
      const pnl = finalVal - 100;
      const entry: JournalEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        symbol: currentCoin.symbol,
        name: currentCoin.name,
        entryPrice: trade.entry,
        exitPrice: currentPrice,
        initialEquity: trade.equity,
        finalEquity: finalVal,
        pnlValue: pnl,
        pnlPercent: (pnl / 100) * 100,
        justification: "Institutional Simulation Exit",
        aiScore: 85 + Math.floor(Math.random() * 10)
      };
      const updated = [entry, ...journal];
      setJournal(updated);
      localStorage.setItem('crypto50_journal', JSON.stringify(updated));
      setTrade(null);
    } else {
      // Open new position
      const calc = calculateNetEquity(currentPrice);
      setTrade({ entry: currentPrice, equity: calc.netEquity });
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const txt = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', text: txt, timestamp: Date.now() }]);
    setIsChatLoading(true);
    
    try {
      const res = await chatWithExpert([{ role: 'user', text: txt }], currentCoin, currentPrice, activeIndicators, [], { riskLevel: 'Moderate', style: 'Day Trading' });
      setChatHistory(prev => [...prev, { role: 'model', text: res, timestamp: Date.now() }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Signal connection interrupted. Re-polling...", timestamp: Date.now() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-4 lg:p-6 bg-slate-50 min-h-screen flex flex-col gap-6 overflow-hidden">
      
      {/* HEADER COMMAND BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-slate-200 pb-6 shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all active:scale-95 shadow-sm"><ChevronLeft className="w-8 h-8" /></button>
          <div>
            <div className="flex items-center gap-3">
               <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{currentCoin.name}</h2>
               <div className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest mt-1">Live Feed</div>
            </div>
            <div className="flex items-center gap-4 font-mono font-black text-2xl md:text-3xl text-blue-600 mt-2">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className={`px-3 py-1 rounded-xl text-sm md:text-base border ${currentCoin.change24h >= 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                {currentCoin.change24h > 0 ? '+' : ''}{currentCoin.change24h.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button onClick={() => setShowMeta(true)} className="flex-grow lg:flex-none px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl flex items-center justify-center gap-4 hover:bg-slate-800 transition-all text-lg group">
            <Glasses className="w-7 h-7 text-blue-400 group-hover:rotate-12 transition-transform" /> NEURAL SCAN™
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow h-[85vh] min-h-[900px] max-h-[1400px]">
        {/* MAIN CHART BLOCK */}
        <div className="lg:col-span-3 flex flex-col gap-6 h-full">
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-xl p-6 flex flex-col h-full overflow-hidden">
            
            {/* CHART TOOLBAR */}
            <div className="flex flex-col gap-4 mb-6 border-b border-slate-100 pb-4 shrink-0">
               <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {TIMEFRAMES.map(tf => (
                      <button key={tf} onClick={() => setTimeframe(tf)} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${timeframe === tf ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-800'}`}>{tf}</button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button onClick={() => setChartType('line')} className={`p-2 rounded-lg ${chartType === 'line' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><TrendingUp className="w-5 h-5" /></button>
                      <button onClick={() => setChartType('candle')} className={`p-2 rounded-lg ${chartType === 'candle' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><BarChart2 className="w-5 h-5" /></button>
                    </div>
                    <button onClick={() => setShowFib(!showFib)} className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${showFib ? 'bg-yellow-400 border-yellow-500 text-slate-900' : 'bg-white border-slate-200 text-slate-500'}`}>FIB</button>
                    <select className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 text-xs font-black outline-none" value="" onChange={(e) => { const i = INDICATORS.find(x => x.name === e.target.value); if(i) setActiveIndicators([...activeIndicators, i].slice(-3)); }}>
                       <option value="" disabled>Indicators ({activeIndicators.length}/3)</option>
                       {INDICATORS.map(ind => <option key={ind.name} value={ind.name}>{ind.name}</option>)}
                    </select>
                  </div>
               </div>

               {/* REAL-TIME OHLC STATUS */}
               <div className="bg-slate-900 rounded-2xl p-4 flex flex-wrap items-center gap-6 text-white shadow-inner font-mono text-xs">
                  <div className="flex items-center gap-2"><span className="text-slate-500 uppercase tracking-widest text-[10px]">Open</span> <strong>${hoveredData?.open.toLocaleString()}</strong></div>
                  <div className="flex items-center gap-2"><span className="text-slate-500 uppercase tracking-widest text-[10px]">High</span> <strong className="text-green-400">${hoveredData?.high.toLocaleString()}</strong></div>
                  <div className="flex items-center gap-2"><span className="text-slate-500 uppercase tracking-widest text-[10px]">Low</span> <strong className="text-red-400">${hoveredData?.low.toLocaleString()}</strong></div>
                  <div className="flex items-center gap-2 border-l border-white/10 pl-6 ml-auto"><span className="text-slate-500 uppercase tracking-widest text-[10px]">Last</span> <strong className={`text-lg ${hoveredData?.close >= hoveredData?.open ? 'text-green-500' : 'text-red-500'}`}>${hoveredData?.close.toLocaleString()}</strong></div>
               </div>
            </div>

            {/* CHART ENGINE */}
            <div className="flex-grow bg-[#0f172a] border-4 border-slate-800 rounded-[2rem] overflow-hidden shadow-inner relative">
              {isReady && data.length > 0 ? (
                <div className="w-full h-full p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                      <CartesianGrid stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="timestamp" stroke="#475569" fontSize={10} fontWeight="bold" tickFormatter={v => new Date(v).toLocaleDateString([], { month: 'short', day: 'numeric' })} />
                      <YAxis yAxisId="price" domain={['auto', 'auto']} stroke="#475569" fontSize={10} fontWeight="black" tickFormatter={v => `$${v.toLocaleString()}`} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      
                      {chartType === 'line' && (
                        <Line yAxisId="price" type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={5} dot={false} isAnimationActive={false} />
                      )}
                      
                      {chartType === 'candle' && (
                        <Bar yAxisId="price" dataKey="candleWick" barSize={16} isAnimationActive={false} shape={renderCandle} />
                      )}

                      {activeIndicators.map((ind, idx) => (
                        <Line key={`ind-${idx}`} yAxisId="price" dataKey={`ind_${idx}`} stroke={INDICATOR_COLORS[idx]} strokeWidth={3} dot={false} isAnimationActive={false} />
                      ))}

                      {showPriceLine && <ReferenceLine yAxisId="price" y={currentPrice} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" />}
                      {trade && <ReferenceLine yAxisId="price" y={trade.entry} stroke="#fff" strokeWidth={3} strokeDasharray="10 5"><Label value="ENTRY" position="insideRight" fill="#fff" fontSize={10} fontWeight="black" /></ReferenceLine>}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                  <RefreshCw className="w-12 h-12 animate-spin text-blue-500" />
                  <p className="font-black text-[10px] uppercase tracking-widest">Re-synchronizing Historical Node...</p>
                </div>
              )}
            </div>

            {/* SITUATIONAL BRIEFING SECTION */}
            <div className="mt-6 bg-slate-900 border-[6px] border-slate-800 rounded-[2rem] p-6 text-white shrink-0">
               <div className="flex items-center justify-between mb-4">
                  <button onClick={async () => { setLoadingBrief(true); try { const r = await generateBriefing(currentCoin); setBriefing(r); } catch(e){} setLoadingBrief(false); }} className="bg-blue-600 px-8 py-4 rounded-xl text-xs font-black uppercase flex items-center gap-3 shadow-lg hover:bg-blue-700 transition-all">
                    {loadingBrief ? <RefreshCw className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4 text-yellow-300" />}
                    Generate Situational Report
                  </button>
                  <div className="hidden md:flex items-center gap-2 opacity-30 text-[10px] font-black uppercase tracking-widest"><Info className="w-4 h-4" /> Expert Analysis Verified</div>
               </div>
               <div className="bg-black/50 rounded-2xl p-6 min-h-[120px] max-h-[180px] overflow-y-auto custom-scrollbar border border-white/5">
                 {!briefing ? (
                   <div className="flex items-center justify-center h-full text-slate-600 font-black uppercase tracking-widest text-[10px]">Awaiting Signal Input</div>
                 ) : (
                   <div className="prose prose-invert max-w-none text-blue-50 font-medium">
                     <ReactMarkdown>{briefing}</ReactMarkdown>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR: AI COACH & POSITION TOOLS */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* SIMULATION COMMAND CARD */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl border-[8px] border-slate-800 relative overflow-hidden shrink-0">
             <div className="relative z-10 flex flex-col gap-6">
                <div>
                   <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Audit Balance</h4>
                   <div className={`text-6xl font-black tracking-tighter leading-none ${trade ? (currentEquity >= 100 ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
                      ${currentEquity.toFixed(2)}
                   </div>
                   {trade && (
                      <div className="flex items-center gap-2 mt-2">
                        {currentEquity >= 100 ? <ArrowUpRight className="w-5 h-5 text-green-400" /> : <ArrowDownRight className="w-5 h-5 text-red-400" />}
                        <span className={`text-lg font-black ${currentEquity >= 100 ? 'text-green-400' : 'text-red-400'}`}>
                          {((currentEquity - 100)).toFixed(1)}% ROI
                        </span>
                      </div>
                   )}
                </div>
                <button onClick={toggleTrade} className={`w-full font-black text-lg py-6 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 border-b-8 ${trade ? 'bg-red-600 border-red-800 hover:bg-red-700' : 'bg-green-600 border-green-800 hover:bg-green-700'}`}>
                   {trade ? <Trash2 className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                   {trade ? "CLOSE AUDIT" : "INITIATE $100 AUDIT"}
                </button>
             </div>
          </div>

          {/* COACH CHAT */}
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-xl overflow-hidden flex flex-col flex-grow">
            <div className="bg-slate-900 p-5 text-white flex items-center gap-4 border-b-8 border-blue-600 shrink-0">
               <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl"><Bot className="w-6 h-6" /></div>
               <h3 className="text-lg font-black tracking-tight uppercase leading-none">Coach Crypto</h3>
            </div>
            
            <div ref={chatRef} className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-50/40 custom-scrollbar">
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-4 rounded-2xl text-base md:text-lg leading-relaxed shadow-sm font-bold border ${m.role === 'user' ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'}`}>
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl border-2 border-slate-100 flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 animate-pulse"><RefreshCw className="w-4 h-4 animate-spin" /> Processing Market Node...</div></div>
              )}
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-3 border-2 border-slate-200 shadow-inner focus-within:border-blue-400 transition-colors">
                <input type="text" className="bg-transparent border-none outline-none w-full text-base font-black text-slate-700 placeholder:text-slate-400" placeholder="Ask your Expert..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleChat()} />
                <button onClick={handleChat} disabled={!chatInput.trim() || isChatLoading} className="text-blue-600 hover:scale-110 transition-transform disabled:opacity-30"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PHASE 2: PERSISTENT SIMULATION JOURNAL */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-4 pb-12 shrink-0">
         <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl border-[8px] border-slate-800 flex flex-col justify-center text-center">
            <div className="bg-blue-600/10 p-6 rounded-[2rem] border-2 border-blue-600/20 mb-6">
              <Wallet className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Simulation Equity</h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-6">Use this portal to test your Revolut strategies. Real price data, zero real risk.</p>
              <div className="text-4xl font-black text-white">${currentEquity.toFixed(2)}</div>
            </div>
         </div>

         <div className="lg:col-span-3 bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-xl flex flex-col min-h-[400px]">
            <div className="p-8 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-xl text-white shadow-md"><History className="w-6 h-6" /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Trade History</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Audit Log for {currentCoin.name}</p>
                  </div>
               </div>
               <button onClick={() => { if(confirm("Clear local journal?")) { setJournal([]); localStorage.removeItem('crypto50_journal'); }}} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
               {journal.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-200 gap-4 opacity-30">
                   <BookOpen className="w-16 h-16" />
                   <p className="font-black uppercase tracking-[0.3em] text-sm">Awaiting Simulation Completion</p>
                 </div>
               ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                        <tr>
                          <th className="pb-4 px-2">Asset Node</th>
                          <th className="pb-4 text-center">Entry Price</th>
                          <th className="pb-4 text-center">Exit Price</th>
                          <th className="pb-4 text-right">Simulation Outcome</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {journal.map(j => (
                          <tr key={j.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="py-6 px-2">
                               <div className="font-black text-slate-900 uppercase leading-none mb-1">{j.name}</div>
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(j.timestamp).toLocaleDateString()}</div>
                            </td>
                            <td className="py-6 text-center font-mono font-bold text-slate-600">${j.entryPrice.toLocaleString()}</td>
                            <td className="py-6 text-center font-mono font-bold text-slate-600">${j.exitPrice.toLocaleString()}</td>
                            <td className="py-6 text-right">
                               <div className={`text-2xl font-black ${j.pnlValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                 {j.pnlValue >= 0 ? '+' : ''}{j.pnlPercent.toFixed(1)}%
                               </div>
                               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                 P&L: ${j.pnlValue.toFixed(2)}
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                 </div>
               )}
            </div>
         </div>
      </div>
      
      {showMeta && <MetaGlassView coin={currentCoin} data={data} activeIndicators={activeIndicators} detectedPatterns={[]} onClose={() => setShowMeta(false)} />}
    </div>
  );
};
