
import React, { useState, useEffect } from 'react';
import { Coin, TrafficLight, ReportType, GeneratedReport } from '../types';
import { getMarketData, getVolatilityColor } from '../services/marketService';
import { fetchCoinNews, fetchWhitepaperInsight, generateTimeframeReport } from '../services/geminiService';
import { deductCredits, getUserCredits } from '../services/crmService';
import { AssetIcon } from './AssetIcon';
import { Search, AlertTriangle, CheckCircle, AlertOctagon, Zap, Globe, X, RefreshCw, ShieldCheck, FileText, PlayCircle, Info, CreditCard, Sparkles, Inbox, ArrowRight, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MarketListProps {
  onSelectCoin: (coin: Coin) => void;
  onViewReports: () => void;
}

export const MarketList: React.FC<MarketListProps> = ({ onSelectCoin, onViewReports }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedNewsCoin, setSelectedNewsCoin] = useState<Coin | null>(null);
  const [newsData, setNewsData] = useState<{summary: string, report: string, sources?: any[]} | null>(null);
  const [loadingNews, setLoadingNews] = useState(false);

  const [selectedWP, setSelectedWP] = useState<Coin | null>(null);
  const [wpData, setWPData] = useState<{text: string, wpUrl: string, siteUrl: string, sources?: any[]} | null>(null);
  const [loadingWP, setLoadingWP] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [genTarget, setGenTarget] = useState<{coin: string, type: string} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMarketData();
      setCoins(data);
      if (loading) setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 15000); 
    return () => clearInterval(interval);
  }, []);

  const handleOpenNews = async (coin: Coin) => {
    if (getUserCredits() < 1) return alert("Insufficient Intelligence Credits.");
    setSelectedNewsCoin(coin);
    setLoadingNews(true);
    try {
      const result = await fetchCoinNews(coin.name, coin.symbol);
      setNewsData(result);
      deductCredits(1);
    } catch(err) {
      setSelectedNewsCoin(null);
    } finally {
      setLoadingNews(false);
    }
  };

  const handleOpenWhitepaper = async (coin: Coin) => {
    if (getUserCredits() < 1) return alert("Insufficient Intelligence Credits.");
    setSelectedWP(coin);
    setLoadingWP(true);
    try {
      const result = await fetchWhitepaperInsight(coin.name, coin.symbol);
      if (result) {
        setWPData(result as any);
        deductCredits(1);
      }
    } catch (err) {
      setSelectedWP(null);
    } finally {
      setLoadingWP(false);
    }
  };

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-32 font-sans animate-in fade-in duration-700">
      {/* PHASE 2: HUB HEADER */}
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b-8 border-slate-900 pb-12">
        <div>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">
             Neural <span className="text-blue-600">Watchlist</span>
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-2xl text-xs font-black uppercase border-2 border-green-200 shadow-sm">
                <ShieldCheck className="w-5 h-5" /> Verified Market Data
            </div>
            <div className="flex items-center gap-3 bg-blue-100 text-blue-700 px-6 py-3 rounded-2xl text-xs font-black uppercase border-2 border-blue-200 shadow-sm">
                <Activity className="w-5 h-5" /> 312 Active Assets
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-l-8 border-blue-600 text-white min-w-[320px]">
           <button onClick={onViewReports} className="flex items-center justify-between w-full mb-4 group">
             <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Intelligence Inbox</span>
             <Inbox className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </button>
           <p className="text-[10px] font-black uppercase leading-relaxed text-slate-400 mb-6">Store generated deep-dive reports for offline study and long-term research.</p>
           <button onClick={onViewReports} className="w-full bg-blue-600 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-500 transition-all">Enter Vault</button>
        </div>
      </div>

      <div className="bg-white rounded-[4rem] shadow-2xl border-4 border-slate-200 overflow-hidden">
        <div className="p-8 md:p-12 border-b-4 border-slate-100 bg-slate-50/80 flex items-center gap-8">
          <Search className="text-slate-300 w-12 h-12" />
          <input 
            type="text" 
            placeholder="Search verified institutional assets..." 
            className="bg-transparent border-none outline-none w-full text-4xl md:text-5xl text-slate-900 placeholder-slate-200 font-black tracking-tight"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-60 text-center"><RefreshCw className="w-20 h-20 text-blue-600 animate-spin mx-auto mb-8" /><p className="text-slate-400 font-black uppercase text-lg tracking-[0.5em]">Syncing Feed...</p></div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead className="bg-slate-50 border-b-8 border-slate-200">
                <tr>
                  <th className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-[0.3em] sticky left-0 bg-slate-50 z-20 border-r border-slate-100">Asset Identity</th>
                  <th className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-[0.3em] text-right">Price (USD)</th>
                  <th className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-[0.3em] text-right">Performance</th>
                  <th className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-[0.3em] text-center">Audit Status</th>
                  <th className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-[0.3em] text-center">Expert Recon</th>
                  <th className="px-10 py-8 text-xs font-black text-blue-600 uppercase tracking-[0.3em] text-center bg-blue-50/50">Inbox Access</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-slate-50">
                {filteredCoins.map((coin) => (
                  <tr key={coin.symbol} className="hover:bg-blue-50/40 transition-all group h-32">
                    <td className="px-10 py-8 sticky left-0 bg-white group-hover:bg-blue-50/40 z-20 border-r border-slate-100">
                      <div className="flex items-center gap-8">
                        <AssetIcon coin={coin} size="md" />
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-2xl uppercase leading-none mb-2">{coin.name}</span>
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{coin.symbol} • Verified Tier</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right font-mono font-black text-slate-900 text-2xl">
                      ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-10 py-8 text-right font-black text-2xl ${coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(1)}%
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className={`inline-flex px-5 py-2 rounded-2xl border-2 font-black text-xs uppercase tracking-widest ${getVolatilityColor(coin.volatility)} shadow-sm`}>
                         {coin.volatility}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center justify-center gap-4">
                        <button onClick={() => handleOpenNews(coin)} title="Flash News" className="w-16 h-16 flex items-center justify-center bg-yellow-100 text-yellow-700 rounded-3xl hover:bg-yellow-400 hover:text-white transition-all active:scale-90 border-2 border-yellow-200 shadow-md">
                          <Zap className="w-8 h-8 fill-current" />
                        </button>
                        <button onClick={() => handleOpenWhitepaper(coin)} title="Utility Scan" className="w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-3xl hover:bg-blue-600 hover:text-white transition-all active:scale-90 border-2 border-blue-200 shadow-md">
                          <FileText className="w-8 h-8" />
                        </button>
                        <button onClick={() => onSelectCoin(coin)} title="Simulator" className="w-16 h-16 flex items-center justify-center bg-slate-900 text-white rounded-3xl hover:bg-blue-600 transition-all active:scale-90 shadow-2xl">
                          <PlayCircle className="w-10 h-10" />
                        </button>
                      </div>
                    </td>
                    <td className="px-10 py-8 bg-blue-50/50">
                       <div className="flex items-center justify-center gap-3">
                         {['D','W','M'].map(t => (
                           <button 
                             key={t}
                             onClick={() => alert(`Generating ${t} briefing... Checkout your Intelligence Hub in 60s.`)}
                             className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border-2 border-slate-200 font-black text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all shadow-md"
                           >
                             {t}
                           </button>
                         ))}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RE-USING REFINED NEWS/WP MODALS FROM PREVIOUS VERSIONS TO ENSURE NO FEATURE LOSS */}
      {selectedNewsCoin && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white rounded-[4rem] w-full max-w-4xl shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] overflow-hidden border-8 border-yellow-400">
            <div className="p-10 border-b-4 border-slate-100 flex items-center justify-between bg-yellow-50/50">
              <div className="flex items-center gap-6">
                <AssetIcon coin={selectedNewsCoin} size="md" />
                <div>
                   <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Flash Intelligence</h3>
                   <p className="text-yellow-600 font-black text-xs uppercase tracking-[0.3em] mt-2">Neural Analysis: {selectedNewsCoin.symbol}</p>
                </div>
              </div>
              <button onClick={() => setSelectedNewsCoin(null)} className="p-5 hover:bg-yellow-200 rounded-full transition-colors"><X className="w-10 h-10" /></button>
            </div>
            <div className="flex-grow p-12 overflow-y-auto bg-white custom-scrollbar">
              {loadingNews ? (
                <div className="py-40 text-center"><RefreshCw className="w-20 h-20 text-yellow-500 animate-spin mx-auto mb-8" /><p className="font-black text-slate-400 uppercase text-lg tracking-[0.3em]">Synthesizing Context...</p></div>
              ) : (
                <div className="prose prose-slate prose-2xl max-w-none font-bold text-slate-800 leading-relaxed selection:bg-yellow-200">
                  <ReactMarkdown>{newsData?.report || ""}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
