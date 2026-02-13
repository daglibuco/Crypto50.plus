
import React, { useState, useMemo } from 'react';
import { INDICATORS, PATTERN_DEFINITIONS, BASIC_VOCABULARY } from '../constants';
import { BookOpen, Scan, GraduationCap, Search, X } from 'lucide-react';

interface GlossaryItem {
  name: string;
  summary: string;
  type: 'Vocabulary' | 'Indicator' | 'Pattern';
}

const ALPHABET = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

export const Glossary: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState("");

  const allItems: GlossaryItem[] = useMemo(() => {
    const vocab = BASIC_VOCABULARY.map(i => ({ ...i, type: 'Vocabulary' } as GlossaryItem));
    const inds = INDICATORS.map(i => ({ ...i, type: 'Indicator' } as GlossaryItem));
    const patterns = Object.entries(PATTERN_DEFINITIONS).map(([k, v]) => ({ name: k, summary: v, type: 'Pattern' } as GlossaryItem));
    
    return [...vocab, ...inds, ...patterns].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.summary.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesLetter = true;
      if (selectedLetter !== 'ALL') {
        const firstChar = item.name.charAt(0).toUpperCase();
        if (selectedLetter === '#') {
          matchesLetter = !isNaN(parseInt(firstChar));
        } else {
          matchesLetter = firstChar === selectedLetter;
        }
      }
      return matchesSearch && matchesLetter;
    });
  }, [allItems, selectedLetter, searchTerm]);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'Vocabulary': return { color: 'bg-green-100 text-green-700', icon: <GraduationCap className="w-5 h-5" />, label: 'Basic Term' };
      case 'Indicator': return { color: 'bg-blue-100 text-blue-700', icon: <BookOpen className="w-5 h-5" />, label: 'Chart Indicator' };
      case 'Pattern': return { color: 'bg-indigo-100 text-indigo-700', icon: <Scan className="w-5 h-5" />, label: 'Chart Pattern' };
      default: return { color: 'bg-slate-100 text-slate-700', icon: <BookOpen className="w-5 h-5" />, label: 'Term' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 uppercase tracking-tighter">Crypto Dictionary</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
          Plain-English definitions for everything from basic vocabulary to professional chart indicators.
        </p>
      </div>

      <div className="sticky top-20 z-30 bg-slate-50/95 backdrop-blur-sm pt-2 pb-6 border-b border-slate-200 mb-8">
        <div className="max-w-md mx-auto mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search terms..." 
            className="w-full pl-12 pr-10 py-4 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none shadow-sm text-lg font-bold"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if(e.target.value) setSelectedLetter('ALL');
            }}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
          <button
            onClick={() => setSelectedLetter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${selectedLetter === 'ALL' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-slate-500 hover:bg-blue-50 border-2 border-slate-200'}`}
          >
            ALL
          </button>
          {ALPHABET.map(char => (
            <button
              key={char}
              onClick={() => {
                setSelectedLetter(char);
                setSearchTerm("");
              }}
              className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-xl text-xs font-black transition-all ${selectedLetter === char ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-white text-slate-600 hover:bg-blue-50 border-2 border-slate-200'}`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold">No definitions match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item, idx) => {
              const style = getTypeStyles(item.type);
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-100 hover:border-blue-200 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-start gap-5">
                    <div className={`p-4 rounded-2xl inline-flex items-center justify-center h-fit ${style.color}`}>
                        {style.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight">
                          {item.name}
                        </h3>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${style.color}`}>
                            {style.label}
                        </span>
                      </div>
                      <p className="text-slate-600 text-lg leading-relaxed font-medium">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
