
import React from 'react';
import type { FileInfo } from '../types';

interface FileInfoPanelProps {
  fileInfo: FileInfo;
}

// Using a named function for the component
const InfoRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-start py-2 border-b border-slate-700/50">
    <dt className="text-sm font-medium text-slate-400">{label}</dt>
    <dd className="text-sm text-slate-200 text-right break-words">{value}</dd>
  </div>
);


const FileInfoPanel: React.FC<FileInfoPanelProps> = ({ fileInfo }) => {
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-cyan-400 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>File Analysis</span>
        </h2>
      </div>
      <div className="p-4 space-y-2">
        <dl>
          <InfoRow label="File Name" value={<span className="font-mono bg-slate-700 px-2 py-1 rounded">{fileInfo.name}</span>} />
          <InfoRow label="File Size" value={formatBytes(fileInfo.size)} />
          <InfoRow label="MIME Type" value={fileInfo.type || 'N/A'} />
        </dl>
      </div>
      <div className="p-4 flex-grow flex flex-col min-h-0">
        <h3 className="text-md font-semibold text-slate-300 mb-2">Extracted Strings</h3>
        <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-3 flex-grow overflow-y-auto min-h-0">
          {fileInfo.extractedStrings.length > 0 ? (
            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
              {fileInfo.extractedStrings.join('\n')}
            </pre>
          ) : (
            <p className="text-sm text-slate-500 italic">No printable strings found in the file.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileInfoPanel;
