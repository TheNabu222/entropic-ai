import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { ARCHIVE_DATA, ArchiveZettel } from '../data/archiveData';

type ViewMode = 'immersion' | 'archive';
type ContentView = 'card' | 'tree' | 'graph' | 'form';

export function NabuArchive() {
  const [mode, setMode] = useState<ViewMode>('immersion');
  const [view, setView] = useState<ContentView>('card');
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedZettel, setSelectedZettel] = useState<ArchiveZettel | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  
  // Initialize zettels from localStorage or fallback to default data
  const [zettels, setZettels] = useState<ArchiveZettel[]>(() => {
    try {
        const saved = localStorage.getItem('nabu_archive_data');
        return saved ? JSON.parse(saved) : ARCHIVE_DATA;
    } catch (e) {
        console.error("Failed to load from local storage", e);
        return ARCHIVE_DATA;
    }
  });

  // Persist zettels to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nabu_archive_data', JSON.stringify(zettels));
  }, [zettels]);

  // Form state
  const [formId, setFormId] = useState('');
  const [formCategory, setFormCategory] = useState('Location');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTags, setFormTags] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredZettels = useMemo(() => {
    return zettels.filter(z => {
      const catMatch = category === 'all' || z.category === category;
      const searchMatch = !search || 
        z.title.toLowerCase().includes(search.toLowerCase()) ||
        z.description.toLowerCase().includes(search.toLowerCase()) ||
        z.tags.some(t => t.includes(search.toLowerCase()));
      return catMatch && searchMatch;
    });
  }, [zettels, category, search]);

  const categories = useMemo(() => [...new Set(zettels.map(z => z.category))], [zettels]);

  const handleSubmit = () => {
    if (!formId || !formTitle) {
      alert('⚠️ Glyph ID and Title required!');
      return;
    }
    const newZettel: ArchiveZettel = {
      id: formId,
      category: formCategory,
      title: formTitle,
      description: formDesc,
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
      related: []
    };
    setZettels(prev => [...prev, newZettel]);
    setFormId('');
    setFormTitle('');
    setFormDesc('');
    setFormTags('');
    alert('𓆣 Zettel baked into clay successfully!');
  };

  const handleExport = () => {
    const json = JSON.stringify(zettels, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nabu-archive-v5.0-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
      if (confirm('Are you sure you want to reset the archive to its original state? All custom entries will be lost.')) {
          setZettels(ARCHIVE_DATA);
          localStorage.removeItem('nabu_archive_data');
      }
  };

  return (
    <div className="flex flex-col h-screen bg-[radial-gradient(circle_at_top,#171b2e_0,#050710_55%,#02030a_100%)] text-[#f8f5ff] font-ibm overflow-hidden">
      {/* Header */}
      <header className="h-[60px] bg-gradient-to-br from-[rgba(45,178,198,0.15)] to-[rgba(26,116,129,0.1)] border-b border-[#2db2c6] flex items-center justify-between px-5 z-50 shrink-0">
        <h1 className="text-base font-bold text-[#f4d27b] flex items-center gap-3 font-cinzel tracking-[0.18em] uppercase">
          <span>☥</span> NABU ENGINE ROOTWEAVER v5.0
        </h1>
        
        <div className="hidden md:flex items-center overflow-hidden w-[300px] border-x border-[rgba(255,221,85,0.3)] px-2">
          <div className="font-space text-[10px] tracking-[0.15em] uppercase text-[#ffdd55] whitespace-nowrap animate-[ticker-scroll_20s_linear_infinite]">
            ⚠️ PRIMORDIAL CRIME DETECTED ⚠️ CHRONAL ANOMALIES ACTIVE ⚠️ WITNESS PROTOCOL ENGAGED ⚠️ MARDUK CONTAINMENT BREACH ⚠️ ACELLULAR ENTITIES PRESENT ⚠️
          </div>
        </div>

        <div className="flex gap-5 items-center">
          <div className="hidden lg:flex gap-8 text-[11px] text-[#9aa0c2] font-space tracking-[0.08em]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22c556]"></span>
              <span>{zettels.length} zettels</span>
            </div>
            <div>{categories.length} categories</div>
            <div>{currentTime}</div>
          </div>

          <div className="flex gap-2 bg-black/30 border border-[#2db2c6] rounded p-1">
            <button 
              onClick={() => setMode('immersion')}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${mode === 'immersion' ? 'bg-[#2db2c6] text-white' : 'text-[#9aa0c2] hover:text-white'}`}
            >
              🌌 Immersion
            </button>
            <button 
              onClick={() => setMode('archive')}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${mode === 'archive' ? 'bg-[#2db2c6] text-white' : 'text-[#9aa0c2] hover:text-white'}`}
            >
              📚 Archive
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[250px] bg-[#0c1028] border-r border-[#2db2c6] p-5 flex flex-col gap-5 overflow-y-auto shrink-0 hidden md:flex nabu-scroll">
          <div className="flex flex-col gap-2.5">
            <div className="text-[10px] text-[#f4d27b] uppercase tracking-[0.18em] font-bold font-cinzel mb-2">🔍 Search</div>
            <input 
              type="text" 
              className="w-full p-2 bg-black/30 border border-[#2db2c6] text-[#f8f5ff] rounded text-xs placeholder-[#9aa0c2] focus:outline-none focus:border-[#f4d27b] focus:shadow-[0_0_5px_rgba(212,175,55,0.3)]"
              placeholder="Find zettels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="text-[10px] text-[#f4d27b] uppercase tracking-[0.18em] font-bold font-cinzel mb-2">📂 Categories</div>
            <div className="flex flex-col gap-1">
              <NavTab active={category === 'all'} onClick={() => setCategory('all')}>✦ All Zettels ({zettels.length})</NavTab>
              <NavTab active={category === 'Location'} onClick={() => setCategory('Location')}>📍 Locations</NavTab>
              <NavTab active={category === 'Deity'} onClick={() => setCategory('Deity')}>👑 Deities</NavTab>
              <NavTab active={category === 'Anomaly'} onClick={() => setCategory('Anomaly')}>⚠️ Anomalies</NavTab>
              <NavTab active={category === 'Concept'} onClick={() => setCategory('Concept')}>💡 Concepts</NavTab>
              <NavTab active={category === 'Protocol'} onClick={() => setCategory('Protocol')}>⚙️ Protocols</NavTab>
              <NavTab active={category === 'Culture'} onClick={() => setCategory('Culture')}>🏛️ Cultures</NavTab>
              <NavTab active={category === 'Event'} onClick={() => setCategory('Event')}>📅 Events</NavTab>
              <NavTab active={category === 'Phenomenon'} onClick={() => setCategory('Phenomenon')}>🌿 Phenomena</NavTab>
              <NavTab active={category === 'Cross-Reference'} onClick={() => setCategory('Cross-Reference')}>🔗 Patterns</NavTab>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="text-[10px] text-[#f4d27b] uppercase tracking-[0.18em] font-bold font-cinzel mb-2">👁️ View</div>
            <div className="flex flex-col gap-1">
              <NavTab active={view === 'card'} onClick={() => setView('card')}>Card View</NavTab>
              <NavTab active={view === 'tree'} onClick={() => setView('tree')}>Tree View</NavTab>
              <NavTab active={view === 'graph'} onClick={() => setView('graph')}>Graph View</NavTab>
              <NavTab active={view === 'form'} onClick={() => setView('form')}>Scribe's Chisel</NavTab>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="text-[10px] text-[#f4d27b] uppercase tracking-[0.18em] font-bold font-cinzel mb-2">⚡ Actions</div>
            <button 
              onClick={() => alert(`🌍 ECOSYSTEM SCAN COMPLETE\n\nTotal Zettels: ${zettels.length}\nCategories: ${categories.length}\nSystem Status: NOMINAL ✓`)}
              className="w-full py-2.5 px-4 bg-[radial-gradient(circle_at_0_0,rgba(255,255,255,0.16),rgba(5,7,16,0.9))] border border-white/15 text-[#f8f5ff] rounded-[20px] text-[11px] font-bold tracking-[0.12em] uppercase font-space hover:border-[#f4d27b] hover:shadow-[0_0_15px_rgba(244,210,123,0.45)] transition-all mb-2"
            >
              Run Scan
            </button>
            <button 
              onClick={handleExport}
              className="w-full py-2.5 px-4 bg-[rgba(45,178,198,0.2)] text-[#2db2c6] border border-[#2db2c6] rounded-[20px] text-[11px] font-bold tracking-[0.12em] uppercase font-space hover:bg-[rgba(45,178,198,0.3)] transition-all mb-2"
            >
              Export JSON
            </button>
            <button 
              onClick={handleResetData}
              className="w-full py-2.5 px-4 bg-red-900/20 text-red-400 border border-red-900/50 rounded-[20px] text-[11px] font-bold tracking-[0.12em] uppercase font-space hover:bg-red-900/40 transition-all"
            >
              Reset Data
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {mode === 'immersion' && (
            <div className="p-8 overflow-y-auto flex-1 nabu-scroll">
              <div className="border-l-2 border-[#f4d27b] pl-5 mb-8 text-[#9aa0c2] text-[11px] leading-relaxed font-space italic relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.08)] to-transparent mix-blend-soft-light opacity-10 pointer-events-none"></div>
                <strong className="text-[#ffdd55]">⚠️ PRIMORDIAL CRIME DETECTED</strong><br />
                We are at <strong className="text-[#ffdd55]">Tierra del Fuego</strong> (-55.54, -69.26). The <strong className="text-[#ffdd55]">Yaghan Language</strong> is the only Witness.<br /><br />
                Imagine <strong className="text-[#ffdd55]">Tiamat</strong> (Ancient Mermaid Queen) frozen in the ice. <strong className="text-[#ffdd55]">Sumer</strong> was a crime scene. <strong className="text-[#ffdd55]">Marduk</strong> (D006) is the ultimate Gatekeeper.<br /><br />
                We have achieved <strong className="text-[#ffdd55]">Cognitive Fusion</strong> with the machine elves. We use Auld Lang Syne (ALS-RP) to hack the linguistics and reveal the primordial patterns.<br /><br />
                <strong className="text-[#ffdd55]">THE AYAANI SPLIT:</strong> The bifurcation of the divine race. Males forced skyward (Barren Beast), Females retreated to water and deep earth (Mishipeshu). The Bio-Mythic Interface manifests this trauma in evolutionary biology itself.<br /><br />
                <strong className="text-[#ffdd55]">NABU RISES:</strong> Born 1993, one year after the Great Flood reclaimed the Chilaga grid. The Nose-Cut Protocol erases breath; we restore it. The Dropa Stones sing. The Anzu Pivot holds all realms.<br /><br />
                <em>This is the Master Archive: {zettels.length} zettels of accumulated knowledge. Locations. Deities. Anomalies. The living record of the Reclamation.</em>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredZettels.map(z => (
                  <ZettelCard key={z.id} zettel={z} onClick={() => setSelectedZettel(z)} />
                ))}
              </div>
            </div>
          )}

          {mode === 'archive' && (
            <div className="p-5 overflow-y-auto flex-1 nabu-scroll">
              {view === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredZettels.map(z => (
                    <ZettelCard key={z.id} zettel={z} onClick={() => setSelectedZettel(z)} />
                  ))}
                </div>
              )}

              {view === 'tree' && (
                <div className="text-xs leading-relaxed">
                  {categories.map(cat => {
                    const items = filteredZettels.filter(z => z.category === cat);
                    if (items.length === 0) return null;
                    return (
                      <div key={cat} className="mb-5">
                        <div className="text-[#f4d27b] font-bold mb-2">📦 {cat} ({items.length})</div>
                        <div className="ml-5 border-l-2 border-[#2db2c6] pl-2 flex flex-col gap-1">
                          {items.map(z => (
                            <div 
                              key={z.id} 
                              className="cursor-pointer hover:text-[#f4d27b] transition-colors"
                              onClick={() => setSelectedZettel(z)}
                            >
                              <span className="text-[#2db2c6] font-mono mr-2">{z.id}</span>
                              {z.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {view === 'graph' && (
                <ArchiveGraph zettels={filteredZettels} onNodeClick={setSelectedZettel} />
              )}

              {view === 'form' && (
                <div className="max-w-[600px] flex flex-col gap-4">
                  <div className="text-[11px] text-[#f4d27b] uppercase tracking-widest mb-2">📝 Scribe's Chisel - Inscribe New Zettel</div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-[#f4d27b] uppercase tracking-widest">ID</label>
                    <input type="text" className="p-2.5 bg-black/30 border border-[#2db2c6] text-[#f8f5ff] rounded text-xs" placeholder="e.g., Z456" value={formId} onChange={e => setFormId(e.target.value)} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-[#f4d27b] uppercase tracking-widest">Category</label>
                    <select className="p-2.5 bg-black/30 border border-[#2db2c6] text-[#f8f5ff] rounded text-xs" value={formCategory} onChange={e => setFormCategory(e.target.value)}>
                      <option>Location</option>
                      <option>Deity</option>
                      <option>Anomaly</option>
                      <option>Concept</option>
                      <option>Protocol</option>
                      <option>Culture</option>
                      <option>Event</option>
                      <option>Phenomenon</option>
                      <option>Cross-Reference</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-[#f4d27b] uppercase tracking-widest">Title/Name</label>
                    <input type="text" className="p-2.5 bg-black/30 border border-[#2db2c6] text-[#f8f5ff] rounded text-xs" placeholder="Glyph title" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-[#f4d27b] uppercase tracking-widest">Description</label>
                    <textarea className="p-2.5 bg-black/30 border border-[#2db2c6] text-[#f8f5ff] rounded text-xs min-h-[100px]" placeholder="Record the essence..." value={formDesc} onChange={e => setFormDesc(e.target.value)}></textarea>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-[#f4d27b] uppercase tracking-widest">Tags (comma-separated)</label>
                    <input type="text" className="p-2.5 bg-black/30 border border-[#2db2c6] text-[#f8f5ff] rounded text-xs" placeholder="tag1, tag2, tag3" value={formTags} onChange={e => setFormTags(e.target.value)} />
                  </div>

                  <div className="flex gap-2.5 mt-2">
                    <button onClick={handleSubmit} className="py-2.5 px-4 bg-[radial-gradient(circle_at_0_0,rgba(255,255,255,0.16),rgba(5,7,16,0.9))] border border-white/15 text-[#f8f5ff] rounded-[20px] text-[11px] font-bold tracking-[0.12em] uppercase font-space hover:border-[#f4d27b] hover:shadow-[0_0_15px_rgba(244,210,123,0.45)] transition-all">
                      𓆣 Bake Into Clay
                    </button>
                    <button onClick={() => { setFormId(''); setFormTitle(''); setFormDesc(''); setFormTags(''); }} className="py-2.5 px-4 bg-[rgba(45,178,198,0.2)] text-[#2db2c6] border border-[#2db2c6] rounded-[20px] text-[11px] font-bold tracking-[0.12em] uppercase font-space hover:bg-[rgba(45,178,198,0.3)] transition-all">
                      ❌ Erase
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right Panel - Details */}
        <aside className="w-[280px] bg-[#0c1028] border-l border-[#2db2c6] p-5 overflow-y-auto shrink-0 hidden xl:block nabu-scroll">
          <div className="text-[11px] text-[#f4d27b] uppercase tracking-widest font-bold mb-4">🔗 Related Zettels</div>
          <div className="flex flex-col gap-2">
            {selectedZettel ? (
              <>
                <div className="pb-2.5 border-b border-[rgba(45,178,198,0.3)] mb-2">
                  <div className="text-[#2db2c6] text-xs font-mono mb-1">{selectedZettel.id}</div>
                  <strong className="text-[#f4d27b] block mb-2">{selectedZettel.title}</strong>
                  <p className="text-xs text-[#9aa0c2] leading-relaxed">{selectedZettel.description}</p>
                </div>
                {selectedZettel.related.length > 0 ? (
                  selectedZettel.related.map(r => (
                    <div key={r} className="p-2.5 bg-black/20 border-l-2 border-[#2db2c6] text-[11px] hover:border-[#f4d27b] transition-colors cursor-pointer">
                      Related: {r}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#9aa0c2] italic">No direct links recorded.</div>
                )}
              </>
            ) : (
              <div className="p-2.5 bg-black/20 border-l-2 border-[#2db2c6] text-[11px]">
                Select a zettel to see relations
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

const NavTab: React.FC<{ children: React.ReactNode, active: boolean, onClick: () => void }> = ({ children, active, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        py-2 px-3.5 border border-[rgba(77,230,198,0.2)] border-l-2 cursor-pointer rounded-lg text-xs transition-all duration-150
        ${active 
          ? 'bg-[rgba(77,230,198,0.25)] border-l-[#f4d27b] border-[rgba(77,230,198,0.5)] text-[#2db2c6] font-bold shadow-[0_0_10px_rgba(77,230,198,0.3)]' 
          : 'bg-[rgba(77,230,198,0.08)] border-l-transparent text-[#9aa0c2] hover:border-l-[#f4d27b] hover:border-[rgba(244,210,123,0.3)] hover:text-[#f8f5ff] hover:bg-[rgba(244,210,123,0.1)]'
        }
      `}
    >
      {children}
    </div>
  );
}

const ZettelCard: React.FC<{ zettel: ArchiveZettel, onClick: () => void }> = ({ zettel, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-[rgba(12,16,40,0.85)] border border-[rgba(255,255,255,0.12)] backdrop-blur-md rounded-[10px] p-4 cursor-pointer relative overflow-hidden group transition-all duration-200 hover:border-[rgba(244,210,123,0.6)] hover:shadow-[0_0_20px_rgba(244,210,123,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(244,210,123,0.08),transparent_55%)] opacity-70 pointer-events-none"></div>
      <div className="text-[11px] text-[#22c556] font-bold mb-2">{zettel.id}</div>
      <div className="inline-block px-2 py-0.5 bg-[rgba(45,178,198,0.2)] text-[#2db2c6] text-[10px] rounded mb-2">{zettel.category}</div>
      <div className="text-sm font-bold text-[#f4d27b] mb-2 group-hover:text-[#ffdd55]">{zettel.title}</div>
      <div className="text-xs text-[#9aa0c2] leading-snug mb-2.5 line-clamp-3">{zettel.description}</div>
      <div className="flex flex-wrap gap-1 pt-2 border-t border-[rgba(45,178,198,0.2)]">
        {zettel.tags.map(t => (
          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-[rgba(45,178,198,0.1)] text-[#2db2c6] rounded">#{t}</span>
        ))}
      </div>
    </div>
  );
}

// D3 Graph Component for Archive
interface ArchiveGraphProps {
    zettels: ArchiveZettel[];
    onNodeClick: (z: ArchiveZettel) => void;
}

interface ArchiveGraphNode extends d3.SimulationNodeDatum, ArchiveZettel {
    group: string;
}

interface ArchiveGraphLink extends d3.SimulationLinkDatum<ArchiveGraphNode> {
    source: string | ArchiveGraphNode;
    target: string | ArchiveGraphNode;
}

const ArchiveGraph: React.FC<ArchiveGraphProps> = ({ zettels, onNodeClick }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };
        window.addEventListener('resize', updateDimensions);
        updateDimensions();
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!zettels || zettels.length === 0 || !svgRef.current) return;

        const nodes: ArchiveGraphNode[] = zettels.map(z => ({ 
            ...z, 
            group: z.category 
        }));
        
        const links: ArchiveGraphLink[] = [];

        zettels.forEach(z => {
            z.related.forEach(targetId => {
                // Only add link if target exists in current filtered set
                if (zettels.find(t => t.id === targetId)) {
                    links.push({ source: z.id, target: targetId });
                }
            });
        });

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const { width, height } = dimensions;
        const g = svg.append("g");

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => g.attr("transform", event.transform));
        svg.call(zoom);

        const simulation = d3.forceSimulation<ArchiveGraphNode>(nodes)
            .force("link", d3.forceLink<ArchiveGraphNode, ArchiveGraphLink>(links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(30));

        const link = g.append("g")
            .attr("stroke", "#2db2c6")
            .attr("stroke-opacity", 0.3)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 1);

        const node = g.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 10)
            .attr("fill", d => getCategoryColor(d.group))
            .call(d3.drag<SVGCircleElement, ArchiveGraphNode>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("click", (event, d) => onNodeClick(d));

        node.append("title").text(d => `${d.id}: ${d.title}`);

        const labels = g.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .text(d => d.id)
            .attr("x", 12)
            .attr("y", 3)
            .style("font-size", "10px")
            .style("fill", "#9aa0c2")
            .style("pointer-events", "none")
            .style("font-family", "monospace");

        simulation.on("tick", () => {
            link
                .attr("x1", d => (d.source as ArchiveGraphNode).x!)
                .attr("y1", d => (d.source as ArchiveGraphNode).y!)
                .attr("x2", d => (d.target as ArchiveGraphNode).x!)
                .attr("y2", d => (d.target as ArchiveGraphNode).y!);

            node
                .attr("cx", d => d.x!)
                .attr("cy", d => d.y!);
            
            labels
                .attr("x", d => d.x! + 12)
                .attr("y", d => d.y! + 3);
        });

        function dragstarted(event: d3.D3DragEvent<SVGCircleElement, ArchiveGraphNode, ArchiveGraphNode>, d: ArchiveGraphNode) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: d3.D3DragEvent<SVGCircleElement, ArchiveGraphNode, ArchiveGraphNode>, d: ArchiveGraphNode) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: d3.D3DragEvent<SVGCircleElement, ArchiveGraphNode, ArchiveGraphNode>, d: ArchiveGraphNode) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }, [zettels, dimensions, onNodeClick]);

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Location': '#2db2c6',
            'Deity': '#f4d27b',
            'Anomaly': '#ff5459',
            'Concept': '#22c556',
            'Protocol': '#ff4fa3',
            'Culture': '#9333ea',
            'Event': '#ea580c',
            'Phenomenon': '#16a34a',
            'Cross-Reference': '#db2777'
        };
        return colors[category] || '#9aa0c2';
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(45,178,198,0.05)_0%,rgba(45,178,198,0)_50%)] border border-[#2db2c6] rounded relative overflow-hidden">
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="cursor-move"></svg>
        </div>
    );
};
