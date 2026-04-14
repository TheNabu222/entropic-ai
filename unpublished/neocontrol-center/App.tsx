import React, { useState, useEffect, useMemo } from 'react';
import { NeocitiesService } from './services/neocities';
import { buildFileTree, analyzeSite } from './utils/fileSystem';
import { AppMode, FileNode, SiteStats, ApiConfig } from './types';
import { DEFAULT_API_KEY, DEFAULT_SITENAME } from './constants';
import { Dashboard } from './components/Dashboard';
import { FileManager } from './components/FileManager';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { OrphanScanner } from './components/OrphanScanner';
import { LayoutDashboard, FolderTree, Settings, Cpu, Menu, X, ScanEye, AlertCircle, Globe, WifiOff, ShieldAlert, Zap, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [config, setConfig] = useState<ApiConfig>({
    apiKey: DEFAULT_API_KEY,
    sitename: DEFAULT_SITENAME,
    useMock: false, // Default to Live
    useProxy: true, // Default to Proxy enabled for immediate functionality
    proxyUrl: "" // Use default rotation list
  });
  
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [files, setFiles] = useState<any[]>([]); 
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'error' | 'warning' | 'success'} | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Service Instance
  const api = useMemo(() => new NeocitiesService(config.apiKey, config.useMock, config.useProxy, config.proxyUrl), [config.apiKey, config.useMock, config.useProxy, config.proxyUrl]);

  // Effects
  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rawFiles = await api.listFiles();
      setFiles(rawFiles);
      setFileTree(buildFileTree(rawFiles));
      setStats(analyzeSite(rawFiles));
      
      if (!config.useMock) {
        // Clear error if we successfully connected live
        setError(null);
      }
    } catch (err: any) {
      if (!config.useMock) {
         console.warn("Real API failed, fallback options available.", err);
         setError(err.message || 'Failed to connect to Neocities.');
      } else {
         setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]); 

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
        const timer = setTimeout(() => setNotification(null), 5000);
        return () => clearTimeout(timer);
    }
  }, [notification]);

  const toggleConnectionMode = () => {
      setConfig(prev => ({ ...prev, useMock: !prev.useMock }));
  };

  // Render Helpers
  const renderContent = () => {
    if (mode === AppMode.ANALYZER) {
        return <ImageAnalyzer apiKey={process.env.API_KEY || ""} />;
    }
    
    if (mode === AppMode.SETTINGS) {
        return (
            <div className="p-8 max-w-2xl mx-auto h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Configuration</h2>
                
                <div className="space-y-6">
                    <div className="bg-neo-800 p-6 rounded border border-neo-700">
                        <h3 className="text-lg font-semibold text-neo-accent mb-4">Connection Settings</h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-1">Neocities API Key</label>
                            <input 
                                type="password" 
                                value={config.apiKey}
                                onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                                className="w-full bg-neo-900 border border-neo-700 rounded p-2 text-white focus:border-neo-500 focus:outline-none"
                            />
                        </div>

                        <div className="mb-4">
                             <label className="block text-sm text-gray-400 mb-1">Site Name</label>
                             <input 
                                type="text" 
                                value={config.sitename}
                                onChange={(e) => setConfig({...config, sitename: e.target.value})}
                                className="w-full bg-neo-900 border border-neo-700 rounded p-2 text-white focus:border-neo-500 focus:outline-none"
                            />
                        </div>

                        <div className="p-4 bg-neo-900 rounded border border-neo-700 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm text-white font-medium flex items-center gap-2">
                                    <Globe size={16} className="text-blue-400" />
                                    Use CORS Proxy (Recommended for Live)
                                </label>
                                <input 
                                    type="checkbox" 
                                    checked={config.useProxy}
                                    onChange={(e) => setConfig({...config, useProxy: e.target.checked})}
                                    className="w-4 h-4 text-neo-500 rounded bg-neo-800 border-neo-600 focus:ring-neo-500"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mb-3">
                                Routes traffic through public proxies (corsproxy.io, allorigins.win) to bypass browser CORS restrictions.
                            </p>
                            {config.useProxy && (
                                <input 
                                    type="text" 
                                    placeholder="Optional: Custom Proxy URL"
                                    value={config.proxyUrl}
                                    onChange={(e) => setConfig({...config, proxyUrl: e.target.value})}
                                    className="w-full bg-neo-800 border border-neo-700 rounded p-2 text-xs text-gray-300 font-mono"
                                />
                            )}
                        </div>
                    </div>

                    <div className="bg-neo-800 p-6 rounded border border-neo-700">
                        <h3 className="text-lg font-semibold text-blue-400 mb-4">Gemini AI</h3>
                        <p className="text-sm text-gray-400 mb-2">
                            Using <strong>gemini-3-pro-preview</strong> for reasoning and vision tasks.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading && !files.length) {
        return (
            <div className="flex items-center justify-center h-full text-neo-accent flex-col gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
                <div className="text-sm text-gray-400 animate-pulse">Connecting to Neocities...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-lg max-w-lg text-center shadow-2xl">
                    <h3 className="text-xl text-red-400 font-bold mb-2">Connection Failed</h3>
                    <p className="text-gray-300 mb-6 text-sm">{error}</p>
                    <div className="flex flex-col gap-3">
                         <button 
                            onClick={fetchFiles}
                            className="w-full px-4 py-3 bg-neo-500 hover:bg-neo-400 text-white rounded font-medium shadow-lg shadow-neo-500/20 flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Retry Connection
                        </button>
                        <div className="text-xs text-gray-500 my-1">- OR -</div>
                        <button 
                            onClick={() => setConfig(prev => ({ ...prev, useMock: true }))}
                            className="w-full px-4 py-2 bg-neo-800 hover:bg-neo-700 text-gray-300 rounded text-sm border border-neo-700"
                        >
                            Switch to Offline Mode
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    switch (mode) {
      case AppMode.DASHBOARD:
        return stats ? (
            <Dashboard 
                stats={stats} 
                onNavigateToOrphans={() => setMode(AppMode.ORPHAN_SCANNER)} 
            />
        ) : null;
      case AppMode.EXPLORER:
        return (
            <FileManager 
                files={fileTree} 
                api={api} 
                onRefresh={fetchFiles} 
                geminiApiKey={process.env.API_KEY || ""} 
                siteUrl={`https://${config.sitename}.wtf`}
                stats={stats || undefined}
            />
        );
      case AppMode.ORPHAN_SCANNER:
        return <OrphanScanner files={files} api={api} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neo-900 text-gray-200 font-sans">
      {/* Notification Toast */}
      {notification && (
        <div className={`absolute top-16 right-4 z-50 px-4 py-3 rounded shadow-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 border ${
            notification.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' : 
            notification.type === 'success' ? 'bg-green-900/90 border-green-500 text-white' :
            'bg-yellow-900/90 border-yellow-500 text-yellow-100'
        }`}>
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)}><X size={16} /></button>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="h-14 bg-neo-900 border-b border-neo-800 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <Cpu className="text-neo-500" />
                <span className="font-bold text-lg tracking-tight hidden sm:inline">NEO<span className="text-neo-accent">CONTROL</span></span>
            </div>
            
            {/* Live/Offline Status Toggle */}
            <button 
                onClick={toggleConnectionMode}
                className={`text-[10px] px-2 py-1 rounded border flex items-center gap-1.5 transition-all ${
                    config.useMock 
                    ? 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700' 
                    : 'bg-green-900/30 border-green-500/50 text-green-400 hover:bg-green-900/50 shadow-[0_0_8px_rgba(0,255,157,0.2)]'
                }`}
            >
                {config.useMock ? (
                    <>
                        <WifiOff size={10} />
                        OFFLINE
                    </>
                ) : (
                    <>
                        <Zap size={10} className="fill-current" />
                        LIVE CONNECTED
                    </>
                )}
            </button>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
            <NavButton icon={<LayoutDashboard size={18} />} label="Overview" active={mode === AppMode.DASHBOARD} onClick={() => setMode(AppMode.DASHBOARD)} />
            <NavButton icon={<FolderTree size={18} />} label="Explorer" active={mode === AppMode.EXPLORER} onClick={() => setMode(AppMode.EXPLORER)} />
            <NavButton icon={<ShieldAlert size={18} />} label="Scanner" active={mode === AppMode.ORPHAN_SCANNER} onClick={() => setMode(AppMode.ORPHAN_SCANNER)} />
            <NavButton icon={<ScanEye size={18} />} label="Image Lab" active={mode === AppMode.ANALYZER} onClick={() => setMode(AppMode.ANALYZER)} />
            <NavButton icon={<Settings size={18} />} label="Settings" active={mode === AppMode.SETTINGS} onClick={() => setMode(AppMode.SETTINGS)} />
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-gray-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neo-800 border-b border-neo-700 py-2 px-4 flex flex-col space-y-2 z-10 absolute top-14 w-full shadow-xl">
             <MobileNavButton icon={<LayoutDashboard size={18} />} label="Overview" active={mode === AppMode.DASHBOARD} onClick={() => { setMode(AppMode.DASHBOARD); setIsMobileMenuOpen(false); }} />
             <MobileNavButton icon={<FolderTree size={18} />} label="Explorer" active={mode === AppMode.EXPLORER} onClick={() => { setMode(AppMode.EXPLORER); setIsMobileMenuOpen(false); }} />
             <MobileNavButton icon={<ShieldAlert size={18} />} label="Scanner" active={mode === AppMode.ORPHAN_SCANNER} onClick={() => { setMode(AppMode.ORPHAN_SCANNER); setIsMobileMenuOpen(false); }} />
             <MobileNavButton icon={<ScanEye size={18} />} label="Image Lab" active={mode === AppMode.ANALYZER} onClick={() => { setMode(AppMode.ANALYZER); setIsMobileMenuOpen(false); }} />
             <MobileNavButton icon={<Settings size={18} />} label="Settings" active={mode === AppMode.SETTINGS} onClick={() => { setMode(AppMode.SETTINGS); setIsMobileMenuOpen(false); }} />
        </div>
      )}

      {/* Main Area */}
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
};

// UI Components for Nav
const NavButton: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 rounded transition-all ${
            active 
            ? 'bg-neo-800 text-neo-accent shadow-[0_0_10px_rgba(0,255,157,0.1)]' 
            : 'text-gray-400 hover:text-white hover:bg-neo-800/50'
        }`}
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const MobileNavButton: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded w-full ${
            active ? 'bg-neo-700 text-white' : 'text-gray-400'
        }`}
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </button>
);

export default App;