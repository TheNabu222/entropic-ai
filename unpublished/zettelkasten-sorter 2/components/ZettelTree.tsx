import React, { useState, useCallback } from 'react';
import { TreeNode } from './TreeNode';
import { ZettelNode } from '../types';
import { ContextMenu } from './ContextMenu';
import { ARCHIVE_DATA } from '../data/archiveData';

interface ZettelTreeProps {
  nodes: ZettelNode[];
}

export function ZettelTree({ nodes }: ZettelTreeProps) {
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    node: ZettelNode | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });

  const handleContextMenu = useCallback((event: React.MouseEvent, node: ZettelNode) => {
    event.preventDefault(); // Prevent native browser menu
    event.stopPropagation(); // Stop bubbling so parent nodes don't also trigger
    
    setMenuState({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      node: node,
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuState(prev => ({ ...prev, visible: false }));
  }, []);

  const handleArchive = useCallback((node: ZettelNode) => {
      try {
          const saved = localStorage.getItem('nabu_archive_data');
          const currentArchive = saved ? JSON.parse(saved) : ARCHIVE_DATA;
          
          if (currentArchive.some((z: any) => z.id === node.id)) {
              alert(`Zettel ${node.id} already exists in the archive.`);
              return;
          }

          // Map kingdom to category
          const kingdomMap: Record<string, string> = {
              'EXISTENTIA': 'Phenomenon',
              'COGNITIO': 'Concept',
              'VALOR': 'Protocol',
              'SIGNIFICATIO': 'Culture',
              'SYSTEMA': 'Protocol',
              'ACTUS': 'Event',
              'UNKNOWN': 'Concept'
          };

          const newZettel = {
              id: node.id,
              category: kingdomMap[node.kingdom || 'UNKNOWN'] || 'Concept',
              title: node.title,
              description: `Imported from Zettelkasten Sorter. Kingdom: ${node.kingdom}`,
              tags: node.tags || [],
              related: node.links || []
          };

          const updatedArchive = [...currentArchive, newZettel];
          localStorage.setItem('nabu_archive_data', JSON.stringify(updatedArchive));
          alert(`Zettel ${node.id} saved to archive!`);
      } catch (e) {
          console.error("Failed to save to archive", e);
          alert("Failed to save to archive.");
      }
  }, []);

  return (
    <div className="text-gray-300 relative">
      <ul className="space-y-1">
        {nodes.map((node) => (
          <TreeNode 
            key={node.id} 
            node={node} 
            onNodeContextMenu={handleContextMenu}
          />
        ))}
      </ul>

      {menuState.visible && menuState.node && (
        <ContextMenu 
          x={menuState.x} 
          y={menuState.y} 
          node={menuState.node} 
          onClose={closeMenu} 
          onArchive={handleArchive}
        />
      )}
    </div>
  );
}