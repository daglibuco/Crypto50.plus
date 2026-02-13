import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Search, Sparkles, AlertCircle } from 'lucide-react';
import { analyzeChartImage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // Assuming react-markdown availability or simple text rendering

export const UploadAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (JPG or PNG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      // Strip prefix for API if needed, but Gemini usually takes full base64 data url or raw base64. 
      // The GenAI SDK usually expects raw base64 string without "data:image/xyz;base64," prefix for inlineData
      const rawBase64 = base64.split(',')[1];
      setImage(rawBase64);
      setResult(null); // Clear previous results
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerAnalysis = async () => {
    if (!image) return;
    setAnalyzing(true);
    const analysisText = await analyzeChartImage(image);
    setResult(analysisText);
    setAnalyzing(false);
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
          <Sparkles className="text-blue-600 w-8 h-8" />
          AI Chart Analyzer
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload a screenshot of any crypto chart. Our AI Expert (Gemini 3 Pro) will analyze the trends, patterns, and safety levels for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT: Upload Zone */}
        <div className="space-y-6">
          <div 
            className={`border-4 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all h-96 ${image ? 'border-blue-200 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer'}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !image && fileInputRef.current?.click()}
          >
            {image ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={`data:image/jpeg;base64,${image}`} 
                  alt="Uploaded Chart" 
                  className="max-h-full max-w-full rounded-xl shadow-lg object-contain"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); clearImage(); }}
                  className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="pointer-events-none">
                <div className="bg-blue-100 p-6 rounded-full inline-block mb-4">
                  <UploadCloud className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Click or Drag Image Here</h3>
                <p className="text-slate-500">Supports JPG, PNG screenshots</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>

          {image && !analyzing && !result && (
            <button 
              onClick={triggerAnalysis}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-3"
            >
              <Search className="w-6 h-6" />
              Analyze Chart Now
            </button>
          )}

          {analyzing && (
            <div className="w-full py-6 bg-slate-100 text-slate-500 font-bold text-lg rounded-xl flex items-center justify-center gap-3 animate-pulse border border-slate-200">
              <Sparkles className="w-6 h-6 animate-spin text-purple-500" />
              AI is studying your chart...
            </div>
          )}
        </div>

        {/* RIGHT: Results Zone */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 h-full min-h-[400px]">
          <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
            <ImageIcon className="text-slate-400 w-5 h-5" />
            Analysis Results
          </h3>

          {!result ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
              <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
              <p>Upload a chart to see the expert breakdown here.</p>
            </div>
          ) : (
            <div className="prose prose-slate prose-lg max-w-none">
               {/* Simple Markdown Rendering Fallback if no library */}
               {result.split('\n').map((line, idx) => {
                 if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-bold text-blue-800 mt-4 mb-2">{line.replace('## ', '')}</h2>;
                 if (line.startsWith('### ')) return <h3 key={idx} className="text-lg font-bold text-slate-800 mt-3 mb-1">{line.replace('### ', '')}</h3>;
                 if (line.startsWith('* ') || line.startsWith('- ')) return <li key={idx} className="ml-4 text-slate-600 mb-1">{line.replace(/[*|-] /, '')}</li>;
                 if (line.trim() === '') return <br key={idx} />;
                 return <p key={idx} className="text-slate-600 mb-2 leading-relaxed">{line}</p>;
               })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};