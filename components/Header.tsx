
import React, { useMemo } from 'react';
import { Asset } from '../types';
import { Settings, Bot, TrendingUp, ChevronRight } from 'lucide-react';

interface HeaderProps {
  assets: Asset[];
  onOpenAdmin: () => void;
  onOpenAnalysis?: () => void; // Optional for backward compat if needed
}

const Header: React.FC<HeaderProps> = ({ assets, onOpenAdmin, onOpenAnalysis }) => {
  
  // Smart Narrative Generator
  const digest = useMemo(() => {
    if (!assets.length) return "Initializing Market Analytics...";
    
    const topGainer = [...assets].sort((a,b) => b.change24h - a.change24h)[0];
    const topLoser = [...assets].sort((a,b) => a.change24h - b.change24h)[0];
    const highVol = assets.filter(a => a.volumeSpike).length;
    
    let narrative = `🚀 Market Update: ${topGainer.symbol} leads the rally (+${topGainer.change24h}%)`;
    narrative += ` • ${topLoser.symbol} showing weakness (${topLoser.change24h}%)`;
    if (highVol > 0) narrative += ` • ⚠️ ${highVol} Assets showing unusual volume volume spikes`;
    narrative += ` • Global Sentiment: ${topGainer.change24h > 0 ? 'BULLISH' : 'NEUTRAL'}`;
    narrative += ` • BTC Dominance holding steady`;
    
    return narrative;
  }, [assets]);

  return (
    <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center overflow-hidden relative z-20">
      
      {/* Ticker Title */}
      <button 
        onClick={onOpenAnalysis}
        className="bg-slate-900 h-full flex items-center px-4 font-bold text-xs text-blue-400 uppercase tracking-wider shrink-0 z-10 border-r border-slate-800 shadow-xl gap-2 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer group"
        title="Generate Full AI Report"
      >
        <Bot size={16} className="group-hover:animate-bounce" /> AI Digest
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
      </button>

      {/* Smart Marquee */}
      <div 
        onClick={onOpenAnalysis} 
        className="flex items-center overflow-x-hidden w-full group relative bg-slate-950/50 cursor-pointer"
        title="Click for full analysis"
      >
        <div className="flex animate-marquee whitespace-nowrap py-2 text-sm font-medium text-slate-300">
          <span className="mx-4 text-blue-200 font-bold hover:underline">{digest}</span>
          <span className="mx-4 text-slate-600">|</span>
          {[...assets].map((asset, i) => (
            <div key={`${asset.id}-${i}`} className="inline-flex items-center gap-2 px-4 border-r border-slate-800/50">
              <span className="font-bold text-slate-400">{asset.symbol}</span>
              <span className={asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                ${asset.price.toLocaleString()}
              </span>
              <TrendingUp size={12} className={asset.change24h >= 0 ? 'text-green-500' : 'text-red-500 rotate-180'} />
            </div>
          ))}
        </div>
      </div>

      {/* Admin Trigger */}
      <button 
        onClick={onOpenAdmin}
        className="h-full px-4 bg-slate-950 hover:bg-slate-900 border-l border-slate-800 text-slate-500 hover:text-white transition-colors z-10 shrink-0"
        title="Admin Config"
      >
        <Settings size={16} />
      </button>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Header;
