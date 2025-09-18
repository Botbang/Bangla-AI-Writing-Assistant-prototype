import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  onClear: () => void;
  currentApiKey: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, onClear, currentApiKey }) => {
  const [apiKey, setApiKey] = useState(currentApiKey);

  useEffect(() => {
    setApiKey(currentApiKey);
  }, [currentApiKey]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-500/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-8 max-w-md w-full m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h2>
            <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gemini API Key</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your new API key"
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-50"
              disabled={!apiKey.trim() || apiKey === currentApiKey}
            >
              Save Changes
            </button>
            <button
              onClick={onClear}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-colors"
            >
              Clear Key & Sign Out
            </button>
        </div>
      </div>
    </div>
  );
};
