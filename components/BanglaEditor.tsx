import React, { useState, useRef, useMemo, useEffect } from 'react';
import type { Correction } from '../types';

interface SuggestionPopoverProps {
  correction: Correction;
  position: { top: number; left: number };
  onApply: (correction: Correction) => void;
  onClose: () => void;
  onIgnore: () => void;
  onAddToDictionary: (word: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const SuggestionPopover: React.FC<SuggestionPopoverProps> = ({ 
    correction, position, onApply, onClose, onIgnore, onAddToDictionary, onMouseEnter, onMouseLeave 
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  
  return (
    <div
      ref={popoverRef}
      style={{ top: position.top, left: position.left, maxWidth: '20rem' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute z-20 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-2xl p-3 text-sm flex flex-col space-y-2"
    >
      <p className="font-semibold text-slate-700 dark:text-slate-300">সংশোধন:</p>
      <button
        onClick={() => onApply(correction)}
        className="w-full text-left px-3 py-1.5 bg-emerald-100/50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-md transition-colors"
      >
        {correction.correct}
      </button>
      <p className="text-xs text-slate-500 dark:text-slate-400 italic border-t border-slate-200 dark:border-slate-700 pt-2">{correction.explanation}</p>
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onIgnore}
          className="flex-1 text-center px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs rounded-md transition-colors"
        >
         উপেক্ষা করুন
        </button>
         <button
          onClick={() => onAddToDictionary(correction.incorrect)}
          className="flex-1 text-center px-2 py-1 bg-sky-600 hover:bg-sky-700 text-sky-100 dark:bg-sky-700 dark:hover:bg-sky-600 dark:text-sky-200 text-xs rounded-md transition-colors"
        >
          ডিকশনারিতে যোগ করুন
        </button>
      </div>
    </div>
  );
};


interface BanglaEditorProps {
  text: string;
  corrections: Correction[];
  dictionary: string[];
  onTextChange: (newText: string) => void;
  onAddToDictionary: (word: string) => void;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

export const BanglaEditor: React.FC<BanglaEditorProps> = ({ text, corrections, dictionary, onTextChange, onAddToDictionary, onFileUpload, isLoading, isDisabled = false }) => {
  const [activeCorrection, setActiveCorrection] = useState<{ correction: Correction; index: number } | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [isCopied, setIsCopied] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);
  const hidePopoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const recognitionRef = useRef<any>(null); // Using `any` for SpeechRecognition
  const textBeforeListeningRef = useRef('');

  // Setup speech recognition on component mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
        setIsSpeechRecognitionSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'bn-BD';
        recognition.interimResults = true;
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    } else {
        setIsSpeechRecognitionSupported(false);
    }

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
    };
  }, []);

  const handleToggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition || isLoading || isDisabled) return;

    if (isListening) {
        recognition.stop();
    } else {
        textBeforeListeningRef.current = text;
        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0])
                .map((result: any) => result.transcript)
                .join('');

            const separator = textBeforeListeningRef.current.trim() && transcript.trim() ? ' ' : '';
            onTextChange(textBeforeListeningRef.current + separator + transcript);
        };
        recognition.start();
    }
  };
  
  const handleCorrectionApply = (correctionToApply: Correction) => {
      onTextChange(text.replace(correctionToApply.incorrect, correctionToApply.correct));
      setActiveCorrection(null);
  };

  const handleAddToDictionaryAndClose = (word: string) => {
    onAddToDictionary(word);
    setActiveCorrection(null);
  }
  
  const handleHighlightMouseEnter = (correction: Correction, index: number, event: React.MouseEvent) => {
    if (hidePopoverTimeout.current) {
      clearTimeout(hidePopoverTimeout.current);
      hidePopoverTimeout.current = null;
    }

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const displayRect = displayRef.current?.getBoundingClientRect();
    if(!displayRect) return;

    setPopoverPosition({
      top: rect.bottom - displayRect.top + 5,
      left: rect.left - displayRect.left,
    });
    setActiveCorrection({ correction, index });
  };
  
  const handleMouseLeaveWithDelay = () => {
      hidePopoverTimeout.current = setTimeout(() => {
          setActiveCorrection(null);
      }, 200); // 200ms delay to allow moving mouse to popover
  };

  const filteredCorrections = useMemo(() => {
    return corrections.filter(c => !dictionary.includes(c.incorrect));
  }, [corrections, dictionary]);
  
  const getCorrectedText = () => {
    const sortedCorrections = [...filteredCorrections].sort((a, b) => b.incorrect.length - a.incorrect.length);

    let newText = text;
    sortedCorrections.forEach(correction => {
        newText = newText.split(correction.incorrect).join(correction.correct);
    });
    return newText;
  }

  const handleFixAll = () => {
    onTextChange(getCorrectedText());
    setActiveCorrection(null);
  };

  const handleCopyToClipboard = () => {
    if (isCopied) return;

    const correctedText = getCorrectedText();

    navigator.clipboard.writeText(correctedText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Could not copy text to clipboard.');
    });
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
      // Reset the input value to allow uploading the same file again
      event.target.value = '';
    }
  };

  const renderedText = useMemo(() => {
    if (isDisabled || !filteredCorrections.length) {
      return text;
    }
    
    const incorrectPhrases = filteredCorrections.map(c => c.incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const validPhrases = incorrectPhrases.filter(phrase => phrase.length > 0);
    if (validPhrases.length === 0) return text;
    
    const regex = new RegExp(`(${validPhrases.join('|')})`, 'g');
    const parts = text.split(regex);
    let errorIndex = 0;

    return parts.map((part, i) => {
      const correction = filteredCorrections.find(c => c.incorrect === part);
      if (correction) {
        const currentIndex = errorIndex++;
        return (
          <span
            key={`${i}-${currentIndex}`}
            className="bg-red-500/20 dark:bg-red-500/30 hover:bg-red-500/30 dark:hover:bg-red-500/40 cursor-pointer rounded px-1 py-0.5 transition-colors"
            onMouseEnter={(e) => handleHighlightMouseEnter(correction, currentIndex, e)}
            onMouseLeave={handleMouseLeaveWithDelay}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  }, [text, filteredCorrections, isDisabled]);


  return (
    <div className="relative bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
             <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                বাংলা এডিটর
             </h2>
             <div className="flex items-center space-x-2 md:space-x-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".txt,.rtf,.docx"
                />
                <button
                    onClick={handleFileButtonClick}
                    disabled={isLoading || isDisabled}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Upload a document (.txt, .rtf, .docx) to edit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline">ডকুমেন্ট আপলোড</span>
                </button>
                {filteredCorrections.length > 0 && !isLoading && !isDisabled && (
                    <button 
                        onClick={handleFixAll}
                        disabled={isLoading || isDisabled}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        <span className="hidden sm:inline">সব ঠিক করুন</span>
                    </button>
                )}
                {isSpeechRecognitionSupported && !isDisabled && (
                    <button
                        onClick={handleToggleListening}
                        disabled={isLoading}
                        className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-emerald-500 ${
                            isListening 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                        aria-label={isListening ? 'Stop dictation' : 'Start dictation'}
                        title={isListening ? 'Stop dictation' : 'Start dictation'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93V17h-2v-2.07A5 5 0 014 11V9h2v2a3 3 0 006 0V9h2v2a5 5 0 01-5 4.93z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
                 {isLoading && (
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                        <div className="w-4 h-4 border-2 border-slate-400 dark:border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>পরীক্ষা চলছে...</span>
                    </div>
                 )}
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700">
            <div className="p-4 bg-white dark:bg-slate-800 md:rounded-bl-xl">
                 <textarea
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    placeholder={isDisabled ? "অনুগ্রহ করে কাজ শুরু করার জন্য সেটিংসে আপনার API কী যোগ করুন।" : "এখানে লিখুন বা একটি ডকুমেন্ট আপলোড করুন..."}
                    disabled={isDisabled}
                    className="w-full h-64 md:h-96 p-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base leading-relaxed disabled:opacity-70 disabled:cursor-not-allowed"
                 />
            </div>
            
            <div ref={displayRef} className="relative p-4 bg-white dark:bg-slate-800 md:rounded-br-xl">
                {text.trim() && !isDisabled && (
                    <button
                        onClick={handleCopyToClipboard}
                        className="absolute top-6 right-6 z-10 px-3 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md transition-all duration-200 disabled:opacity-50"
                        disabled={isCopied}
                        title="Copy corrected text to clipboard"
                    >
                        {isCopied ? (
                            <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                কপি হয়েছে!
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                কপি করুন
                            </span>
                        )}
                    </button>
                )}
                <div className="w-full h-64 md:h-96 p-2 bg-slate-50 dark:bg-slate-900/50 border border-transparent rounded-md text-base leading-relaxed whitespace-pre-wrap overflow-y-auto">
                    {renderedText}
                </div>
                 {activeCorrection && (
                    <SuggestionPopover
                        correction={activeCorrection.correction}
                        position={popoverPosition}
                        onApply={handleCorrectionApply}
                        onClose={() => setActiveCorrection(null)}
                        onIgnore={() => setActiveCorrection(null)}
                        onAddToDictionary={handleAddToDictionaryAndClose}
                        onMouseEnter={() => {
                            if (hidePopoverTimeout.current) {
                                clearTimeout(hidePopoverTimeout.current);
                                hidePopoverTimeout.current = null;
                            }
                        }}
                        onMouseLeave={handleMouseLeaveWithDelay}
                    />
                )}
            </div>
        </div>
        <div className="p-2 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
            <p><strong>বাম:</strong> আপনার লেখা | <strong>ডান:</strong> AI বিশ্লেষণ ও পরামর্শ (ভুলের উপর হোভার করুন)</p>
        </div>
    </div>
  );
};