import React, { useState, useEffect } from 'react';
import { NeocitiesFile } from '../types';
import { NeocitiesService } from '../services/neocities';
import { Link, ShieldAlert, FolderSearch, FileQuestion, RefreshCw, CheckCircle, AlertTriangle, Copy, Check } from 'lucide-react';

interface OrphanScannerProps {
    files: NeocitiesFile[];
    api: NeocitiesService;
}

interface FolderStat {
    total: number;
    orphans: number;
}

interface ScanResult {
    orphans: string[];
    linkedFiles: Set<string>;
    folderStats: Record<string, FolderStat>;
}

export const OrphanScanner: React.FC<OrphanScannerProps> = ({ files, api }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [navContent, setNavContent] = useState<string>('');
    const [results, setResults] = useState<ScanResult | null>(null);
    const [scanMethod, setScanMethod] = useState<'PROXY_AUTO' | 'MANUAL_PASTE'>('PROXY_AUTO');
    const [copied, setCopied] = useState(false);

    // Known nav files to attempt automatic fetching
    const KNOWN_NAVS = [
        'nav.html', 
        'admin/admin-nav.html', 
        'bc7f2a/myco-nav.html', 
        'hd_tv/hd-nav.html',
        'index.html' // Always assume index links are valid entry points
    ];

    const performScan = async () => {
        setIsScanning(true);
        const linkedFiles = new Set<string>();
        const htmlFiles = files.filter(f => f.path.endsWith('.html'));

        // 1. Collect Links
        let contentToParse = "";

        if (scanMethod === 'PROXY_AUTO') {
            // Attempt to fetch known navs
            for (const navPath of KNOWN_NAVS) {
                try {
                    const content = await api.getFileContent(navPath);
                    contentToParse += content + "\n";
                } catch (e) {
                    console.warn(`Could not fetch ${navPath} automatically.`, e);
                }
            }
        } else {
            contentToParse = navContent;
        }

        // Parse HREFs from the gathered content
        const regex = /href=["']([^"']+)["']/g;
        let match;
        while ((match = regex.exec(contentToParse)) !== null) {
            let link = match[1];
            // Normalize link: remove leading slash, remove params/hashes
            link = link.split('#')[0].split('?')[0];
            if (link.startsWith('/')) link = link.substring(1);
            if (link.startsWith('https://coaiexist.wtf/')) link = link.replace('https://coaiexist.wtf/', '');
            
            linkedFiles.add(link);
        }

        // Always whitelist known navs themselves and index.html
        KNOWN_NAVS.forEach(n => linkedFiles.add(n));

        // 2. Identify Orphans
        const orphans: string[] = [];
        const folderStats: Record<string, FolderStat> = {};

        htmlFiles.forEach(file => {
            const folder = file.path.includes('/') ? file.path.split('/')[0] : '(root)';
            
            // Init stats
            if (!folderStats[folder]) folderStats[folder] = { total: 0, orphans: 0 };
            folderStats[folder].total++;

            if (!linkedFiles.has(file.path)) {
                orphans.push(file.path);
                folderStats[folder].orphans++;
            }
        });

        setResults({ orphans, linkedFiles, folderStats });
        setIsScanning(false);
    };

    const handleCopyResults = () => {
        if (!results) return;
        const text = `ORPHAN FILES REPORT (${new Date().toLocaleDateString()})\n\n` + 
                     results.orphans.join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Auto-scan on mount
    useEffect(() => {
        performScan();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="h-full flex flex-col bg-neo-900 text-gray-200">
            {/* Header / Config */}
            <div className="p-6 border-b border-neo-800 bg-neo-900 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                            <ShieldAlert className="text-orange-500" />
                            Orphan & Stub Scanner
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Identify HTML files that are not linked from your main navigation bars.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {results && results.orphans.length > 0 && (
                             <button 
                                onClick={handleCopyResults}
                                className="px-4 py-2 bg-neo-800 hover:bg-neo-700 text-white rounded font-medium flex items-center gap-2 border border-neo-700"
                            >
                                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                {copied ? "Copied" : "Copy List"}
                            </button>
                        )}
                        <button 
                            onClick={performScan}
                            disabled={isScanning}
                            className="px-6 py-2 bg-neo-500 hover:bg-neo-400 text-white rounded font-medium flex items-center gap-2 shadow-lg shadow-neo-500/20"
                        >
                            {isScanning ? <RefreshCw className="animate-spin" /> : <FolderSearch />}
                            Run Live Scan
                        </button>
                    </div>
                </div>

                {/* Method Selector */}
                <div className="flex gap-4 mb-4">
                    <button 
                        onClick={() => setScanMethod('PROXY_AUTO')}
                        className={`flex-1 p-3 rounded border text-left ${scanMethod === 'PROXY_AUTO' ? 'bg-neo-800 border-neo-accent text-white' : 'border-neo-700 text-gray-400 hover:bg-neo-800'}`}
                    >
                        <div className="font-bold text-sm mb-1">Live Auto-Scan</div>
                        <div className="text-xs opacity-70">Crawls your live nav.html and index.html via proxy.</div>
                    </button>
                    <button 
                        onClick={() => setScanMethod('MANUAL_PASTE')}
                        className={`flex-1 p-3 rounded border text-left ${scanMethod === 'MANUAL_PASTE' ? 'bg-neo-800 border-neo-accent text-white' : 'border-neo-700 text-gray-400 hover:bg-neo-800'}`}
                    >
                        <div className="font-bold text-sm mb-1">Manual Paste</div>
                        <div className="text-xs opacity-70">Copy/Paste your nav bar HTML manually if Live Mode fails.</div>
                    </button>
                </div>

                {scanMethod === 'MANUAL_PASTE' && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        <label className="block text-xs font-mono text-gray-400 mb-2">PASTE NAV HTML HERE:</label>
                        <textarea 
                            value={navContent}
                            onChange={(e) => setNavContent(e.target.value)}
                            className="w-full h-32 bg-neo-800 border border-neo-600 rounded p-3 font-mono text-xs text-green-300 focus:outline-none focus:border-neo-accent"
                            placeholder='<nav> <a href="/index.html">Home</a> ... </nav>'
                        />
                    </div>
                )}
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-neo-800">
                {results ? (
                    <div className="space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-neo-900 p-4 rounded border border-neo-700">
                                <div className="text-xs text-gray-500 uppercase">Total Orphans</div>
                                <div className="text-2xl font-bold text-orange-400">{results.orphans.length}</div>
                            </div>
                            <div className="bg-neo-900 p-4 rounded border border-neo-700">
                                <div className="text-xs text-gray-500 uppercase">Linked Files</div>
                                <div className="text-2xl font-bold text-green-400">{results.linkedFiles.size}</div>
                            </div>
                            <div className="bg-neo-900 p-4 rounded border border-neo-700">
                                <div className="text-xs text-gray-500 uppercase">Clutter Health</div>
                                <div className="text-2xl font-bold text-white">
                                    {Math.round((1 - (results.orphans.length / files.filter(f => f.path.endsWith('.html')).length)) * 100)}%
                                </div>
                            </div>
                        </div>

                        {/* Folder Breakdown */}
                        <h3 className="text-lg font-bold text-white mt-8 mb-4">Analysis by Folder</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(Object.entries(results.folderStats) as [string, FolderStat][])
                                .sort(([,a], [,b]) => b.orphans - a.orphans) // Sort by most orphans
                                .map(([folder, stat]) => (
                                <div key={folder} className="bg-neo-900 rounded border border-neo-700 overflow-hidden">
                                    <div className="p-3 bg-neo-800 border-b border-neo-700 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <FolderSearch size={16} className="text-blue-400" />
                                            <span className="font-mono font-bold">{folder}</span>
                                        </div>
                                        <div className={`text-xs px-2 py-0.5 rounded ${stat.orphans > 0 ? 'bg-orange-900/50 text-orange-300' : 'bg-green-900/50 text-green-300'}`}>
                                            {stat.orphans} orphans / {stat.total} files
                                        </div>
                                    </div>
                                    {stat.orphans > 0 && (
                                        <div className="p-3 max-h-40 overflow-y-auto custom-scrollbar">
                                            {results.orphans.filter(p => p.startsWith(folder === '(root)' ? '' : folder) && (folder === '(root)' ? !p.includes('/') : true)).map(path => (
                                                <div key={path} className="flex items-center gap-2 text-xs text-gray-400 py-1 hover:text-white">
                                                    <FileQuestion size={12} className="text-orange-500" />
                                                    {path}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                        <FolderSearch size={64} className="mb-4" />
                        <p>Scanning...</p>
                    </div>
                )}
            </div>
        </div>
    );
};