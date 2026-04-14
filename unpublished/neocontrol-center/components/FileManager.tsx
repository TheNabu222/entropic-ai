import React, { useState, useEffect } from 'react';
import { FileNode, NeocitiesFile, SiteStats } from '../types';
import { formatBytes } from '../utils/fileSystem';
import { 
    Folder, FolderOpen, File, ChevronRight, ChevronDown, 
    MoreVertical, Edit2, Trash2, Move, FileText, Image, Code, Eye,
    CheckSquare, Square, BrainCircuit, Zap, Sparkles, Layers, ExternalLink, X, Save,
    ArrowRightCircle, FileWarning, AlertTriangle
} from 'lucide-react';
import { NeocitiesService } from '../services/neocities';
import { generateAiResponse } from '../utils/gemini';

interface FileManagerProps {
  files: FileNode[];
  api: NeocitiesService;
  onRefresh: () => void;
  geminiApiKey: string;
  siteUrl?: string;
  stats?: SiteStats;
}

// Tree Item with Selection Support and Visual Stats
const FileTreeItem: React.FC<{ 
    node: FileNode; 
    onSelect: (node: FileNode) => void;
    selectedPath: string | null;
    checkedPaths: Set<string>;
    onCheck: (path: string, checked: boolean) => void;
    stats?: SiteStats;
}> = ({ node, onSelect, selectedPath, checkedPaths, onCheck, stats }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isSelected = node.path === selectedPath;
    const isChecked = checkedPaths.has(node.path);
    
    // Check for issues
    const isOrphan = stats?.orphans.includes(node.path);
    const isStub = stats?.stubs.includes(node.path);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.isDirectory) setIsOpen(!isOpen);
        onSelect(node);
    };

    const handleCheck = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCheck(node.path, !isChecked);
    };

    return (
        <div className="select-none">
            <div 
                className={`flex items-center py-1 px-2 cursor-pointer transition-colors group ${isSelected ? 'bg-neo-700/50' : 'hover:bg-neo-800'}`}
                onClick={toggle}
            >
                {/* Checkbox */}
                <div onClick={handleCheck} className="mr-2 text-gray-500 hover:text-neo-accent cursor-pointer">
                    {isChecked ? <CheckSquare size={14} className="text-neo-accent" /> : <Square size={14} />}
                </div>

                {/* Expansion Icon */}
                <div className="w-4 h-4 mr-1 flex items-center justify-center">
                    {node.isDirectory && (
                        isOpen ? <ChevronDown size={12} className="text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />
                    )}
                </div>
                
                {/* File Type Icon */}
                <div className="mr-2 relative">
                    {node.isDirectory ? (
                        <div className="text-neo-500">
                             {isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
                        </div>
                    ) : (
                        <div className={node.path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "text-purple-400" : "text-gray-500"}>
                             <FileText size={16} />
                        </div>
                    )}
                    {/* Visual Indicators */}
                    {isOrphan && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Potential Orphan" />}
                    {isStub && !isOrphan && <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" title="Stub / Tiny File" />}
                </div>
                
                {/* Name */}
                <span className={`text-sm font-mono truncate ${isSelected ? 'text-neo-accent' : 'text-gray-300'} ${isOrphan ? 'text-red-300' : ''}`}>
                    {node.name}
                </span>
            </div>
            
            {/* Children */}
            {isOpen && node.children && (
                <div className="pl-4 border-l border-neo-800 ml-2">
                    {node.children.map(child => (
                        <FileTreeItem 
                            key={child.path} 
                            node={child} 
                            onSelect={onSelect} 
                            selectedPath={selectedPath}
                            checkedPaths={checkedPaths}
                            onCheck={onCheck}
                            stats={stats}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const FileManager: React.FC<FileManagerProps> = ({ files, api, onRefresh, geminiApiKey, siteUrl, stats }) => {
    const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
    const [checkedPaths, setCheckedPaths] = useState<Set<string>>(new Set());
    const [fileContent, setFileContent] = useState<string>('');
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [viewMode, setViewMode] = useState<'code' | 'preview'>('preview');
    
    // UI State
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [moveDestination, setMoveDestination] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    
    // AI States
    const [aiAnalysis, setAiAnalysis] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisMode, setAnalysisMode] = useState<'FAST' | 'THINKING' | 'ORGANIZE'>('FAST');

    // Selection Handling
    const handleCheck = (path: string, checked: boolean) => {
        const newSet = new Set(checkedPaths);
        if (checked) newSet.add(path);
        else newSet.delete(path);
        setCheckedPaths(newSet);
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${checkedPaths.size} items?`)) return;
        
        try {
            const paths = Array.from(checkedPaths);
            for (const path of paths) {
                await api.deleteFile(path);
            }
            alert(`Deleted ${paths.length} files.`);
            setCheckedPaths(new Set());
            onRefresh();
            if (selectedNode && checkedPaths.has(selectedNode.path)) {
                setSelectedNode(null);
            }
        } catch (e: any) {
            alert("Error deleting files: " + e.message);
        }
    };

    const handleDeleteSingle = async () => {
        if (!selectedNode) return;
        if (!confirm(`Delete ${selectedNode.name}?`)) return;
        try {
            await api.deleteFile(selectedNode.path);
            onRefresh();
            setSelectedNode(null);
        } catch (e: any) {
             alert("Error deleting file: " + e.message);
        }
    };

    const handleSave = async () => {
        if (!selectedNode || isSaving) return;
        setIsSaving(true);
        try {
            await api.uploadFile(selectedNode.path, fileContent);
            alert("File saved successfully.");
        } catch (e: any) {
            alert("Save failed: " + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleMove = async () => {
        if (!selectedNode || !moveDestination) return;
        try {
            let newPath = moveDestination.endsWith('/') 
                ? moveDestination + selectedNode.name 
                : moveDestination;
            
            // Basic safety check for duplicate path
            if (newPath === selectedNode.path) return;

            // Fetch content if not already loaded
            let content = fileContent;
            if (!content) {
                content = await api.getFileContent(selectedNode.path);
            }

            await api.renameFile(selectedNode.path, newPath, content);
            
            setShowMoveModal(false);
            setMoveDestination("");
            onRefresh();
            setSelectedNode(null); // Deselect as it's gone from that path
        } catch (e: any) {
            alert("Move failed: " + e.message);
        }
    };

    // Content Loading
    useEffect(() => {
        if (selectedNode && !selectedNode.isDirectory) {
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedNode.path);
            
            if (isImage) {
                setFileContent(`${siteUrl}/${selectedNode.path}`);
                setViewMode('preview');
                return;
            }

            // Load text content only if needed (Code view or AI analysis)
            if (viewMode === 'code') {
                setIsLoadingContent(true);
                setAiAnalysis('');
                api.getFileContent(selectedNode.path)
                    .then(content => setFileContent(content))
                    .catch(err => setFileContent(`Error loading content: ${err.message}`))
                    .finally(() => setIsLoadingContent(false));
            }
        }
    }, [selectedNode, api, viewMode, siteUrl]);

    // AI Analysis Logic
    const handleAnalyze = async (mode: 'FAST' | 'THINKING' | 'ORGANIZE') => {
        if (!selectedNode || !geminiApiKey) return;
        
        setIsAnalyzing(true);
        setAnalysisMode(mode);
        
        try {
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedNode.path);
            let prompt = "";

            if (isImage) {
                 prompt = "Analyze this image."; 
                 if (mode === 'THINKING') {
                     prompt = `Analyze the file path and potential purpose of this image: ${selectedNode.path}. Is it organized correctly in the folder structure?`;
                 } else if (mode === 'ORGANIZE') {
                     prompt = `Look at this image. Based on its content, suggest a better filename and which folder type it belongs to (e.g. assets/images, backgrounds, etc). Current path: ${selectedNode.path}`;
                 }
            } else {
                 // Ensure content is loaded
                 let contentToAnalyze = fileContent;
                 if (!contentToAnalyze && viewMode !== 'code') {
                    contentToAnalyze = await api.getFileContent(selectedNode.path);
                    setFileContent(contentToAnalyze);
                 }

                 if (mode === 'ORGANIZE') {
                     // Collect folders for context
                     const folders = files.map(f => f.path).filter(p => !p.includes('.')); // Rough approximation of root folders or just pass top level
                     const folderList = JSON.stringify(folders.slice(0, 20)); // Limit context

                     prompt = `
                        You are a File Organization Agent. 
                        Here is a list of some existing files/folders in the project: ${folderList}.
                        
                        Current File: ${selectedNode.path}
                        
                        File Content Preview:
                        ${contentToAnalyze.substring(0, 1000)}
                        ...

                        Task:
                        1. Does this file belong in its current location?
                        2. If not, suggest a specific existing folder or a new folder name.
                        3. Suggest a better filename if the current one is vague.
                        4. Identify if this file looks like an "Orphan" (unused/broken) or a "Stub" (incomplete).
                     `;
                 } else if (mode === 'THINKING') {
                     prompt = `Deeply analyze this code. Identify logic errors, accessibility issues, and suggest refactors. File: ${selectedNode.name}\n\n${contentToAnalyze.substring(0, 10000)}`;
                 } else {
                     prompt = `Quickly summarize this file and check for syntax errors.\n\n${contentToAnalyze.substring(0, 5000)}`;
                 }
            }

            const response = await generateAiResponse(
                geminiApiKey,
                prompt,
                isImage ? 'VISION' : (mode === 'ORGANIZE' ? 'THINKING' : mode), 
                undefined 
            );
            
            setAiAnalysis(response || "No analysis generated.");
        } catch (e: any) {
            setAiAnalysis(`AI Error: ${e.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const isImage = selectedNode && /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedNode.path);
    const previewUrl = selectedNode ? `${siteUrl}/${selectedNode.path}` : '';
    const isOrphan = selectedNode && stats?.orphans.includes(selectedNode.path);

    return (
        <div className="flex h-full border-t border-neo-800 relative">
             {/* Move Modal */}
             {showMoveModal && (
                <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-neo-800 p-6 rounded-lg border border-neo-600 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Move / Rename File</h3>
                        <p className="text-sm text-gray-400 mb-2">Current: <span className="text-neo-accent">{selectedNode?.path}</span></p>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-300 mb-1">New Path (Folder + Filename)</label>
                            <input 
                                type="text" 
                                value={moveDestination} 
                                onChange={(e) => setMoveDestination(e.target.value)}
                                placeholder="e.g. assets/images/newname.png"
                                className="w-full bg-neo-900 border border-neo-700 rounded p-2 text-white focus:border-neo-500 outline-none"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowMoveModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                            <button onClick={handleMove} className="px-4 py-2 bg-neo-500 hover:bg-neo-400 text-white rounded">Move File</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className="w-1/3 min-w-[250px] max-w-[400px] border-r border-neo-700 bg-neo-900 flex flex-col">
                <div className="p-3 bg-neo-800 border-b border-neo-700 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Explorer</span>
                        {checkedPaths.size > 0 && (
                            <span className="text-xs bg-neo-500 text-white px-2 py-0.5 rounded-full">
                                {checkedPaths.size}
                            </span>
                        )}
                    </div>
                    <div className="flex space-x-1">
                        {checkedPaths.size > 0 && (
                             <button onClick={handleBulkDelete} className="p-1.5 hover:bg-red-900/50 text-red-400 rounded transition-colors" title="Delete Selected">
                                <Trash2 size={14} />
                             </button>
                        )}
                        <button onClick={onRefresh} className="p-1.5 hover:bg-neo-700 rounded text-gray-300">
                            <span className="text-xs">Refresh</span>
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {files.map(node => (
                        <FileTreeItem 
                            key={node.path} 
                            node={node} 
                            onSelect={setSelectedNode} 
                            selectedPath={selectedNode?.path || null}
                            checkedPaths={checkedPaths}
                            onCheck={handleCheck}
                            stats={stats}
                        />
                    ))}
                </div>
                {/* Legend */}
                <div className="p-2 border-t border-neo-800 flex gap-4 text-[10px] text-gray-500 justify-center">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Orphan</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div> Stub</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-neo-800 flex flex-col relative">
                {selectedNode ? (
                    <>
                        {/* Toolbar */}
                        <div className="h-14 border-b border-neo-700 bg-neo-900 flex items-center px-4 justify-between shrink-0">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                {isImage ? <Image size={18} className="text-purple-400" /> : <Code size={18} className="text-blue-400" />}
                                <div className="flex flex-col">
                                    <span className="font-mono text-neo-accent text-sm truncate max-w-[200px]">{selectedNode.name}</span>
                                    <span className="text-[10px] text-gray-500 truncate max-w-[300px]">{selectedNode.path}</span>
                                </div>
                                {isOrphan && (
                                    <span className="flex items-center gap-1 text-[10px] bg-red-900/50 text-red-300 px-2 py-0.5 rounded border border-red-800">
                                        <FileWarning size={10} /> Orphan
                                    </span>
                                )}
                                <a href={previewUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white" title="Open in new tab">
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => { setMoveDestination(selectedNode.path); setShowMoveModal(true); }}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-neo-800 rounded mr-1" 
                                    title="Move / Rename"
                                >
                                    <Move size={16} />
                                </button>

                                <button onClick={handleDeleteSingle} className="p-2 text-red-500 hover:bg-red-900/20 rounded mr-2" title="Delete File">
                                    <Trash2 size={16} />
                                </button>

                                {!selectedNode.isDirectory && (
                                    <>
                                        {!isImage && (
                                            <div className="flex bg-neo-800 rounded border border-neo-700 mr-2">
                                                <button 
                                                    onClick={() => setViewMode('code')}
                                                    className={`px-3 py-1 text-xs font-medium rounded-l ${viewMode === 'code' ? 'bg-neo-700 text-white' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    Code
                                                </button>
                                                <button 
                                                    onClick={() => setViewMode('preview')}
                                                    className={`px-3 py-1 text-xs font-medium rounded-r ${viewMode === 'preview' ? 'bg-neo-700 text-white' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    Preview
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* Save Button */}
                                        {viewMode === 'code' && !isImage && (
                                             <button 
                                                onClick={handleSave}
                                                disabled={isSaving}
                                                className="p-2 mr-2 text-neo-accent hover:bg-neo-accent/10 rounded"
                                                title="Save Changes"
                                             >
                                                <Save size={18} />
                                             </button>
                                        )}

                                        <div className="h-6 w-px bg-neo-700 mx-2"></div>

                                        {/* AI Toolbar */}
                                        <div className="flex bg-neo-800 rounded border border-neo-600 p-0.5">
                                            <button 
                                                onClick={() => handleAnalyze('FAST')}
                                                disabled={isAnalyzing}
                                                className="px-2 py-1 hover:bg-neo-700 rounded text-gray-400 hover:text-white transition-colors"
                                                title="Quick Scan"
                                            >
                                                <Zap size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleAnalyze('ORGANIZE')}
                                                disabled={isAnalyzing}
                                                className="px-2 py-1 hover:bg-neo-700 rounded text-gray-400 hover:text-neo-accent transition-colors"
                                                title="Organize Agent: Where should this file go?"
                                            >
                                                <Sparkles size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleAnalyze('THINKING')}
                                                disabled={isAnalyzing}
                                                className="px-2 py-1 hover:bg-neo-700 rounded text-gray-400 hover:text-pink-400 transition-colors"
                                                title="Deep Think & Code Review"
                                            >
                                                <BrainCircuit size={14} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Editor/Viewer Area */}
                        <div className="flex-1 relative overflow-hidden flex flex-col md:flex-row">
                            <div className={`flex-1 flex flex-col min-h-0 ${aiAnalysis ? 'h-1/2 md:h-full md:w-2/3 border-b md:border-b-0 md:border-r border-neo-700' : 'h-full'}`}>
                                {selectedNode.isDirectory ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                        <FolderOpen size={64} className="mb-4 opacity-20" />
                                        <p className="text-lg font-medium">Directory Selected</p>
                                        <p className="text-sm opacity-60">{selectedNode.children?.length || 0} items</p>
                                    </div>
                                ) : isImage ? (
                                    <div className="flex-1 bg-[#121212] flex items-center justify-center p-8 overflow-auto">
                                        <img src={previewUrl} alt={selectedNode.name} className="max-w-full max-h-full object-contain shadow-2xl border border-neo-800" />
                                    </div>
                                ) : viewMode === 'code' ? (
                                    isLoadingContent ? (
                                        <div className="flex-1 flex items-center justify-center">
                                            <div className="flex flex-col items-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neo-accent mb-2"></div>
                                                <span className="text-xs text-neo-accent">Fetching content...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <textarea 
                                            className="w-full h-full bg-[#1e1e1e] text-gray-300 font-mono p-4 text-sm resize-none focus:outline-none custom-scrollbar leading-relaxed"
                                            value={fileContent}
                                            onChange={(e) => setFileContent(e.target.value)}
                                            spellCheck={false}
                                        />
                                    )
                                ) : (
                                    // Iframe Preview Mode
                                    <div className="w-full h-full bg-white">
                                        <iframe 
                                            src={previewUrl} 
                                            className="w-full h-full border-none"
                                            title="Preview"
                                            sandbox="allow-scripts allow-same-origin"
                                        />
                                    </div>
                                )}
                            </div>
                            
                            {/* AI Analysis Panel */}
                            {aiAnalysis && (
                                <div className="w-full md:w-1/3 h-1/2 md:h-full bg-neo-900 flex flex-col shadow-xl animate-in slide-in-from-right-10 duration-300 border-l border-neo-800">
                                    <div className="p-4 border-b border-neo-700 flex justify-between items-center bg-neo-800/50">
                                        <div className="flex items-center gap-2">
                                            {analysisMode === 'THINKING' ? <BrainCircuit size={16} className="text-pink-500" /> : 
                                             analysisMode === 'ORGANIZE' ? <Sparkles size={16} className="text-neo-accent" /> :
                                             <Zap size={16} className="text-yellow-500" />}
                                            <h4 className="text-gray-200 font-bold text-sm tracking-wide">
                                                {analysisMode === 'THINKING' ? 'Deep Insights' : analysisMode === 'ORGANIZE' ? 'Organizer Agent' : 'Quick Summary'}
                                            </h4>
                                        </div>
                                        <button onClick={() => setAiAnalysis('')} className="text-gray-500 hover:text-white transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <p className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">{aiAnalysis}</p>
                                        </div>
                                    </div>
                                    {analysisMode === 'ORGANIZE' && (
                                        <div className="p-4 border-t border-neo-800 bg-neo-900/50 text-xs text-gray-500 text-center">
                                            Use the <strong>Move</strong> button in the toolbar to apply changes.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-600 bg-neo-900/50">
                        <div className="text-center max-w-md p-6 border border-dashed border-neo-800 rounded-xl">
                            <Layers className="w-16 h-16 mx-auto mb-4 text-neo-800" />
                            <h3 className="text-xl font-bold text-gray-300 mb-2">Select a file to begin</h3>
                            <p className="text-sm text-gray-500">
                                Use the checkboxes to delete files, or select a file to organize and edit.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};