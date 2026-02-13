
import React, { useState, useEffect } from 'react';
import { GeneratedReport, ReportType, Coin } from '../types';
import { COIN_DATA_SEED } from '../constants';
import { AssetIcon } from './AssetIcon';
// Added Sparkles to the lucide-react import
import { Inbox, Search, Trash2, Star, Calendar, ArrowRight, X, Clock, FileText, LayoutGrid, List, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ReportsHub: React.FC = () => {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<ReportType | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const saved = localStorage.getItem('crypto50_reports');
    if (saved) setReports(JSON.parse(saved));
  }, []);

  const deleteReport = (id: string) => {
    if (!confirm("Are you sure you want to delete this intelligence report?")) return;
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('crypto50_reports', JSON.stringify(updated));
    if (selectedReport?.id === id) setSelectedReport(null);
  };

  const toggleFavorite = (id: string) => {
    const updated = reports.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r);
    setReports(updated);
    localStorage.setItem('crypto50_reports', JSON.stringify(updated));
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.assetName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || r.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getBadgeStyle = (type: ReportType) => {
    switch (type) {
      case 'D': return "bg-blue-100 text-blue-700 border-blue-200";
      case 'W': return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case 'M': return "bg-purple-100 text-purple-700 border-purple-200";
    }
  };

  const getLabel = (type: ReportType) => {
    switch (type) {
      case 'D': return "Daily Flash";
      case 'W': return "Weekly Deep Dive";
      case 'M': return "Monthly Outlook";
    }
  };

  const getCoinObj = (symbol: string): Coin => {
    return COIN_DATA_SEED.find(c => c.symbol === symbol) || { symbol, name: symbol, category: 'Unknown', price: 0, change24h: 0, volatility: 1 as any };
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-32 font-sans animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2 flex items-center gap-4">
            <Inbox className="w-10 h-10 md:w-16 md:h-16 text-blue-600" /> Intelligence <span className="text-blue-600">Hub</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium max-w-xl">Your personal repository of AI-generated market research and tactical situational reports.</p>
        </div>

        <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}><LayoutGrid className="w-5 h-5" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}><List className="w-5 h-5" /></button>
            </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          <input 
            type="text" 
            placeholder="Search by asset name or ticker..." 
            className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-xl font-bold shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="lg:col-span-2 flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {['ALL', 'D', 'W', 'M'].map(t => (
                <button 
                  key={t}
                  onClick={() => setFilter(t as any)}
                  className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${filter === t ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400'}`}
                >
                  {t === 'ALL' ? 'Everything' : getLabel(t as ReportType)}
                </button>
            ))}
        </div>
      </div>

      {/* REPORTS DISPLAY */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
          <FileText className="w-24 h-24 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Inbox is Empty</h3>
          <p className="text-slate-400 font-bold mt-2">Generate your first report from the Market page to populate your hub.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
          {filteredReports.map((report) => (
            <div 
              key={report.id} 
              className={`bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-xl overflow-hidden hover:border-blue-400 transition-all group flex ${viewMode === 'list' ? 'flex-row items-center p-4' : 'flex-col'}`}
            >
              <div className={`${viewMode === 'list' ? 'w-20 shrink-0' : 'p-8 pb-4'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-4 py-1.5 rounded-full border-2 text-[10px] font-black uppercase tracking-widest ${getBadgeStyle(report.type)}`}>
                    {report.type}
                  </div>
                  {viewMode === 'grid' && (
                    <button onClick={() => toggleFavorite(report.id)} className={`p-2 rounded-full transition-colors ${report.isFavorite ? 'text-yellow-500 bg-yellow-50' : 'text-slate-300 hover:text-yellow-400'}`}>
                      <Star className={`w-5 h-5 ${report.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                   <AssetIcon coin={getCoinObj(report.symbol)} size="sm" />
                   <div>
                      <h4 className="text-xl font-black text-slate-900 leading-none mb-1">{report.assetName}</h4>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{report.symbol} • Intelligence</p>
                   </div>
                </div>
              </div>

              {viewMode === 'grid' && (
                <div className="px-8 py-6 flex-grow">
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-medium">
                    {report.content.substring(0, 180)}...
                  </p>
                </div>
              )}

              <div className={`p-8 pt-0 flex items-center justify-between ${viewMode === 'list' ? 'flex-grow border-l-2 border-slate-100 ml-6 pl-6' : ''}`}>
                 <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <Clock className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">{new Date(report.timestamp).toLocaleDateString()}</span>
                    </div>
                    {viewMode === 'list' && (
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{getLabel(report.type)}</div>
                    )}
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={() => deleteReport(report.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    <button 
                        onClick={() => setSelectedReport(report)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest text-[10px]"
                    >
                        Read Full <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* READ MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border-8 border-slate-50">
            <div className="p-8 border-b-2 border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-5">
                <AssetIcon coin={getCoinObj(selectedReport.symbol)} size="md" />
                <div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedReport.assetName} Intelligence</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className={`px-3 py-1 rounded-full border-2 text-[8px] font-black uppercase tracking-widest ${getBadgeStyle(selectedReport.type)}`}>
                        {getLabel(selectedReport.type)}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(selectedReport.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-4 hover:bg-slate-100 rounded-full transition-colors"><X className="w-8 h-8" /></button>
            </div>
            <div className="flex-grow p-10 overflow-y-auto bg-white custom-scrollbar">
                <div className="prose prose-slate prose-xl max-w-none">
                  <ReactMarkdown>{selectedReport.content}</ReactMarkdown>
                </div>
                
                <div className="mt-16 pt-8 border-t-2 border-slate-100 flex flex-col items-center">
                    <Sparkles className="w-12 h-12 text-blue-100 mb-4" />
                    <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest max-w-xs leading-relaxed">
                        This briefing was generated by Crypto50 Intelligence Engine. The "Science vs Gamble" methodology is applied to all reports.
                    </p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
