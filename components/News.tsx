import React from 'react';
import { Newspaper, TrendingUp, TrendingDown, Clock, ExternalLink, Bot, Zap, Globe } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  summary: string;
  impact: 'High' | 'Medium' | 'Low';
  category: string;
  imageUrl?: string;
}

const DEMO_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "SEC Approves New Multi-Asset ETF Framework, Signaling Institutional Shift",
    source: "Bloomberg Crypto",
    time: "25 min ago",
    sentiment: "Bullish",
    summary: "Regulators have unexpectedly approved a framework paving the way for basket-based crypto ETFs. Institutional inflows are projected to increase by 40% in Q4.",
    impact: "High",
    category: "Regulation",
    imageUrl: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2832&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Solana DeFi Volume Flips Ethereum for Third Consecutive Day",
    source: "The Block",
    time: "2 hours ago",
    sentiment: "Bullish",
    summary: "On-chain data reveals a massive surge in DEX activity on Solana, driven by low fees and a resurgence in meme coin speculation. TVL is up 12% this week.",
    impact: "Medium",
    category: "On-Chain",
  },
  {
    id: 3,
    title: "EU MiCA Regulations May Force Stablecoin Delistings",
    source: "Reuters",
    time: "5 hours ago",
    sentiment: "Bearish",
    summary: "Major exchanges warn that non-compliant stablecoins could be delisted from European platforms by next month, potentially causing short-term liquidity crunches.",
    impact: "High",
    category: "Regulation"
  },
  {
    id: 4,
    title: "Ethereum 'Pectra' Upgrade Timeline Confirmed by Developers",
    source: "CoinDesk",
    time: "8 hours ago",
    sentiment: "Neutral",
    summary: "Core developers have set a tentative date for the Pectra upgrade. Focus remains on validator staking limits and minor scalability improvements via proto-danksharding.",
    impact: "Low",
    category: "Tech Upgrade"
  }
];

const News: React.FC<{ brandColor: string }> = ({ brandColor }) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      
      {/* Header & Market Sentiment */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-stretch">
        <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
           <div className="relative z-10">
             <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
               <Globe className="text-blue-500" /> Market Intelligence
             </h1>
             <p className="text-slate-400">Real-time news aggregation and AI-driven sentiment analysis.</p>
           </div>
           <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-900/10 to-transparent"></div>
        </div>

        {/* Sentiment Widget */}
        <div className="w-full md:w-80 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden">
           <div className="flex justify-between items-center mb-2 relative z-10">
             <span className="text-slate-400 text-sm font-semibold uppercase">AI Sentiment Score</span>
             <span className="text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded text-xs">GREED</span>
           </div>
           <div className="text-4xl font-bold text-white relative z-10">72<span className="text-lg text-slate-500 font-normal">/100</span></div>
           <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden relative z-10">
             <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full w-[72%] relative">
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
             </div>
           </div>
           {/* Background Glow */}
           <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-green-500/10 blur-3xl rounded-full"></div>
        </div>
      </div>

      {/* Featured News */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-yellow-400" /> Featured Story
        </h2>
        <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl group cursor-pointer hover:border-slate-600 transition-colors relative">
           <div className="absolute top-0 right-0 p-6 z-20">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg">Breaking</span>
           </div>
           <div className="grid md:grid-cols-2">
             <div className="h-64 md:h-auto bg-slate-700 relative overflow-hidden">
                <img 
                  src={DEMO_NEWS[0].imageUrl} 
                  alt="News" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 scale-100 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
             </div>
             <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">
                  <span className="text-blue-400">{DEMO_NEWS[0].source}</span>
                  <span>•</span>
                  <span>{DEMO_NEWS[0].time}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                  {DEMO_NEWS[0].title}
                </h3>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-6">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mb-2">
                    <Bot size={14} /> AI SUMMARY
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {DEMO_NEWS[0].summary}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                    Bullish
                  </span>
                  <span className="px-3 py-1 rounded bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                    High Impact
                  </span>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* News Grid */}
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Newspaper size={18} className="text-slate-400" /> Latest Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMO_NEWS.slice(1).map(item => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all hover:-translate-y-1 cursor-pointer group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                  <Newspaper size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-300">{item.source}</span>
                  <span className="text-[10px] text-slate-500">{item.time}</span>
                </div>
              </div>
              {item.sentiment === 'Bullish' && <TrendingUp size={16} className="text-green-500" />}
              {item.sentiment === 'Bearish' && <TrendingDown size={16} className="text-red-500" />}
            </div>

            <h3 className="text-white font-bold mb-3 leading-snug group-hover:text-blue-400 transition-colors">
              {item.title}
            </h3>

            <p className="text-slate-400 text-xs mb-4 line-clamp-3 leading-relaxed flex-1">
              {item.summary}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
               <div className="flex gap-2">
                 <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                   item.sentiment === 'Bullish' ? 'text-green-400 bg-green-500/10' :
                   item.sentiment === 'Bearish' ? 'text-red-400 bg-red-500/10' :
                   'text-slate-400 bg-slate-500/10'
                 }`}>
                   {item.sentiment}
                 </span>
                 <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase text-slate-500 bg-slate-800">
                   {item.category}
                 </span>
               </div>
               <ExternalLink size={14} className="text-slate-600 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;