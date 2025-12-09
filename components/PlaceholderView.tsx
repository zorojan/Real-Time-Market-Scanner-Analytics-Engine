import React from 'react';
import { ViewType } from '../types';
import { Construction, Star, Newspaper, Waves, Settings } from 'lucide-react';

interface PlaceholderViewProps {
  view: ViewType;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ view }) => {
  const getContent = () => {
    switch (view) {
      case 'watchlist':
        return {
          icon: Star,
          title: 'My Watchlist',
          desc: 'Track your favorite assets and PnL in real-time.',
          color: 'text-yellow-500'
        };
      case 'news':
        return {
          icon: Newspaper,
          title: 'News & AI Sentiment',
          desc: 'Real-time news aggregation and AI-driven market sentiment analysis.',
          color: 'text-purple-500'
        };
      case 'whale':
        return {
          icon: Waves,
          title: 'Whale Alerts',
          desc: 'Monitor large on-chain transactions and institutional movements.',
          color: 'text-blue-500'
        };
      case 'settings':
        return {
          icon: Settings,
          title: 'Platform Settings',
          desc: 'Configure API keys, notifications, and display preferences.',
          color: 'text-slate-400'
        };
      default:
        return {
          icon: Construction,
          title: 'Under Construction',
          desc: 'This module is currently being built.',
          color: 'text-slate-500'
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 m-6 rounded-2xl border border-slate-800 border-dashed">
      <div className={`w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6 ${content.color} bg-opacity-10`}>
        <Icon size={48} className={content.color} />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">{content.title}</h2>
      <p className="text-slate-400 max-w-md text-lg">{content.desc}</p>
      
      <div className="mt-8 flex gap-3">
        <div className="h-2 w-2 rounded-full bg-slate-700 animate-bounce"></div>
        <div className="h-2 w-2 rounded-full bg-slate-700 animate-bounce delay-100"></div>
        <div className="h-2 w-2 rounded-full bg-slate-700 animate-bounce delay-200"></div>
      </div>
      
      <p className="mt-4 text-xs text-slate-600 uppercase tracking-widest">Coming in v1.1</p>
    </div>
  );
};

export default PlaceholderView;