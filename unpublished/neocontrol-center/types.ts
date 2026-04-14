export interface NeocitiesFile {
  path: string;
  is_directory: boolean;
  size?: number;
  updated_at?: string;
  sha1_hash?: string;
  extension?: string;
}

export interface FileNode {
  name: string;
  path: string; // Full path
  isDirectory: boolean;
  children?: FileNode[];
  data?: NeocitiesFile;
  isOpen?: boolean; // For UI toggle state
}

export interface SiteStats {
  totalFiles: number;
  totalSize: number;
  orphans: string[];
  stubs: string[]; // Files under a certain size
  lastUpdated: string;
  fileTypes: Record<string, number>;
  folderUsage: Record<string, number>; // Size in bytes per root folder
}

export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  EXPLORER = 'EXPLORER',
  ANALYZER = 'ANALYZER', // Image Analysis / Magic Lens
  ORPHAN_SCANNER = 'ORPHAN_SCANNER',
  SETTINGS = 'SETTINGS'
}

export interface ApiConfig {
  apiKey: string;
  sitename: string;
  useMock: boolean;
  useProxy: boolean;
  proxyUrl: string;
}

export type AiCapability = 'FAST' | 'THINKING' | 'VISION';