
import React, { useState, useEffect } from 'react';
import { Asset, FilterState, AppConfig, ViewType, AIInsight } from './types';
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
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    brandColor: '#3b82f6', // Default Blue
    visibleAssets: [],
  });
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // Real-time data fetching
  useEffect(() => {
    const fetchMarketData = async () => {
      // Create a copy of assets to update
      let currentAssets = [...assets];

      // Fetch data for each asset sequentially to respect rate limits
      for (let i = 0; i < currentAssets.length; i++) {
        const asset = currentAssets[i];
        try {
          // Import dynamically to avoid circular dependencies if any, though not needed here really
          const { fetchAssetData } = await import('./services/taapi');
          const updatedAsset = await fetchAssetData(asset.id, asset);

          // Update state immediately for this asset to show progress
          setAssets(prev => prev.map(a => a.id === asset.id ? updatedAsset : a));

          // Wait 2 seconds between requests (Free tier limit is often 1 request / 15s, but let's try 2s for now or assume user has better key)
          // If free tier (1 req/15s), this loop will be slow. 
          // We'll use 1.5s delay as a baseline for "Basic" tier or "Free" with burst.
          await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
          console.error(`Error updating ${asset.id}`, error);
        }
      }
    };

    fetchMarketData();

    // Optional: Poll every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
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
            aiInsights={aiInsights}
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
          onAnalysisComplete={(insights) => setAiInsights(insights)}
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
