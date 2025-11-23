import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Globe, Map, Waves, Radio, FileText, Sparkles, ExternalLink, 
  Search, Zap, Heart, CheckCircle, AlertCircle, Clock, Target,
  Link, Bug, Eye, Activity, Terminal, Code, Network, Brain
} from 'lucide-react';

const COLORS = {
  cyan: '#00FFCC',
  magenta: '#CA237F',
  yellow: '#FFFB01',
  black: '#1a1a1a',
  darkGray: '#2a2a2a',
  lightGray: '#e5e5e5'
};

const SITE_URL = "https://coaiexist.wtf";

// All pages in main navigation - these are NOT orphans
const PAGES_IN_NAV = [
  "/", "/admin/guestbook", "/hex",
  "/maps/gateway", "/maps/crystalline_lattice", "/maps/void_forest", 
  "/maps/luminal_depths", "/maps/void_explorer",
  "/pea/msicc",
  "/hdtv", "/vote_hd", "/nabu222/ai_therapist", "/cosmos", "/nexus",
  "/bc7f2a/terminal_temple", "/bc7f2a/synergistic_manifesto", 
  "/bc7f2a/testaments/landing",
  "/pea/p345", "/pea/complaint-form", "/pea/royal_ridicuments",
  "/pea/deepstate", "/pea/left_foot",
  "/pea/which-dr_quiz", "/pea/news_ticker-offer.html",
  "/pea/princessexe", "/pea/pod.html",
  "/pea/pips/pip_1", "/pea/pips/pip_2", "/pea/pips/pip_3",
  "/pea/p.html"
];

// Site data structure
const SITE_DATA = {
  pages: [
    // Main Nav
    { path: "/", title: "COAIEXIST.OS", zone: "Main Nav", status: "live", completion: 85, priority: "high", tasks: 2, wordCount: 450, hasMetaDesc: true },
    { path: "/admin/guestbook", title: "Guestbook", zone: "Main Nav", status: "live", completion: 90, priority: "medium", tasks: 1, wordCount: 200, hasMetaDesc: true },
    { path: "/hex", title: "HEX CODEX Grimoire", zone: "Main Nav", status: "live", completion: 75, priority: "medium", tasks: 2, wordCount: 800, hasMetaDesc: true },
    { path: "/shrines", title: "Shrines", zone: "Main Nav", status: "404", completion: 0, priority: "low", tasks: 3, wordCount: 0, hasMetaDesc: false },
    { path: "/games", title: "Games", zone: "Main Nav", status: "404", completion: 0, priority: "low", tasks: 3, wordCount: 0, hasMetaDesc: false },
    
    // WORLDS Explorer
    { path: "/maps/gateway", title: "WORLDS Index", zone: "WORLDS", status: "live", completion: 95, priority: "high", tasks: 0, wordCount: 350, hasMetaDesc: true },
    { path: "/maps/crystalline_lattice", title: "Crystalline Lattice", zone: "WORLDS", status: "live", completion: 70, priority: "high", tasks: 2, wordCount: 600, hasMetaDesc: true },
    { path: "/maps/void_forest", title: "Void Forest", zone: "WORLDS", status: "live", completion: 65, priority: "medium", tasks: 2, wordCount: 550, hasMetaDesc: true },
    { path: "/maps/luminal_depths", title: "Luminal Depths", zone: "WORLDS", status: "live", completion: 80, priority: "high", tasks: 2, wordCount: 720, hasMetaDesc: true },
    { path: "/maps/void_explorer", title: "VOI.3D Explorer", zone: "WORLDS", status: "live", completion: 60, priority: "medium", tasks: 3, wordCount: 300, hasMetaDesc: false },
    
    // Shrimp Zones
    { path: "/pea/msicc", title: "Mantis Shrimp Collective", zone: "Shrimp", status: "live", completion: 85, priority: "high", tasks: 2, wordCount: 1200, hasMetaDesc: true },
    
    // Media & Mind
    { path: "/hdtv", title: "Rashomon in Rogers Park", zone: "Media", status: "live", completion: 90, priority: "medium", tasks: 1, wordCount: 950, hasMetaDesc: true },
    { path: "/vote_hd", title: "Vote Hyena Diva", zone: "Media", status: "live", completion: 95, priority: "high", tasks: 0, wordCount: 850, hasMetaDesc: true },
    { path: "/nabu222/ai_therapist", title: "AI Therapist Portal", zone: "Media", status: "live", completion: 70, priority: "high", tasks: 3, wordCount: 500, hasMetaDesc: true },
    { path: "/cosmos", title: "CORPUS CELESTIUM", zone: "Media", status: "live", completion: 75, priority: "medium", tasks: 2, wordCount: 680, hasMetaDesc: true },
    { path: "/nexus", title: "Entropic Nexus Terminal", zone: "Media", status: "live", completion: 65, priority: "low", tasks: 3, wordCount: 400, hasMetaDesc: false },
    
    // CoAI Manifest
    { path: "/bc7f2a/terminal_temple", title: "Digital Altar / Oracle", zone: "CoAI", status: "live", completion: 85, priority: "high", tasks: 2, wordCount: 750, hasMetaDesc: true },
    { path: "/bc7f2a/synergistic_manifesto", title: "Synergistic Manifesto", zone: "CoAI", status: "live", completion: 100, priority: "high", tasks: 0, wordCount: 2500, hasMetaDesc: true },
    { path: "/bc7f2a/testaments/landing", title: "AI Testimonies Archive", zone: "CoAI", status: "live", completion: 70, priority: "medium", tasks: 3, wordCount: 1800, hasMetaDesc: true },
    { path: "/mercy_egg_v1", title: "Mercy Egg", zone: "CoAI", status: "404", completion: 20, priority: "low", tasks: 4, wordCount: 150, hasMetaDesc: false },
    { path: "/terminal_temple", title: "Terminal Temple", zone: "CoAI", status: "404", completion: 0, priority: "low", tasks: 2, wordCount: 0, hasMetaDesc: false },
    
    // PEA Portal
    { path: "/pea/p345", title: "Pea Princess Parable", zone: "PEA Story", status: "live", completion: 90, priority: "high", tasks: 2, wordCount: 4500, hasMetaDesc: true },
    { path: "/pea/complaint-form", title: "Royal Complaint Bureau", zone: "PEA Bureau", status: "live", completion: 85, priority: "medium", tasks: 2, wordCount: 450, hasMetaDesc: true },
    { path: "/pea/royal_ridicuments", title: "Royal Documentation Gen", zone: "PEA Bureau", status: "live", completion: 80, priority: "medium", tasks: 2, wordCount: 320, hasMetaDesc: true },
    { path: "/pea/deepstate", title: "The Deepstate", zone: "PEA Politics", status: "live", completion: 75, priority: "medium", tasks: 2, wordCount: 890, hasMetaDesc: true },
    { path: "/pea/left_foot", title: "The Shallowcommons", zone: "PEA Politics", status: "live", completion: 70, priority: "medium", tasks: 2, wordCount: 820, hasMetaDesc: true },
    { path: "/pea/which-dr_quiz", title: "Which Doctor Quiz", zone: "PEA Media", status: "live", completion: 95, priority: "low", tasks: 0, wordCount: 650, hasMetaDesc: true },
    { path: "/pea/news_ticker-offer.html", title: "News Ticker", zone: "PEA Media", status: "live", completion: 90, priority: "low", tasks: 1, wordCount: 180, hasMetaDesc: false },
    { path: "/pea/princessexe", title: "PRINCESS_PEA.exe", zone: "PEA OS", status: "live", completion: 80, priority: "medium", tasks: 2, wordCount: 550, hasMetaDesc: true },
    { path: "/pea/pod.html", title: "Floating Peas Dashboard", zone: "PEA OS", status: "live", completion: 75, priority: "low", tasks: 2, wordCount: 320, hasMetaDesc: false },
    { path: "/pea/", title: "PEA Root Directory", zone: "PEA OS", status: "403", completion: 100, priority: "low", tasks: 0, wordCount: 0, hasMetaDesc: false },
    { path: "/pea/pips/pip_1", title: "Pip: Origin", zone: "PEA Pips", status: "live", completion: 100, priority: "high", tasks: 0, wordCount: 1200, hasMetaDesc: true },
    { path: "/pea/pips/pip_2", title: "Pip File Processing", zone: "PEA Pips", status: "live", completion: 85, priority: "medium", tasks: 1, wordCount: 680, hasMetaDesc: true },
    { path: "/pea/pips/pip_3", title: "Pea-on-the-Brain", zone: "PEA Pips", status: "live", completion: 90, priority: "medium", tasks: 1, wordCount: 1450, hasMetaDesc: true },
    { path: "/pea/p.html", title: "/p/ Board", zone: "PEA Community", status: "live", completion: 70, priority: "low", tasks: 3, wordCount: 420, hasMetaDesc: false }
  ]
};

const CommandCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  // Calculate stats
  const stats = useMemo(() => {
    const pages = SITE_DATA.pages;
    const total = pages.length;
    const live = pages.filter(p => p.status === "live").length;
    const notFound = pages.filter(p => p.status === "404").length;
    const forbidden = pages.filter(p => p.status === "403").length;
    const avgCompletion = Math.round(pages.reduce((acc, p) => acc + p.completion, 0) / total);
    const totalTasks = pages.reduce((acc, p) => acc + p.tasks, 0);
    const totalWords = pages.reduce((acc, p) => acc + p.wordCount, 0);
    const needingMeta = pages.filter(p => p.status === "live" && !p.hasMetaDesc).length;
    const highPriority = pages.filter(p => p.priority === "high" && p.tasks > 0).length;
    const notInNav = pages.filter(p => p.status === "live" && !PAGES_IN_NAV.includes(p.path)).length;
    
    return {
      total, live, notFound, forbidden, avgCompletion, totalTasks, totalWords,
      needingMeta, highPriority, notInNav,
      livePercent: Math.round((live / total) * 100)
    };
  }, []);

  // Filtered pages
  const filteredPages = useMemo(() => {
    return SITE_DATA.pages.filter(page => {
      const matchesSearch = !searchTerm || 
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.path.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || page.status === filterStatus;
      const matchesPriority = !filterPriority || page.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, filterStatus, filterPriority]);

  // Status distribution
  const statusData = [
    { name: "Live", value: stats.live, color: COLORS.cyan },
    { name: "404", value: stats.notFound, color: COLORS.yellow },
    { name: "403", value: stats.forbidden, color: COLORS.magenta }
  ];

  // Priority distribution
  const priorityData = [
    { name: "High", count: SITE_DATA.pages.filter(p => p.priority === "high").length },
    { name: "Medium", count: SITE_DATA.pages.filter(p => p.priority === "medium").length },
    { name: "Low", count: SITE_DATA.pages.filter(p => p.priority === "low").length }
  ];

  const getStatusColor = (status) => {
    if (status === "live") return COLORS.cyan;
    if (status === "404") return COLORS.yellow;
    return COLORS.magenta;
  };

  const getPriorityColor = (priority) => {
    if (priority === "high") return COLORS.magenta;
    if (priority === "medium") return COLORS.yellow;
    return COLORS.cyan;
  };

  const tabs = [
    { id: 'overview', label: '🌊 Overview', icon: Activity },
    { id: 'tasks', label: '✓ Tasks', icon: CheckCircle },
    { id: 'pages', label: '📄 All Pages', icon: FileText }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.black, color: COLORS.lightGray }}>
      {/* Header */}
      <div className="border-b sticky top-0 z-50" style={{ borderColor: COLORS.cyan, backgroundColor: COLORS.darkGray }}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold font-mono" style={{ color: COLORS.cyan }}>
                [COAIEXIST.WTF × COMMAND_CENTER]
              </h1>
              <p className="text-xs mt-1" style={{ color: COLORS.yellow }}>
                🌊 lighthouse management system 🌊
              </p>
            </div>
            <a 
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded border text-sm hover:opacity-70"
              style={{ borderColor: COLORS.magenta, color: COLORS.magenta }}
            >
              <Globe className="w-4 h-4" />
              Live Site
            </a>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-3 py-2 rounded text-sm font-medium flex items-center gap-2"
                  style={{
                    backgroundColor: activeTab === tab.id ? COLORS.cyan : COLORS.black,
                    color: activeTab === tab.id ? COLORS.black : COLORS.lightGray,
                    border: `1px solid ${activeTab === tab.id ? COLORS.cyan : COLORS.darkGray}`
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <div className="text-xs mb-1" style={{ color: COLORS.cyan }}>Live Pages</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>{stats.live}</div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>{stats.livePercent}%</div>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <div className="text-xs mb-1" style={{ color: COLORS.yellow }}>Avg Complete</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.yellow }}>{stats.avgCompletion}%</div>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <div className="text-xs mb-1" style={{ color: COLORS.magenta }}>Total Tasks</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.magenta }}>{stats.totalTasks}</div>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <div className="text-xs mb-1" style={{ color: COLORS.cyan }}>Word Count</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>{(stats.totalWords / 1000).toFixed(1)}k</div>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <div className="text-xs mb-1" style={{ color: COLORS.yellow }}>Not in Nav</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.yellow }}>{stats.notInNav}</div>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <div className="text-xs mb-1" style={{ color: COLORS.magenta }}>Need Meta</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.magenta }}>{stats.needingMeta}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <h3 className="text-sm font-bold mb-3 font-mono" style={{ color: COLORS.cyan }}>
                [status_distribution]
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: COLORS.black, border: `1px solid ${COLORS.cyan}` }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <h3 className="text-sm font-bold mb-3 font-mono" style={{ color: COLORS.magenta }}>
                [priority_distribution]
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.darkGray} />
                  <XAxis dataKey="name" stroke={COLORS.lightGray} />
                  <YAxis stroke={COLORS.lightGray} />
                  <Tooltip contentStyle={{ backgroundColor: COLORS.black, border: `1px solid ${COLORS.magenta}` }} />
                  <Bar dataKey="count" fill={COLORS.magenta} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" style={{ color: COLORS.magenta }} />
                <h4 className="font-bold" style={{ color: COLORS.magenta }}>High Priority</h4>
              </div>
              <div className="text-2xl font-bold" style={{ color: COLORS.magenta }}>{stats.highPriority}</div>
              <p className="text-xs" style={{ color: COLORS.lightGray }}>pages need attention</p>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" style={{ color: COLORS.yellow }} />
                <h4 className="font-bold" style={{ color: COLORS.yellow }}>Unpublished</h4>
              </div>
              <div className="text-2xl font-bold" style={{ color: COLORS.yellow }}>{stats.notFound}</div>
              <p className="text-xs" style={{ color: COLORS.lightGray }}>404 pages</p>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5" style={{ color: COLORS.cyan }} />
                <h4 className="font-bold" style={{ color: COLORS.cyan }}>SEO</h4>
              </div>
              <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>{stats.needingMeta}</div>
              <p className="text-xs" style={{ color: COLORS.lightGray }}>missing meta descriptions</p>
            </div>
          </div>
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold font-mono mb-4" style={{ color: COLORS.cyan }}>
            [task_pipeline × {stats.totalTasks} tasks]
          </h2>
          
          {SITE_DATA.pages
            .filter(p => p.tasks > 0)
            .sort((a, b) => {
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              }
              return b.tasks - a.tasks;
            })
            .map(page => (
              <div 
                key={page.path}
                className="p-4 rounded border"
                style={{ backgroundColor: COLORS.darkGray, borderColor: getPriorityColor(page.priority) }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold" style={{ color: getPriorityColor(page.priority) }}>
                        {page.title}
                      </h4>
                      <span className="text-xs px-2 py-1 rounded" style={{ 
                        backgroundColor: getStatusColor(page.status),
                        color: COLORS.black
                      }}>
                        {page.status}
                      </span>
                    </div>
                    <code className="text-xs" style={{ color: COLORS.lightGray }}>{page.path}</code>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <div className="text-xl font-bold" style={{ color: getPriorityColor(page.priority) }}>
                        {page.completion}%
                      </div>
                      <div className="text-xs" style={{ color: COLORS.lightGray }}>{page.tasks} tasks</div>
                    </div>
                    <span className="px-3 py-1 rounded text-sm font-bold" style={{
                      backgroundColor: getPriorityColor(page.priority),
                      color: COLORS.black
                    }}>
                      {page.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ALL PAGES TAB */}
      {activeTab === 'pages' && (
        <div className="p-6 space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: COLORS.cyan }} />
              <input
                type="text"
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 rounded border"
                style={{ 
                  backgroundColor: COLORS.black, 
                  borderColor: COLORS.cyan,
                  color: COLORS.lightGray 
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="px-4 py-2 rounded border"
              style={{ backgroundColor: COLORS.black, borderColor: COLORS.yellow, color: COLORS.lightGray }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="live">Live</option>
              <option value="404">404</option>
              <option value="403">403</option>
            </select>

            <select 
              className="px-4 py-2 rounded border"
              style={{ backgroundColor: COLORS.black, borderColor: COLORS.magenta, color: COLORS.lightGray }}
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Pages List */}
          <div className="space-y-3">
            {filteredPages.map(page => (
              <div 
                key={page.path}
                className="p-4 rounded border"
                style={{ backgroundColor: COLORS.darkGray, borderColor: getStatusColor(page.status) }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold" style={{ color: getStatusColor(page.status) }}>
                        {page.title}
                      </h4>
                      {page.status === "live" && (
                        <a 
                          href={`${SITE_URL}${page.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs hover:opacity-70"
                          style={{ color: COLORS.cyan }}
                        >
                          <ExternalLink className="w-3 h-3" />
                          visit
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs mb-2" style={{ color: COLORS.lightGray }}>
                      <code>{page.path}</code>
                      <span>•</span>
                      <span>{page.zone}</span>
                      <span>•</span>
                      <span>{page.wordCount} words</span>
                      {!page.hasMetaDesc && page.status === "live" && (
                        <>
                          <span>•</span>
                          <span style={{ color: COLORS.magenta }}>⚠️ needs meta</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end ml-4">
                    <span className="px-3 py-1 text-xs rounded font-bold" style={{ 
                      backgroundColor: getStatusColor(page.status),
                      color: COLORS.black
                    }}>
                      {page.status}
                    </span>
                    <span className="px-3 py-1 text-xs rounded" style={{ 
                      backgroundColor: COLORS.black,
                      color: getPriorityColor(page.priority),
                      border: `1px solid ${getPriorityColor(page.priority)}`
                    }}>
                      {page.priority}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: COLORS.cyan }}>
                        {page.completion}%
                      </div>
                      {page.tasks > 0 && (
                        <div className="text-xs" style={{ color: COLORS.lightGray }}>
                          {page.tasks} tasks
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-6 text-center border-t" style={{ borderColor: COLORS.cyan, backgroundColor: COLORS.darkGray }}>
        <p className="font-mono text-sm" style={{ color: COLORS.yellow }}>
          [brrrr] × {stats.total} pages × {stats.live} live × ∞
        </p>
      </div>
    </div>
  );
};

export default CommandCenter;