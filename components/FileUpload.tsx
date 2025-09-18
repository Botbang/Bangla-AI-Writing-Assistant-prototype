
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full p-10 border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging ? 'border-cyan-400 bg-slate-800/50 scale-105' : 'border-slate-600 bg-slate-800/20'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept=".exe"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mb-4 transition-colors ${isDragging ? 'text-cyan-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl font-semibold text-slate-300">Drop your .exe file here</p>
          <p className="text-slate-400 mt-2">or</p>
          <span className="mt-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-lg transition-transform duration-200 hover:scale-105">
            Browse File
          </span>
        </label>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg w-full">
          <strong>Error:</strong> {error}
        </div>
      )}
       <div className="mt-8 text-left text-slate-400 bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h2 className="text-lg font-semibold text-slate-200 mb-3">How it works:</h2>
            <ol className="list-decimal list-inside space-y-2">
                <li>Upload a Windows executable file (.exe).</li>
                <li>The app performs a safe, client-side scan to extract basic information like file size and embedded text strings. <strong>Your file never leaves your computer.</strong></li>
                <li>Use the chat interface to ask Gemini for guidance on how to analyze the file, what tools to use, and what the extracted data might mean.</li>
            </ol>
            <p className="mt-4 text-sm text-amber-400/80">
                <strong className="font-semibold">Disclaimer:</strong> This tool is for educational purposes only. Do not upload or analyze malicious software. Always perform reverse engineering in a safe, isolated environment (like a virtual machine).
            </p>
        </div>
    </div>
  );
};

export default FileUpload;
