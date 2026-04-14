import React, { useEffect, useRef } from 'react';
import { ZettelNode } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  node: ZettelNode;
  onClose: () => void;
  onArchive?: (node: ZettelNode) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, node, onClose, onArchive }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [onClose]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    onClose();
  };

  // Ensure menu doesn't overflow viewport (basic check)
  const style: React.CSSProperties = {
    top: y,
    left: x,
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-gray-800 border border-gray-600 rounded-md shadow-2xl py-1 w-56 text-sm text-gray-200 backdrop-blur-sm bg-opacity-95"
      style={style}
    >
      <div className="px-4 py-2 border-b border-gray-700 bg-gray-800/50 rounded-t-md">
         <p className="font-semibold text-xs text-indigo-400 uppercase tracking-wider">Options</p>
         <p className="font-mono text-xs text-gray-500 truncate mt-0.5" title={node.id}>{node.id}</p>
      </div>
      
      <button
        className="w-full text-left px-4 py-2 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors flex items-center group"
        onClick={() => handleCopy(node.id)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copy ID
      </button>

      <button
        className="w-full text-left px-4 py-2 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors flex items-center group"
        onClick={() => handleCopy(node.title)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Copy Title
      </button>
      
      <button
        className="w-full text-left px-4 py-2 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors flex items-center group"
        onClick={() => handleCopy(`[${node.id}] :: ${node.title}`)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Copy Full Path
      </button>

      {onArchive && (
        <button
            className="w-full text-left px-4 py-2 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors flex items-center group border-t border-gray-700"
            onClick={() => { onArchive(node); onClose(); }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Save to Archive
        </button>
      )}
    </div>
  );
};