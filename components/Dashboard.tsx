
import React, { useMemo, useState } from 'react';
import { Asset, FilterState } from '../types';
import Sparkline from './Sparkline';
import LiveScanner from './LiveScanner';
import { ArrowUpRight, Zap, AlertCircle, BarChart3, LayoutGrid, List, Layers } from 'lucide-react';

interface DashboardProps {
  assets: Asset[];
  filters: FilterState;
  onAssetClick: (asset: Asset) => void;
  brandColor: string;
}

const Dashboard: React.FC<DashboardProps> = ({ assets, filters, onAssetClick, brandColor }) => {
  const [viewMode, setViewMode] = useState<'list' | 'heatmap'>('list');
  
  // Filtering Logic
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Strategy Filter
      if (filters.strategy === 'Dip Hunting' && !asset.oversold && asset.change24h > -2) return false;
      if (filters.strategy === 'Day Trading' && asset.volatility !== 'High') return false;
      if (filters.strategy === 'Trend Following' && asset.momentum < 60) return false;
      
      // Volatility Slider (Range approx matching)
      const volScore = asset.volatility === 'High' ? 100 : asset.volatility === 'Medium' ? 50 : 0;
      if (Math.abs(volScore - filters.volatility) > 50) return false; 

      // Market Cap Slider
      const capScore = asset.marketCap === 'Large' ? 100 : asset.marketCap === 'Mid' ? 50 : 0;
      if (Math.abs(capScore - filters.marketCap) > 50) return false;

      // RSI / Momentum Slider (Broad matching range)
      // If user sets RSI to 20 (Oversold), we want assets with low momentum.
      // Tolerance of +/- 30 to keep results plentiful
      if (Math.abs(asset.momentum - filters.rsi) > 35) return false;

      // Min Volume Slider
      // Map 0-100 slider to a volume threshold. 0 = $0, 100 = $10B
      const volumeThreshold = (filters.minVolume / 100) * 1000000000;
      if (asset.volume24h < volumeThreshold) return false;

      return true;
    });
  }, [assets, filters]);

  // Derived Top Opportunities with Safety Checks
  const topGainer = useMemo(() => {
    if (!assets.length) return null;
    return [...assets].sort((a, b) => b.change24h - a.change24h)[0];
  }, [assets]);

  const oversoldAsset = useMemo(() => {
    if (!assets.length) return null;
    return assets.find(a => a.oversold) || assets[assets.length - 1];
  }, [assets]);

  const volumeAsset = useMemo(() => {
    if (!assets.length) return null;
    return assets.find(a => a.volumeSpike) || assets[0];
  }, [assets]);

  if (!assets.length) {
    return <div className="flex-1 p-6 flex items-center justify-center text-slate-500">Loading market data...</div>;
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Main Dashboard Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        
        {/* Top Opportunity Cards */}
        {topGainer && oversoldAsset && volumeAsset && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Top Gainer Card */}
            <div 
              onClick={() => onAssetClick(topGainer)}
              className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700 hover:border-green-500/50 cursor-pointer transition-all hover:-translate-y-1 shadow-lg group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <ArrowUpRight size={24} />
                </div>
                <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/20 animate-pulse">Top Gainer</span>
              </div>
              <div className="text-slate-400 text-sm mb-1 font-medium">24h Growth Leader</div>
              <div className="text-2xl font-bold text-white mb-1 tracking-tight">
                {topGainer.symbol} <span className="text-green-400 text-lg ml-2">+{topGainer.change24h}%</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Zap size={12} className="text-green-500" />
                Momentum accelerating
              </div>
            </div>

            {/* Oversold Alert Card */}
            <div 
              onClick={() => onAssetClick(oversoldAsset)}
              className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700 hover:border-yellow-500/50 cursor-pointer transition-all hover:-translate-y-1 shadow-lg group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                  <AlertCircle size={24} />
                </div>
                <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded border border-yellow-500/20 animate-pulse">Oversold</span>
              </div>
              <div className="text-slate-400 text-sm mb-1 font-medium">Potential Reversal</div>
              <div className="text-2xl font-bold text-white mb-1 tracking-tight">
                {oversoldAsset.symbol} <span className="text-slate-300 text-lg ml-2">${oversoldAsset.price.toLocaleString()}</span>
              </div>
              <div className="text-xs text-slate-500">RSI below 30</div>
            </div>

            {/* Volume Spike Card */}
            <div 
              onClick={() => onAssetClick(volumeAsset)}
              className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700 hover:border-indigo-500/50 cursor-pointer transition-all hover:-translate-y-1 shadow-lg group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <BarChart3 size={24} />
                </div>
                <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded border border-indigo-500/20 animate-pulse">Volume Spike</span>
              </div>
              <div className="text-slate-400 text-sm mb-1 font-medium">Unusual Activity</div>
              <div className="text-2xl font-bold text-white mb-1 tracking-tight">
                {volumeAsset.symbol} <span className="text-slate-300 text-lg ml-2">${volumeAsset.price.toLocaleString()}</span>
              </div>
              <div className="text-xs text-slate-500">2x Avg Volume</div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="text-yellow-400" size={20}/> Market Opportunities
          </h2>
          
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <List size={16} /> List
            </button>
            <button 
              onClick={() => setViewMode('heatmap')}
              className={`p-2 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'heatmap' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LayoutGrid size={16} /> Heatmap
            </button>
          </div>
        </div>

        {/* View Switcher */}
        {viewMode === 'list' ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 backdrop-blur">
              <div className="text-sm text-slate-400">
                Showing {filteredAssets.length} Assets
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-medium">Asset</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Trend (7d)</th>
                  <th className="p-4 font-medium">Momentum</th>
                  <th className="p-4 font-medium text-right">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredAssets.length > 0 ? filteredAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    onClick={() => onAssetClick(asset)}
                    className="hover:bg-slate-700/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white group-hover:scale-110 transition-transform shadow-lg border border-slate-600">
                          {asset.symbol[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white">{asset.name}</div>
                          <div className="text-xs text-slate-500">{asset.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-white tracking-tight">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                      <div className={`text-xs font-medium ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </div>
                    </td>
                    <td className="p-4">
                      <Sparkline 
                        data={asset.trend} 
                        color={asset.change24h >= 0 ? '#4ade80' : '#f87171'} 
                      />
                    </td>
                    <td className="p-4 w-48">
                      <div className="w-full bg-slate-900 rounded-full h-1.5 mb-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            asset.momentum > 70 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                            asset.momentum < 30 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                            'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                          style={{ width: `${asset.momentum}%` }}
                        />
                      </div>
                      <div className="text-xs text-right text-slate-500 font-mono">{asset.momentum}/100</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end">
                        <span className={`relative px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                          asset.verdict === 'Strong Buy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          asset.verdict === 'Buy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          asset.verdict === 'Sell' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          asset.verdict === 'Strong Sell' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {/* Status Dot Animation */}
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            asset.verdict.includes('Buy') ? 'bg-green-400 animate-[pulse_1.5s_infinite]' :
                            asset.verdict.includes('Sell') ? 'bg-red-400 animate-[pulse_1.5s_infinite]' :
                            'bg-slate-400'
                          }`}></span>
                          {asset.verdict}
                        </span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-500">
                        No assets match your current filters. Try adjusting the sliders.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Heatmap Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-[120px] animate-in fade-in zoom-in-95 duration-300">
            {filteredAssets.map((asset) => {
              // Determine size based on Market Cap
              const sizeClass = 
                asset.marketCap === 'Large' ? 'col-span-2 row-span-2' : 
                asset.marketCap === 'Mid' ? 'col-span-1 row-span-2' : 
                'col-span-1 row-span-1';

              // Determine color intensity based on change
              const isPositive = asset.change24h >= 0;
              const absChange = Math.min(Math.abs(asset.change24h), 10); // cap opacity impact at 10%
              const opacity = 0.1 + (absChange / 15); // Base 0.1, max around 0.8
              
              const bgStyle = isPositive 
                ? `rgba(34, 197, 94, ${opacity})` // Green
                : `rgba(239, 68, 68, ${opacity})`; // Red

              return (
                <div 
                  key={asset.id}
                  onClick={() => onAssetClick(asset)}
                  className={`${sizeClass} rounded-xl border border-slate-700/50 p-4 flex flex-col justify-between cursor-pointer transition-transform hover:scale-[0.98] hover:border-white/20 shadow-lg relative overflow-hidden group`}
                  style={{ backgroundColor: bgStyle }}
                >
                  {/* Background Pulse Animation for high volatility */}
                  {Math.abs(asset.change24h) > 5 && (
                      <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none"></div>
                  )}

                  <div className="flex justify-between items-start z-10">
                    <span className="font-bold text-white text-shadow-sm">{asset.symbol}</span>
                    <Layers size={14} className="text-white/50" />
                  </div>
                  
                  <div className="z-10">
                    <div className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
                      {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                    </div>
                    <div className="text-xs text-white/80 font-medium truncate">
                      ${asset.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Sidebar: Live Scanner */}
      <div className="hidden lg:block h-full">
         <LiveScanner assets={assets} />
      </div>
    </div>
  );
};

export default Dashboard;
