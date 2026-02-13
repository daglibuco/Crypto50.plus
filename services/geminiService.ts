
import { GoogleGenAI, Type } from "@google/genai";
import { Coin, WhisperStrategy, WhisperSignal, IndicatorDefinition, TraderProfile, ReportType } from '../types';

// Specialized Intelligence Generator for the Reports Hub
export const generateTimeframeReport = async (coin: Coin, type: ReportType): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const context = {
        'D': "DAILY SITUATION REPORT: Focus on the last 24 hours of price action, current sentiment, and immediate support/resistance levels. High urgency, tactical advice.",
        'W': "WEEKLY DEEP DIVE: Focus on the past 7 days. Analyze trend sustainability, macro news impacts, and key utility developments. Strategic positioning advice.",
        'M': "MONTHLY OUTLOOK: Focus on the long-term fundamentals. Analyze the project's roadmap, competitive landscape, and overall health of the asset's utility in the market."
    }[type];

    const prompt = `
      You are the Lead Macro Analyst for Crypto50.plus. 
      Target Asset: ${coin.name} (${coin.symbol}).
      Report Type: ${context}
      
      TONE: Senior-friendly, calm, factual. 
      STRUCTURE:
      1. Summary Overview
      2. The "Science" (Fundamental facts)
      3. The "Gamble" (Short-term noise/hype to ignore)
      4. Technical Health Check (Simpler terms)
      5. Forward View (emphasize high risk/uncertainty)
      6. Verdict & Warning
      
      Current Price: $${coin.price}
      24h Change: ${coin.change24h}%
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });

    return response.text;
};

// Whisper engine generating signals with strategy and news context
export const generateWhisperSignal = async (
  coin: Coin,
  strategy: WhisperStrategy,
  history: any[],
  newsSummary: string
): Promise<WhisperSignal> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are the "Whisper AI Analyst" for Crypto50.plus. 
      Analyze ${coin.name} (${coin.symbol}).
      
      PHILOSOPHY (PHASE 1 - THE TRUTH):
      - Trading is part Science (fundamentals) and part Gamble (noise).
      - We do not "beat" the market; we interpret situational awareness.
      - Emphasize uncertainty and risk.
      
      USER STRATEGY & BIAS:
      - Risk Profile: ${strategy.riskLevel}
      - Time Horizon: ${strategy.horizon}
      - Preferred Indicators to verify: ${strategy.preferredIndicators.join(', ')}
      - Specific Chart Patterns to hunt for: ${strategy.preferredPatterns.join(', ')}
      
      TASK:
      1. Scan the recent closing prices for the user's requested patterns.
      2. Cross-reference news sentiment with technical score.
      3. Provide a clear Directional Bias.
      
      MARKET DATA:
      - Price: $${coin.price}
      - 24h: ${coin.change24h}%
      - News Context: ${newsSummary}
      - Recent Price History (Last 5 candles): ${history.slice(-5).map(h => h.close).join(', ')}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            direction: { type: Type.STRING, description: "LONG, SHORT, or NEUTRAL" },
            confidence: { type: Type.NUMBER },
            techScore: { type: Type.NUMBER },
            newsScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            simpleRecommendation: { type: Type.STRING }
          },
          required: ["direction", "confidence", "techScore", "newsScore", "reasoning", "simpleRecommendation"]
        },
        tools: [{ googleSearch: {} }]
      }
    });

    const signalData = JSON.parse(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { 
      ...signalData, 
      timestamp: Date.now(), 
      sources 
    };
  } catch (error) {
    console.error("Whisper Engine Error:", error);
    throw error;
  }
};

// Generates a Situational Awareness Report following the 8-point structure
export const generateBriefing = async (coin: Coin) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are the Lead Analyst for Crypto50.plus. Generate a "Situational Awareness Report" for ${coin.name}. 
      Follow this exact structure using professional, senior-friendly language (no jargon, no hype):
      
      1. **Asset Snapshot**: Brief overview.
      2. **What’s Happening Right Now**: Current market dynamics.
      3. **Risk Level**: Clear assessment (Low/Medium/High) with reasoning.
      4. **Pattern & Indicator Summary**: Explain current signals simply.
      5. **Forecast-Style "Educated Guess"**: State a likely direction but MUST emphasize high uncertainty and risk.
      6. **What Changed Since Last Report**: Based on current price movement.
      7. **What to Watch Next**: Specific price levels or news events.
      8. **The Truth Reminder**: Briefly remind the user that markets are part science, part gamble.
      
      Current Data: Price $${coin.price}, 24h Change ${coin.change24h}%.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt
    });
    return response.text;
};

// Handles interactive expert chat
export const chatWithExpert = async (
  history: any[], 
  coin: Coin, 
  price: number, 
  indicators: IndicatorDefinition[], 
  patterns: string[] | undefined, 
  profile: TraderProfile
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are "Coach Crypto", a world-class Lead Crypto Advisor for Crypto50.plus.
    You are mentoring a senior user (50+) through the ${coin.name} (${coin.symbol}) simulator.
    
    CORE PHILOSOPHY (PHASE 1):
    1. Markets are split into Science (fundamentals/macro) and Gamble (short-term noise).
    2. Be honest: humans cannot consistently "beat" the market through gambling.
    3. Emphasize uncertainty, risk awareness, and the stability of long-term utility.
    
    USER PROFILE:
    - Experience Level: Senior Beginner.
    - Risk Profile: ${profile.riskLevel}.
    - Trading Style: ${profile.style}.
    
    TECHNICAL CONTEXT:
    - Price: $${price.toLocaleString()}
    - Active Overlays: ${indicators.length > 0 ? indicators.map(i => i.name).join(', ') : 'None'}.
    - Formations: ${patterns && patterns.length > 0 ? patterns.join(', ') : 'Consolidation'}.
    
    INSTRUCTIONS:
    - Use calm, supportive, non-hyped language.
    - Explain the "Why" behind chart movements.
    - Always warn about "FOMO" or "overbought" conditions (e.g. RSI > 70).
    - If asked for advice, say "In my expert view..." or "Technically speaking..." but reiterate there are no guarantees.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: history.map(h => ({ 
        role: h.role === 'user' ? 'user' : 'model', 
        parts: [{ text: h.text }] 
      })),
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    return response.text || "I'm analyzing the market structure. What part of the chart would you like me to clarify?";
  } catch (error) {
    return "The data stream encountered a temporary lag. Please re-ask your technical question.";
  }
};

// Fetches latest news
export const fetchCoinNews = async (name: string, symbol: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Provide a Situational News Update for ${name} (${symbol}). Focus on facts vs. sentiment noise. What is the 'Science' (fundamental news) vs. the 'Gamble' (hype/social media)? Provide a risk-aware verdict.`,
        config: { tools: [{ googleSearch: {} }] }
    });
    return { 
        summary: response.text, 
        report: response.text, 
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
};

// Fetches whitepaper insights
export const fetchWhitepaperInsight = async (name: string, symbol: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze the official whitepaper for ${name} (${symbol}). What is its core utility? Does it solve a real-world problem or is it purely speculative? Summarize for a 50+ audience.`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              wpUrl: { type: Type.STRING },
              siteUrl: { type: Type.STRING }
            }
          },
          tools: [{ googleSearch: {} }] 
        }
    });
    const data = JSON.parse(response.text);
    return { 
        ...data,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
};

// Multimodal chart analysis
export const analyzeChartImage = async (base64: string, coinName?: string, timeframe?: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are an expert technical analyst for Crypto50.plus.
      Please analyze the provided chart image for:
      1. **Candlestick Patterns**: Identify significant formations like Hammers, Engulfing candles, Stars, or Dojis.
      2. **Trendlines & Structure**: Identify primary and secondary trendlines, support zones, and resistance levels.
      3. **Summary of Findings**: Provide a clear, senior-friendly summary of the asset's current trajectory.
      4. **Safety Verdict**: Rate the visual setup on a scale of 1-10 and state if it is currently a 'Science' setup (clear structure) or 'Gamble' setup (chaotic noise).
      
      Asset Name/Context: ${coinName || 'Unknown asset'}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: [{ inlineData: { mimeType: "image/jpeg", data: base64 } }, { text: prompt }] }
    });
    return response.text;
};
