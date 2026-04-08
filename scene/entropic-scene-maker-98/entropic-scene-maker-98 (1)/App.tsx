
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import { GithubAsset, SceneLayer, AnimationType, LayerRole } from './types';
import { fetchRepoAssets, isImage, isAudio } from './services/githubService';
import { GoogleGenAI, GenerateContentResponse, Modality, LiveServerMessage } from "@google/genai";

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

// Guideline-compliant audio utilities
const encode = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
};

const App: React.FC = () => {
  const [assets, setAssets] = useState<GithubAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  
  // Library State
  const [assetFilter, setAssetFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'audio'>('all');
  const [roleFilter, setRoleFilter] = useState<LayerRole | 'all'>('all');
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  
  // Flash Maker State
  const [layers, setLayers] = useState<SceneLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Gemini State
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiHistory, setAiHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);
  const liveSessionRef = useRef<any>(null);

  // Window State
  const [windows, setWindows] = useState<{ [key: string]: boolean }>({ 
    explorer: false, editor: true, media_lab: false, ai_scripting: false 
  });
  const [windowStack, setWindowStack] = useState<string[]>(['editor']);

  // Added getZIndex to fix missing function errors
  const getZIndex = (win: string) => {
    const idx = windowStack.indexOf(win);
    return idx === -1 ? 10 : 10 + idx;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 15;
      });
    }, 70);
    fetchRepoAssets().then(setAssets).then(() => setLoading(false));
  }, []);

  const bringToFront = (win: string) => setWindowStack(prev => [...prev.filter(k => k !== win), win]);
  const toggleWindow = (win: string, force?: boolean) => {
    const isOpen = force !== undefined ? force : !windows[win];
    setWindows(prev => ({ ...prev, [win]: isOpen }));
    if (isOpen) bringToFront(win);
  };
  const activeWindow = windowStack[windowStack.length - 1];

  // Fix: Robust stage clicking to prevent inspector loss
  const handleStageClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setSelectedLayerId(null);
  };

  const addLayer = (asset: { name: string, url: string }) => {
    const isSfx = isAudio(asset.name);
    const newLayer: SceneLayer = {
      id: Math.random().toString(36).substr(2, 9),
      name: asset.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_') + '_mc',
      type: isSfx ? 'audio' : 'image',
      role: isSfx ? 'sound_emitter' : 'sprite',
      url: asset.url,
      x: 100, y: 100, width: 200, height: 200, 
      zIndex: layers.length, opacity: 1, rotation: 0, flipX: false, flipY: false,
      animation: 'none', effectIntensity: 1, effectSpeed: 1, effectColor: '#FFFF00',
      hoverEffect: 'none'
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const updateLayer = (id: string, updates: Partial<SceneLayer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  // Robust Filtering Logic
  const filteredAndGroupedAssets = useMemo(() => {
    const groups: Record<string, GithubAsset[]> = {};
    assets
      .filter(a => {
        const matchesText = a.name.toLowerCase().includes(assetFilter.toLowerCase());
        const matchesType = typeFilter === 'all' || (typeFilter === 'image' && isImage(a.name)) || (typeFilter === 'audio' && isAudio(a.name));
        return matchesText && matchesType;
      })
      .sort((a, b) => a.path.localeCompare(b.path))
      .forEach(asset => {
        const folder = asset.path.includes('/') ? asset.path.substring(0, asset.path.lastIndexOf('/')) : 'Root';
        if (!groups[folder]) groups[folder] = [];
        groups[folder].push(asset);
      });
    return groups;
  }, [assets, assetFilter, typeFilter]);

  // AI ACTIONS
  const handleAiScripting = async () => {
    if (!aiInput.trim()) return;
    const prompt = aiInput; setAiInput('');
    setAiHistory(p => [...p, { role: 'user', text: prompt }]);
    setIsAiProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { systemInstruction: 'ActionScript 2.0 Expert. Provide brief, functional snippets.', thinkingConfig: { thinkingBudget: 32768 } }
      });
      setAiHistory(p => [...p, { role: 'model', text: response.text || '// Error' }]);
    } catch (e) { console.error(e); }
    setIsAiProcessing(false);
  };

  const generateMedia = async (type: 'image' | 'video', prompt: string, config: any) => {
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
    }
    setIsAiProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (type === 'image') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: prompt,
          config: { imageConfig: { aspectRatio: config.aspectRatio, imageSize: config.size } }
        });
        const part = response.candidates?.[0].content.parts.find(p => p.inlineData);
        if (part?.inlineData) addLayer({ name: `gen_${Date.now()}.png`, url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` });
      } else {
        let op = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview', prompt, config: { aspectRatio: config.aspectRatio, resolution: '720p', numberOfVideos: 1 }
        });
        while (!op.done) { await new Promise(r => setTimeout(r, 10000)); op = await ai.operations.getVideosOperation({ operation: op }); }
        const download = `${op.response?.generatedVideos?.[0]?.video?.uri}&key=${process.env.API_KEY}`;
        addLayer({ name: 'veo_video.mp4', url: download });
      }
    } catch (e) { console.error(e); }
    setIsAiProcessing(false);
  };

  const analyzeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAiProcessing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ parts: [{ text: "Analyze this image and list key game assets/colors for a point and click scene." }, { inlineData: { data: base64, mimeType: file.type } }] }],
        config: { thinkingConfig: { thinkingBudget: 32768 } }
      });
      setAnalysisResult(res.text || "");
      setIsAiProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const startLiveApi = async () => {
    if (isLiveActive) { liveSessionRef.current?.close(); setIsLiveActive(false); return; }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const inputCtx = new AudioContext({ sampleRate: 16000 });
    const outputCtx = new AudioContext({ sampleRate: 24000 });
    let nextStartTime = 0;
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setIsLiveActive(true);
          const source = inputCtx.createMediaStreamSource(stream);
          const proc = inputCtx.createScriptProcessor(4096, 1, 1);
          proc.onaudioprocess = (e) => {
            const data = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(data.length);
            for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
            sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
          };
          source.connect(proc); proc.connect(inputCtx.destination);
        },
        onmessage: async (msg: LiveServerMessage) => {
          const audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audio) {
            nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
            const buf = await decodeAudioData(decode(audio), outputCtx, 24000, 1);
            const s = outputCtx.createBufferSource(); s.buffer = buf; s.connect(outputCtx.destination); s.start(nextStartTime);
            nextStartTime += buf.duration;
          }
          if (msg.serverContent?.outputTranscription) setLiveTranscript(p => [...p, "Gemini: " + msg.serverContent!.outputTranscription!.text]);
        }
      },
      config: { responseModalities: [Modality.AUDIO], outputAudioTranscription: {} }
    });
    liveSessionRef.current = await sessionPromise;
  };

  const generateTTS = async (text: string) => {
    setIsAiProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text }] }],
        config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } }
      });
      const data = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (data) {
        const ctx = new AudioContext({ sampleRate: 24000 });
        const buf = await decodeAudioData(decode(data), ctx, 24000, 1);
        const s = ctx.createBufferSource(); s.buffer = buf; s.connect(ctx.destination); s.start();
      }
    } catch (e) { console.error(e); }
    setIsAiProcessing(false);
  };

  if (!appReady) {
    return (
      <div className="h-screen w-screen preloader-bg flex flex-col items-center justify-center gap-10 font-mono">
        <div className="flex flex-col items-center gap-2">
          <div className="text-5xl font-bold italic tracking-tighter text-flash-yellow">entropicFLASH</div>
          <div className="text-xs tracking-[0.3em] opacity-60 uppercase">MX 2004 PROFESSIONAL</div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="loader-bar"><div className="loader-fill" style={{ width: `${loadProgress}%` }}></div></div>
          <div className="text-[9px] uppercase tracking-widest">{Math.floor(loadProgress)}% Initializing Architecture...</div>
        </div>
        {loadProgress >= 100 && <button onClick={() => setAppReady(true)} className="px-10 py-3 bg-flash-yellow text-black font-bold border-2 border-white hover:bg-white active:scale-95 transition-all text-xl shadow-[0_0_20px_rgba(255,204,0,0.5)]">START PROJECT</button>}
      </div>
    );
  }

  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#008080]">
      {/* OS Desktop Icons */}
      <div className="absolute inset-0 z-0 p-6 flex flex-col gap-2 pointer-events-none">
        <DesktopIcon label="The Library" icon="📚" onClick={() => toggleWindow('explorer', true)} />
        <DesktopIcon label="Authoring" icon="⚡" onClick={() => toggleWindow('editor', true)} />
        <DesktopIcon label="Media Lab" icon="🔬" onClick={() => toggleWindow('media_lab', true)} />
        <DesktopIcon label="AS2 Bot" icon="🤖" onClick={() => toggleWindow('ai_scripting', true)} />
      </div>

      {/* FLASH EDITOR WINDOW */}
      {windows.editor && (
        <Window title="entropicFlash MX 2004 Professional - Scene 1" width={1100} height={800} zIndex={getZIndex('editor')} isActive={activeWindow === 'editor'} onClose={() => toggleWindow('editor', false)} onFocus={() => bringToFront('editor')}>
          <div className="flex flex-col h-full bg-[#d4d0c8] pointer-events-auto select-none">
            <div className="flex gap-2 px-1 py-0.5 border-b border-gray-400 text-[11px] bg-gray-200">
               {['File', 'Edit', 'Control', 'Window', 'Help'].map(m => <span key={m} className="px-2 hover:bg-blue-800 hover:text-white cursor-pointer">{m}</span>)}
            </div>
            <div className="flex-grow flex min-h-0 overflow-hidden">
              <div className="w-12 border-r border-gray-400 bg-gray-200 shrink-0 flex flex-col items-center py-2 gap-1">
                 {['P', 'S', 'F', 'L'].map(t => <div key={t} className="w-8 h-8 win98-border flex items-center justify-center text-xs font-bold bg-gray-100">{t}</div>)}
              </div>
              <div className="flex-grow flex flex-col min-w-0">
                 <div className="h-32 border-b border-gray-400 bg-[#e1e1e1] flex shrink-0">
                    <div className="w-48 shrink-0 border-r border-gray-400 bg-gray-100 flex flex-col">
                       <div className="h-5 px-1 border-b text-[9px] font-bold">Layers</div>
                       <div className="flex-grow overflow-y-auto">
                         {layers.map(l => (
                           <div key={l.id} onClick={() => setSelectedLayerId(l.id)} className={`h-[18px] border-b border-gray-300 px-1 flex items-center gap-1 text-[10px] cursor-pointer ${selectedLayerId === l.id ? 'bg-blue-800 text-white' : ''}`}>
                             <span className="w-3 text-center">👁️</span> <span className="truncate flex-grow">{l.name}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                    <div className="flex-grow flash-timeline-header overflow-x-auto">
                       <div className="h-5 border-b flex">{Array.from({length: 20}).map((_, i) => <div key={i} className="w-20 shrink-0 border-r border-gray-400 text-[8px] flex items-end px-1">{(i*5)+1}</div>)}</div>
                       {layers.map(l => <div key={l.id} className="h-[18px] flex">{Array.from({length: 100}).map((_, i) => <div key={i} className="flash-timeline-cell"></div>)}</div>)}
                    </div>
                 </div>
                 <div className="flex-grow flex min-h-0 bg-gray-300">
                    <div className="flex-grow flex flex-col min-w-0">
                       <div className="flex items-center gap-2 p-1 bg-gray-200 border-b border-gray-300 text-[10px]">
                          <button onClick={() => setIsPlaying(!isPlaying)} className={`win98-button font-bold px-3 ${isPlaying ? 'bg-red-100' : 'bg-green-100'}`}>{isPlaying ? '■ STOP' : '▶ TEST'}</button>
                          <select className="win98-inset text-[10px]" value={zoomLevel} onChange={e => setZoomLevel(+e.target.value)}>
                            {[0.25, 0.5, 0.75, 1, 1.5, 2].map(z => <option key={z} value={z}>{z*100}%</option>)}
                          </select>
                       </div>
                       <div className="flex-grow flash-stage-container p-12 overflow-auto flex items-center justify-center" onClick={handleStageClick}>
                          <div className="flash-stage relative shrink-0" style={{ width: 800, height: 500, transform: `scale(${zoomLevel})` }}>
                            {layers.map(l => (
                              <div key={l.id} className={`absolute ${selectedLayerId === l.id ? 'ring-2 ring-blue-500 z-50 shadow-xl' : ''}`} style={{ left: l.x, top: l.y, width: l.width, height: l.height, opacity: l.opacity, transform: `rotate(${l.rotation}deg) scaleX(${l.flipX ? -1 : 1})`, cursor: isPlaying ? 'pointer' : 'move' } as any} onMouseDown={() => setSelectedLayerId(l.id)}>
                                 {l.type === 'image' ? <img src={l.url} draggable={false} className={`w-full h-full object-contain pointer-events-none ${isPlaying ? `anim-${l.animation}` : ''}`} /> : <div className="w-full h-full bg-blue-100 border border-blue-400 flex items-center justify-center text-xs">🎵 {l.name}</div>}
                              </div>
                            ))}
                          </div>
                       </div>
                    </div>
                    <div className="w-72 border-l border-gray-400 flex flex-col shrink-0">
                       <div className="bg-[#444] text-white text-[9px] px-2 py-0.5 font-bold tracking-widest uppercase">Panels</div>
                       <div className="h-1/2 border-b border-gray-400 flex flex-col overflow-hidden">
                          <div className="bg-gray-300 border-b border-gray-400 px-2 py-0.5 text-[10px] font-bold">Properties</div>
                          <div className="flex-grow p-3 bg-gray-200 overflow-y-auto">
                            {selectedLayer ? (
                               <div className="flex flex-col gap-3 text-[10px]">
                                  <div className="flex items-center gap-1"><span>Instance:</span><input className="win98-inset px-1 flex-grow" value={selectedLayer.name} onChange={e => updateLayer(selectedLayer.id, {name: e.target.value})} /></div>
                                  <div className="grid grid-cols-2 gap-2">
                                     <div>W: <input className="win98-inset w-14" type="number" value={selectedLayer.width} onChange={e => updateLayer(selectedLayer.id, {width: +e.target.value})} /></div>
                                     <div>H: <input className="win98-inset w-14" type="number" value={selectedLayer.height} onChange={e => updateLayer(selectedLayer.id, {height: +e.target.value})} /></div>
                                     <div>X: <input className="win98-inset w-14" type="number" value={selectedLayer.x} onChange={e => updateLayer(selectedLayer.id, {x: +e.target.value})} /></div>
                                     <div>Y: <input className="win98-inset w-14" type="number" value={selectedLayer.y} onChange={e => updateLayer(selectedLayer.id, {y: +e.target.value})} /></div>
                                  </div>
                                  <div className="flex gap-2">
                                     <button onClick={() => updateLayer(selectedLayer.id, {flipX: !selectedLayer.flipX})} className="win98-button flex-grow">Flip X</button>
                                     <button onClick={() => updateLayer(selectedLayer.id, {animation: 'pulse'})} className="win98-button flex-grow">Pulse</button>
                                  </div>
                                  <button onClick={() => setLayers(l => l.filter(i => i.id !== selectedLayer.id))} className="win98-button text-red-700 font-bold">Remove From Stage</button>
                               </div>
                            ) : <div className="p-10 opacity-40 text-center text-[10px]">Select object to inspect</div>}
                          </div>
                       </div>
                       <div className="flex-grow flex flex-col overflow-hidden">
                          <div className="bg-gray-300 border-b border-gray-400 px-2 py-0.5 text-[10px] font-bold">Library</div>
                          <div className="p-1 bg-gray-100 border-b border-gray-400 flex flex-col gap-1">
                             <input className="win98-inset w-full px-1 text-[10px]" placeholder="Search..." value={assetFilter} onChange={e => setAssetFilter(e.target.value)} />
                             <div className="flex gap-1">
                                <select className="win98-inset text-[9px] flex-grow" value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
                                   <option value="all">All Types</option>
                                   <option value="image">Images</option>
                                   <option value="audio">Audio</option>
                                </select>
                             </div>
                          </div>
                          <div className="flex-grow overflow-y-auto bg-white win98-inset m-1">
                             {(Object.entries(filteredAndGroupedAssets) as [string, GithubAsset[]][]).map(([f, items]) => (
                               <div key={f}>
                                 <div className="bg-[#eee] px-2 py-0.5 border-b text-[10px] font-bold cursor-pointer" onClick={() => setCollapsedFolders(s => { const n = new Set(s); if(n.has(f)) n.delete(f); else n.add(f); return n; })}>
                                   {collapsedFolders.has(f) ? '📁+' : '📂-'} {f}
                                 </div>
                                 {!collapsedFolders.has(f) && items.map(a => (
                                   <div key={a.path} onDoubleClick={() => addLayer(a)} className="flex items-center gap-1 p-1 pl-4 hover:bg-blue-800 hover:text-white cursor-pointer group text-[10px]">
                                      <div className="w-5 h-5 flex items-center justify-center bg-gray-50 border shrink-0 overflow-hidden">
                                        {isImage(a.name) ? <img src={a.url} className="max-h-full max-w-full" /> : <span>🎵</span>}
                                      </div>
                                      <span className="truncate">{a.name}</span>
                                   </div>
                                 ))}
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </Window>
      )}

      {/* MEDIA LAB WINDOW */}
      {windows.media_lab && (
        <Window title="Gemini AI Media Lab" width={500} height={600} zIndex={getZIndex('media_lab')} isActive={activeWindow === 'media_lab'} onClose={() => toggleWindow('media_lab', false)} onFocus={() => bringToFront('media_lab')}>
           <div className="flex flex-col h-full bg-[#eee] p-4 overflow-y-auto gap-4 pointer-events-auto">
              <div className="win98-border p-3 bg-gray-200 flex flex-col gap-2">
                 <h3 className="text-xs font-bold underline">Nano Banana Image Engine</h3>
                 <textarea className="win98-inset p-2 text-[11px] h-20" placeholder="Describe your asset..." onChange={e => setAiInput(e.target.value)} value={aiInput}></textarea>
                 <div className="flex gap-2 text-[10px]">
                   <span>Ratio:</span>
                   <select className="win98-inset" id="as-ratio"><option>1:1</option><option>16:9</option><option>9:16</option><option>4:3</option></select>
                   <span>Size:</span>
                   <select className="win98-inset" id="sz-opt"><option>1K</option><option>2K</option><option>4K</option></select>
                 </div>
                 <button onClick={() => generateMedia('image', aiInput, { aspectRatio: (document.getElementById('as-ratio') as any).value, size: (document.getElementById('sz-opt') as any).value })} className="win98-button font-bold text-xs" disabled={isAiProcessing}>{isAiProcessing ? '...' : 'GENERATE ASSET'}</button>
              </div>

              <div className="win98-border p-3 bg-gray-200 flex flex-col gap-2">
                 <h3 className="text-xs font-bold underline">Veo Video Forge</h3>
                 <button onClick={() => generateMedia('video', aiInput, { aspectRatio: '16:9' })} className="win98-button font-bold text-xs" disabled={isAiProcessing}>GENERATE VIDEO</button>
              </div>

              <div className="win98-border p-3 bg-gray-200 flex flex-col gap-2">
                 <h3 className="text-xs font-bold underline">Image Analyst (Pro 3.0)</h3>
                 <input type="file" onChange={analyzeImage} className="text-[10px]" />
                 {analysisResult && <div className="win98-inset p-2 bg-white text-[10px] whitespace-pre-wrap max-h-32 overflow-y-auto">{analysisResult}</div>}
              </div>

              <div className="win98-border p-3 bg-[#111] text-[#0f0] font-mono flex flex-col gap-2">
                 <h3 className="text-xs font-bold underline text-white">Gemini Native Audio (Live)</h3>
                 <button onClick={startLiveApi} className={`win98-button text-xs font-bold ${isLiveActive ? 'bg-red-200' : 'bg-green-200'}`}>{isLiveActive ? 'DISCONNECT' : 'START LIVE CHAT'}</button>
                 <div className="h-32 overflow-y-auto text-[10px] bg-black p-2 border border-gray-700">
                    {liveTranscript.map((t, i) => <div key={i} className="mb-1">{t}</div>)}
                 </div>
              </div>

              <div className="win98-border p-3 bg-gray-200 flex flex-col gap-2">
                 <h3 className="text-xs font-bold underline">Voice Generator (TTS)</h3>
                 <div className="flex gap-1">
                   <input className="win98-inset p-1 text-[11px] flex-grow" id="tts-input" placeholder="Text to speak..." />
                   <button onClick={() => generateTTS((document.getElementById('tts-input') as any).value)} className="win98-button font-bold text-[10px]" disabled={isAiProcessing}>SPEAK</button>
                 </div>
              </div>
           </div>
        </Window>
      )}

      {/* AS2 SCRIPTING WINDOW */}
      {windows.ai_scripting && (
        <Window title="ActionScript 2.0 Editor - AS2 Bot" width={450} height={400} zIndex={getZIndex('ai_scripting')} isActive={activeWindow === 'ai_scripting'} onClose={() => toggleWindow('ai_scripting', false)} onFocus={() => bringToFront('ai_scripting')}>
           <div className="flex flex-col h-full bg-[#1e1e1e] text-[#0f0] font-mono p-1 pointer-events-auto">
              <div className="bg-gray-200 text-black px-2 py-0.5 text-[10px] flex justify-between"><span>Actions - Scene 1</span><span>Gemini Pro</span></div>
              <div className="flex-grow overflow-y-auto p-4 text-[12px] flex flex-col gap-3">
                 {aiHistory.map((m, i) => (
                   <div key={i} className={`border-l-2 pl-3 ${m.role === 'user' ? 'text-white border-white/20' : 'text-[#0f0] border-[#0f0]/30'}`}>
                     <span className="text-[9px] opacity-40 uppercase block mb-1">{m.role}</span>
                     <pre className="whitespace-pre-wrap">{m.text}</pre>
                   </div>
                 ))}
                 {isAiProcessing && <div className="animate-pulse">_</div>}
              </div>
              <div className="p-3 border-t border-gray-800 bg-[#252525] flex gap-2">
                <input className="bg-transparent border-b border-gray-700 outline-none flex-grow text-[12px]" placeholder="Ask for point-and-click logic..." value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiScripting()} />
                <button onClick={handleAiScripting} className="win98-button text-black font-bold text-[10px] px-3">COMPILE</button>
              </div>
           </div>
        </Window>
      )}

      {/* TASKBAR */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-300 border-t-2 border-white flex items-center px-1 z-[100] win98-border">
         <button className="win98-button px-4 font-bold h-8 flex items-center gap-2 mr-2 bg-[#d4d0c8]"><span className="bg-flash-yellow text-black px-1 text-[10px] font-black italic">MX</span> Start</button>
         <div className="h-6 w-px bg-gray-400 mx-1"></div>
         {Object.entries(windows).map(([k, v]) => v && (
           <button key={k} onClick={() => toggleWindow(k)} className={`win98-button h-8 text-[11px] min-w-[120px] truncate px-3 ml-1 ${activeWindow === k ? 'active font-bold' : ''}`}>
             <span className="mr-2 opacity-60">{k === 'editor' ? '⚡' : k === 'media_lab' ? '🔬' : '🤖'}</span> {k.replace('_', ' ').toUpperCase()}
           </button>
         ))}
         <div className="flex-grow"></div>
         <div className="win98-inset h-8 px-4 flex items-center text-[11px] font-bold italic bg-[#eee]">
           {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
      </div>
    </div>
  );
};

export default App;
