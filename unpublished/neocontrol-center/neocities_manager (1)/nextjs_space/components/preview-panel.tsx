'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';

interface PreviewPanelProps {
  path: string | null;
  onClose: () => void;
}

export default function PreviewPanel({ path, onClose }: PreviewPanelProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (path) {
      setIsLoading(true);
    }
  }, [path]);

  if (!path) {
    return (
      <div className="panel h-full flex items-center justify-center text-gray-500">
        <p className="text-center">
          <span className="text-4xl mb-2 block">👁️</span>
          Select a file to preview
        </p>
      </div>
    );
  }

  const url = `https://coaiexist.wtf${path}`;

  return (
    <motion.div
      layout
      className={`panel flex flex-col overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50' : 'h-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-cyan-500/30 bg-cyan-500/5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-cyan-400 text-lg">👁️</span>
          <span className="text-sm font-mono text-gray-300 truncate">{path}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsLoading(true)}
            className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-cyan-400 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-green-400 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-purple-400 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
            <div className="flex items-center gap-2 text-cyan-400">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Loading preview...</span>
            </div>
          </div>
        )}
        <iframe
          src={url}
          title={`Preview: ${path}`}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </motion.div>
  );
}
