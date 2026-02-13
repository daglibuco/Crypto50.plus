
import React, { useState, useEffect } from 'react';
import { Coin, WhisperStrategy, WhisperSignal, IndicatorDefinition } from '../types';
import { COIN_DATA_SEED, INDICATORS, PATTERN_DEFINITIONS } from '../constants';
import { generateWhisperSignal, fetchCoinNews } from '../services/geminiService';
import { getHistoricalData, detectPatterns } from '../services/marketService';
import { AssetIcon } from './AssetIcon';
import { 
  Zap, Shield, Target, TrendingUp, TrendingDown, RefreshCw, 
  Save, Trash2, Search, Info, Sparkles, Newspaper, BrainCircuit,
  Settings2, ChevronRight, CheckCircle2, AlertTriangle, Circle, CheckCircle, Scan, MousePointer2, Microscope
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const Whisper: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<Coin>(COIN_DATA_SEED[0]);
  const [strategy, setStrategy] = useState<WhisperStrategy>({
    symbol: COIN_DATA_SEED[0].symbol,
    riskLevel: 'Conservative',
    horizon: 'Long-term',
    preferredIndicators: ['RSI - Relative Strength Index (14 days)', 'Moving Average Simple (200 days)'],
    preferredPatterns: ['Bullish Engulfing', 'Hammer']
  });
  const [loading, setLoading] = useState(false);
  const [signal, setSignal] = useState<WhisperSignal | null>(null);
  const [news, setNews] = useState<string>("");
  const [savedStrategies, setSavedStrategies] = useState<WhisperStrategy[]>(() => {
    const saved = localStorage.getItem('crypto50_whisper_strategies');
    return saved ? JSON.parse(saved) : [];
  });

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const newsResult = await fetchCoinNews(selectedCoin.name, selectedCoin.symbol);
      setNews(newsResult.summary);
      const history = getHistoricalData(selectedCoin.symbol, '1M', []);
      const whisper = await generateWhisperSignal(selectedCoin, strategy, history, newsResult.summary);
      setSignal(whisper);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentStrategy = () => {
    const updated = [...savedStrategies.filter(s => s.symbol !== strategy.symbol), strategy];
    setSavedStrategies(updated);
    localStorage.setItem('crypto50_whisper_strategies', JSON.stringify(updated));
    alert(`Strategy for ${strategy.symbol} saved!`);
  };

  const removeStrategy = (symbol: string) => {
    const updated = savedStrategies.filter(s => s.symbol !== symbol);
    setSavedStrategies(updated);
    localStorage.setItem('crypto50_whisper_strategies', JSON.stringify(updated));
  };

  const loadStrategy = (s: WhisperStrategy) => {
    setStrategy(s);
    const coin = COIN_DATA_SEED.find(c => c.symbol === s.symbol);
    if (coin) setSelectedCoin(coin);
    setSignal(null);
  };

  const toggleIndicator = (name: string) => {
    setStrategy(prev => ({
      ...prev,
      preferredIndicators: prev.preferredIndicators.includes(name) 
        ? prev.preferredIndicators.filter(i => i !== name) 
        : [...prev.preferredIndicators.slice(-2), name]
    }));
  };

  const togglePattern = (name: string) => {
    setStrategy(prev => ({
      ...prev,
      preferredPatterns: prev.preferredPatterns.includes(name) 
        ? prev.preferredPatterns.filter(p => p !== name) 
        : [...prev.preferredPatterns.slice(-2), name]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 font-sans animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT PANEL: CONFIGURATION */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Settings2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Whisper Settings</h2>
                  <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">Neural Strategy Engine</p>
                </div>
              </div>
              <Microscope className="w-6 h-6 text-blue-500/50" />
            </div>
            
            <div className="p-6 space-y-8">
              {/* Coin Select */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3">Target Asset</label>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
                   <AssetIcon coin={selectedCoin} size="sm" />
                   <div className="flex-grow">
                      <select 
                        className="w-full bg-transparent font-black text-slate-800 outline-none appearance-none"
                        value={selectedCoin.symbol}
                        onChange={(e) => {
                          const c = COIN_DATA_SEED.find(coin => coin.symbol === e.target.value);
                          if (c) {
                            setSelectedCoin(c);
                            setStrategy(prev => ({ ...prev, symbol: c.symbol }));
                          }
                        }}
                      >
                        {COIN_DATA_SEED.slice(0, 50).map(c => (
                          <option key={c.symbol} value={c.symbol}>{c.name} ({c.symbol})</option>
                        ))}
                      </select>
                   </div>
                   <ChevronRight className="w-5 h-5 text-slate-300 rotate-90" />
                </div>
              </div>

              {/* Strategy Lens */}
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3">Risk Sensitivity</label>
                  <div className="flex flex-col gap-2">
                    {['Conservative', 'Aggressive'].map(level => (
                      <button 
                        key={level}
                        onClick={() => setStrategy({...strategy, riskLevel: level as any})}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${strategy.riskLevel === level ? 'bg-blue-50 border-blue-600' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                      >
                        <span className={`font-black text-sm ${strategy.riskLevel === level ? 'text-blue-700' : 'text-slate-600'}`}>{level}</span>
                        {strategy.riskLevel === level ? <CheckCircle className="w-5 h-5 text-blue-600" /> : <Circle className="w-5 h-5 text-slate-200" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3">Neural Pattern Hunt (Max 3)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(PATTERN_DEFINITIONS).slice(0, 10).map(p => (
                      <button 
                        key={p}
                        onClick={() => togglePattern(p)}
                        className={`px-3 py-2.5 rounded-xl text-[9px] font-black border-2 transition-all text-left flex items-center justify-between ${strategy.preferredPatterns.includes(p) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-400'}`}
                      >
                        {p}
                        {strategy.preferredPatterns.includes(p) && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3">Indicator Verification</label>
                  <div className="flex flex-wrap gap-2">
                    {INDICATORS.slice(0, 12).map(ind => (
                      <button 
                        key={ind.name}
                        onClick={() => toggleIndicator(ind.name)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black border-2 transition-all ${strategy.preferredIndicators.includes(ind.name) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-500 border-slate-100 hover:border-blue-400'}`}
                      >
                        {ind.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-slate-100 flex gap-4">
                <button 
                  onClick={runAnalysis}
                  disabled={loading}
                  className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                >
                  {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5 fill-current" />}
                  {loading ? "SYNTHESIZING..." : "GENERATE SIGNAL"}
                </button>
                <button onClick={saveCurrentStrategy} className="p-4 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-2xl border-2 border-transparent hover:border-slate-300">
                  <Save className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* LIVE RECON MODULE */}
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white border border-white/10 shadow-2xl">
             <div className="flex items-center gap-3 mb-6">
                <Scan className="w-6 h-6 text-blue-400" />
                <h3 className="text-sm font-black uppercase tracking-widest">Active Neural Scan</h3>
             </div>
             <div className="space-y-4">
                {strategy.preferredPatterns.map(p => (
                   <div key={p} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                      <span className="text-[10px] font-bold text-slate-300 uppercase">{p}</span>
                      <div className="flex gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* RIGHT PANEL: OUTPUT */}
        <div className="flex-grow space-y-8">
          
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
            {!signal && !loading ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
                <div className="bg-blue-50 p-12 rounded-[3rem] mb-6 border-4 border-dashed border-blue-100">
                  <BrainCircuit className="w-24 h-24 text-blue-600 opacity-20" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Node Awaiting Input</h3>
                <p className="text-slate-500 text-lg max-w-sm font-medium">Select your asset and preferred pattern lens on the left to activate the Whisper node.</p>
              </div>
            ) : loading ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
                <div className="relative">
                  <div className="w-40 h-40 border-[16px] border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-blue-400 animate-pulse" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mt-12 mb-2 uppercase tracking-tighter">Scanning Structure...</h3>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em] animate-pulse">Neural engine verifying {strategy.preferredIndicators.length} technical nodes</p>
              </div>
            ) : signal && (
              <>
                <div className={`p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12 ${signal.direction === 'LONG' ? 'bg-gradient-to-br from-green-600 to-emerald-700' : signal.direction === 'SHORT' ? 'bg-gradient-to-br from-red-600 to-rose-700' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
                  <div className="text-center md:text-left flex-grow">
                    <div className="flex items-center gap-3 mb-4 opacity-70">
                      <AssetIcon coin={selectedCoin} size="sm" className="bg-white/10" />
                      <span className="text-xs font-black uppercase tracking-widest">{selectedCoin.name} Analysis Finalized</span>
                    </div>
                    <h2 className="text-8xl font-black tracking-tighter mb-4 leading-none flex items-center justify-center md:justify-start gap-6">
                      {signal.direction === 'LONG' ? 'LONG' : signal.direction === 'SHORT' ? 'SHORT' : 'NEUTRAL'}
                      <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                        {signal.direction === 'LONG' ? <TrendingUp className="w-16 h-16" /> : signal.direction === 'SHORT' ? <TrendingDown className="w-16 h-16" /> : <Shield className="w-16 h-16" />}
                      </div>
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 px-6 py-2 rounded-full backdrop-blur-md text-sm font-black uppercase tracking-widest border border-white/20">
                        Node Confidence: {signal.confidence}%
                      </div>
                    </div>
                  </div>

                  <div className="relative w-56 h-56 bg-white/10 rounded-full border-[12px] border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-2xl group">
                    <div className="text-center transform group-hover:scale-110 transition-transform">
                       <div className="text-6xl font-black leading-none">{signal.confidence}%</div>
                       <div className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em] mt-2">Verified</div>
                    </div>
                  </div>
                </div>

                <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <div className="bg-slate-900 rounded-[3rem] p-10 border-4 border-blue-500 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><Zap className="w-20 h-20 text-yellow-400" /></div>
                      <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                        <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">Neural Consensus</h4>
                      </div>
                      <div className={`text-5xl font-black mb-6 leading-[0.9] tracking-tight ${signal.direction === 'LONG' ? 'text-green-400' : signal.direction === 'SHORT' ? 'text-red-400' : 'text-slate-200'}`}>
                        {signal.simpleRecommendation}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                         <BrainCircuit className="w-8 h-8 text-blue-600" />
                         <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Expert Reasoning</h4>
                      </div>
                      <p className="text-3xl text-slate-800 leading-tight font-black tracking-tight">{signal.reasoning}</p>
                      
                      <div className="grid grid-cols-2 gap-6 pt-6">
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-100">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Chart Health</div>
                          <div className="text-5xl font-black text-blue-600 leading-none mb-4">{signal.techScore}<span className="text-lg opacity-30">/100</span></div>
                          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${signal.techScore}%` }}></div>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-100">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">News Flow</div>
                          <div className="text-5xl font-black text-indigo-600 leading-none mb-4">{signal.newsScore}<span className="text-lg opacity-30">/100</span></div>
                          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${signal.newsScore}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 rounded-[3rem] p-12 border-2 border-blue-100 h-fit sticky top-24">
                    <div className="flex items-center gap-3 mb-8">
                       <Newspaper className="w-8 h-8 text-blue-600" />
                       <h4 className="text-sm font-black text-blue-500 uppercase tracking-[0.3em]">Situational Intel</h4>
                    </div>
                    <div className="prose prose-lg prose-slate font-medium text-slate-700 leading-relaxed italic">
                      <ReactMarkdown>{news}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
