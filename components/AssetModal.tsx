import React, { useEffect, useState } from 'react';
import { Asset } from '../types';
import Gauge from './Gauge';
import { X, TrendingUp, Activity, AlertTriangle, Sparkles } from 'lucide-react';
import { getAssetSummary } from '../services/geminiService';

interface AssetModalProps {
  asset: Asset | null;
  onClose: () => void;
  brandColor: string;
}

const AssetModal: React.FC<AssetModalProps> = ({ asset, onClose, brandColor }) => {
  const [summary, setSummary] = useState<string>('Analyzing market data...');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (asset) {
      setIsLoading(true);
      setSummary('Analyzing market patterns with Gemini AI...');
      
      const fetchSummary = async () => {
        const text = await getAssetSummary(asset);
        setSummary(text);
        setIsLoading(false);
      };
      fetchSummary();
    }
  }, [asset]);

  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 blur-xl"></div>
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold">
               {asset.symbol[0]}
             </div>
             <div>
               <h2 className="text-xl font-bold text-white">{asset.name}</h2>
               <span className="text-slate-400 text-sm">{asset.symbol}/USD</span>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center gap-6">
          
          {/* Gauge Section */}
          <div className="flex flex-col items-center">
            <Gauge value={asset.momentum} label="Technical Rating" />
            <div className={`mt-2 px-4 py-1 rounded-full text-sm font-bold ${
              asset.verdict.includes('Buy') ? 'bg-green-500/20 text-green-400' :
              asset.verdict.includes('Sell') ? 'bg-red-500/20 text-red-400' :
              'bg-slate-500/20 text-slate-400'
            }`}>
              {asset.verdict}
            </div>
          </div>

          {/* AI Summary */}
          <div className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-purple-400">
              <Sparkles size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">AI Insight</span>
            </div>
            <p className={`text-sm leading-relaxed ${isLoading ? 'animate-pulse text-slate-500' : 'text-slate-300'}`}>
              {summary}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="bg-slate-800/30 p-3 rounded-lg text-center">
              <div className="text-slate-500 text-xs uppercase mb-1">Volatility</div>
              <div className="text-white font-medium">{asset.volatility}</div>
            </div>
            <div className="bg-slate-800/30 p-3 rounded-lg text-center">
               <div className="text-slate-500 text-xs uppercase mb-1">24h Vol</div>
               <div className="text-white font-medium">{asset.volumeSpike ? 'High' : 'Normal'}</div>
            </div>
             <div className="bg-slate-800/30 p-3 rounded-lg text-center">
               <div className="text-slate-500 text-xs uppercase mb-1">RSI Status</div>
               <div className="text-white font-medium">{asset.oversold ? 'Oversold' : 'Neutral'}</div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transform transition active:scale-95 hover:brightness-110"
            style={{ backgroundColor: brandColor }}
          >
            Trade {asset.symbol} Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetModal;
