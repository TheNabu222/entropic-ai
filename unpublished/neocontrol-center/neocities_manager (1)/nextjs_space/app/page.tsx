'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, FolderTree, FileText, BarChart3, Settings, Zap,
  Search, ChevronLeft, ChevronRight, AlertTriangle, FileWarning,
  Plus, Edit, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

import FileTree from '@/components/file-tree';
import StatsPanel from '@/components/stats-panel';
import PageList from '@/components/page-list';
import PreviewPanel from '@/components/preview-panel';
import QuickEditor from '@/components/quick-editor';
import SiteInfo from '@/components/site-info';

type Tab = 'files' | 'pages' | 'analytics' | 'settings';

interface FileNode {
  path: string;
  is_directory: boolean;
  size?: number;
  updated_at?: string;
  isOrphan?: boolean;
  isStub?: boolean;
}

interface PageData {
  id: string;
  path: string;
  filename: string;
  directory: string;
  category: string;
  isOrphan: boolean;
  isStub: boolean;
  wordCount: number;
  inboundLinks: number;
  title?: string;
  lastScanned?: string;
}

interface StatsData {
  totalPages: number;
  orphanCount: number;
  stubCount: number;
  categories: { name: string; count: number }[];
  lastScan?: string;
}

interface SiteInfoData {
  sitename: string;
  views: number;
  hits: number;
  created_at: string;
  last_updated: string;
  domain?: string;
  tags: string[];
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('files');
  const [files, setFiles] = useState<FileNode[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [siteInfo, setSiteInfo] = useState<SiteInfoData | null>(null);
  
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoadingSiteInfo, setIsLoadingSiteInfo] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [previewPath, setPreviewPath] = useState<string | null>(null);
  const [editorFile, setEditorFile] = useState<{ path: string } | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageFilter, setPageFilter] = useState<'all' | 'orphans' | 'stubs'>('all');

  // Fetch site info on mount
  useEffect(() => {
    fetchSiteInfo();
    fetchStats();
  }, []);

  const fetchSiteInfo = async () => {
    setIsLoadingSiteInfo(true);
    try {
      const res = await fetch('/api/neocities/info');
      const data = await res.json();
      if (data?.success) {
        setSiteInfo(data?.info ?? null);
      }
    } catch (error) {
      console.error('Failed to fetch site info:', error);
    } finally {
      setIsLoadingSiteInfo(false);
    }
  };

  const fetchFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const res = await fetch('/api/neocities/files');
      const data = await res.json();
      if (data?.success) {
        setFiles(data?.files ?? []);
        toast.success(`Loaded ${data?.count ?? 0} files`);
      } else {
        toast.error(data?.error ?? 'Failed to load files');
      }
    } catch (error) {
      toast.error('Failed to fetch files');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/pages/stats');
      const data = await res.json();
      if (data?.success) {
        setStats(data?.stats ?? null);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      if (data?.success) {
        setPages(data?.pages ?? []);
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    }
  };

  const runFullScan = async () => {
    setIsScanning(true);
    toast.loading('Running full site analysis...', { id: 'scan' });
    
    try {
      const res = await fetch('/api/analyze', { method: 'POST' });
      const data = await res.json();
      
      if (data?.success) {
        toast.success(
          `Scan complete! Found ${data?.stats?.orphanCount ?? 0} orphans, ${data?.stats?.stubCount ?? 0} stubs`,
          { id: 'scan' }
        );
        await fetchStats();
        await fetchPages();
        await fetchFiles();
      } else {
        toast.error(data?.error ?? 'Scan failed', { id: 'scan' });
      }
    } catch (error) {
      toast.error('Scan failed', { id: 'scan' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file);
    if (file?.path?.endsWith('.html') || file?.path?.endsWith('.htm')) {
      setPreviewPath(file.path?.startsWith('/') ? file.path : '/' + file.path);
    }
  };

  const handleEditFile = (file: FileNode | PageData) => {
    const path = 'is_directory' in file ? file.path : file.path;
    setEditorFile({ path: path?.startsWith('/') ? path : '/' + path });
    setIsEditorOpen(true);
  };

  const filteredFiles = (files ?? []).filter(f => {
    if (!searchQuery) return true;
    return f?.path?.toLowerCase()?.includes(searchQuery.toLowerCase());
  });

  const tabs = [
    { id: 'files' as Tab, label: 'Files', icon: FolderTree },
    { id: 'pages' as Tab, label: 'Pages', icon: FileText },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-cyan-500/30 bg-[#0a0e27]/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="text-3xl">⚡</span>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Neocities Manager
                  </h1>
                  <p className="text-xs text-gray-500">coaiexist.wtf</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runFullScan}
                disabled={isScanning}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-bold rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 ${isScanning ? 'animate-pulse' : ''}`} />
                {isScanning ? 'Scanning...' : 'Scan Site'}
              </button>
              
              <a
                href="https://coaiexist.wtf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                View Site
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Site Info */}
      <div className="max-w-[1600px] mx-auto px-4 py-4 w-full">
        <SiteInfo info={siteInfo} isLoading={isLoadingSiteInfo} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarCollapsed ? 60 : 320 }}
          className="border-r border-cyan-500/30 bg-[#0f1325] flex flex-col relative"
        >
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-4 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-black z-10 hover:bg-cyan-400 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Tabs */}
          <nav className="p-2 border-b border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-1 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{tab.label}</span>}
              </button>
            ))}
          </nav>

          {/* Sidebar Content */}
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeTab === 'files' && (
                <>
                  <div className="p-3 border-b border-gray-800">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <button
                      onClick={fetchFiles}
                      disabled={isLoadingFiles}
                      className="w-full mt-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                      {isLoadingFiles ? 'Loading...' : 'Load Files'}
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                    <FileTree
                      files={filteredFiles}
                      onSelect={handleFileSelect}
                      onEdit={handleEditFile}
                      selectedPath={selectedFile?.path}
                    />
                  </div>
                </>
              )}

              {activeTab === 'pages' && (
                <div className="p-3">
                  <div className="space-y-2">
                    <button
                      onClick={fetchPages}
                      className="w-full px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh Pages
                    </button>
                    <div className="text-xs text-gray-500 text-center">
                      {pages.length} pages in database
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && stats && (
                <div className="p-3 space-y-3">
                  <div className="panel p-3">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Orphans</span>
                      <span className="ml-auto text-lg font-bold">{stats.orphanCount}</span>
                    </div>
                  </div>
                  <div className="panel p-3">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <FileWarning className="w-4 h-4" />
                      <span className="text-sm font-medium">Stubs</span>
                      <span className="ml-auto text-lg font-bold">{stats.stubCount}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.aside>

        {/* Main Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {/* Content Panel */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {activeTab === 'files' && (
                  <motion.div
                    key="files"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full"
                  >
                    {previewPath ? (
                      <PreviewPanel
                        path={previewPath}
                        onClose={() => setPreviewPath(null)}
                      />
                    ) : (
                      <div className="panel h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <FolderTree className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p className="text-lg">Select a file to preview</p>
                          <p className="text-sm mt-2">Click on any HTML file in the tree</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'pages' && (
                  <motion.div
                    key="pages"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <PageList
                      pages={pages}
                      filter={pageFilter}
                      onFilterChange={setPageFilter}
                      onEdit={(page) => handleEditFile(page)}
                      onPreview={(page) => {
                        setPreviewPath(page.path);
                        setActiveTab('files');
                      }}
                    />
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <StatsPanel stats={stats} isLoading={isScanning} />
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-2xl"
                  >
                    <SettingsPanel />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* Quick Editor Modal */}
      <QuickEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditorFile(null);
        }}
        file={editorFile}
      />
    </div>
  );
}

// Settings Panel Component
function SettingsPanel() {
  const [settings, setSettings] = useState({
    stubWordThreshold: 200,
    orphanIgnorePaths: [] as string[],
    autoScanEnabled: false,
  });
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [siteInfo, setSiteInfo] = useState<{ sitename?: string; domain?: string } | null>(null);

  useEffect(() => {
    fetchSettings();
    testConnection();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data?.success && data?.settings) {
        setSettings({
          stubWordThreshold: data.settings.stubWordThreshold ?? 200,
          orphanIgnorePaths: data.settings.orphanIgnorePaths ?? [],
          autoScanEnabled: data.settings.autoScanEnabled ?? false,
        });
        if (data.settings.neocitiesApiKey) {
          setApiKey(data.settings.neocitiesApiKey);
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const res = await fetch('/api/neocities/info');
      const data = await res.json();
      if (data?.success && data?.info) {
        setApiStatus('connected');
        setSiteInfo(data.info);
      } else {
        setApiStatus('error');
        setSiteInfo(null);
      }
    } catch (error) {
      setApiStatus('error');
      setSiteInfo(null);
    } finally {
      setIsTesting(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, neocitiesApiKey: apiKey }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success('Settings saved!');
        // Test connection after saving
        testConnection();
      } else {
        toast.error(data?.error || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Settings
        </h2>
      </div>

      {/* API Configuration - moved to top for visibility */}
      <div className="panel p-6 space-y-4">
        <h3 className="text-lg font-bold text-purple-400 mb-2">🔑 Neocities API Key</h3>
        <p className="text-xs text-gray-500 mb-3">
          Get your API key from{' '}
          <a 
            href="https://neocities.org/settings#api_key" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            Neocities Settings → API Key
          </a>
        </p>
        
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Neocities API key..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 pr-24 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs text-gray-400 hover:text-white"
          >
            {showApiKey ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveSettings}
            disabled={isSaving || !apiKey}
            className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save API Key'}
          </button>
          <button
            onClick={testConnection}
            disabled={isTesting}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all disabled:opacity-50"
          >
            {isTesting ? '...' : 'Test'}
          </button>
        </div>

        {/* Connection Status */}
        <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Connection Status</span>
            {apiStatus === 'connected' && (
              <span className="text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Connected
              </span>
            )}
            {apiStatus === 'error' && (
              <span className="text-red-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-red-400 rounded-full" />
                Not Connected
              </span>
            )}
            {apiStatus === 'unknown' && (
              <span className="text-gray-500">Unknown</span>
            )}
          </div>
          {siteInfo && (
            <div className="mt-2 pt-2 border-t border-gray-700 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Site</span>
                <span className="text-cyan-400">{siteInfo.sitename}</span>
              </div>
              {siteInfo.domain && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Domain</span>
                  <span className="text-purple-400">{siteInfo.domain}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Analysis Settings */}
      <div className="panel p-6 space-y-6">
        <h3 className="text-lg font-bold text-purple-400">Analysis Settings</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Stub Word Threshold
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Pages with fewer words than this will be marked as stubs
          </p>
          <input
            type="number"
            value={settings.stubWordThreshold}
            onChange={(e) => setSettings({ ...settings, stubWordThreshold: parseInt(e.target.value) || 200 })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoScanEnabled}
              onChange={(e) => setSettings({ ...settings, autoScanEnabled: e.target.checked })}
              className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-300">Auto Scan</span>
              <p className="text-xs text-gray-500">Automatically scan site on dashboard load</p>
            </div>
          </label>
        </div>

        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
