import React from 'react';
import { AppConfig } from '../types';
import { Save } from 'lucide-react';

interface AdminPanelProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, setConfig, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Admin Configuration</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Primary Brand Color</label>
            <div className="flex items-center gap-4">
              <input 
                type="color" 
                value={config.brandColor}
                onChange={(e) => setConfig({ ...config, brandColor: e.target.value })}
                className="h-10 w-20 bg-transparent border-0 rounded cursor-pointer"
              />
              <span className="text-slate-300 font-mono">{config.brandColor}</span>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-400 mb-2">Display Settings</label>
             <div className="p-3 bg-slate-800 rounded-lg text-sm text-slate-500">
               Additional admin settings (Asset Whitelist, API Keys) would go here.
             </div>
          </div>

          <div className="flex gap-3 pt-4">
             <button 
               onClick={onClose}
               className="flex-1 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
             >
               Close
             </button>
             <button 
               onClick={onClose}
               className="flex-1 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-500 flex items-center justify-center gap-2"
             >
               <Save size={18} /> Save Changes
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
