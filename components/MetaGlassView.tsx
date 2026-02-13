
import React, { useMemo, useState } from 'react';
import { Coin, TrafficLight, IndicatorDefinition } from '../types';
import { generateMetaGlassData, generateWhisperString, playWhisperAudio, analyzeTechnicalData } from '../services/metaService';
import { X, Headphones, Glasses, Activity, Layers } from 'lucide-react';
import { 
    LineChart, Line, ComposedChart, Bar, Cell,
    XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine, Label
} from 'recharts';

interface MetaGlassViewProps {
    coin: Coin;
    data: any[];
    activeIndicators: IndicatorDefinition[];
    detectedPatterns: string[];
    onClose: () => void;
}

const NEON_COLORS = ["#00ffff", "#ff00ff", "#ffff00"];

export const MetaGlassView: React.FC<MetaGlassViewProps> = ({ coin, data, activeIndicators, detectedPatterns, onClose }) => {
    const [chartType, setChartType] = useState<'line' | 'candle'>('line');
    const [showFib, setShowFib] = useState(false);
    
    const coinData = generateMetaGlassData(coin);
    const technicalSignals = useMemo(() => analyzeTechnicalData(data, activeIndicators, detectedPatterns), [data, activeIndicators, detectedPatterns]);

    const handleWhisper = () => {
        const text = generateWhisperString(coin, technicalSignals);
        playWhisperAudio(text);
    };

    const getStatusColor = (s: TrafficLight) => {
        if (s === TrafficLight.GREEN) return "text-green-500 border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]";
        if (s === TrafficLight.YELLOW) return "text-yellow-400 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.3)]";
        return "text-red-600 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)]";
    };

    const getStatusBg = (s: TrafficLight) => {
        if (s === TrafficLight.GREEN) return "bg-green-950/30";
        if (s === TrafficLight.YELLOW) return "bg-yellow-950/30";
        return "bg-red-950/30";
    };

    const getChartHexColor = (s: TrafficLight) => {
        if (s === TrafficLight.GREEN) return "#22c55e";
        if (s === TrafficLight.YELLOW) return "#facc15";
        return "#dc2626";
    };

    const renderIndicatorLines = (ind: IndicatorDefinition, idx: number) => {
        if (ind.name.toLowerCase().includes('rsi')) return null;
        const color = NEON_COLORS[idx % NEON_COLORS.length];
        return (
            <Line 
                key={ind.name}
                name={ind.name} 
                type="monotone" 
                dataKey={`ind_${idx}`} 
                stroke={color} 
                strokeWidth={4} 
                isAnimationActive={false} 
                dot={false}
            />
        );
    };

    const fibLevels = useMemo(() => {
        if (!data || data.length === 0 || !showFib) return null;
        const highs = data.map(d => d.high);
        const lows = data.map(d => d.low);
        const max = Math.max(...highs);
        const min = Math.min(...lows);
        const diff = max - min;
        return [
            { level: 0, price: max, label: '0%', color: '#94a3b8' },
            { level: 0.618, price: max - (diff * 0.618), label: '61.8%', color: '#eab308' },
            { level: 1, price: min, label: '100%', color: '#94a3b8' },
        ];
    }, [data, showFib]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-start p-4 text-center font-mono overflow-y-auto">
            <button onClick={onClose} className="fixed top-4 right-4 text-white/50 hover:text-white transition-colors bg-white/10 p-3 rounded-full z-[110]"><X className="w-8 h-8" /></button>
            <div className="fixed top-4 left-4 flex items-center gap-3 text-white/60 uppercase font-mono tracking-[0.2em] text-[10px] bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md z-[110]"><Glasses className="w-4 h-4" /><span>Neural View</span></div>

            <div className="max-w-7xl w-full flex flex-col items-center gap-6 md:gap-8 mt-16 pb-24">
                <div className={`border-[6px] md:border-[8px] ${getStatusColor(coin.volatility)} ${getStatusBg(coin.volatility)} p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] w-full`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                        <div className="text-left">
                            <h1 className="text-white text-4xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-2">{coinData.name}</h1>
                            <div className="text-white text-3xl md:text-6xl font-bold tracking-tight">{coinData.price}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-white/20 pt-6 lg:pt-0 lg:pl-8">
                             <div className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Risk Gauge</div>
                             <div className={`text-5xl md:text-8xl font-black uppercase tracking-widest ${getStatusColor(coin.volatility).split(' ')[0]}`}>{coinData.statusText}</div>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-[#0a0a0a] border-[4px] border-white/20 rounded-[2rem] p-4 md:p-8 relative min-h-[450px] md:min-h-[600px] flex flex-col shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-2 text-white/80 uppercase tracking-[0.2em] font-black text-xs"><Activity className="w-4 h-4" /> Real-Time Signal Matrix</div>
                        <div className="flex gap-2">
                            <div className="flex bg-white/10 rounded-lg p-1">
                                <button onClick={() => setChartType('line')} className={`px-4 py-1.5 rounded font-black text-[10px] uppercase ${chartType === 'line' ? 'bg-white text-black' : 'text-white/50'}`}>Line</button>
                                <button onClick={() => setChartType('candle')} className={`px-4 py-1.5 rounded font-black text-[10px] uppercase ${chartType === 'candle' ? 'bg-white text-black' : 'text-white/50'}`}>Candle</button>
                            </div>
                            <button onClick={() => setShowFib(!showFib)} className={`px-5 py-1.5 rounded-lg text-[10px] font-black border-4 ${showFib ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/10 text-white/50 border-white/20'}`}>FIB</button>
                        </div>
                    </div>
                    
                    <div className="flex-grow w-full h-[350px] md:h-[500px]">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'line' ? (
                                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                    <CartesianGrid stroke="#222" vertical={false} />
                                    <XAxis dataKey="time" stroke="#fff" tick={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }} />
                                    <YAxis domain={['auto', 'auto']} stroke="#fff" tick={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }} width={70} />
                                    <Tooltip contentStyle={{ background: '#000', border: '2px solid #fff', borderRadius: '1rem', color: '#fff' }} />
                                    <Line type="monotone" dataKey="close" stroke={getChartHexColor(coin.volatility)} strokeWidth={10} dot={false} isAnimationActive={false} />
                                    {activeIndicators.map((ind, idx) => renderIndicatorLines(ind, idx))}
                                </LineChart>
                            ) : (
                                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                    <CartesianGrid stroke="#222" vertical={false} />
                                    <XAxis xAxisId={0} dataKey="time" hide />
                                    <XAxis xAxisId={1} dataKey="time" stroke="#fff" tick={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }} />
                                    <YAxis domain={['auto', 'auto']} stroke="#fff" tick={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }} width={70} />
                                    <Bar xAxisId={1} dataKey={(d) => [d.wickLow, d.wickHigh]} barSize={2} isAnimationActive={false}>
                                        {data.map((e, i) => <Cell key={`wick-${i}`} fill={e.color === '#22c55e' ? '#00ff00' : '#ff0000'} />)}
                                    </Bar>
                                    <Bar xAxisId={0} dataKey={(d) => [d.bodyLow, d.bodyHigh]} barSize={16} isAnimationActive={false}>
                                        {data.map((e, i) => <Cell key={`body-${i}`} fill={e.color === '#22c55e' ? '#00ff00' : '#ff0000'} stroke="#fff" strokeWidth={1} />)}
                                    </Bar>
                                    {activeIndicators.map((ind, idx) => renderIndicatorLines(ind, idx))}
                                    {showFib && fibLevels?.map((fib, i) => (
                                      <ReferenceLine key={i} xAxisId={1} y={fib.price} stroke={fib.color} strokeWidth={2} strokeDasharray="5 5"><Label value={fib.label} position="insideLeft" fill="#fff" fontSize={10} /></ReferenceLine>
                                    ))}
                                </ComposedChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                     {technicalSignals.map((sig, idx) => (
                         <div key={idx} className="bg-white/10 border-[6px] border-white/20 p-6 md:p-8 rounded-[2rem] text-left backdrop-blur-sm">
                             <div className="text-white/50 font-black text-[9px] uppercase mb-2 tracking-widest">{sig.name}</div>
                             <div className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">{sig.value}</div>
                             <div className={`text-sm md:text-xl font-black uppercase tracking-widest ${sig.signal === 'BULLISH' ? 'text-green-400' : sig.signal === 'BEARISH' ? 'text-red-400' : 'text-white'}`}>{sig.signal}</div>
                         </div>
                     ))}
                </div>
            </div>

            <button onClick={handleWhisper} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-lg md:text-xl shadow-[0_0_50px_rgba(37,99,235,0.4)] transition-all active:scale-95 z-[110]">
                <Headphones className="w-6 h-6 md:w-7 md:h-7" />
                <span className="uppercase tracking-widest text-sm md:text-base">Audio Brief</span>
            </button>
        </div>
    );
};
