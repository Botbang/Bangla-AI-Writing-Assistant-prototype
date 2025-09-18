
export interface Correction {
  incorrect: string;
  correct: string;
  explanation: string;
}

// FIX: Added FileInfo and ChatMessage interfaces to resolve import errors.
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  extractedStrings: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
