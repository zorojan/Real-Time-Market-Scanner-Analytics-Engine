import React from 'react';
import { Waves, ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine, AlertOctagon, Wallet } from 'lucide-react';

interface WhaleTransaction {
  id: string;
  symbol: string;
  amount: number;
  valueUsd: number;
  from: string;
  to: string;
  type: 'Transfer' | 'Inflow' | 'Outflow'; // Inflow to Exchange, Outflow from Exchange
  time: string;
  hash: string;
}

const MOCK_WHALES: WhaleTransaction[] = [
  {
    id: 'tx-1',
    symbol: 'BTC',
    amount: 1250,
    valueUsd: 78500000,
    from: 'Unknown Wallet',
    to: 'Binance (Hot Wallet)',
    type: 'Inflow',
    time: '2 min ago',
    hash: '8a9f...3k29'
  },
  {
    id: 'tx-2',
    symbol: 'ETH',
    amount: 15000,
    valueUsd: 48000000,
    from: 'Coinbase',
    to: 'Unknown Wallet',
    type: 'Outflow',
    time: '5 min ago',
    hash: '2b8d...9l12'
  },
  {
    id: 'tx-3',
    symbol: 'SOL',
    amount: 500000,
    valueUsd: 72500000,
    from: 'Unknown Wallet',
    to: 'Unknown Wallet',
    type: 'Transfer',
    time: '12 min ago',
    hash: '1c7e...5m34'
  },
  {
    id: 'tx-4',
    symbol: 'USDT',
    amount: 100000000,
    valueUsd: 100000000,
    from: 'Tether Treasury',
    to: 'Binance',
    type: 'Inflow',
    time: '15 min ago',
    hash: 'Mint...2k99'
  },
  {
    id: 'tx-5',
    symbol: 'PEPE',
    amount: 400000000000,
    valueUsd: 3200000,
    from: 'Unknown Wallet',
    to: 'OKX',
    type: 'Inflow',
    time: '22 min ago',
    hash: '9d1f...8j45'
  },
  {
    id: 'tx-6',
    symbol: 'BTC',
    amount: 500,
    valueUsd: 31400000,
    from: 'Gemini',
    to: 'Unknown Wallet',
    type: 'Outflow',
    time: '30 min ago',
    hash: '4e5a...1p67'
  }
];

const WhaleAlerts: React.FC<{ brandColor: string }> = ({ brandColor }) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-stretch">
        <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
           <div className="relative z-10">
             <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
               <Waves className="text-blue-500" /> Institutional Activity
             </h1>
             <p className="text-slate-400">Tracking large on-chain movements (> $1M USD).</p>
           </div>
           {/* Background Pattern */}
           <div className="absolute right-0 top-0 h-full w-64 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
           <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none"></div>
        </div>

        {/* Stats Widget */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-96">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">24h Net Flow</div>
                <div className="text-xl font-bold text-red-400 flex items-center gap-1">
                    <ArrowDownToLine size={18} /> -$124.5M
                </div>
                <div className="text-[10px] text-slate-600">Exchange Reserves Increasing</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Largest Tx</div>
                <div className="text-xl font-bold text-white flex items-center gap-1">
                    <AlertOctagon size={18} className="text-yellow-500" /> $100M
                </div>
                <div className="text-[10px] text-slate-600">USDT Mint to Binance</div>
            </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 backdrop-blur">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wallet size={18} className="text-slate-400" /> Recent Large Transactions
            </h2>
            <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                    <ArrowDownToLine size={12} /> INFLOW (SELL PRESSURE)
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                    <ArrowUpFromLine size={12} /> OUTFLOW (ACCUMULATION)
                </span>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Asset</th>
                <th className="p-4 font-medium">Value (USD)</th>
                <th className="p-4 font-medium hidden md:table-cell">From / To</th>
                <th className="p-4 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
                {MOCK_WHALES.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-700/50 transition-colors group">
                        <td className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                                    tx.type === 'Inflow' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                    tx.type === 'Outflow' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                    'bg-slate-700/50 border-slate-600 text-slate-300'
                                }`}>
                                    {tx.type === 'Inflow' && <ArrowDownToLine size={20} />}
                                    {tx.type === 'Outflow' && <ArrowUpFromLine size={20} />}
                                    {tx.type === 'Transfer' && <ArrowRightLeft size={20} />}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${
                                        tx.type === 'Inflow' ? 'text-red-400' :
                                        tx.type === 'Outflow' ? 'text-green-400' :
                                        'text-white'
                                    }`}>{tx.type.toUpperCase()}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{tx.hash}</span>
                                </div>
                            </div>
                        </td>
                        <td className="p-4">
                            <div className="font-bold text-white">{tx.amount.toLocaleString()} {tx.symbol}</div>
                        </td>
                        <td className="p-4">
                            <div className="font-mono text-slate-200">${tx.valueUsd.toLocaleString()}</div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                            <div className="flex flex-col text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500 w-8">From:</span>
                                    <span className={tx.type === 'Outflow' ? 'text-blue-400 font-medium' : 'text-slate-300'}>
                                        {tx.from}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500 w-8">To:</span>
                                    <span className={tx.type === 'Inflow' ? 'text-orange-400 font-medium' : 'text-slate-300'}>
                                        {tx.to}
                                    </span>
                                </div>
                            </div>
                        </td>
                        <td className="p-4 text-right">
                            <span className="text-slate-400 text-sm font-medium">{tx.time}</span>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
      </div>

    </div>
  );
};

export default WhaleAlerts;