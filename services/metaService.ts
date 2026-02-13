
import { Coin, TrafficLight, IndicatorDefinition } from '../types';

export interface MetaSignal {
    name: string;
    value: string;
    signal: "BULLISH" | "BEARISH" | "NEUTRAL" | "WARNING";
}

// Requirement: generate_meta_glass_view (Data preparation)
export const generateMetaGlassData = (coin: Coin) => {
    return {
        symbol: (coin?.symbol || "UNK").toUpperCase(),
        name: (coin?.name || "UNKNOWN").toUpperCase(),
        price: `$${(coin?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        status: coin?.volatility || TrafficLight.GREEN,
        statusText: coin?.volatility === TrafficLight.GREEN ? "SAFE" : coin?.volatility === TrafficLight.RED ? "RISKY" : "CAUTION"
    };
};

export const analyzeTechnicalData = (data: any[], indicators: IndicatorDefinition[], patterns: string[]): MetaSignal[] => {
    const signals: MetaSignal[] = [];
    if (!data || data.length === 0) return signals;
    
    const latest = data[data.length - 1];
    
    // 1. Patterns
    if (patterns) {
        patterns.forEach(p => {
            if (p) signals.push({ name: "PATTERN", value: p.toUpperCase(), signal: "WARNING" });
        });
    }

    // 2. Indicators
    if (indicators) {
        indicators.forEach((ind, idx) => {
            if (!ind || !ind.name) return;
            const key = `ind_${idx}`;
            const val = latest[key];
            
            const name = ind.name.toUpperCase();
            
            if (name.includes("RSI")) {
                const num = parseFloat(val);
                let sig: MetaSignal['signal'] = "NEUTRAL";
                let txt = !isNaN(num) ? Math.round(num).toString() : "0";
                if (num > 70) { sig = "BEARISH"; txt += " (OVERBOUGHT)"; }
                else if (num < 30) { sig = "BULLISH"; txt += " (OVERSOLD)"; }
                signals.push({ name: "RSI (14)", value: txt, signal: sig });
            }
            else if (name.includes("BOLLINGER")) {
                const upper = latest[`${key}_upper`];
                const lower = latest[`${key}_lower`];
                const close = latest.close;
                let sig: MetaSignal['signal'] = "NEUTRAL";
                let txt = "IN RANGE";
                
                if (close > upper) { sig = "BULLISH"; txt = "BREAKOUT UP"; }
                else if (close < lower) { sig = "BEARISH"; txt = "BREAKOUT DOWN"; }
                else {
                    const mid = latest[`${key}_mid`];
                    if (mid) {
                        const width = (upper - lower) / mid;
                        if (width < 0.05) txt = "SQUEEZE (PRE-MOVE)";
                    }
                }
                signals.push({ name: "BBANDS", value: txt, signal: sig });
            }
            else if (name.includes("MACD")) {
                const hist = latest[`${key}_hist`];
                let sig: MetaSignal['signal'] = "NEUTRAL";
                let txt = "FLAT";
                if (hist > 0) { sig = "BULLISH"; txt = "MOMENTUM UP"; }
                if (hist < 0) { sig = "BEARISH"; txt = "MOMENTUM DOWN"; }
                signals.push({ name: "MACD", value: txt, signal: sig });
            }
            else if (name.includes("MOVING AVERAGE") || name.includes("SMA") || name.includes("EMA")) {
                const ma = val;
                const close = latest.close;
                let sig: MetaSignal['signal'] = "NEUTRAL";
                let txt = "NEUTRAL";
                if (close > ma) { sig = "BULLISH"; txt = "PRICE > AVG"; }
                else { sig = "BEARISH"; txt = "PRICE < AVG"; }
                signals.push({ name: "MA TREND", value: txt, signal: sig });
            }
            else {
                signals.push({ name: ind.name.substring(0, 10).toUpperCase(), value: "ACTIVE", signal: "NEUTRAL" });
            }
        });
    }
    
    return signals;
}

export const generateWhisperString = (coin: Coin, signals: MetaSignal[] = []): string => {
    const status = coin?.volatility || TrafficLight.GREEN;
    let advice = "";
    
    if (status === TrafficLight.GREEN) {
        advice = "Safe zone.";
    } else if (status === TrafficLight.YELLOW) {
        advice = "Volatility moderate.";
    } else {
        advice = "Risk high. Caution.";
    }

    let technicals = "";
    if (signals && signals.length > 0) {
        technicals = "Technical signals: " + signals.map(s => s && `${s.name} is ${s.value}`).filter(Boolean).join(". ");
    }

    const name = coin?.name || "Target asset";
    const price = coin?.price ? Math.round(coin.price) : "unknown";

    return `Crypto 50 Update. ${name}. Price ${price}. Status ${status}. ${advice}. ${technicals}`;
};

export const getMetaPrompts = (coinName: string, hasIndicators: boolean): string[] => {
    const name = coinName || "this coin";
    const base = [
        `"Hey Meta, look at this. Is ${name} safe?"`,
        `"Hey Meta, what is the risk level?"`,
    ];
    if (hasIndicators) {
        base.push(`"Hey Meta, read the technical signals."`);
        base.push(`"Hey Meta, explain the chart pattern."`);
    }
    return base;
};

export const playWhisperAudio = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
};
