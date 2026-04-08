
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import { GithubAsset, SceneLayer, AssetType, AnimationType, HoverEffect, LayerRole, GameStat, SavedScene } from './types';
import { fetchRepoAssets, isImage, isAudio } from './services/githubService';
import { GoogleGenAI, Type } from "@google/genai";

// Fix aistudio declaration to match identical modifiers and type name
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    readonly aistudio: AIStudio;
  }
}

const CREATIVE_IDEAS = [
  "A cyberpunk detective questioning a sentient toaster.",
  "A medieval knight lost in a modern supermarket.",
  "An alien tourist trying to buy a souvenir in NYC.",
  "A ghost trying to scare a very bored teenager.",
  "A wizard running a tech support hotline.",
  "Two pigeons discussing stock market trends.",
  "A vampire sunbathing with SPF 5000."
];

const ASPECT_RATIOS = ["1:1", "3:4", "4:3", "9:16", "16:9"];

const getAnimDuration = (type: AnimationType, speed: number = 1): string => {
  const base = { 'none': 0, 'pulse': 2, 'float': 3, 'shake': 0.2, 'spin': 10, 'bounce': 2, 'ghost': 3, 'rainbow': 5 }[type] || 0;
  return `${base / speed}s`;
};

const App: React.FC = () => {
  const [assets, setAssets] = useState<GithubAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [assetViewMode, setAssetViewMode] = useState<'list' | 'grid'>('grid');
  const [assetFilter, setAssetFilter] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [currentIdea, setCurrentIdea] = useState(CREATIVE_IDEAS[0]);

  // Window State
  const [windows, setWindows] = useState({ 
    explorer: false, 
    editor: true, 
    stats: false, 
    export: false, 
    ai: false, 
    studio: false, 
    sidebar: true, 
    idea: false, 
    scenes: false 
  });
  const [windowStack, setWindowStack] = useState<string[]>(['editor', 'explorer', 'ai', 'studio', 'stats', 'export', 'idea', 'scenes']);

  // Scene State
  const [layers, setLayers] = useState<SceneLayer[]>([]);
  const [gameStats, setGameStats] = useState<GameStat[]>([{ id: 'hp', name: 'Health', value: 100, min: 0, max: 100 }]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [savedScenes, setSavedScenes] = useState<SavedScene[]>([]);
  const [exportCode, setExportCode] = useState('');

  // AI Assistant State
  const [aiInput, setAiInput] = useState('');
  const [aiHistory, setAiHistory] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // AI Studio State
  const [studioTab, setStudioTab] = useState<'gen' | 'edit' | 'video'>('gen');
  const [genPrompt, setGenPrompt] = useState('');
  const [genRatio, setGenRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genResult, setGenResult] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editImageBase64, setEditImageBase64] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoStartBase64, setVideoStartBase64] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [videoRatio, setVideoRatio] = useState<'16:9' | '9:16'>('16:9');

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  const editorCanvasRef = useRef<HTMLDivElement>(null);

  // Load Assets
  useEffect(() => {
    fetchRepoAssets().then(setAssets).then(() => setLoading(false));
    const saved = localStorage.getItem('entropic_scenes');
    if (saved) setSavedScenes(JSON.parse(saved));
  }, []);

  const bringToFront = (win: string) => setWindowStack(prev => [...prev.filter(k => k !== win), win]);
  const toggleWindow = (win: string, force?: boolean) => {
    const isOpen = force !== undefined ? force : !windows[win as keyof typeof windows];
    setWindows(prev => ({ ...prev, [win]: isOpen }));
    if (isOpen) bringToFront(win);
  };

  const getZIndex = (win: string) => 10 + windowStack.indexOf(win);
  const activeWindow = windowStack[windowStack.length - 1];

  const updateLayer = useCallback((id: string, updates: Partial<SceneLayer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  const addLayer = (asset: { name: string, url: string, role?: LayerRole }, x = 100, y = 100) => {
    const isSfx = isAudio(asset.name);
    const newLayer: SceneLayer = {
      id: Math.random().toString(36).substr(2, 9),
      name: asset.name,
      type: isSfx ? 'audio' : 'image',
      role: isSfx ? 'sound_emitter' : (asset.role || 'sprite'),
      url: asset.url,
      x, y,
      width: isSfx ? 40 : 150, height: 150,
      zIndex: layers.length,
      opacity: 1, rotation: 0, flipX: false, flipY: false,
      animation: 'none', effectIntensity: 1, effectSpeed: 1, effectColor: '#FFFF00',
      hoverEffect: 'none', isAudioAutoplay: true, audioVolume: 1, isLocked: false
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleAssetDragStart = (e: React.DragEvent, asset: GithubAsset) => {
    e.dataTransfer.setData('asset', JSON.stringify(asset));
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const assetData = e.dataTransfer.getData('asset');
    if (!assetData || !editorCanvasRef.current) return;
    const asset = JSON.parse(assetData);
    const rect = editorCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel - 40;
    const y = (e.clientY - rect.top) / zoomLevel - 40;
    addLayer(asset, x, y);
  };

  const saveCurrentScene = () => {
    const name = prompt("Enter scene name:", `Scene ${savedScenes.length + 1}`);
    if (!name) return;
    const newScene: SavedScene = { id: Math.random().toString(36).substr(2, 9), name, timestamp: Date.now(), layers, stats: gameStats };
    const updated = [...savedScenes, newScene];
    setSavedScenes(updated);
    localStorage.setItem('entropic_scenes', JSON.stringify(updated));
    alert("Scene Saved!");
  };

  const loadScene = (scene: SavedScene) => {
    setLayers(scene.layers);
    setGameStats(scene.stats);
    toggleWindow('scenes', false);
  };

  const handleCanvasDrag = (e: React.MouseEvent | React.TouchEvent, layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer || layer.isLocked) return;
    setSelectedLayerId(layerId);
    bringToFront('editor');
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startX = clientX, startY = clientY, initX = layer.x, initY = layer.y;
    
    const onMove = (mE: MouseEvent) => {
      let nx = initX + (mE.clientX - startX) / zoomLevel, ny = initY + (mE.clientY - startY) / zoomLevel;
      if (snapToGrid) { nx = Math.round(nx / gridSize) * gridSize; ny = Math.round(ny / gridSize) * gridSize; }
      updateLayer(layerId, { x: nx, y: ny });
    };
    const onEnd = () => {
      window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onEnd);
    };
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onEnd);
  };

  const handleStudioAction = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    if (studioTab === 'gen') {
      if (!genPrompt.trim()) return;
      if (!(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }
      setIsGenerating(true);
      try {
        const res = await ai.models.generateContent({ 
          model: 'gemini-3-pro-image-preview', 
          contents: { parts: [{ text: genPrompt }] }, 
          config: { imageConfig: { aspectRatio: genRatio as any, imageSize: '1K' } } 
        });
        const part = res.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part?.inlineData) setGenResult(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      } catch (e: any) { 
        if (e.message?.includes("Requested entity was not found")) {
          await window.aistudio.openSelectKey();
        }
        alert("Generation error."); 
      } finally { setIsGenerating(false); }
    } else if (studioTab === 'edit') {
      if (!editPrompt.trim() || !editImageBase64) return;
      setIsEditing(true);
      try {
        const res = await ai.models.generateContent({ 
          model: 'gemini-2.5-flash-image', 
          contents: { parts: [{ inlineData: { data: editImageBase64.split(',')[1], mimeType: 'image/png' } }, { text: editPrompt }] } 
        });
        const part = res.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part?.inlineData) setEditImageBase64(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      } catch (e) { alert("Edit failed."); } finally { setIsEditing(false); }
    } else if (studioTab === 'video') {
      if (!videoStartBase64) return;
      if (!(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }
      setIsGeneratingVideo(true);
      try {
        let op = await ai.models.generateVideos({ 
          model: 'veo-3.1-fast-generate-preview', 
          prompt: videoPrompt, 
          image: { imageBytes: videoStartBase64.split(',')[1], mimeType: 'image/png' }, 
          config: { resolution: '720p', aspectRatio: videoRatio, numberOfVideos: 1 } 
        });
        while (!op.done) { 
          await new Promise(r => setTimeout(r, 10000)); 
          op = await ai.operations.getVideosOperation({ operation: op }); 
        }
        const downloadUrl = op.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadUrl) setVideoResult(`${downloadUrl}&key=${process.env.API_KEY}`);
      } catch (e: any) { 
        if (e.message?.includes("Requested entity was not found")) {
          await window.aistudio.openSelectKey();
        }
        alert("Video failed."); 
      } finally { setIsGeneratingVideo(false); }
    }
  };

  const handleAiChat = async () => {
    if (!aiInput.trim()) return;
    const msg = aiInput; setAiInput(''); setAiHistory(p => [...p, { role: 'user', text: msg }]); setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: msg, 
        config: { systemInstruction: "Help the user build their Win98 point and click scene. Be retro, helpful, and creative." } 
      });
      setAiHistory(p => [...p, { role: 'assistant', text: res.text || "OK!" }]);
    } catch (e) { setAiHistory(p => [...p, { role: 'assistant', text: "Dial-up error." }]); } finally { setIsAiLoading(false); }
  };

  const showIdea = () => {
    const randomIndex = Math.floor(Math.random() * CREATIVE_IDEAS.length);
    setCurrentIdea(CREATIVE_IDEAS[randomIndex]);
    toggleWindow('idea', true);
  };

  const generateExport = () => {
    const exportData = { layers, stats: gameStats, exportedAt: new Date().toISOString(), canvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } };
    setExportCode(JSON.stringify(exportData, null, 2));
    toggleWindow('export', true);
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(a => a.name.toLowerCase().includes(assetFilter.toLowerCase()));
  }, [assets, assetFilter]);

  const groupedAssets = useMemo(() => {
    const groups: Record<string, GithubAsset[]> = {};
    filteredAssets.forEach(asset => {
      const parts = asset.path.split('/');
      const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : 'General Assets';
      if (!groups[folder]) groups[folder] = [];
      groups[folder].push(asset);
    });
    return groups;
  }, [filteredAssets]);

  const toggleFolder = (folder: string) => {
    setCollapsedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folder)) next.delete(folder);
      else next.add(folder);
      return next;
    });
  };

  const toggleAllFolders = (collapse: boolean) => {
    if (collapse) {
      setCollapsedFolders(new Set(Object.keys(groupedAssets)));
    } else {
      setCollapsedFolders(new Set());
    }
  };

  const selectedLayer = useMemo(() => layers.find(l => l.id === selectedLayerId), [layers, selectedLayerId]);

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#008080] text-black">
      {/* Desktop Grid */}
      <div className="absolute inset-0 z-0 p-8 grid grid-flow-col grid-rows-6 auto-cols-min gap-4 pointer-events-none">
        <div className="pointer-events-auto"><DesktopIcon label="Assets" icon="📁" onClick={() => toggleWindow('explorer', true)} /></div>
        <div className="pointer-events-auto"><DesktopIcon label="Workbench" icon="🖼️" onClick={() => toggleWindow('editor', true)} /></div>
        <div className="pointer-events-auto"><DesktopIcon label="Studio" icon="✨" onClick={() => toggleWindow('studio', true)} /></div>
        <div className="pointer-events-auto"><DesktopIcon label="Assistant" icon="🤖" onClick={() => toggleWindow('ai', true)} /></div>
        <div className="pointer-events-auto"><DesktopIcon label="Variables" icon="📈" onClick={() => toggleWindow('stats', true)} /></div>
      </div>

      {/* Vertical Right Sidebar Taskbar */}
      <div className="absolute right-0 top-0 bottom-0 w-12 win98-border z-[100] flex flex-col items-center py-2 gap-4 bg-[#c0c0c0]">
        <button onClick={() => setWindows(w => ({...w, sidebar: !w.sidebar}))} className={`win98-button w-10 h-10 font-bold ${windows.sidebar ? 'active' : ''}`} title="Start Sidebar">
          <span className="text-xl">🍬</span>
        </button>
        <div className="w-8 h-[1px] bg-gray-400 border-b border-white my-1"></div>
        <button onClick={saveCurrentScene} className="win98-button w-10 h-10 text-[9px]" title="Save Scene">💾</button>
        <button onClick={() => toggleWindow('scenes', true)} className="win98-button w-10 h-10 text-[9px]" title="My Scenes">📂</button>
        <button onClick={() => toggleWindow('editor', true)} className="win98-button w-10 h-10 text-[9px]" title="Editor">🖼️</button>
        <div className="flex-grow"></div>
        <div className="win98-inset w-10 py-2 text-[8px] font-bold text-center bg-white rounded-sm -rotate-90 whitespace-nowrap">
          {new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
        </div>
      </div>

      {/* Persistent Sidebar Menu */}
      <div className={`sidebar-menu win98-border shadow-2xl flex flex-col ${windows.sidebar ? 'show' : ''}`} style={{ right: '48px' }}>
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] h-6 flex items-center px-2 text-white font-bold text-[10px]">ENTROPIC SIDEBAR</div>
        <div className="flex-grow p-1 flex flex-col gap-1 text-[11px]">
          <button onClick={() => toggleWindow('explorer', true)} className="text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 border border-transparent hover:border-gray-400">📁 Explorer</button>
          <button onClick={() => toggleWindow('editor', true)} className="text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 border border-transparent hover:border-gray-400">🖼️ Scene Maker</button>
          <button onClick={() => toggleWindow('studio', true)} className="text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 border border-transparent hover:border-gray-400">✨ AI Studio</button>
          <button onClick={() => toggleWindow('stats', true)} className="text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 border border-transparent hover:border-gray-400">📈 Variables</button>
          <div className="h-[1px] bg-gray-400 my-2"></div>
          <button onClick={generateExport} className="text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white font-bold flex items-center gap-2 border border-transparent hover:border-gray-400">🚀 COMPILE</button>
          <button onClick={showIdea} className="text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 border border-transparent hover:border-gray-400">💡 IDEA GEN</button>
        </div>
        <div className="bg-gray-300 p-2 text-[8px] italic text-center text-gray-600 border-t border-gray-400">Windows 98 Pro v1.0</div>
      </div>

      {/* Main Workbench Editor */}
      {windows.editor && (
        <Window title="Point & Click Builder - Pro Workbench" width={1100} height={780} zIndex={getZIndex('editor')} isActive={activeWindow === 'editor'} onClose={() => toggleWindow('editor', false)}>
          <div className="flex flex-col h-full overflow-hidden">
            {/* Workbench Toolbar */}
            <div className="flex items-center gap-4 p-1 border-b border-gray-400 text-[10px] bg-gray-200">
              <div className="flex gap-1 items-center bg-gray-100 p-0.5 win98-inset">
                <button onClick={() => setZoomLevel(z => Math.max(0.1, z-0.1))} className="win98-button w-6 h-6">-</button>
                <span className="w-12 text-center font-bold">{(zoomLevel*100).toFixed(0)}%</span>
                <button onClick={() => setZoomLevel(z => Math.min(4, z+0.1))} className="win98-button w-6 h-6">+</button>
                <button onClick={() => setZoomLevel(1.0)} className="win98-button h-6 px-1 text-[8px]">1:1</button>
              </div>
              <div className="h-6 w-[1px] bg-gray-400"></div>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)}/> Grid</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={snapToGrid} onChange={e => setSnapToGrid(e.target.checked)}/> Snap</label>
              <input type="number" className="w-10 win98-inset px-1" value={gridSize} onChange={e => setGridSize(+e.target.value)}/>
              <div className="flex-grow"></div>
              <button onClick={generateExport} className="win98-button h-7 px-3 font-bold text-blue-900 italic">🚀 COMPILE PROJECT</button>
            </div>

            <div className="flex flex-grow min-h-0 bg-gray-300">
              {/* Workspace Canvas */}
              <div className="flex-grow flex flex-col relative overflow-hidden bg-gray-600 win98-inset m-1 shadow-inner">
                <div ref={editorCanvasRef} onDragOver={e => e.preventDefault()} onDrop={handleCanvasDrop} className="flex-grow overflow-auto relative bg-[#222]">
                  <div className="relative origin-top-left shadow-2xl" style={{ transform: `scale(${zoomLevel})`, width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
                    {showGrid && <div className="canvas-grid-overlay" style={{ '--grid-size': `${gridSize}px` } as any} />}
                    {layers.slice().sort((a,b)=>a.zIndex-b.zIndex).map(l => (
                      <div key={l.id} className={`layer-container ${selectedLayerId === l.id ? 'ring-2 ring-blue-500 z-[999]' : ''}`}
                        style={{ left: l.x, top: l.y, width: l.width, zIndex: l.zIndex, opacity: l.opacity, transform: `rotate(${l.rotation}deg) scale(${l.flipX?-1:1}, ${l.flipY?-1:1})`, '--fx-int': l.effectIntensity, '--fx-col': l.effectColor, '--fx-dur': getAnimDuration(l.animation, l.effectSpeed) } as any}
                        onMouseDown={e => handleCanvasDrag(e, l.id)}>
                        {l.role === 'sound_emitter' ? <div className="w-10 h-10 bg-gray-800 border-2 border-white text-white flex items-center justify-center rounded-full anim-pulse text-lg">🔊</div> 
                        : <img src={l.url} className={`layer-image anim-${l.animation} hover-${l.hoverEffect}`} alt=""/>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-6 border-t border-gray-400 bg-gray-200 text-[9px] px-2 flex items-center justify-between">
                  <div className="flex gap-4">
                    <span>Layers: {layers.length}</span>
                    <span>Canvas: {CANVAS_WIDTH}x{CANVAS_HEIGHT}</span>
                  </div>
                  <span className="italic text-gray-500">Workbench Ready</span>
                </div>
              </div>

              {/* Inspector Panel */}
              <div className="w-80 flex flex-col border-l border-gray-400 bg-gray-200 shrink-0">
                <div className="h-[45%] flex flex-col p-1">
                  <div className="bg-[#000080] text-white p-1 text-[10px] font-bold flex justify-between items-center px-2">
                    <span>LAYER STACK</span>
                    <button onClick={() => setLayers([])} className="text-[8px] px-1 bg-red-700 win98-button border-none text-white h-4">RESET</button>
                  </div>
                  <div className="flex-grow overflow-y-auto bg-white win98-inset mt-1">
                    {layers.length === 0 ? (
                      <div className="p-8 text-center text-[10px] text-gray-400 italic">Drag assets from explorer to begin.</div>
                    ) : (
                      layers.slice().reverse().map((l, i) => {
                        const idx = layers.length - 1 - i;
                        return (
                          <div key={l.id} draggable onDragStart={e => e.dataTransfer.setData('layerIdx', idx.toString())} onDragOver={e => e.preventDefault()} 
                            onDrop={e => { const from = +e.dataTransfer.getData('layerIdx'); const temp = [...layers]; const [m] = temp.splice(from,1); temp.splice(idx,0,m); setLayers(temp.map((x,ni)=>({...x,zIndex:ni}))); }}
                            onClick={() => setSelectedLayerId(l.id)} className={`p-1.5 flex justify-between items-center cursor-move text-[10px] border-b ${selectedLayerId === l.id ? 'bg-[#000080] text-white' : 'hover:bg-gray-100'}`}>
                            <span className="truncate flex-grow font-sans px-1">
                              {l.isLocked ? '🔒' : (l.role === 'sound_emitter' ? '🔊' : '🖐️')} {l.name}
                            </span>
                            <div className="flex gap-1">
                              <button onClick={() => updateLayer(l.id, { isLocked: !l.isLocked })} className={`win98-button w-5 h-5 p-0 ${l.isLocked?'bg-yellow-100':''}`}>{l.isLocked?'🔓':'🔒'}</button>
                              <button onClick={() => setLayers(p => p.filter(x => x.id !== l.id))} className="win98-button w-5 h-5 p-0 text-red-600 font-bold">×</button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="flex-grow flex flex-col overflow-y-auto p-1">
                  <div className="bg-[#000080] text-white p-1 text-[10px] font-bold px-2 mb-1">PROPERTIES</div>
                  <div className="flex-grow bg-gray-100 win98-inset p-2">
                    {selectedLayer ? (
                      <div className="space-y-4 text-[10px]">
                        <fieldset className="win98-border p-2 pt-1">
                          <legend className="px-1 font-bold text-blue-900">Transform</legend>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="flex flex-col">X: <input type="number" className="win98-inset p-0.5" value={Math.round(selectedLayer.x)} onChange={e=>updateLayer(selectedLayer.id,{x:+e.target.value})}/></div>
                            <div className="flex flex-col">Y: <input type="number" className="win98-inset p-0.5" value={Math.round(selectedLayer.y)} onChange={e=>updateLayer(selectedLayer.id,{y:+e.target.value})}/></div>
                          </div>
                          <div className="mt-2 flex flex-col">
                             <label className="flex justify-between">Width: <span>{selectedLayer.width}px</span></label>
                             <input type="range" min="10" max="2000" value={selectedLayer.width} onChange={e=>updateLayer(selectedLayer.id,{width:+e.target.value})}/>
                          </div>
                          <div className="mt-2 flex flex-col">
                             <label className="flex justify-between">Rotate: <span>{selectedLayer.rotation}°</span></label>
                             <input type="range" min="0" max="360" value={selectedLayer.rotation} onChange={e=>updateLayer(selectedLayer.id,{rotation:+e.target.value})}/>
                          </div>
                        </fieldset>

                        <fieldset className="win98-border p-2 pt-1">
                          <legend className="px-1 font-bold text-blue-900">Visual</legend>
                          <div className="flex gap-1 mb-2">
                             <button className={`win98-button flex-grow text-[9px] ${selectedLayer.flipX?'active':''}`} onClick={()=>updateLayer(selectedLayer.id,{flipX:!selectedLayer.flipX})}>Flip H</button>
                             <button className={`win98-button flex-grow text-[9px] ${selectedLayer.flipY?'active':''}`} onClick={()=>updateLayer(selectedLayer.id,{flipY:!selectedLayer.flipY})}>Flip V</button>
                          </div>
                          <label className="flex justify-between">Opacity: <span>{(selectedLayer.opacity*100).toFixed(0)}%</span></label>
                          <input type="range" min="0" max="1" step="0.01" value={selectedLayer.opacity} onChange={e=>updateLayer(selectedLayer.id,{opacity:+e.target.value})}/>
                          
                          <label className="mt-2 block">Animation:</label>
                          <select className="win98-inset w-full p-0.5" value={selectedLayer.animation} onChange={e=>updateLayer(selectedLayer.id,{animation:e.target.value as any})}>
                            <option value="none">None</option><option value="pulse">Pulse</option><option value="float">Breathe</option>
                            <option value="shake">Shake</option><option value="spin">Spin</option><option value="bounce">Bounce</option>
                          </select>
                        </fieldset>

                        <fieldset className="win98-border p-2 pt-1">
                          <legend className="px-1 font-bold text-blue-900">Advanced</legend>
                          <label>Hover Mode:</label>
                          <select className="win98-inset w-full p-0.5" value={selectedLayer.hoverEffect} onChange={e=>updateLayer(selectedLayer.id,{hoverEffect:e.target.value as any})}>
                             <option value="none">None</option><option value="glow">Glow</option><option value="lift">Lift</option>
                             <option value="invert">Invert</option><option value="blur">Blur</option>
                          </select>

                          {selectedLayer.role === 'sound_emitter' && (
                            <div className="mt-2 p-2 bg-yellow-100 win98-inset space-y-2">
                              <label className="flex items-center gap-1 font-bold cursor-pointer"><input type="checkbox" checked={selectedLayer.isAudioAutoplay} onChange={e=>updateLayer(selectedLayer.id,{isAudioAutoplay:e.target.checked})}/> Loop Autoplay</label>
                              <div className="flex flex-col">
                                <label className="flex justify-between text-[8px]">Volume: <span>{selectedLayer.audioVolume}</span></label>
                                <input type="range" min="0" max="1" step="0.1" value={selectedLayer.audioVolume} onChange={e=>updateLayer(selectedLayer.id,{audioVolume:+e.target.value})}/>
                              </div>
                            </div>
                          )}
                        </fieldset>
                      </div>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-gray-400 italic text-[10px] p-6 text-center opacity-60">
                         <span className="text-4xl mb-4">🔍</span>
                         Select an element to inspect and modify properties.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Window>
      )}

      {/* AI Studio Window */}
      {windows.studio && (
        <Window title="Entropic AI Studio" width={440} height={580} zIndex={getZIndex('studio')} isActive={activeWindow === 'studio'} onClose={() => toggleWindow('studio', false)}>
          <div className="flex flex-col h-full gap-2 text-[10px]">
            <div className="flex gap-1 px-1">
              <button onClick={()=>setStudioTab('gen')} className={`win98-button flex-grow font-bold ${studioTab==='gen'?'active':''}`}>GENERATE</button>
              <button onClick={()=>setStudioTab('edit')} className={`win98-button flex-grow font-bold ${studioTab==='edit'?'active':''}`}>EDIT</button>
              <button onClick={()=>setStudioTab('video')} className={`win98-button flex-grow font-bold ${studioTab==='video'?'active':''}`}>ANIMATE</button>
            </div>
            
            <div className="win98-inset m-1 p-3 bg-gray-100 flex-grow overflow-y-auto">
              {studioTab === 'gen' && (
                <div className="flex flex-col gap-3">
                  <p className="italic text-gray-600">Create new high-fidelity assets using Pro models.</p>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold">Describe Asset:</label>
                    <textarea className="win98-inset h-24 p-2 resize-none" value={genPrompt} onChange={e=>setGenPrompt(e.target.value)} placeholder="e.g. A retro pixel art spaceship with blue neon highlights..."/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold">Format:</label>
                    <select className="win98-inset p-1" value={genRatio} onChange={e=>setGenRatio(e.target.value)}>{ASPECT_RATIOS.map(r=><option key={r} value={r}>{r}</option>)}</select>
                  </div>
                  <button onClick={handleStudioAction} disabled={isGenerating} className="win98-button py-2 font-bold text-blue-900">{isGenerating?'✨ GENERATING...':'✨ START GENERATION'}</button>
                  {genResult && (
                    <div className="mt-3 p-2 win98-inset bg-white">
                       <img src={genResult} className="max-h-40 mx-auto win98-inset"/>
                       <button onClick={()=>addLayer({name:'AI Result', url:genResult})} className="win98-button w-full mt-2 font-bold">ADD TO SCENE</button>
                    </div>
                  )}
                </div>
              )}
              {studioTab === 'edit' && (
                <div className="flex flex-col gap-3">
                  <p className="italic text-gray-600">Modify existing images using Gemini 2.5 Flash Image.</p>
                  <div className="win98-inset p-2 bg-white flex flex-col items-center min-h-[100px] justify-center">
                    {editImageBase64 ? <img src={editImageBase64} className="h-32 mb-2 shadow-sm win98-inset"/> : <span className="text-gray-400">Upload an image to edit</span>}
                    <input type="file" onChange={e => { const f=e.target.files?.[0]; if(f){const r=new FileReader(); r.onload=()=>setEditImageBase64(r.result as string); r.readAsDataURL(f);}}} className="text-[8px] w-full mt-2"/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold">Instructions:</label>
                    <textarea className="win98-inset h-16 p-2 resize-none" value={editPrompt} onChange={e=>setEditPrompt(e.target.value)} placeholder="e.g. 'Turn it into a charcoal sketch'"/>
                  </div>
                  <button onClick={handleStudioAction} disabled={isEditing || !editImageBase64} className="win98-button py-2 font-bold">{isEditing?'🖌️ PROCESSING...':'🖌️ APPLY EDIT'}</button>
                </div>
              )}
              {studioTab === 'video' && (
                <div className="flex flex-col gap-3">
                  <p className="italic text-gray-600">Transform a photo into a short animated video using Veo 3.1.</p>
                  <div className="win98-inset p-2 bg-white flex flex-col items-center min-h-[100px] justify-center">
                    {videoStartBase64 ? <img src={videoStartBase64} className="h-28 mb-2 shadow-sm win98-inset"/> : <span className="text-gray-400">Upload start frame</span>}
                    <input type="file" onChange={e => { const f=e.target.files?.[0]; if(f){const r=new FileReader(); r.onload=()=>setVideoStartBase64(r.result as string); r.readAsDataURL(f);}}} className="text-[8px] w-full mt-2"/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold">Movement Description:</label>
                    <textarea className="win98-inset h-16 p-2 resize-none" value={videoPrompt} onChange={e=>setVideoPrompt(e.target.value)} placeholder="How should it move?"/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold">Ratio:</label>
                    <select className="win98-inset p-1" value={videoRatio} onChange={e=>setVideoRatio(e.target.value as any)}><option value="16:9">16:9 Landscape</option><option value="9:16">9:16 Portrait</option></select>
                  </div>
                  <button onClick={handleStudioAction} disabled={isGeneratingVideo || !videoStartBase64} className="win98-button py-2 font-bold text-red-900">{isGeneratingVideo?'🎬 RENDERING (Wait)...':'🎬 GENERATE VIDEO'}</button>
                  {videoResult && <div className="mt-3 p-1 win98-inset bg-black"><video src={videoResult} controls className="w-full h-40"/></div>}
                </div>
              )}
            </div>
          </div>
        </Window>
      )}

      {/* Grouped & Collapsible Asset Explorer */}
      {windows.explorer && (
        <Window title="Asset Explorer" width={550} height={580} zIndex={getZIndex('explorer')} isActive={activeWindow === 'explorer'} onClose={() => toggleWindow('explorer', false)}>
          <div className="flex flex-col h-full text-[10px] bg-gray-200">
            {/* Explorer Toolbar */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-200 border-b border-gray-400">
              <div className="flex gap-1">
                <button onClick={()=>setAssetViewMode('list')} className={`win98-button w-8 h-8 p-0 ${assetViewMode==='list'?'active':''}`} title="Details View">≡</button>
                <button onClick={()=>setAssetViewMode('grid')} className={`win98-button w-8 h-8 p-0 ${assetViewMode==='grid'?'active':''}`} title="Icons View">▦</button>
              </div>
              <div className="h-8 w-[1px] bg-gray-400 mx-1"></div>
              <div className="flex gap-1">
                <button onClick={() => toggleAllFolders(true)} className="win98-button h-8 px-2 text-[9px]" title="Collapse All">[-]</button>
                <button onClick={() => toggleAllFolders(false)} className="win98-button h-8 px-2 text-[9px]" title="Expand All">[+]</button>
              </div>
              <div className="h-8 w-[1px] bg-gray-400 mx-1"></div>
              <div className="flex items-center gap-2 flex-grow bg-white win98-inset px-2 h-8">
                 <span className="text-gray-400">🔍</span>
                 <input 
                   type="text" 
                   className="flex-grow bg-transparent outline-none h-full text-[11px]" 
                   placeholder="Search assets..." 
                   value={assetFilter}
                   onChange={e => setAssetFilter(e.target.value)}
                 />
                 {assetFilter && <button onClick={() => setAssetFilter('')} className="text-gray-400 hover:text-black font-bold px-1">×</button>}
              </div>
              <button onClick={() => { setLoading(true); fetchRepoAssets().then(setAssets).then(()=>setLoading(false)); }} className="win98-button h-8 px-2 flex gap-1 items-center">
                 🔄 <span>Refresh</span>
              </button>
            </div>

            {/* Grouped Content Area */}
            <div className="win98-inset flex-grow bg-white overflow-y-auto m-1.5 p-0 shadow-inner">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center bg-gray-50 gap-3 opacity-60">
                   <div className="animate-spin text-3xl">⏳</div>
                   <p className="font-bold">Syncing repository...</p>
                </div>
              ) : Object.keys(groupedAssets).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 italic text-[11px]">
                   <span className="text-4xl mb-4">🕳️</span>
                   No assets found matching "{assetFilter}"
                </div>
              ) : (
                <div className="flex flex-col">
                  {Object.entries(groupedAssets).sort(([a], [b]) => a.localeCompare(b)).map(([folder, folderAssets]) => {
                    const isCollapsed = collapsedFolders.has(folder);
                    return (
                      <div key={folder} className="mb-0 border-b border-gray-200 last:border-b-0">
                        {/* Folder Header */}
                        <div 
                          className="bg-[#e1e1e1] px-3 py-1.5 font-bold border-y border-gray-300 flex items-center gap-2 text-[11px] text-blue-900 sticky top-0 z-20 shadow-sm cursor-pointer hover:bg-gray-200 select-none"
                          onClick={() => toggleFolder(folder)}
                        >
                          <span className="text-[12px] font-mono w-4 text-center">{isCollapsed ? '[+]' : '[-]'}</span>
                          <span className="text-lg">📁</span>
                          <span className="tracking-wide uppercase">{folder}</span>
                          <span className="text-[9px] font-normal text-gray-500 ml-auto bg-white/50 px-2 rounded-full border border-gray-300">{folderAssets.length} items</span>
                        </div>
                        
                        {/* Folder Content - Conditional rendering for performance */}
                        {!isCollapsed && (
                          <div className="bg-white">
                            {assetViewMode === 'grid' ? (
                              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 p-4 animate-in fade-in duration-200">
                                {folderAssets.map(a => (
                                  <div key={a.path} draggable onDragStart={e => handleAssetDragStart(e, a)} onClick={()=>addLayer(a)} 
                                    className="cursor-grab p-2 border border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center group relative">
                                    <div className="w-16 h-16 flex items-center justify-center bg-gray-50 win98-inset p-1 shadow-sm group-hover:shadow-md">
                                      {isImage(a.name) ? <img src={a.url} className="max-h-full max-w-full object-contain" alt=""/> : <span className="text-3xl">🎵</span>}
                                    </div>
                                    <span className="text-[10px] mt-2 text-center break-all line-clamp-2 leading-tight px-1 group-hover:text-blue-900 group-hover:font-bold">{a.name}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col animate-in fade-in duration-200">
                                {folderAssets.map(a => (
                                  <div key={a.path} draggable onDragStart={e => handleAssetDragStart(e, a)} onClick={()=>addLayer(a)} 
                                    className="flex items-center cursor-grab border-b border-gray-50 hover:bg-blue-600 hover:text-white group transition-colors">
                                    <div className="w-12 h-10 flex items-center justify-center p-1 shrink-0 bg-gray-50/30">
                                      {isImage(a.name) ? <img src={a.url} className="max-h-full max-w-full object-contain" alt=""/> : <span className="text-xl">🎵</span>}
                                    </div>
                                    <div className="flex-grow px-3 font-sans truncate py-2 text-[11px]" title={a.name}>{a.name}</div>
                                    <div className="w-20 px-3 text-[9px] text-gray-400 group-hover:text-blue-100 font-mono uppercase text-right">{a.name.split('.').pop()}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Status Info */}
            <div className="px-3 py-1 border-t border-gray-400 bg-gray-200 text-[9px] flex justify-between items-center text-gray-600 shrink-0">
               <div className="flex gap-4">
                 <span>Groups: {Object.keys(groupedAssets).length}</span>
                 <span>Total: {filteredAssets.length}</span>
               </div>
               <span>Double-click or drag to workspace</span>
            </div>
          </div>
        </Window>
      )}

      {/* Utility Windows */}
      {windows.scenes && (
        <Window title="Scene Browser" width={320} height={420} zIndex={getZIndex('scenes')} isActive={activeWindow === 'scenes'} onClose={() => toggleWindow('scenes', false)}>
          <div className="flex flex-col h-full bg-gray-200 p-1">
            <div className="win98-inset bg-white flex-grow overflow-y-auto m-1">
              {savedScenes.length === 0 ? <div className="p-12 text-center italic text-gray-400 text-[10px]">No snapshots found.</div> : (
                savedScenes.map(s => (
                  <div key={s.id} onClick={() => loadScene(s)} className="p-3 border-b hover:bg-[#000080] hover:text-white cursor-pointer group flex justify-between items-center text-[11px]">
                    <div className="flex flex-col">
                       <span className="font-bold">{s.name}</span>
                       <span className="text-[8px] opacity-70 italic">{new Date(s.timestamp).toLocaleString()}</span>
                    </div>
                    <button onClick={e=>{e.stopPropagation(); const n=savedScenes.filter(x=>x.id!==s.id); setSavedScenes(n); localStorage.setItem('entropic_scenes', JSON.stringify(n));}} className="text-red-500 opacity-0 group-hover:opacity-100 font-bold text-lg p-1 hover:scale-110">🗑️</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Window>
      )}

      {windows.stats && (
        <Window title="Global Variables" width={300} zIndex={getZIndex('stats')} isActive={activeWindow === 'stats'} onClose={() => toggleWindow('stats', false)}>
          <div className="p-2 space-y-4 text-[10px]">
            {gameStats.map(s => (
              <div key={s.id} className="win98-inset p-3 bg-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <input className="font-bold bg-transparent outline-none flex-grow border-b border-gray-400 focus:border-blue-500" value={s.name} onChange={e=>setGameStats(p=>p.map(x=>x.id===s.id?{...x,name:e.target.value}:x))}/>
                  <button onClick={()=>setGameStats(p=>p.filter(x=>x.id!==s.id))} className="text-red-600 font-bold ml-4 hover:scale-110">🗑️</button>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1">Val: <input type="number" className="win98-inset w-14 px-1" value={s.value} onChange={e=>setGameStats(p=>p.map(x=>x.id===s.id?{...x,value:+e.target.value}:x))}/></div>
                   <div className="flex items-center gap-1">Max: <input type="number" className="win98-inset w-14 px-1" value={s.max} onChange={e=>setGameStats(p=>p.map(x=>x.id===s.id?{...x,max:+e.target.value}:x))}/></div>
                </div>
              </div>
            ))}
            <button onClick={()=>setGameStats([...gameStats, {id:Math.random().toString(), name:'variable_'+gameStats.length, value:50, min:0, max:100}])} className="win98-button w-full font-bold py-2 bg-blue-50">+ ADD VARIABLE</button>
          </div>
        </Window>
      )}

      {windows.ai && (
        <Window title="Clippy Assistant" width={340} height={450} zIndex={getZIndex('ai')} isActive={activeWindow === 'ai'} onClose={() => toggleWindow('ai', false)}>
          <div className="flex flex-col h-full gap-2 p-1 text-[11px]">
            <div className="win98-inset bg-white flex-grow overflow-y-auto p-4 font-sans flex flex-col gap-4">
              <div className="flex gap-2 items-start text-blue-900 bg-blue-50 p-2 border border-blue-200 rounded-sm italic">
                <span>🤖:</span>
                <span>It looks like you're building a masterpiece! I'm here to help with questions about the editor or scene ideas.</span>
              </div>
              {aiHistory.map((m, i) => (
                <div key={i} className={`flex gap-2 items-start ${m.role==='user'?'text-gray-700':'text-blue-900 p-1 border-l-2 border-blue-400 bg-gray-50'}`}>
                  <span className="font-bold shrink-0">{m.role==='user'?'👤:':'🤖:'}</span>
                  <span className="leading-tight">{m.text}</span>
                </div>
              ))}
              {isAiLoading && <div className="italic text-gray-400 animate-pulse text-[10px]">Generating response...</div>}
            </div>
            <div className="flex gap-1 p-1">
              <input type="text" className="win98-inset flex-grow px-3 py-1.5 outline-none" value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAiChat()} placeholder="Ask for scene help..."/>
              <button onClick={handleAiChat} disabled={isAiLoading} className="win98-button px-5 font-bold">SEND</button>
            </div>
          </div>
        </Window>
      )}

      {windows.idea && (
        <Window title="Idea Spark" width={320} zIndex={getZIndex('idea')} isActive={activeWindow === 'idea'} onClose={() => toggleWindow('idea', false)} resizable={false}>
          <div className="p-8 text-center bg-[#ffffcc] win98-inset m-1 flex flex-col items-center gap-6 shadow-inner">
            <div className="text-6xl drop-shadow-lg">💡</div>
            <p className="italic text-blue-900 text-[14px] font-sans font-bold leading-relaxed">"{currentIdea}"</p>
            <div className="flex gap-3 w-full mt-2">
              <button onClick={showIdea} className="win98-button flex-grow py-2 font-bold bg-white">REGENERATE</button>
              <button onClick={()=>toggleWindow('idea', false)} className="win98-button flex-grow py-2">CLOSE</button>
            </div>
          </div>
        </Window>
      )}

      {windows.export && (
        <Window title="Compiler Target - Metadata" width={550} height={550} zIndex={getZIndex('export')} isActive={activeWindow === 'export'} onClose={() => toggleWindow('export', false)}>
          <div className="flex flex-col h-full gap-2 p-1 bg-gray-200">
            <p className="text-[10px] font-bold px-2 py-1 text-gray-700">Project JSON Snapshot:</p>
            <textarea readOnly className="win98-inset flex-grow bg-black text-[#0f0] font-mono text-[10px] p-5 resize-none outline-none leading-relaxed border-none" value={exportCode} />
            <div className="flex gap-2 mt-2 px-1">
               <button className="win98-button py-2 flex-grow font-bold bg-[#000080] text-white" onClick={() => { navigator.clipboard.writeText(exportCode); alert("Project data copied!"); }}>COPY JSON DATA</button>
               <button className="win98-button py-2 px-8 font-bold" onClick={() => toggleWindow('export', false)}>DISMISS</button>
            </div>
          </div>
        </Window>
      )}
    </div>
  );
};

export default App;
