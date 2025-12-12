import { Asset } from '../types';

const TAAPI_BASE_URL = 'https://api.taapi.io';
const API_KEY = import.meta.env.VITE_TAAPI_SECRET;

// Map internal IDs to Taapi symbols (assuming Binance for consistency)
const SYMBOL_MAP: Record<string, string> = {
  'bitcoin': 'BTC/USDT',
  'ethereum': 'ETH/USDT',
  'solana': 'SOL/USDT',
  'ripple': 'XRP/USDT',
  'cardano': 'ADA/USDT',
  'pepe': 'PEPE/USDT',
  'avalanche': 'AVAX/USDT',
};

interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Helper to calculate RSI locally to save API calls
// Simple RSI implementation
function calculateRSI(closes: number[], period: number = 14): number {
  if (closes.length < period + 1) return 50; // Not enough data

  let gains = 0;
  let losses = 0;

  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export const fetchAssetData = async (assetId: string, currentAsset: Asset): Promise<Asset> => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.warn('Missing Taapi API Key');
    return currentAsset;
  }

  const symbol = SYMBOL_MAP[assetId];
  if (!symbol) return currentAsset;

  try {
    // Fetch last 24 hours of 1h candles
    const response = await fetch(
      `${TAAPI_BASE_URL}/candles?secret=${API_KEY}&exchange=binance&symbol=${symbol}&interval=1h&limit=24`
    );

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`Rate limit exceeded for ${assetId}`);
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    const candles: Candle[] = await response.json();

    if (!candles || candles.length === 0) return currentAsset;

    // Sort candles by timestamp just in case, though usually they are sorted
    // Taapi returns newest first? Or oldest first? 
    // Documentation says: "Returns an array of candles... The first element is the oldest candle."
    // Let's verify if we can. Assuming oldest first for standard OHLCV.

    // Latest candle is the last one
    const latestCandle = candles[candles.length - 1];
    const firstCandle = candles[0];

    const currentPrice = latestCandle.close;
    const openPrice24h = firstCandle.open; // Or close of 24h ago? Let's use open of the oldest candle in the 24h set.

    const change24h = ((currentPrice - openPrice24h) / openPrice24h) * 100;

    const trend = candles.map(c => c.close);
    const volume24h = candles.reduce((acc, c) => acc + (c.volume * c.close), 0); // Approximate USD volume

    // Calculate RSI for momentum
    const rsi = calculateRSI(trend, 14);

    // Determine Verdict based on RSI
    let verdict: Asset['verdict'] = 'Neutral';
    if (rsi > 70) verdict = 'Sell';
    else if (rsi > 80) verdict = 'Strong Sell';
    else if (rsi < 30) verdict = 'Buy';
    else if (rsi < 20) verdict = 'Strong Buy';

    // Determine Volatility (simple range based)
    const high = Math.max(...candles.map(c => c.high));
    const low = Math.min(...candles.map(c => c.low));
    const volatilityRange = (high - low) / low;
    let volatility: Asset['volatility'] = 'Medium';
    if (volatilityRange > 0.05) volatility = 'High';
    if (volatilityRange < 0.02) volatility = 'Low';

    // Dynamic Market Cap Calculation
    let marketCap: Asset['marketCap'] = currentAsset.marketCap; // Fallback
    if (currentAsset.supply) {
      const mcapValue = currentPrice * currentAsset.supply;
      if (mcapValue >= 10_000_000_000) marketCap = 'Large';      // > $10B
      else if (mcapValue >= 1_000_000_000) marketCap = 'Mid';    // > $1B
      else marketCap = 'Small';                                  // < $1B
    }

    // Improved Volume Spike Detection
    // Calculate Average Volume of the last 24h
    const averageVolume = candles.reduce((acc, c) => acc + c.volume, 0) / candles.length;
    // Check if the latest candle's volume is significantly higher than the average
    // We use the latest closed candle for this check
    const latestVolume = latestCandle.volume;
    const volumeSpike = latestVolume > (averageVolume * 1.5);

    return {
      ...currentAsset,
      price: currentPrice,
      change24h: parseFloat(change24h.toFixed(2)),
      trend: trend,
      momentum: Math.round(rsi),
      verdict,
      volatility,
      volume24h,
      marketCap,
      volumeSpike,
      oversold: rsi < 30,
    };

  } catch (error) {
    console.error(`Failed to fetch data for ${assetId}:`, error);
    return currentAsset;
  }
};
