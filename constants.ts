
import { Asset } from './types';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 64231.45,
    change24h: 2.4,
    trend: [62000, 62500, 61800, 63000, 63500, 64000, 64231],
    momentum: 75,
    verdict: 'Strong Buy',
    volatility: 'Medium',
    marketCap: 'Large',
    volumeSpike: false,
    oversold: false,
    volume24h: 45000000000,
    supply: 19700000, // ~19.7M BTC
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3452.12,
    change24h: -1.2,
    trend: [3500, 3480, 3520, 3490, 3460, 3440, 3452],
    momentum: 45,
    verdict: 'Neutral',
    volatility: 'Medium',
    marketCap: 'Large',
    volumeSpike: false,
    oversold: false,
    volume24h: 18000000000,
    supply: 120000000, // ~120M ETH
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 145.67,
    change24h: 8.5,
    trend: [120, 125, 128, 135, 140, 142, 145],
    momentum: 92,
    verdict: 'Strong Buy',
    volatility: 'High',
    marketCap: 'Mid',
    volumeSpike: true, // Top Gainer candidate
    oversold: false,
    volume24h: 4200000000,
    supply: 460000000, // ~460M SOL
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'Ripple',
    price: 0.62,
    change24h: 0.5,
    trend: [0.60, 0.61, 0.61, 0.62, 0.61, 0.62, 0.62],
    momentum: 50,
    verdict: 'Neutral',
    volatility: 'Low',
    marketCap: 'Large',
    volumeSpike: false,
    oversold: false,
    volume24h: 1200000000,
    supply: 55000000000, // ~55B XRP
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.45,
    change24h: -5.4,
    trend: [0.50, 0.49, 0.48, 0.47, 0.46, 0.45, 0.45],
    momentum: 20,
    verdict: 'Sell',
    volatility: 'Medium',
    marketCap: 'Mid',
    volumeSpike: false,
    oversold: true, // Oversold candidate
    volume24h: 450000000,
    supply: 35000000000, // ~35B ADA
  },
  {
    id: 'pepe',
    symbol: 'PEPE',
    name: 'Pepe',
    price: 0.000007,
    change24h: 15.2,
    trend: [0.000005, 0.0000055, 0.000006, 0.0000065, 0.000007, 0.000008, 0.000007],
    momentum: 85,
    verdict: 'Buy',
    volatility: 'High',
    marketCap: 'Small',
    volumeSpike: true,
    oversold: false,
    volume24h: 850000000,
    supply: 420000000000000, // ~420T PEPE
  },
  {
    id: 'avalanche',
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 35.40,
    change24h: 1.1,
    trend: [34, 35, 33, 34, 35, 36, 35.4],
    momentum: 55,
    verdict: 'Neutral',
    volatility: 'Medium',
    marketCap: 'Mid',
    volumeSpike: false,
    oversold: false,
    volume24h: 650000000,
    supply: 390000000, // ~390M AVAX
  }
];

export const STRATEGIES = ['Day Trading', 'Dip Hunting', 'Trend Following'] as const;
