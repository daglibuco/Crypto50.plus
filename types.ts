
export enum TrafficLight {
  GREEN = "GREEN",   // Low Volatility / Safe
  YELLOW = "YELLOW", // Moderate
  RED = "RED"        // High Volatility / Do Not Trade
}

export interface Coin {
  symbol: string;
  name: string;
  category: string;
  price: number;
  change24h: number;
  volatility: TrafficLight;
  description?: string;
  website?: string;
  whitepaper?: string;
  image?: string;
}

export interface IndicatorDefinition {
  name: string;
  summary: string;
}

export interface TradeSimulation {
  baseAmount: number; // Always 100
  feePercentage: number; // e.g. 1.5
  spreadPercentage: number; // e.g. 0.5
  entryPrice: number;
  netEquity: number;
  breakEvenPrice: number;
}

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y';
export type ChartType = 'line' | 'area' | 'candle';

export interface OHLCV {
  time: string;
  originalTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  bodyLow: number;
  bodyHigh: number;
  wickLow: number;
  wickHigh: number;
  color: string;
  [key: string]: any;
}

export interface WhisperStrategy {
  symbol: string;
  riskLevel: 'Conservative' | 'Aggressive';
  horizon: 'Short-term' | 'Long-term';
  preferredIndicators: string[];
  preferredPatterns: string[];
}

export interface WhisperSignal {
  direction: 'LONG' | 'SHORT' | 'NEUTRAL';
  confidence: number; // 0-100
  reasoning: string;
  simpleRecommendation: string; // Clear instruction in simple words
  techScore: number;
  newsScore: number;
  timestamp: number;
  sources?: any[]; // For Google Search grounding sources
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type RiskLevel = 'Conservative' | 'Moderate' | 'Aggressive';
export type TradingStyle = 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Position Trading';

export interface TraderProfile {
  riskLevel: RiskLevel;
  style: TradingStyle;
}

export type JustificationTag = 'Trend Following' | 'Reversal' | 'News/Hype' | 'FOMO' | 'Long Term Hold' | 'Experiment';

export interface JournalEntry {
  id: string;
  timestamp: number;
  symbol: string;
  name: string;
  entryPrice: number;
  exitPrice: number;
  initialEquity: number;
  finalEquity: number;
  pnlValue: number;
  pnlPercent: number;
  justification: JustificationTag | string;
  aiScore: number;
}

// NEW: Intelligence Reports for the Reports Hub
export type ReportType = 'D' | 'W' | 'M'; // Daily, Weekly, Monthly

export interface GeneratedReport {
  id: string;
  symbol: string;
  assetName: string;
  type: ReportType;
  timestamp: number;
  content: string;
  isFavorite: boolean;
}

export interface PatternPoint {
  index: number;
  name: string;
  description: string;
  price: number;
}

export interface PatternHunterHook {
  patterns: string[];
  reliability: 'Low' | 'Medium' | 'High';
  patternPoints: PatternPoint[];
}

export interface SentimentScannerHook {
  score: number;
  summary: string;
  lastUpdated: Date;
}
