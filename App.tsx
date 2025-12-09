
import React, { useState, useEffect } from 'react';
import { Asset, FilterState, AppConfig, ViewType } from './types';
import { INITIAL_ASSETS } from './constants';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import Dashboard from './components/Dashboard';
import AssetModal from './components/AssetModal';
import MarketAnalysisModal from './components/MarketAnalysisModal';
import AdminPanel from './components/AdminPanel';
import GlobalNav from './components/GlobalNav';
import PlaceholderView from './components/PlaceholderView';
import Watchlist from './components/Watchlist';
import News from './components/News';
import WhaleAlerts from './components/WhaleAlerts';

const App: React.FC = () => {
  // Global State
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [filters, setFilters] = useState<FilterState>({
    strategy: 'All',
    volatility: 50,
    marketCap: 50,
    rsi: 50, // Default Neutral
    minVolume: 0, // Default All
  });
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showMarketAnalysis, setShowMarketAnalysis] = useState(false);
  const [config, setConfig] = useState<AppConfig>({
    brandColor: '#3b82f6', // Default Blue
    visibleAssets: [],
  });
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // Simulation Effect: Real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        // Calculate dynamic movement based on volatility
        const volatilityFactor = asset.volatility === 'High' ? 0.015 : 0.005; // Increased volatility for demo
        const randomMove = Math.random() * volatilityFactor * 2 - volatilityFactor;
        const changeMult = 1 + randomMove;
        
        const newPrice = asset.price * changeMult;
        
        // Update 24h Change to be dynamic (drifts over time)
        const newChange24h = parseFloat((asset.change24h + (randomMove * 100)).toFixed(2));
        
        // Update momentum based on the direction of the move
        const momentumShift = randomMove > 0 ? 3 : -3;
        const newMomentum = Math.min(100, Math.max(0, asset.momentum + momentumShift));

        // Dynamic Verdict calculation based on new Momentum
        let newVerdict: Asset['verdict'] = 'Neutral';
        if (newMomentum >= 80) newVerdict = 'Strong Buy';
        else if (newMomentum >= 60) newVerdict = 'Buy';
        else if (newMomentum <= 20) newVerdict = 'Strong Sell';
        else if (newMomentum <= 40) newVerdict = 'Sell';

        // Randomly toggle flags occasionally to rotate "Top Cards"
        // 2% chance to toggle volume spike or oversold status per tick
        const newVolumeSpike = Math.random() > 0.98 ? !asset.volumeSpike : asset.volumeSpike;
        const newOversold = newMomentum < 25; // Oversold is strictly tied to low momentum
        
        // Jitter volume slightly
        const volumeJitter = 1 + ((Math.random() - 0.5) * 0.05);

        return {
          ...asset,
          price: newPrice,
          change24h: newChange24h,
          momentum: newMomentum,
          verdict: newVerdict,
          volumeSpike: newVolumeSpike,
          oversold: newOversold,
          volume24h: asset.volume24h * volumeJitter,
          // Update trend array for sparkline (remove first, add new price)
          trend: [...asset.trend.slice(1), newPrice]
        };
      }));
    }, 2000); // Update every 2 seconds for faster demo feel

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
      
      {/* Global Navigation Rail */}
      <GlobalNav 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        brandColor={config.brandColor} 
      />

      {/* Context Sidebar (Only visible on Dashboard) */}
      {currentView === 'dashboard' && (
        <FilterPanel 
          filters={filters} 
          setFilters={setFilters} 
          brandColor={config.brandColor} 
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Ticker & Header */}
        <Header 
          assets={assets} 
          onOpenAdmin={() => setShowAdmin(true)} 
          onOpenAnalysis={() => setShowMarketAnalysis(true)}
        />

        {/* Main Content Area */}
        {currentView === 'dashboard' ? (
          <Dashboard 
            assets={assets} 
            filters={filters} 
            onAssetClick={setSelectedAsset} 
            brandColor={config.brandColor}
          />
        ) : currentView === 'watchlist' ? (
          <Watchlist assets={assets} brandColor={config.brandColor} />
        ) : currentView === 'news' ? (
          <News brandColor={config.brandColor} />
        ) : currentView === 'whale' ? (
          <WhaleAlerts brandColor={config.brandColor} />
        ) : (
          <PlaceholderView view={currentView} />
        )}
      </div>

      {/* Modals */}
      {selectedAsset && (
        <AssetModal 
          asset={selectedAsset} 
          onClose={() => setSelectedAsset(null)} 
          brandColor={config.brandColor}
        />
      )}

      {showMarketAnalysis && (
        <MarketAnalysisModal 
          assets={assets}
          onClose={() => setShowMarketAnalysis(false)}
          brandColor={config.brandColor}
        />
      )}

      {showAdmin && (
        <AdminPanel 
          config={config} 
          setConfig={setConfig} 
          onClose={() => setShowAdmin(false)} 
        />
      )}

    </div>
  );
};

export default App;
