
import React from 'react';
import type { FileInfo } from '../types';
import FileInfoPanel from './FileInfoPanel';
import ChatPanel from './ChatPanel';

interface AnalysisViewProps {
  fileInfo: FileInfo;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ fileInfo }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-1">
        <FileInfoPanel fileInfo={fileInfo} />
      </div>
      <div className="lg:col-span-2">
        <ChatPanel fileInfo={fileInfo} />
      </div>
    </div>
  );
};

export default AnalysisView;
