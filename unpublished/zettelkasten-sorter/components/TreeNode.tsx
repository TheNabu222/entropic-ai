import React, { useState } from 'react';
import { ZettelNode } from '../types';

interface TreeNodeProps {
  node: ZettelNode;
  onNodeContextMenu: (event: React.MouseEvent, node: ZettelNode) => void;
}

const getIconForNode = (node: ZettelNode, isExpanded: boolean) => {
    const hasChildren = node.children && node.children.length > 0;
    if (!hasChildren) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 mr-2 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );
};

const kingdomColors: Record<string, string> = {
  'EXISTENTIA': 'bg-purple-900/50 text-purple-200 border-purple-700/50',
  'COGNITIO': 'bg-blue-900/50 text-blue-200 border-blue-700/50',
  'ACTUS': 'bg-orange-900/50 text-orange-200 border-orange-700/50',
  'VALOR': 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50',
  'SYSTEMA': 'bg-green-900/50 text-green-200 border-green-700/50',
  'SIGNIFICATIO': 'bg-pink-900/50 text-pink-200 border-pink-700/50',
};

export const TreeNode: React.FC<TreeNodeProps> = ({ node, onNodeContextMenu }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  // Detect if the ID was auto-generated (e.g. "note-173...")
  // The parser generates IDs starting with "note-" for items without explicit brackets [ID]
  const isAutoId = node.id && node.id.startsWith('note-');

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <li>
      <div
        onClick={toggleExpand}
        onContextMenu={(e) => onNodeContextMenu(e, node)}
        className={`flex flex-wrap items-center gap-2 p-2 rounded-md hover:bg-gray-700/50 transition-colors duration-150 ${hasChildren ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-center flex-shrink-0">
            {getIconForNode(node, isExpanded)}
            
            {isAutoId ? (
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-500 bg-amber-900/20 border border-amber-800/30 px-2 py-0.5 rounded mr-2 select-none">
                Auto
                </span>
            ) : (
                <span className="font-mono text-xs text-indigo-400 bg-gray-700 px-2 py-1 rounded-md mr-2">
                {node.id}
                </span>
            )}
        </div>
        
        <span className={`text-gray-200 font-medium ${isAutoId ? 'italic text-gray-400' : ''}`}>
          {node.title}
        </span>

        {node.kingdom && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${kingdomColors[node.kingdom] || 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                {node.kingdom}
            </span>
        )}

        {node.tags && node.tags.map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-600">
                {tag}
            </span>
        ))}
      </div>
      {hasChildren && isExpanded && (
        <ul className="pl-6 border-l-2 border-gray-600 ml-2 mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              onNodeContextMenu={onNodeContextMenu}
            />
          ))}
        </ul>
      )}
    </li>
  );
};