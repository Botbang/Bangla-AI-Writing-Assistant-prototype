
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { FileInfo, ChatMessage } from '../types';
import { GREETING_MESSAGE, SUGGESTED_PROMPTS } from '../constants';
import { getGuidance } from '../services/geminiService';

interface ChatPanelProps {
  fileInfo: FileInfo;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ fileInfo }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'greeting', role: 'assistant', content: GREETING_MESSAGE }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = [...messages, userMessage];
    const assistantResponse = await getGuidance(fileInfo, history, messageText);

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: assistantResponse,
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  }, [isLoading, messages, fileInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-cyan-400 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Gemini Assistant</span>
        </h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-6">
        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl lg:max-w-2xl px-5 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-800 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
               <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-pre:bg-slate-900/70 prose-pre:p-3 prose-pre:rounded-md">
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
               </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="max-w-xl lg:max-w-2xl px-5 py-3 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-none flex items-center space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700">
        {!isLoading && messages.length <= 1 && (
             <div className="mb-3 flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button key={i} onClick={() => handleSendMessage(prompt)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-full transition-colors">
                        {prompt}
                    </button>
                ))}
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this file..."
            disabled={isLoading}
            className="flex-grow bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-600 flex items-center justify-center w-28"
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
