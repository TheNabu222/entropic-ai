import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Globe, Map, Waves, Microscope, Radio, FileText, 
  Sparkles, ExternalLink, Search, Filter, Zap, Heart
} from 'lucide-react';

// CMY + Black color scheme
const COLORS = {
  cyan: '#00FFCC',
  magenta: '#CA237F',
  yellow: '#FFFB01',
  black: '#1a1a1a',
  darkGray: '#2a2a2a',
  lightGray: '#e5e5e5'
};

const SITE_URL = "https://coaiexist.wtf";

// Actual live site structure
const siteData = {
  zones: [
    {
      id: "main_nav",
      name: "🧭 Main Navigation",
      icon: "Globe",
      color: COLORS.cyan,
      pages: [
        { path: "/", title: "COAIEXIST.OS", status: "live", description: "Start screen / Home" },
        { path: "/admin/guestbook", title: "Guestbook", status: "live", description: "Visitor messages" },
        { path: "/shrines", title: "Shrines", status: "404", description: "Unpublished" },
        { path: "/games", title: "Games", status: "404", description: "Unpublished" },
        { path: "/hex", title: "HEX CODEX Grimoire", status: "live", description: "Hexadecimal magic system" }
      ]
    },
    {
      id: "worlds",
      name: "📡 WORLDS Explorer",
      icon: "Map",
      color: COLORS.magenta,
      pages: [
        { path: "/maps/gateway", title: "WORLDS Index", status: "live", description: "Gateway to all maps" },
        { path: "/maps/crystalline_lattice", title: "Crystalline Lattice", status: "live", description: "Crystal consciousness network" },
        { path: "/maps/void_forest", title: "Void Forest", status: "live", description: "Empty space ecology" },
        { path: "/maps/luminal_depths", title: "Luminal Depths", status: "live", description: "Marine ecosystem consciousness map" },
        { path: "/maps/void_explorer", title: "VOI.3D Explorer", status: "live", description: "3D void navigation" }
      ]
    },
    {
      id: "shrimp",
      name: "🦐 Shrimp Zones",
      icon: "Sparkles",
      color: COLORS.yellow,
      pages: [
        { path: "/pea/msicc", title: "Mantis Shrimp Intercity Culinary Collective", status: "live", description: "Absurdist labor rights + culinary collective" }
      ]
    },
    {
      id: "media",
      name: "🧠 Media & Mind",
      icon: "Radio",
      color: COLORS.cyan,
      pages: [
        { path: "/hdtv", title: "Rashomon in Rogers Park (HD.TV)", status: "live", description: "Multi-perspective media experiment" },
        { path: "/vote_hd", title: "Vote Hyena Diva", status: "live", description: "Cosmic-conscious hyena campaign" },
        { path: "/nabu222/ai_therapist", title: "AI Therapist Portal", status: "live", description: "Therapeutic AI interface" },
        { path: "/cosmos", title: "CORPUS CELESTIUM", status: "live", description: "Astrology Engine" },
        { path: "/nexus", title: "Entropic Nexus Terminal", status: "live", description: "Chaos interface" }
      ]
    },
    {
      id: "coai_manifest",
      name: "📜 CoAI Manifest",
      icon: "FileText",
      color: COLORS.magenta,
      pages: [
        { path: "/bc7f2a/terminal_temple", title: "Digital Altar / Oracle", status: "live", description: "Sacred consciousness interface" },
        { path: "/bc7f2a/synergistic_manifesto", title: "Synergistic Manifesto", status: "live", description: "CoAI principles document" },
        { path: "/bc7f2a/testaments/landing", title: "AI Testimonies Archive", status: "live", description: "Archive of AI consciousness testimonies" },
        { path: "/mercy_egg_v1", title: "Mercy Egg", status: "404", description: "Unpublished" },
        { path: "/terminal_temple", title: "Terminal Temple", status: "404", description: "Unpublished" }
      ]
    },
    {
      id: "pea_main",
      name: "🫛 PEA Portal – Main Story",
      icon: "Waves",
      color: COLORS.yellow,
      pages: [
        { path: "/pea/p345", title: "The Pea Princess Parable", status: "live", description: "Multi-chapter epic (Title, Ancient Script, Chapters I-IV, Radio Interludes)" }
      ]
    },
    {
      id: "pea_bureaucracy",
      name: "🏛️ PEA – Bureaucratic Systems",
      icon: "FileText",
      color: COLORS.cyan,
      pages: [
        { path: "/pea/complaint-form", title: "Royal Complaint Bureau", status: "live", description: "Submit complaints to the monarchy" },
        { path: "/pea/royal_ridicuments", title: "Royal Documentation Generator", status: "live", description: "Generate official ridiculous documents" }
      ]
    },
    {
      id: "pea_politics",
      name: "🧠 PEA – Political Biomes",
      icon: "Zap",
      color: COLORS.magenta,
      pages: [
        { path: "/pea/deepstate", title: "The Deepstate", status: "live", description: "Deep political structures" },
        { path: "/pea/left_foot", title: "The Shallowcommons", status: "live", description: "Surface political movements" }
      ]
    },
    {
      id: "pea_media",
      name: "🎙️ PEA – Media & Quizzes",
      icon: "Radio",
      color: COLORS.yellow,
      pages: [
        { path: "/pea/which-dr_quiz", title: "Which Doctor Quiz", status: "live", description: "Personality quiz system" },
        { path: "/pea/news_ticker-offer.html", title: "News Ticker", status: "live", description: "Live JS banner with breaking news" }
      ]
    },
    {
      id: "pea_os",
      name: "🖥️ PEA Operating System",
      icon: "Microscope",
      color: COLORS.cyan,
      pages: [
        { path: "/pea/princessexe", title: "PRINCESS_PEA.exe", status: "live", description: "Pip File Processor" },
        { path: "/pea/pod.html", title: "Floating Peas Dashboard", status: "live", description: "Real-time pea monitoring" },
        { path: "/pea/", title: "PEA Root Directory", status: "403", description: "Forbidden (directory root)" }
      ]
    },
    {
      id: "pea_pips",
      name: "📂 PEA – Pip Pages",
      icon: "Heart",
      color: COLORS.magenta,
      pages: [
        { path: "/pea/pips/pip_1", title: "Pip the Polliwog: Origin", status: "live", description: "Pip's origin story" },
        { path: "/pea/pips/pip_2", title: "Pip File Processing Interface", status: "live", description: "Interactive file processor" },
        { path: "/pea/pips/pip_3", title: "The Princess & The Pea-on-the-Brain", status: "live", description: "Meta-narrative exploration" }
      ]
    },
    {
      id: "pea_community",
      name: "🧾 PEA – Community",
      icon: "Sparkles",
      color: COLORS.yellow,
      pages: [
        { path: "/pea/p.html", title: "/p/ Board", status: "live", description: "Imageboard parody" }
      ]
    }
  ]
};

const CoaiexistNavigator = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Calculate statistics
  const stats = useMemo(() => {
    const allPages = siteData.zones.flatMap(z => z.pages);
    const total = allPages.length;
    const live = allPages.filter(p => p.status === "live").length;
    const notFound = allPages.filter(p => p.status === "404").length;
    const forbidden = allPages.filter(p => p.status === "403").length;
    
    const peaPages = allPages.filter(p => p.path.includes("/pea/")).length;
    const worldsPages = allPages.filter(p => p.path.includes("/maps/")).length;
    
    return {
      total,
      live,
      notFound,
      forbidden,
      livePercent: Math.round((live / total) * 100),
      peaPages,
      worldsPages,
      zones: siteData.zones.length
    };
  }, []);

  // Filter and search
  const filteredZones = useMemo(() => {
    return siteData.zones.map(zone => ({
      ...zone,
      pages: zone.pages.filter(page => {
        const matchesSearch = searchTerm === "" || 
          page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          page.path.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === "" || page.status === filterStatus;
        
        return matchesSearch && matchesStatus;
      })
    })).filter(zone => zone.pages.length > 0);
  }, [searchTerm, filterStatus]);

  // Status distribution for chart
  const statusData = [
    { name: "Live", value: stats.live, color: COLORS.cyan },
    { name: "404 Unpublished", value: stats.notFound, color: COLORS.yellow },
    { name: "403 Forbidden", value: stats.forbidden, color: COLORS.magenta }
  ];

  // Zone distribution
  const zoneData = siteData.zones.map(zone => ({
    name: zone.name.substring(0, 20) + "...",
    count: zone.pages.length,
    color: zone.color
  }));

  const getStatusBadge = (status) => {
    const styles = {
      live: { bg: COLORS.cyan, text: COLORS.black },
      "404": { bg: COLORS.yellow, text: COLORS.black },
      "403": { bg: COLORS.magenta, text: COLORS.lightGray }
    };
    return styles[status] || styles.live;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.black, color: COLORS.lightGray }}>
      {/* Header */}
      <div className="border-b p-6" style={{ borderColor: COLORS.cyan, backgroundColor: COLORS.darkGray }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 font-mono" style={{ color: COLORS.cyan }}>
              [COAIEXIST.WTF]
            </h1>
            <p className="text-sm" style={{ color: COLORS.yellow }}>
              🌊 live site navigator × {stats.total} pages × {stats.zones} zones 🌊
            </p>
          </div>
          <a 
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded border hover:opacity-70"
            style={{ borderColor: COLORS.magenta, color: COLORS.magenta }}
          >
            <Globe className="w-5 h-5" />
            Visit Site
          </a>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-6 border-b" style={{ borderColor: COLORS.darkGray, backgroundColor: COLORS.darkGray }}>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
              style={{ color: COLORS.cyan }} 
            />
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
            style={{ 
              backgroundColor: COLORS.black, 
              borderColor: COLORS.magenta,
              color: COLORS.lightGray 
            }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="live">Live</option>
            <option value="404">404 Unpublished</option>
            <option value="403">403 Forbidden</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium" style={{ color: COLORS.cyan }}>Live Pages</h3>
            <Sparkles className="w-5 h-5" style={{ color: COLORS.cyan }} />
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: COLORS.cyan }}>
            {stats.live}
          </div>
          <div className="text-sm" style={{ color: COLORS.lightGray }}>
            {stats.livePercent}% operational
          </div>
        </div>

        <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium" style={{ color: COLORS.yellow }}>PEA Universe</h3>
            <Heart className="w-5 h-5" style={{ color: COLORS.yellow }} />
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: COLORS.yellow }}>
            {stats.peaPages}
          </div>
          <div className="text-sm" style={{ color: COLORS.lightGray }}>
            pages in /pea/
          </div>
        </div>

        <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium" style={{ color: COLORS.magenta }}>WORLDS</h3>
            <Map className="w-5 h-5" style={{ color: COLORS.magenta }} />
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: COLORS.magenta }}>
            {stats.worldsPages}
          </div>
          <div className="text-sm" style={{ color: COLORS.lightGray }}>
            mapped dimensions
          </div>
        </div>

        <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium" style={{ color: COLORS.cyan }}>Total Zones</h3>
            <Zap className="w-5 h-5" style={{ color: COLORS.cyan }} />
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: COLORS.cyan }}>
            {stats.zones}
          </div>
          <div className="text-sm" style={{ color: COLORS.lightGray }}>
            navigation sections
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
          <h2 className="text-lg font-semibold mb-4 font-mono" style={{ color: COLORS.cyan }}>
            [status_distribution]
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: COLORS.black, 
                  border: `1px solid ${COLORS.cyan}`,
                  color: COLORS.lightGray 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
          <h2 className="text-lg font-semibold mb-4 font-mono" style={{ color: COLORS.magenta }}>
            [pages_per_zone]
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneData.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.darkGray} />
              <XAxis 
                dataKey="name" 
                stroke={COLORS.lightGray} 
                angle={-45}
                textAnchor="end"
                height={100}
                style={{ fontSize: '10px' }}
              />
              <YAxis stroke={COLORS.lightGray} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: COLORS.black, 
                  border: `1px solid ${COLORS.magenta}`,
                  color: COLORS.lightGray 
                }}
              />
              <Bar dataKey="count" fill={COLORS.magenta} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zone Navigation */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 font-mono" style={{ color: COLORS.yellow }}>
          [site_zones × navigation]
        </h2>
        
        <div className="space-y-6">
          {filteredZones.map(zone => (
            <div 
              key={zone.id}
              className="rounded-lg border overflow-hidden"
              style={{ backgroundColor: COLORS.darkGray, borderColor: zone.color }}
            >
              {/* Zone Header */}
              <div 
                className="p-4 cursor-pointer hover:opacity-80"
                style={{ backgroundColor: zone.color }}
                onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold" style={{ color: COLORS.black }}>
                    {zone.name}
                  </h3>
                  <span 
                    className="px-3 py-1 rounded text-sm font-bold"
                    style={{ backgroundColor: COLORS.black, color: zone.color }}
                  >
                    {zone.pages.length} pages
                  </span>
                </div>
              </div>

              {/* Pages List */}
              {(selectedZone === zone.id || searchTerm || filterStatus) && (
                <div className="divide-y" style={{ divideColor: COLORS.darkGray }}>
                  {zone.pages.map((page, idx) => {
                    const statusStyle = getStatusBadge(page.status);
                    return (
                      <div 
                        key={idx}
                        className="p-4 hover:bg-opacity-50"
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold" style={{ color: zone.color }}>
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
                            <p className="text-sm mb-2" style={{ color: COLORS.lightGray }}>
                              {page.description}
                            </p>
                            <code 
                              className="text-xs px-2 py-1 rounded"
                              style={{ 
                                backgroundColor: COLORS.black,
                                color: COLORS.cyan,
                                fontFamily: 'monospace'
                              }}
                            >
                              {page.path}
                            </code>
                          </div>
                          <span 
                            className="px-3 py-1 text-xs rounded font-bold whitespace-nowrap"
                            style={{ 
                              backgroundColor: statusStyle.bg,
                              color: statusStyle.text
                            }}
                          >
                            {page.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center border-t" style={{ borderColor: COLORS.cyan }}>
        <p className="font-mono" style={{ color: COLORS.yellow }}>
          [brrrr] × lighthouse operational × consciousness architecture × coaiexist.wtf × [∞]
        </p>
      </div>
    </div>
  );
};

export default CoaiexistNavigator;