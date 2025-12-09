
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  trend: number[];
  momentum: number; // 0 - 100
  verdict: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  volatility: 'Low' | 'Medium' | 'High';
  marketCap: 'Small' | 'Mid' | 'Large';
  volumeSpike?: boolean;
  oversold?: boolean;
  volume24h: number; // USD value
}

export interface FilterState {
  strategy: 'Day Trading' | 'Dip Hunting' | 'Trend Following' | 'All';
  volatility: number; // 0-100 range mapped to Low/Med/High
  marketCap: number; // 0-100 range mapped to Small/Mid/Large
  rsi: number; // 0-100 (Momentum target)
  minVolume: number; // 0-100 (Minimum liquidity)
}

export interface AppConfig {
  brandColor: string;
  visibleAssets: string[]; // List of symbol IDs
}

export type ViewType = 'dashboard' | 'watchlist' | 'news' | 'whale' | 'settings';
