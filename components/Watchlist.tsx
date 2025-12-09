import React, { useMemo } from 'react';
import { Asset } from '../types';
import { ArrowUpRight, ArrowDownRight, Wallet, Plus, Trash2 } from 'lucide-react';

interface WatchlistProps {
  assets: Asset[];
  brandColor: string;
}

// Mockup extension of Asset for Portfolio
interface PortfolioItem extends Asset {
  amount: number;
  avgBuyPrice: number;
}

const Watchlist: React.FC<WatchlistProps> = ({ assets, brandColor }) => {
    // Creating deterministic mock portfolio based on existing assets
    const portfolio: PortfolioItem[] = useMemo(() => {
        const mockData: Record<string, { amount: number, avgBuyPrice: number }> = {
            'BTC': { amount: 0.45, avgBuyPrice: 58000 },
            'ETH': { amount: 4.2, avgBuyPrice: 2900 },
            'SOL': { amount: 155, avgBuyPrice: 85 },
            'PEPE': { amount: 25000000, avgBuyPrice: 0.0000065 },
        };

        return assets
            .filter(a => mockData[a.symbol])
            .map(a => ({
                ...a,
                amount: mockData[a.symbol].amount,
                avgBuyPrice: mockData[a.symbol].avgBuyPrice
            }));
    }, [assets]);

    const totalBalance = portfolio.reduce((acc, item) => acc + (item.price * item.amount), 0);
    const totalInvested = portfolio.reduce((acc, item) => acc + (item.avgBuyPrice * item.amount), 0);
    const totalPnL = totalBalance - totalInvested;
    const totalPnLPercent = (totalPnL / totalInvested) * 100;

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 relative overflow-hidden shadow-lg">
                    <div className="relative z-10">
                        <div className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
                            <Wallet size={16} /> Total Balance
                        </div>
                        <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                             {totalPnL >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                             ${Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({Math.abs(totalPnLPercent).toFixed(2)}%)
                             <span className="text-slate-500 font-normal ml-1">All Time PnL</span>
                        </div>
                    </div>
                    {/* Decor */}
                    <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                </div>
                
                {/* Quick Add */}
                <div 
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 border-dashed flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors cursor-pointer group"
                  title="Add new asset to portfolio"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-700 group-hover:bg-blue-500/20 text-slate-400 group-hover:text-blue-400 flex items-center justify-center mb-3 transition-colors">
                        <Plus size={24} />
                    </div>
                    <div className="text-slate-300 font-medium">Add Asset</div>
                </div>
            </div>

            {/* Holdings Table */}
             <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 backdrop-blur">
                  <h2 className="text-lg font-bold text-white">Your Holdings</h2>
                  <div className="text-sm text-slate-500">{portfolio.length} Assets</div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-medium">Asset</th>
                            <th className="p-4 font-medium">Price</th>
                            <th className="p-4 font-medium">Balance</th>
                            <th className="p-4 font-medium">Value</th>
                            <th className="p-4 font-medium text-right">PnL</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {portfolio.map(item => {
                            const value = item.price * item.amount;
                            const pnl = value - (item.avgBuyPrice * item.amount);
                            const pnlPercent = (pnl / (item.avgBuyPrice * item.amount)) * 100;
                            return (
                                <tr key={item.id} className="hover:bg-slate-700/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600 shadow-md">
                                                {item.symbol[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{item.name}</div>
                                                <div className="text-xs text-slate-500">{item.symbol}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-slate-200 font-mono">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                                        <div className={`text-xs ${item.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {item.change24h > 0 ? '+' : ''}{item.change24h}%
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-slate-200 font-medium">{item.amount.toLocaleString()} <span className="text-xs text-slate-500">{item.symbol}</span></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white font-bold font-mono">${value.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className={`font-bold font-mono ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {pnl >= 0 ? '+' : ''}{pnl.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                        </div>
                                        <div className={`text-xs ${pnl >= 0 ? 'text-green-500/70' : 'text-red-500/70'}`}>
                                            {pnlPercent.toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors" title="Remove asset">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
             </div>
        </div>
    );
}

export default Watchlist;