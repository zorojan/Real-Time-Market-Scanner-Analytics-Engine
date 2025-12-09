
import React from 'react';
import { FilterState } from '../types';
import { STRATEGIES } from '../constants';
import { Settings, Sliders, Target, Activity, BarChart2 } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  brandColor: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, brandColor }) => {
  
  const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, strategy: e.target.value as any }));
  };

  const handleSliderChange = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [key]: parseInt(e.target.value) }));
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col h-full shrink-0 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
           <div className="w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
           MarketPulse
        </h1>
        <p className="text-xs text-slate-500 mt-1 ml-4 tracking-wider uppercase">Analytics Engine v1.0</p>
      </div>

      <div className="space-y-8 flex-1">
        
        {/* Strategy Selector */}
        <div>
           <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
             <Target size={16} className="text-slate-500" />
             Trading Strategy
           </label>
           <div className="relative">
             <select 
               value={filters.strategy} 
               onChange={handleStrategyChange}
               className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 appearance-none focus:outline-none focus:border-blue-500 transition-colors"
             >
               <option value="All">All Strategies</option>
               {STRATEGIES.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
             <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">▼</div>
           </div>
        </div>

        {/* Sliders */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
             <Sliders size={16} className="text-slate-500" />
             Market Filters
          </label>
          
          {/* Volatility */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Volatility</span>
              <span>{filters.volatility > 70 ? 'Wild' : filters.volatility < 30 ? 'Stable' : 'Normal'}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={filters.volatility}
              onChange={handleSliderChange('volatility')}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Market Cap */}
          <div className="mb-6">
             <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Market Cap</span>
              <span>{filters.marketCap > 70 ? 'Blue Chip' : filters.marketCap < 30 ? 'Micro' : 'Mid'}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={filters.marketCap}
              onChange={handleSliderChange('marketCap')}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* RSI / Momentum */}
          <div className="mb-6">
             <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1"><Activity size={10}/> RSI Target</span>
              <span className={filters.rsi < 30 ? 'text-green-400' : filters.rsi > 70 ? 'text-red-400' : 'text-slate-400'}>
                  {filters.rsi < 30 ? 'Oversold' : filters.rsi > 70 ? 'Overbought' : 'Neutral'}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={filters.rsi}
              onChange={handleSliderChange('rsi')}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Min Volume */}
          <div>
             <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1"><BarChart2 size={10}/> Min Volume</span>
              <span>{filters.minVolume === 0 ? 'Any' : filters.minVolume > 80 ? 'High Liq' : '> $1M'}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={filters.minVolume}
              onChange={handleSliderChange('minVolume')}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

        </div>
      </div>

      {/* Action Button */}
      <button 
        className="w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 transform transition active:scale-95 hover:brightness-110 flex items-center justify-center gap-2 mt-6"
        style={{ backgroundColor: brandColor }}
      >
        <Settings size={18} />
        Scan Market
      </button>

    </div>
  );
};

export default FilterPanel;
