import React from 'react';

interface ApiKeyInstructionsProps {
  onSettingsClick: () => void;
}

export const ApiKeyInstructions: React.FC<ApiKeyInstructionsProps> = ({ onSettingsClick }) => {
  return (
    <div className="text-center p-8 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
      <div className="max-w-2xl mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-200">API Key Required</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          To begin using the assistant, please set your Google Gemini API key in the settings.
        </p>

        <div className="mt-6 text-left p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">How to get your API Key</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400">
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline">Google AI Studio</a>.</li>
                <li>Log in with your Google account.</li>
                <li>Click on <strong>"Get API Key"</strong>.</li>
                <li>Create a new API key in your project.</li>
                <li>Copy the key and paste it into the settings.</li>
              </ol>
            </div>
             <div>
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">কীভাবে আপনার এপিআই কী পাবেন</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                <li><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline">Google AI Studio</a>-তে যান।</li>
                <li>আপনার Google অ্যাকাউন্ট দিয়ে লগ ইন করুন।</li>
                <li><strong>"Get API Key"</strong> বাটনে ক্লিক করুন।</li>
                <li>আপনার প্রকল্পে একটি নতুন API কী তৈরি করুন।</li>
                <li>কী-টি কপি করে সেটিংসে পেস্ট করুন।</li>
              </ol>
            </div>
          </div>
        </div>

        <button 
          onClick={onSettingsClick}
          className="mt-8 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg transition-transform duration-200 hover:scale-105"
        >
          Open Settings
        </button>
      </div>
    </div>
  );
};
