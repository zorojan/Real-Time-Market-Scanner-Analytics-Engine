import React, { useState, useEffect } from 'react';
import { Crosshair, TrendingUp, AlertTriangle, ArrowDown, Activity, Zap } from 'lucide-react';

interface Alert {
  id: number;
  time: string;
  symbol: string;
  signal: string;
  type: 'Bullish' | 'Bearish' | 'Neutral';
  strength: 'High' | 'Medium' | 'Low';
}

const SIGNALS = [
  { text: "RSI Oversold (<30)", type: 'Bullish', strength: 'High' },
  { text: "Golden Cross (MA50/200)", type: 'Bullish', strength: 'High' },
  { text: "Volume Spike (2.5x)", type: 'Neutral', strength: 'Medium' },
  { text: "Resistance Breakout", type: 'Bullish', strength: 'Medium' },
  { text: "MACD Bearish Div", type: 'Bearish', strength: 'Medium' },
  { text: "Support Test Failed", type: 'Bearish', strength: 'High' },
  { text: "Whale Accumulation", type: 'Bullish', strength: 'High' },
  { text: "New 4h Low", type: 'Bearish', strength: 'Low' },
];

const LiveScanner: React.FC<{ assets: any[] }> = ({ assets }) => {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, time: '10:42:05', symbol: 'BTC', signal: 'Volume Spike (2.5x)', type: 'Neutral', strength: 'Medium' },
    { id: 2, time: '10:41:12', symbol: 'SOL', signal: 'Resistance Breakout', type: 'Bullish', strength: 'High' },
    { id: 3, time: '10:39:55', symbol: 'ADA', signal: 'RSI Oversold (<30)', type: 'Bullish', strength: 'Medium' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomAsset = assets[Math.floor(Math.random() * assets.length)];
      const randomSignal = SIGNALS[Math.floor(Math.random() * SIGNALS.length)];
      
      const newAlert: Alert = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        symbol: randomAsset.symbol,
        signal: randomSignal.text,
        type: randomSignal.type as any,
        strength: randomSignal.strength as any,
      };

      setAlerts(prev => [newAlert, ...prev].slice(0, 8)); // Keep last 8
    }, 4500);

    return () => clearInterval(interval);
  }, [assets]);

  return (
    <div className="bg-slate-900 border-l border-slate-800 w-80 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Crosshair size={16} className="text-blue-500 animate-[spin_10s_linear_infinite]" />
          Live Scanner
        </h3>
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {alerts.map((alert, index) => (
          <div 
            key={alert.id} 
            className={`p-3 rounded-lg border text-sm animate-in slide-in-from-right fade-in duration-300 ${
              index === 0 ? 'bg-slate-800 border-slate-600 shadow-lg scale-[1.02]' : 'bg-slate-900/50 border-slate-800/50 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-white">{alert.symbol}</span>
              <span className="text-[10px] text-slate-500 font-mono">{alert.time}</span>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
               {alert.type === 'Bullish' && <TrendingUp size={14} className="text-green-500" />}
               {alert.type === 'Bearish' && <ArrowDown size={14} className="text-red-500" />}
               {alert.type === 'Neutral' && <Activity size={14} className="text-blue-500" />}
               <span className={`font-medium ${
                 alert.type === 'Bullish' ? 'text-green-400' : 
                 alert.type === 'Bearish' ? 'text-red-400' : 'text-blue-400'
               }`}>{alert.signal}</span>
            </div>

            <div className="flex gap-2">
               {alert.strength === 'High' && (
                 <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center gap-1 border border-red-500/20">
                   <Zap size={10} /> HIGH VOL
                 </span>
               )}
               {index === 0 && (
                 <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                   NEW
                 </span>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveScanner;