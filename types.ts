
export enum AssetType {
  CRYPTO = 'Crypto',
  FUND = 'Fund',
  COMMODITY = 'Commodity',
  CURRENCY = 'Currency',
  INDEX = 'Index',
  AMERICAS = 'Americas',
  EUROPE = 'Europe',
  ASIA = 'Asia'
}

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  type: AssetType;
  volume24h: string;
  description: string;
  delay: string;
}

export interface ChartDataPoint {
  time: string;
  price: number;
  volume: number;
}

export interface AnalysisResult {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  summary: string;
  keyLevels: { support: number[]; resistance: number[] };
  recommendation: string;
  sources: { title: string; url: string; snippet?: string }[];
}

export enum AlertType {
  ABOVE = 'Above',
  BELOW = 'Below'
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  type: AlertType;
  isActive: boolean;
  isTriggered: boolean;
  createdAt: number;
}
