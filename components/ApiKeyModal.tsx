import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
  error?: string | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, error }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-8 max-w-md w-full m-4">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-100">Enter Your Gemini API Key</h2>
            <p className="mt-2 text-slate-400">
                To use this application, please provide your Google Gemini API key. Your key will be stored securely in your browser's local storage.
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label htmlFor="apiKey" className="sr-only">Gemini API Key</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key here"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          
          {error && (
            <div className="mt-3 text-sm text-red-400 bg-red-900/30 border border-red-800 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              disabled={!apiKey.trim()}
            >
              Save and Continue
            </button>
          </div>
        </form>
         <div className="mt-4 text-center text-xs text-slate-500">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">
                Don't have a key? Get one from Google AI Studio.
            </a>
        </div>
      </div>
    </div>
  );
};
