import { NeocitiesFile, FileNode, SiteStats } from '../types';
import { STUB_SIZE_LIMIT } from '../constants';

export const buildFileTree = (files: NeocitiesFile[]): FileNode[] => {
  const root: FileNode[] = [];
  const map: Record<string, FileNode> = {};

  // Helper to ensure a node exists in the map
  const ensureNode = (path: string, isDir: boolean): FileNode => {
    if (map[path]) return map[path];
    
    const parts = path.split('/');
    const name = parts[parts.length - 1];
    
    const newNode: FileNode = {
      name,
      path,
      isDirectory: isDir,
      children: isDir ? [] : undefined,
      isOpen: false
    };
    
    map[path] = newNode;
    return newNode;
  };

  // 1. First Pass: Ensure all intermediate paths exist
  files.forEach(f => {
      const parts = f.path.split('/');
      // Walk down the path and create directory nodes if they don't exist
      for (let i = 1; i < parts.length; i++) {
          const dirPath = parts.slice(0, i).join('/');
          ensureNode(dirPath, true);
      }
      
      // Create the file node itself (attach metadata if provided)
      const node = ensureNode(f.path, f.is_directory);
      node.data = f;
  });

  // 2. Second Pass: Build the tree structure by linking parents to children
  Object.values(map).forEach(node => {
    const parts = node.path.split('/');
    
    if (parts.length === 1) {
      if (!root.includes(node)) root.push(node);
    } else {
      const parentPath = parts.slice(0, -1).join('/');
      const parentNode = map[parentPath];
      
      if (parentNode && parentNode.children) {
        if (!parentNode.children.includes(node)) {
          parentNode.children.push(node);
        }
      } else {
        if (!root.includes(node)) root.push(node);
      }
    }
  });

  // 3. Sort: Directories first, then files, alphabetically
  const sortNodes = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.isDirectory === b.isDirectory) {
        return a.name.localeCompare(b.name);
      }
      return a.isDirectory ? -1 : 1;
    });
    nodes.forEach(node => {
      if (node.children) sortNodes(node.children);
    });
  };

  sortNodes(root);
  return root;
};

// Simple heuristic analysis for initial dashboard. 
// Deeper orphan analysis happens in OrphanScanner component.
export const analyzeSite = (files: NeocitiesFile[]): SiteStats => {
  let totalSize = 0;
  const fileTypes: Record<string, number> = {};
  const folderUsage: Record<string, number> = {};
  const stubs: string[] = [];
  
  files.forEach(f => {
    if (!f.is_directory && f.size) {
      totalSize += f.size;
      
      // File Type
      const ext = f.path.split('.').pop() || 'unknown';
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;

      // Folder Usage
      const rootFolder = f.path.includes('/') ? f.path.split('/')[0] : 'root';
      folderUsage[rootFolder] = (folderUsage[rootFolder] || 0) + f.size;

      // Stubs
      if (f.size < STUB_SIZE_LIMIT) {
        stubs.push(f.path);
      }
    }
  });

  return {
    totalFiles: files.length,
    totalSize,
    orphans: [], // Populated by Scanner component
    stubs,
    lastUpdated: new Date().toISOString(),
    fileTypes,
    folderUsage
  };
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};