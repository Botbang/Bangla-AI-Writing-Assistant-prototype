
import React, { useState, useEffect, useCallback } from 'react';
import { BanglaEditor } from './components/BanglaEditor';
import { useDebounce } from './hooks/useDebounce';
import { checkBengaliText, initializeGeminiClient } from './services/geminiService';
import type { Correction } from './types';
import { SettingsModal } from './components/SettingsModal';
import { ThemeToggle } from './components/ThemeToggle';
import { parseDocument } from './services/documentParser';

const GitHubIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
);

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isGeminiReady, setIsGeminiReady] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  // Writer state
  const [text, setText] = useState<string>('আমার সোনার বংলা, আমি তোমায় ভালবসি।');
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [dictionary, setDictionary] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const debouncedText = useDebounce(text, 1000);

  // App state
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      if (initializeGeminiClient(storedApiKey)) {
        setApiKey(storedApiKey);
        setIsGeminiReady(true);
      }
    }
    
    const storedDictionary = localStorage.getItem('bangla_dictionary');
    if (storedDictionary) {
      setDictionary(JSON.parse(storedDictionary));
    }
  }, []);

  useEffect(() => {
    const processText = async () => {
      if (isGeminiReady && debouncedText) {
        setIsLoading(true);
        setError(null);
        try {
          const result = await checkBengaliText(debouncedText);
          setCorrections(result);
        } catch (e) {
          console.error(e);
          setError('Failed to get corrections. Please check your API key in Settings and your network connection.');
          setCorrections([]);
        } finally {
          setIsLoading(false);
        }
      } else if (!debouncedText) {
        setCorrections([]);
        setError(null);
      }
    };
    processText();
  }, [debouncedText, isGeminiReady]);

  const handleSaveApiKey = (newApiKey: string) => {
    if (initializeGeminiClient(newApiKey)) {
        localStorage.setItem('gemini_api_key', newApiKey);
        setApiKey(newApiKey);
        setIsGeminiReady(true);
        setShowSettingsModal(false);
        setApiKeyError(null);
    } else {
        setApiKeyError("Failed to initialize with the provided key.");
    }
  };
  
  const handleClearApiKey = () => {
      localStorage.removeItem('gemini_api_key');
      setApiKey('');
      setIsGeminiReady(false);
      setShowSettingsModal(false);
  };

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const handleAddToDictionary = (word: string) => {
    if (!dictionary.includes(word)) {
        const newDictionary = [...dictionary, word];
        setDictionary(newDictionary);
        localStorage.setItem('bangla_dictionary', JSON.stringify(newDictionary));
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
        const content = await parseDocument(file);
        setText(content);
        setCorrections([]); // Clear old corrections from previous text
    } catch (e: any) {
        console.error("Error processing document:", e);
        setError(e.message || 'Could not process the file. It may be corrupted or in an unsupported format.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)}
        onSave={handleSaveApiKey}
        onClear={handleClearApiKey}
        currentApiKey={apiKey}
      />
      
      <div className="min-h-screen font-sans flex flex-col items-center p-4 sm:p-8">
        <header className="w-full max-w-4xl mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <div className="flex items-center justify-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-wide">
                Bangla AI Writing Assistant
              </h1>
            </div>
            <div className="mt-4 sm:mt-0 flex-shrink-0 flex items-center space-x-2">
                <ThemeToggle />
                <button 
                    onClick={() => setShowSettingsModal(true)}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Settings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
          </div>
            <>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-center sm:text-left">
                Elevate your Bengali writing with our intelligent assistant. Get real-time grammar corrections, spelling suggestions, and stylistic improvements powered by Google Gemini to make your text clear, accurate, and professional.
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-center sm:text-left" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                বাংলা এআই রাইটিং অ্যাসিস্ট্যান্টের মাধ্যমে নির্ভুল বাংলা লিখুন। Google Gemini দ্বারা চালিত, রিয়েল-টাইম ব্যাকরণ সংশোধন, বানান পরামর্শ এবং শৈলীগত উন্নতির মাধ্যমে আপনার লেখাকে করুন পরিষ্কার, নির্ভুল এবং পেশাদার।
              </p>
            </>
          
          {!isGeminiReady && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 rounded-lg w-full" role="alert">
                <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <div>
                        <h3 className="font-bold">API Key Required</h3>
                        <p className="mt-1 text-sm">This application requires a Google Gemini API key to function. Please set your key in the settings.</p>
                        <div className="mt-3" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                            <h4 className="font-semibold">কীভাবে আপনার এপিআই কী পাবেন:</h4>
                            <ol className="list-decimal list-inside space-y-1 text-sm mt-1">
                                <li><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline">Google AI Studio</a>-তে যান।</li>
                                <li>আপনার Google অ্যাকাউন্ট দিয়ে লগ ইন করুন।</li>
                                <li><strong>"Get API Key"</strong> বাটনে ক্লিক করে একটি নতুন কী তৈরি করুন।</li>
                                <li>কী-টি কপি করে এখানকার <button onClick={() => setShowSettingsModal(true)} className="underline font-semibold text-emerald-600 dark:text-emerald-400">সেটিংসে</button> পেস্ট করুন।</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg w-full text-center">
              <strong>Error:</strong> {error}
            </div>
          )}
        </header>

        <main className="w-full max-w-4xl flex-grow">
           <BanglaEditor
              text={text}
              corrections={corrections}
              dictionary={dictionary}
              onTextChange={handleTextChange}
              onAddToDictionary={handleAddToDictionary}
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
              isDisabled={!isGeminiReady}
            />
        </main>

        <footer className="w-full max-w-4xl mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-slate-500 dark:text-slate-500 text-sm">
            <div className="flex flex-col items-center space-y-3">
                <p>Powered by Google Gemini.</p>
                <div className="flex items-center space-x-4">
                     <p>&copy; {new Date().getFullYear()} Afnan Hossain</p>
                     <a href="https://github.com/Botbang" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                        <GitHubIcon />
                        <span>GitHub</span>
                    </a>
                </div>
            </div>
        </footer>
      </div>
    </>
  );
};

export default App;