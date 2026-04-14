'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, FolderOpen, FileText, FileCode, Image, File, 
  ChevronRight, ChevronDown, ExternalLink, Edit, Trash2,
  AlertTriangle, FileWarning
} from 'lucide-react';

interface FileNode {
  path: string;
  is_directory: boolean;
  size?: number;
  updated_at?: string;
  isOrphan?: boolean;
  isStub?: boolean;
}

interface TreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children: TreeNode[];
  file?: FileNode;
}

interface FileTreeProps {
  files: FileNode[];
  onSelect?: (file: FileNode) => void;
  onEdit?: (file: FileNode) => void;
  onDelete?: (file: FileNode) => void;
  selectedPath?: string;
}

function buildTree(files: FileNode[]): TreeNode[] {
  const root: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();

  // Sort files so directories come first
  const sortedFiles = [...(files ?? [])].sort((a, b) => {
    if (a?.is_directory && !b?.is_directory) return -1;
    if (!a?.is_directory && b?.is_directory) return 1;
    return (a?.path ?? '').localeCompare(b?.path ?? '');
  });

  for (const file of sortedFiles) {
    const parts = (file?.path ?? '').split('/').filter(Boolean);
    let currentPath = '';
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i] ?? '';
      currentPath += '/' + part;
      const isLast = i === parts.length - 1;

      let existingNode = nodeMap.get(currentPath);
      if (!existingNode) {
        existingNode = {
          name: part,
          path: currentPath,
          isDirectory: isLast ? (file?.is_directory ?? false) : true,
          children: [],
          file: isLast ? file : undefined,
        };
        nodeMap.set(currentPath, existingNode);
        currentLevel.push(existingNode);
      }

      if (isLast && file) {
        existingNode.file = file;
      }

      currentLevel = existingNode.children;
    }
  }

  return root;
}

function getFileIcon(filename: string, isDirectory: boolean, isOpen: boolean) {
  if (isDirectory) {
    return isOpen ? <FolderOpen className="w-4 h-4 text-yellow-400" /> : <Folder className="w-4 h-4 text-yellow-400" />;
  }

  const ext = (filename?.split('.')?.pop() ?? '').toLowerCase();
  switch (ext) {
    case 'html':
    case 'htm':
      return <FileText className="w-4 h-4 text-cyan-400" />;
    case 'css':
      return <FileCode className="w-4 h-4 text-purple-400" />;
    case 'js':
    case 'ts':
      return <FileCode className="w-4 h-4 text-yellow-300" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
    case 'svg':
      return <Image className="w-4 h-4 text-green-400" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
}

function TreeNodeComponent({
  node,
  level = 0,
  onSelect,
  onEdit,
  onDelete,
  selectedPath,
}: {
  node: TreeNode;
  level?: number;
  onSelect?: (file: FileNode) => void;
  onEdit?: (file: FileNode) => void;
  onDelete?: (file: FileNode) => void;
  selectedPath?: string;
}) {
  const [isOpen, setIsOpen] = useState(level < 1);
  const isSelected = selectedPath === node.path;
  const file = node.file;

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition-all group hover:bg-cyan-500/10 ${
          isSelected ? 'bg-cyan-500/20 border-l-2 border-cyan-400' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (node.isDirectory) {
            setIsOpen(!isOpen);
          } else if (file && onSelect) {
            onSelect(file);
          }
        }}
      >
        {node.isDirectory ? (
          <span className="text-gray-500">
            {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        ) : (
          <span className="w-3" />
        )}
        
        {getFileIcon(node.name, node.isDirectory, isOpen)}
        
        <span className={`flex-1 text-sm truncate ${
          node.isDirectory ? 'text-yellow-300 font-medium' : 'text-gray-200'
        }`}>
          {node.name}
        </span>

        {file?.isOrphan && (
          <span title="Orphan page" className="text-red-400">
            <AlertTriangle className="w-3 h-3" />
          </span>
        )}
        
        {file?.isStub && (
          <span title="Stub/WIP page" className="text-yellow-400">
            <FileWarning className="w-3 h-3" />
          </span>
        )}

        {!node.isDirectory && file && (
          <div className="hidden group-hover:flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(file);
              }}
              className="p-1 hover:bg-cyan-500/20 rounded text-cyan-400"
              title="Edit"
            >
              <Edit className="w-3 h-3" />
            </button>
            <a
              href={`https://coaiexist.wtf${node.path}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 hover:bg-cyan-500/20 rounded text-cyan-400"
              title="Open in new tab"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && node.children.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child) => (
              <TreeNodeComponent
                key={child.path}
                node={child}
                level={level + 1}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                selectedPath={selectedPath}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FileTree({ files, onSelect, onEdit, onDelete, selectedPath }: FileTreeProps) {
  const tree = useMemo(() => buildTree(files ?? []), [files]);

  if (!files?.length) {
    return (
      <div className="text-center text-gray-400 py-8">
        <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No files loaded</p>
        <p className="text-xs mt-1">Click "Scan Site" to load files</p>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm">
      {tree.map((node) => (
        <TreeNodeComponent
          key={node.path}
          node={node}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          selectedPath={selectedPath}
        />
      ))}
    </div>
  );
}
