import React from 'react';
import { ViewType } from '../types';
import { LayoutDashboard, Star, Newspaper, Waves, Settings, Hexagon } from 'lucide-react';

interface GlobalNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  brandColor: string;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ currentView, onViewChange, brandColor }) => {
  const navItems: { id: ViewType; icon: React.ElementType; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'watchlist', icon: Star, label: 'Watchlist' },
    { id: 'news', icon: Newspaper, label: 'News & AI' },
    { id: 'whale', icon: Waves, label: 'Whale Alerts' },
  ];

  return (
    <div className="w-20 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-6 shrink-0 z-30">
       {/* Logo */}
       <div className="w-10 h-10 rounded-xl mb-8 flex items-center justify-center shadow-lg shadow-blue-900/20"
            style={{ background: `linear-gradient(135deg, ${brandColor}, #1e293b)` }}>
         <Hexagon size={24} className="text-white" fill="white" fillOpacity={0.2} />
       </div>

       <div className="flex flex-col gap-6 w-full px-2">
         {navItems.map(item => (
           <button
             key={item.id}
             onClick={() => onViewChange(item.id)}
             className={`p-3 rounded-xl transition-all duration-300 group relative flex justify-center outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 ${
               currentView === item.id 
                 ? 'bg-slate-800 text-white shadow-inner' 
                 : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
             }`}
             style={currentView === item.id ? { color: brandColor } : {}}
           >
             <item.icon size={24} strokeWidth={currentView === item.id ? 2.5 : 2} />
             
             {/* Tooltip */}
             <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity border border-slate-700 shadow-xl translate-x-2 group-hover:translate-x-0">
               {item.label}
               {/* Arrow */}
               <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
             </div>
             
             {/* Active Indicator Bar */}
             {currentView === item.id && (
               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full" style={{ backgroundColor: brandColor }}></div>
             )}
           </button>
         ))}
       </div>

       <div className="mt-auto flex flex-col gap-6 w-full px-2">
          <button
             onClick={() => onViewChange('settings')}
             className={`p-3 rounded-xl transition-all duration-300 group relative flex justify-center ${
               currentView === 'settings' 
                 ? 'bg-slate-800 text-white' 
                 : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
             }`}
           >
             <Settings size={24} />
             <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity border border-slate-700 shadow-xl">
               Settings
             </div>
          </button>
       </div>
    </div>
  );
};

export default GlobalNav;