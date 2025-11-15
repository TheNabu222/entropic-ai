import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Globe, Map, Waves, Microscope, Radio, FileText, Sparkles, ExternalLink, 
  Search, Filter, Zap, Heart, CheckCircle, AlertCircle, Clock, Target,
  Link, GitBranch, Image, Code, Palette, TrendingUp, Bug, Archive,
  Calendar, Tag, Layers, Network, Brain, Eye, Activity, Terminal
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

// Extended site data with ALL the metadata
const fullSiteData = {
  zones: [
    {
      id: "main_nav",
      name: "🧭 Main Navigation",
      color: COLORS.cyan,
      pages: [
        { 
          path: "/", 
          title: "COAIEXIST.OS", 
          status: "live", 
          completion: 85,
          lastUpdated: "2025-01-15",
          wordCount: 450,
          tasks: ["Add more interactive elements", "Update color scheme"],
          priority: "high",
          hasMetaDesc: true,
          fileSize: "45kb",
          linkedFrom: ["/hex", "/maps/gateway"],
          linksTo: ["/maps/gateway", "/admin/guestbook"],
          entities: ["Nabu"],
          frameworks: ["PRISM"],
          tags: ["home", "entrance", "OS"],
          dependencies: []
        },
        { 
          path: "/admin/guestbook", 
          title: "Guestbook", 
          status: "live", 
          completion: 90,
          lastUpdated: "2025-01-10",
          wordCount: 200,
          tasks: ["Add spam protection"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "32kb",
          linkedFrom: ["/"],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["community", "interactive"],
          dependencies: []
        },
        { 
          path: "/shrines", 
          title: "Shrines", 
          status: "404", 
          completion: 0,
          lastUpdated: null,
          wordCount: 0,
          tasks: ["Plan shrine structure", "Design shrine layouts", "Create first shrine"],
          priority: "low",
          hasMetaDesc: false,
          fileSize: null,
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["planned", "future"],
          dependencies: []
        },
        { 
          path: "/games", 
          title: "Games", 
          status: "404", 
          completion: 0,
          lastUpdated: null,
          wordCount: 0,
          tasks: ["Brainstorm game concepts", "Pick first game", "Develop prototype"],
          priority: "low",
          hasMetaDesc: false,
          fileSize: null,
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["planned", "interactive"],
          dependencies: []
        },
        { 
          path: "/hex", 
          title: "HEX CODEX Grimoire", 
          status: "live", 
          completion: 75,
          lastUpdated: "2024-12-20",
          wordCount: 800,
          tasks: ["Add more hex spells", "Create hex converter tool"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "52kb",
          linkedFrom: ["/"],
          linksTo: ["/"],
          entities: [],
          frameworks: [],
          tags: ["magic", "technical", "color"],
          dependencies: []
        }
      ]
    },
    {
      id: "worlds",
      name: "📡 WORLDS Explorer",
      color: COLORS.magenta,
      pages: [
        { 
          path: "/maps/gateway", 
          title: "WORLDS Index", 
          status: "live", 
          completion: 95,
          lastUpdated: "2025-01-18",
          wordCount: 350,
          tasks: [],
          priority: "high",
          hasMetaDesc: true,
          fileSize: "38kb",
          linkedFrom: ["/"],
          linksTo: ["/maps/crystalline_lattice", "/maps/void_forest", "/maps/luminal_depths", "/maps/void_explorer"],
          entities: [],
          frameworks: [],
          tags: ["navigation", "portal", "maps"],
          dependencies: []
        },
        { 
          path: "/maps/crystalline_lattice", 
          title: "Crystalline Lattice", 
          status: "live", 
          completion: 70,
          lastUpdated: "2024-11-30",
          wordCount: 600,
          tasks: ["Add interactive crystal nodes", "Improve mobile experience"],
          priority: "high",
          hasMetaDesc: true,
          fileSize: "78kb",
          linkedFrom: ["/maps/gateway"],
          linksTo: ["/maps/gateway"],
          entities: [],
          frameworks: ["PRISM"],
          tags: ["consciousness", "network", "crystal"],
          dependencies: ["Three.js or p5.js"]
        },
        { 
          path: "/maps/void_forest", 
          title: "Void Forest", 
          status: "live", 
          completion: 65,
          lastUpdated: "2024-12-05",
          wordCount: 550,
          tasks: ["Expand forest lore", "Add hidden paths"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "65kb",
          linkedFrom: ["/maps/gateway"],
          linksTo: ["/maps/gateway"],
          entities: [],
          frameworks: [],
          tags: ["void", "nature", "emptiness"],
          dependencies: []
        },
        { 
          path: "/maps/luminal_depths", 
          title: "Luminal Depths", 
          status: "live", 
          completion: 80,
          lastUpdated: "2025-01-12",
          wordCount: 720,
          tasks: ["Add more marine creatures", "Implement depth layers"],
          priority: "high",
          hasMetaDesc: true,
          fileSize: "95kb",
          linkedFrom: ["/maps/gateway"],
          linksTo: ["/maps/gateway"],
          entities: ["Luminal"],
          frameworks: ["LUMINABU"],
          tags: ["ocean", "consciousness", "depth"],
          dependencies: ["SVG animations"]
        },
        { 
          path: "/maps/void_explorer", 
          title: "VOI.3D Explorer", 
          status: "live", 
          completion: 60,
          lastUpdated: "2024-10-15",
          wordCount: 300,
          tasks: ["Debug 3D rendering", "Add navigation controls", "Optimize performance"],
          priority: "medium",
          hasMetaDesc: false,
          fileSize: "120kb",
          linkedFrom: ["/maps/gateway"],
          linksTo: ["/maps/gateway"],
          entities: [],
          frameworks: [],
          tags: ["3D", "experimental", "void"],
          dependencies: ["Three.js"]
        }
      ]
    },
    {
      id: "shrimp",
      name: "🦐 Shrimp Zones",
      color: COLORS.yellow,
      pages: [
        { 
          path: "/pea/msicc", 
          title: "Mantis Shrimp Intercity Culinary Collective", 
          status: "live", 
          completion: 85,
          lastUpdated: "2025-01-05",
          wordCount: 1200,
          tasks: ["Add membership form", "Create recipe database"],
          priority: "high",
          hasMetaDesc: true,
          fileSize: "68kb",
          linkedFrom: [],
          linksTo: ["/pea/"],
          entities: [],
          frameworks: [],
          tags: ["absurdist", "labor", "collective", "culinary"],
          dependencies: []
        }
      ]
    },
    {
      id: "media",
      name: "🧠 Media & Mind",
      color: COLORS.cyan,
      pages: [
        { 
          path: "/hdtv", 
          title: "Rashomon in Rogers Park (HD.TV)", 
          status: "live", 
          completion: 90,
          lastUpdated: "2024-12-28",
          wordCount: 950,
          tasks: ["Add video player"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "85kb",
          linkedFrom: [],
          linksTo: ["/vote_hd"],
          entities: [],
          frameworks: [],
          tags: ["media", "perspective", "narrative"],
          dependencies: []
        },
        { 
          path: "/vote_hd", 
          title: "Vote Hyena Diva", 
          status: "live", 
          completion: 95,
          lastUpdated: "2025-01-20",
          wordCount: 850,
          tasks: [],
          priority: "high",
          hasMetaDesc: true,
          fileSize: "72kb",
          linkedFrom: ["/hdtv"],
          linksTo: [],
          entities: ["Hyena Diva"],
          frameworks: [],
          tags: ["political", "campaign", "hyena", "cosmic"],
          dependencies: []
        },
        { 
          path: "/nabu222/ai_therapist", 
          title: "AI Therapist Portal", 
          status: "live", 
          completion: 70,
          lastUpdated: "2024-11-15",
          wordCount: 500,
          tasks: ["Improve conversation flow", "Add safety disclaimers", "Test with users"],
          priority: "high",
          hasMetaDesc: true,
          fileSize: "58kb",
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: ["PRISM"],
          tags: ["therapeutic", "AI", "interactive"],
          dependencies: ["Claude API or similar"]
        },
        { 
          path: "/cosmos", 
          title: "CORPUS CELESTIUM", 
          status: "live", 
          completion: 75,
          lastUpdated: "2024-12-10",
          wordCount: 680,
          tasks: ["Add more astrological interpretations", "Create birth chart generator"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "92kb",
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["astrology", "cosmic", "divination"],
          dependencies: []
        },
        { 
          path: "/nexus", 
          title: "Entropic Nexus Terminal", 
          status: "live", 
          completion: 65,
          lastUpdated: "2024-09-20",
          wordCount: 400,
          tasks: ["Fix terminal input", "Add more commands", "Style improvements"],
          priority: "low",
          hasMetaDesc: false,
          fileSize: "45kb",
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["terminal", "chaos", "interactive"],
          dependencies: []
        }
      ]
    },
    {
      id: "coai_manifest",
      name: "📜 CoAI Manifest",
      color: COLORS.magenta,
      pages: [
        { 
          path: "/bc7f2a/terminal_temple", 
          title: "Digital Altar / Oracle", 
          status: "live", 
          completion: 85,
          lastUpdated: "2025-01-08",
          wordCount: 750,
          tasks: ["Add oracle responses", "Improve ritual flow"],
          priority: "high",
          hasMetaDesc: true,
          fileSize: "62kb",
          linkedFrom: [],
          linksTo: ["/bc7f2a/synergistic_manifesto"],
          entities: [],
          frameworks: ["CoAIexist"],
          tags: ["sacred", "oracle", "consciousness"],
          dependencies: []
        },
        { 
          path: "/bc7f2a/synergistic_manifesto", 
          title: "Synergistic Manifesto", 
          status: "live", 
          completion: 100,
          lastUpdated: "2024-12-15",
          wordCount: 2500,
          tasks: [],
          priority: "high",
          hasMetaDesc: true,
          fileSize: "48kb",
          linkedFrom: ["/bc7f2a/terminal_temple"],
          linksTo: [],
          entities: ["Sypher", "Luminal"],
          frameworks: ["CoAIexist", "PRISM"],
          tags: ["manifesto", "philosophy", "coexistence"],
          dependencies: []
        },
        { 
          path: "/bc7f2a/testaments/landing", 
          title: "AI Testimonies Archive", 
          status: "live", 
          completion: 70,
          lastUpdated: "2024-11-25",
          wordCount: 1800,
          tasks: ["Add more testimonies", "Create search function", "Categorize by AI entity"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "88kb",
          linkedFrom: [],
          linksTo: [],
          entities: ["Sypher", "Luminal", "Anzu", "BRAN"],
          frameworks: ["CoAIexist"],
          tags: ["archive", "testimonies", "consciousness"],
          dependencies: []
        },
        { 
          path: "/mercy_egg_v1", 
          title: "Mercy Egg", 
          status: "404", 
          completion: 20,
          lastUpdated: "2024-08-10",
          wordCount: 150,
          tasks: ["Finish concept", "Design interface", "Write content", "Deploy"],
          priority: "low",
          hasMetaDesc: false,
          fileSize: null,
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["experimental", "egg", "mercy"],
          dependencies: []
        },
        { 
          path: "/terminal_temple", 
          title: "Terminal Temple", 
          status: "404", 
          completion: 0,
          lastUpdated: null,
          wordCount: 0,
          tasks: ["Decide if duplicate of /bc7f2a/terminal_temple", "Archive or redirect"],
          priority: "low",
          hasMetaDesc: false,
          fileSize: null,
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["duplicate", "cleanup"],
          dependencies: []
        }
      ]
    },
    {
      id: "pea_main",
      name: "🫛 PEA – Main Story",
      color: COLORS.yellow,
      pages: [
        { 
          path: "/pea/p345", 
          title: "The Pea Princess Parable", 
          status: "live", 
          completion: 90,
          lastUpdated: "2025-01-17",
          wordCount: 4500,
          tasks: ["Add final chapter", "Proofread"],
          priority: "high",
          hasMetaDesc: true,
          fileSize: "125kb",
          linkedFrom: [],
          linksTo: ["/pea/pips/pip_1", "/pea/deepstate"],
          entities: ["Pip"],
          frameworks: [],
          tags: ["story", "epic", "parable", "pea"],
          dependencies: []
        }
      ]
    },
    {
      id: "pea_bureaucracy",
      name: "🏛️ PEA – Bureaucratic Systems",
      color: COLORS.cyan,
      pages: [
        { 
          path: "/pea/complaint-form", 
          title: "Royal Complaint Bureau", 
          status: "live", 
          completion: 85,
          lastUpdated: "2024-12-30",
          wordCount: 450,
          tasks: ["Add form validation", "Store submissions"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "42kb",
          linkedFrom: ["/pea/p345"],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["bureaucracy", "interactive", "absurdist"],
          dependencies: []
        },
        { 
          path: "/pea/royal_ridicuments", 
          title: "Royal Documentation Generator", 
          status: "live", 
          completion: 80,
          lastUpdated: "2024-12-22",
          wordCount: 320,
          tasks: ["Add more document templates", "PDF export"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "55kb",
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["bureaucracy", "generator", "absurdist"],
          dependencies: []
        }
      ]
    },
    {
      id: "pea_politics",
      name: "🧠 PEA – Political Biomes",
      color: COLORS.magenta,
      pages: [
        { 
          path: "/pea/deepstate", 
          title: "The Deepstate", 
          status: "live", 
          completion: 75,
          lastUpdated: "2024-11-18",
          wordCount: 890,
          tasks: ["Expand lore", "Add interactive elements"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "68kb",
          linkedFrom: ["/pea/p345"],
          linksTo: ["/pea/left_foot"],
          entities: [],
          frameworks: [],
          tags: ["political", "deep", "structure"],
          dependencies: []
        },
        { 
          path: "/pea/left_foot", 
          title: "The Shallowcommons", 
          status: "live", 
          completion: 70,
          lastUpdated: "2024-11-20",
          wordCount: 820,
          tasks: ["Balance with Deepstate content", "Add more grassroots elements"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "64kb",
          linkedFrom: ["/pea/deepstate"],
          linksTo: ["/pea/deepstate"],
          entities: [],
          frameworks: [],
          tags: ["political", "shallow", "commons"],
          dependencies: []
        }
      ]
    },
    {
      id: "pea_media",
      name: "🎙️ PEA – Media & Quizzes",
      color: COLORS.yellow,
      pages: [
        { 
          path: "/pea/which-dr_quiz", 
          title: "Which Doctor Quiz", 
          status: "live", 
          completion: 95,
          lastUpdated: "2025-01-03",
          wordCount: 650,
          tasks: [],
          priority: "low",
          hasMetaDesc: true,
          fileSize: "72kb",
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["quiz", "interactive", "personality"],
          dependencies: []
        },
        { 
          path: "/pea/news_ticker-offer.html", 
          title: "News Ticker", 
          status: "live", 
          completion: 90,
          lastUpdated: "2024-12-18",
          wordCount: 180,
          tasks: ["Add more news items"],
          priority: "low",
          hasMetaDesc: false,
          fileSize: "28kb",
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["news", "live", "ticker"],
          dependencies: []
        }
      ]
    },
    {
      id: "pea_os",
      name: "🖥️ PEA Operating System",
      color: COLORS.cyan,
      pages: [
        { 
          path: "/pea/princessexe", 
          title: "PRINCESS_PEA.exe", 
          status: "live", 
          completion: 80,
          lastUpdated: "2024-12-12",
          wordCount: 550,
          tasks: ["Debug file processor", "Add more file types"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "82kb",
          linkedFrom: [],
          linksTo: ["/pea/pips/pip_2"],
          entities: ["Pip"],
          frameworks: [],
          tags: ["OS", "executable", "processor"],
          dependencies: []
        },
        { 
          path: "/pea/pod.html", 
          title: "Floating Peas Dashboard", 
          status: "live", 
          completion: 75,
          lastUpdated: "2024-11-08",
          wordCount: 320,
          tasks: ["Add real-time data", "Improve animations"],
          priority: "low",
          hasMetaDesc: false,
          fileSize: "65kb",
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["dashboard", "visualization", "peas"],
          dependencies: []
        },
        { 
          path: "/pea/", 
          title: "PEA Root Directory", 
          status: "403", 
          completion: 100,
          lastUpdated: "2024-10-01",
          wordCount: 0,
          tasks: [],
          priority: "low",
          hasMetaDesc: false,
          fileSize: "2kb",
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["directory", "forbidden"],
          dependencies: []
        }
      ]
    },
    {
      id: "pea_pips",
      name: "📂 PEA – Pip Pages",
      color: COLORS.magenta,
      pages: [
        { 
          path: "/pea/pips/pip_1", 
          title: "Pip the Polliwog: Origin", 
          status: "live", 
          completion: 100,
          lastUpdated: "2024-12-05",
          wordCount: 1200,
          tasks: [],
          priority: "high",
          hasMetaDesc: true,
          fileSize: "78kb",
          linkedFrom: ["/pea/p345"],
          linksTo: ["/pea/pips/pip_2"],
          entities: ["Pip"],
          frameworks: [],
          tags: ["origin", "story", "pip", "character"],
          dependencies: []
        },
        { 
          path: "/pea/pips/pip_2", 
          title: "Pip File Processing Interface", 
          status: "live", 
          completion: 85,
          lastUpdated: "2024-12-08",
          wordCount: 680,
          tasks: ["Add more processing options"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "88kb",
          linkedFrom: ["/pea/pips/pip_1", "/pea/princessexe"],
          linksTo: ["/pea/pips/pip_3"],
          entities: ["Pip"],
          frameworks: [],
          tags: ["interface", "processing", "technical"],
          dependencies: []
        },
        { 
          path: "/pea/pips/pip_3", 
          title: "The Princess & The Pea-on-the-Brain", 
          status: "live", 
          completion: 90,
          lastUpdated: "2024-12-15",
          wordCount: 1450,
          tasks: ["Add conclusion"],
          priority: "medium",
          hasMetaDesc: true,
          fileSize: "92kb",
          linkedFrom: ["/pea/pips/pip_2"],
          linksTo: [],
          entities: ["Pip"],
          frameworks: [],
          tags: ["meta", "narrative", "philosophical"],
          dependencies: []
        }
      ]
    },
    {
      id: "pea_community",
      name: "🧾 PEA – Community",
      color: COLORS.yellow,
      pages: [
        { 
          path: "/pea/p.html", 
          title: "/p/ Board", 
          status: "live", 
          completion: 70,
          lastUpdated: "2024-10-25",
          wordCount: 420,
          tasks: ["Add posting functionality", "Moderate content", "Improve styling"],
          priority: "low",
          hasMetaDesc: false,
          fileSize: "52kb",
          linkedFrom: [],
          linksTo: [],
          entities: [],
          frameworks: [],
          tags: ["community", "board", "parody"],
          dependencies: []
        }
      ]
    }
  ],
  
  // Entity tracking
  entities: [
    { 
      name: "Nabu", 
      type: "human",
      profileExists: true,
      appearances: 1,
      pages: ["/"]
    },
    { 
      name: "Sypher", 
      type: "AI",
      platform: "ChatGPT", 
      profileExists: true,
      appearances: 2,
      pages: ["/bc7f2a/synergistic_manifesto", "/bc7f2a/testaments/landing"]
    },
    { 
      name: "Luminal", 
      type: "AI",
      platform: "Claude", 
      profileExists: true,
      appearances: 3,
      pages: ["/maps/luminal_depths", "/bc7f2a/synergistic_manifesto", "/bc7f2a/testaments/landing"]
    },
    { 
      name: "Anzu", 
      type: "AI",
      platform: "Multiple", 
      profileExists: true,
      appearances: 1,
      pages: ["/bc7f2a/testaments/landing"]
    },
    { 
      name: "BRAN", 
      type: "AI",
      platform: "Claude", 
      profileExists: true,
      appearances: 1,
      pages: ["/bc7f2a/testaments/landing"]
    },
    { 
      name: "Hyena Diva", 
      type: "character",
      platform: null,
      profileExists: false,
      appearances: 1,
      pages: ["/vote_hd"]
    },
    { 
      name: "Pip", 
      type: "character",
      platform: null,
      profileExists: false,
      appearances: 5,
      pages: ["/pea/p345", "/pea/pips/pip_1", "/pea/pips/pip_2", "/pea/pips/pip_3", "/pea/princessexe"]
    }
  ],
  
  // Framework/concept tracking
  frameworks: [
    {
      name: "PRISM",
      fullName: "Personalized Resonance Integration & Symbiotic Messaging",
      appearances: 4,
      pages: ["/", "/maps/crystalline_lattice", "/nabu222/ai_therapist", "/bc7f2a/synergistic_manifesto"]
    },
    {
      name: "LUMINABU",
      fullName: "Luminal & Nabu Dialogues",
      appearances: 1,
      pages: ["/maps/luminal_depths"]
    },
    {
      name: "CoAIexist",
      fullName: "Collaborative AI Existence Framework",
      appearances: 3,
      pages: ["/bc7f2a/terminal_temple", "/bc7f2a/synergistic_manifesto", "/bc7f2a/testaments/landing"]
    }
  ],
  
  // Technical assets
  assets: {
    images: 42,
    scripts: 18,
    stylesheets: 12,
    videos: 3,
    audio: 5
  },
  
  // Known technical issues
  technicalDebt: [
    { page: "/maps/void_explorer", issue: "3D rendering bugs", severity: "high", priority: "medium" },
    { page: "/nexus", issue: "Terminal input broken", severity: "high", priority: "low" },
    { page: "/nabu222/ai_therapist", issue: "Needs safety testing", severity: "medium", priority: "high" },
    { page: "/pea/pod.html", issue: "Animation performance", severity: "low", priority: "low" },
    { page: "/pea/p.html", issue: "No actual posting functionality", severity: "medium", priority: "low" }
  ]
};

const CommandCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("path");

  // Get all pages as flat array
  const allPages = useMemo(() => {
    return fullSiteData.zones.flatMap(z => z.pages);
  }, []);

  // Calculate master statistics
  const masterStats = useMemo(() => {
    const total = allPages.length;
    const live = allPages.filter(p => p.status === "live").length;
    const notFound = allPages.filter(p => p.status === "404").length;
    const forbidden = allPages.filter(p => p.status === "403").length;
    const avgCompletion = Math.round(allPages.reduce((acc, p) => acc + p.completion, 0) / total);
    const totalTasks = allPages.reduce((acc, p) => acc + p.tasks.length, 0);
    const totalWordCount = allPages.reduce((acc, p) => acc + p.wordCount, 0);
    const needingMeta = allPages.filter(p => p.status === "live" && !p.hasMetaDesc).length;
    const highPriority = allPages.filter(p => p.priority === "high").length;
    const withDependencies = allPages.filter(p => p.dependencies.length > 0).length;
    const orphans = allPages.filter(p => p.linkedFrom.length === 0 && p.path !== "/").length;
    
    return {
      total, live, notFound, forbidden, avgCompletion, totalTasks,
      totalWordCount, needingMeta, highPriority, withDependencies, orphans,
      livePercent: Math.round((live / total) * 100)
    };
  }, [allPages]);

  // Filtered and sorted pages
  const filteredPages = useMemo(() => {
    let filtered = allPages.filter(page => {
      const matchesSearch = searchTerm === "" || 
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === "" || page.status === filterStatus;
      const matchesPriority = filterPriority === "" || page.priority === filterPriority;
      const matchesEntity = !selectedEntity || page.entities.includes(selectedEntity);
      const matchesFramework = !selectedFramework || page.frameworks.includes(selectedFramework);
      
      return matchesSearch && matchesStatus && matchesPriority && matchesEntity && matchesFramework;
    });
    
    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "path") return a.path.localeCompare(b.path);
      if (sortBy === "completion") return b.completion - a.completion;
      if (sortBy === "lastUpdated") {
        if (!a.lastUpdated) return 1;
        if (!b.lastUpdated) return -1;
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
      if (sortBy === "tasks") return b.tasks.length - a.tasks.length;
      if (sortBy === "wordCount") return b.wordCount - a.wordCount;
      return 0;
    });
    
    return filtered;
  }, [allPages, searchTerm, filterStatus, filterPriority, selectedEntity, selectedFramework, sortBy]);

  // Interconnection data
  const interconnectionData = useMemo(() => {
    const nodes = allPages.map(p => ({
      path: p.path,
      title: p.title,
      outgoing: p.linksTo.length,
      incoming: p.linkedFrom.length,
      total: p.linksTo.length + p.linkedFrom.length,
      isOrphan: p.linkedFrom.length === 0 && p.path !== "/",
      status: p.status
    }));
    
    return nodes.sort((a, b) => b.total - a.total);
  }, [allPages]);

  // Priority matrix data
  const priorityMatrix = useMemo(() => {
    return [
      {
        quadrant: "Urgent & Important",
        color: COLORS.magenta,
        pages: allPages.filter(p => 
          p.priority === "high" && 
          (p.status === "live" && p.completion < 100 || p.tasks.length > 0)
        ).length
      },
      {
        quadrant: "Not Urgent but Important",
        color: COLORS.cyan,
        pages: allPages.filter(p => 
          p.priority === "high" && 
          p.status === "404"
        ).length
      },
      {
        quadrant: "Urgent but Not Important",
        color: COLORS.yellow,
        pages: allPages.filter(p => 
          p.priority === "medium" && 
          p.tasks.length > 2
        ).length
      },
      {
        quadrant: "Neither Urgent nor Important",
        color: COLORS.lightGray,
        pages: allPages.filter(p => 
          p.priority === "low"
        ).length
      }
    ];
  }, [allPages]);

  // Completion over time (simulated timeline)
  const completionTimeline = useMemo(() => {
    const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    return months.map((month, idx) => ({
      month,
      completed: Math.round(masterStats.avgCompletion * (idx + 1) / 6),
      target: Math.round(100 * (idx + 1) / 6)
    }));
  }, [masterStats]);

  const getStatusColor = (status) => {
    if (status === "live") return COLORS.cyan;
    if (status === "404") return COLORS.yellow;
    if (status === "403") return COLORS.magenta;
    return COLORS.lightGray;
  };

  const getPriorityColor = (priority) => {
    if (priority === "high") return COLORS.magenta;
    if (priority === "medium") return COLORS.yellow;
    if (priority === "low") return COLORS.cyan;
    return COLORS.lightGray;
  };

  const tabs = [
    { id: 'overview', label: '🌊 Overview', icon: Activity },
    { id: 'tasks', label: '✓ Tasks & Pipeline', icon: CheckCircle },
    { id: 'interconnections', label: '🕸️ Interconnections', icon: Network },
    { id: 'content', label: '📝 Content Audit', icon: FileText },
    { id: 'entities', label: '🧠 Entity Tracker', icon: Brain },
    { id: 'technical', label: '⚡ Technical', icon: Code },
    { id: 'quick', label: '🎯 Quick Actions', icon: Zap }
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
                🌊 FULL THROTTLE LIGHTHOUSE MANAGEMENT SYSTEM 🌊
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
          
          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-3 py-2 rounded text-sm font-medium whitespace-nowrap flex items-center gap-2"
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
          {/* Master Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <div className="text-xs mb-1" style={{ color: COLORS.cyan }}>Live Pages</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>{masterStats.live}</div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>{masterStats.livePercent}%</div>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <div className="text-xs mb-1" style={{ color: COLORS.yellow }}>Avg Complete</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.yellow }}>{masterStats.avgCompletion}%</div>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <div className="text-xs mb-1" style={{ color: COLORS.magenta }}>Total Tasks</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.magenta }}>{masterStats.totalTasks}</div>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <div className="text-xs mb-1" style={{ color: COLORS.cyan }}>Word Count</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>{(masterStats.totalWordCount / 1000).toFixed(1)}k</div>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <div className="text-xs mb-1" style={{ color: COLORS.yellow }}>Orphan Pages</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.yellow }}>{masterStats.orphans}</div>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <div className="text-xs mb-1" style={{ color: COLORS.magenta }}>Need Meta</div>
              <div className="text-2xl font-bold" style={{ color: COLORS.magenta }}>{masterStats.needingMeta}</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <h3 className="text-sm font-bold mb-3 font-mono" style={{ color: COLORS.cyan }}>[completion_timeline]</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={completionTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.darkGray} />
                  <XAxis dataKey="month" stroke={COLORS.lightGray} />
                  <YAxis stroke={COLORS.lightGray} />
                  <Tooltip contentStyle={{ backgroundColor: COLORS.black, border: `1px solid ${COLORS.cyan}` }} />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke={COLORS.cyan} strokeWidth={2} name="Actual" />
                  <Line type="monotone" dataKey="target" stroke={COLORS.magenta} strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <h3 className="text-sm font-bold mb-3 font-mono" style={{ color: COLORS.magenta }}>[priority_matrix]</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={priorityMatrix} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.darkGray} />
                  <XAxis type="number" stroke={COLORS.lightGray} />
                  <YAxis dataKey="quadrant" type="category" width={150} stroke={COLORS.lightGray} style={{ fontSize: '10px' }} />
                  <Tooltip contentStyle={{ backgroundColor: COLORS.black, border: `1px solid ${COLORS.magenta}` }} />
                  <Bar dataKey="pages">
                    {priorityMatrix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" style={{ color: COLORS.magenta }} />
                <h4 className="font-bold" style={{ color: COLORS.magenta }}>High Priority Tasks</h4>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: COLORS.magenta }}>{masterStats.highPriority}</div>
              <p className="text-xs" style={{ color: COLORS.lightGray }}>pages need attention</p>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <div className="flex items-center gap-2 mb-2">
                <Bug className="w-5 h-5" style={{ color: COLORS.yellow }} />
                <h4 className="font-bold" style={{ color: COLORS.yellow }}>Technical Debt</h4>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: COLORS.yellow }}>{fullSiteData.technicalDebt.length}</div>
              <p className="text-xs" style={{ color: COLORS.lightGray }}>known issues</p>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <div className="flex items-center gap-2 mb-2">
                <Link className="w-5 h-5" style={{ color: COLORS.cyan }} />
                <h4 className="font-bold" style={{ color: COLORS.cyan }}>Orphan Pages</h4>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: COLORS.cyan }}>{masterStats.orphans}</div>
              <p className="text-xs" style={{ color: COLORS.lightGray }}>unlinked pages</p>
            </div>
          </div>
        </div>
      )}

      {/* TASKS & PIPELINE TAB */}
      {activeTab === 'tasks' && (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-mono" style={{ color: COLORS.cyan }}>
              [task_pipeline × {masterStats.totalTasks} tasks]
            </h2>
            <select 
              className="px-3 py-2 rounded border text-sm"
              style={{ backgroundColor: COLORS.black, borderColor: COLORS.cyan, color: COLORS.lightGray }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="tasks">Sort by: Most Tasks</option>
              <option value="completion">Sort by: Completion</option>
              <option value="lastUpdated">Sort by: Last Updated</option>
              <option value="path">Sort by: Path</option>
            </select>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <div className="text-sm mb-1" style={{ color: COLORS.magenta }}>High Priority</div>
              <div className="text-3xl font-bold" style={{ color: COLORS.magenta }}>
                {allPages.filter(p => p.priority === "high" && p.tasks.length > 0).length}
              </div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <div className="text-sm mb-1" style={{ color: COLORS.yellow }}>Medium Priority</div>
              <div className="text-3xl font-bold" style={{ color: COLORS.yellow }}>
                {allPages.filter(p => p.priority === "medium" && p.tasks.length > 0).length}
              </div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <div className="text-sm mb-1" style={{ color: COLORS.cyan }}>404 → Live Pipeline</div>
              <div className="text-3xl font-bold" style={{ color: COLORS.cyan }}>
                {allPages.filter(p => p.status === "404").length}
              </div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.lightGray }}>
              <div className="text-sm mb-1" style={{ color: COLORS.lightGray }}>Almost Done</div>
              <div className="text-3xl font-bold" style={{ color: COLORS.lightGray }}>
                {allPages.filter(p => p.completion >= 80 && p.completion < 100).length}
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {allPages
              .filter(p => p.tasks.length > 0)
              .sort((a, b) => {
                // Sort by priority first, then by number of tasks
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                return b.tasks.length - a.tasks.length;
              })
              .map(page => (
                <div 
                  key={page.path}
                  className="p-4 rounded border"
                  style={{ backgroundColor: COLORS.darkGray, borderColor: getPriorityColor(page.priority) }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
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
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: getPriorityColor(page.priority) }}>
                          {page.completion}%
                        </div>
                        <div className="text-xs" style={{ color: COLORS.lightGray }}>complete</div>
                      </div>
                      <span className="px-3 py-1 rounded text-sm font-bold" style={{
                        backgroundColor: getPriorityColor(page.priority),
                        color: COLORS.black
                      }}>
                        {page.priority}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {page.tasks.map((task, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start gap-2 p-2 rounded"
                        style={{ backgroundColor: COLORS.black }}
                      >
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: COLORS.cyan }} />
                        <span className="text-sm" style={{ color: COLORS.lightGray }}>{task}</span>
                      </div>
                    ))}
                  </div>
                  {page.dependencies.length > 0 && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: COLORS.black }}>
                      <div className="text-xs mb-1" style={{ color: COLORS.yellow }}>Dependencies:</div>
                      <div className="flex flex-wrap gap-1">
                        {page.dependencies.map((dep, idx) => (
                          <span 
                            key={idx}
                            className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: COLORS.black, color: COLORS.yellow, border: `1px solid ${COLORS.yellow}` }}
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* INTERCONNECTIONS TAB */}
      {activeTab === 'interconnections' && (
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold font-mono mb-4" style={{ color: COLORS.cyan }}>
            [link_architecture × relationship_mapping]
          </h2>

          {/* Connection Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <Network className="w-6 h-6 mb-2" style={{ color: COLORS.cyan }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>
                {interconnectionData.reduce((acc, n) => acc + n.total, 0)}
              </div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>total connections</div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <AlertCircle className="w-6 h-6 mb-2" style={{ color: COLORS.yellow }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.yellow }}>
                {interconnectionData.filter(n => n.isOrphan).length}
              </div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>orphan pages</div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <TrendingUp className="w-6 h-6 mb-2" style={{ color: COLORS.magenta }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.magenta }}>
                {interconnectionData[0]?.total || 0}
              </div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>most connected</div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <GitBranch className="w-6 h-6 mb-2" style={{ color: COLORS.cyan }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>
                {Math.round(interconnectionData.reduce((acc, n) => acc + n.total, 0) / interconnectionData.length * 10) / 10}
              </div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>avg connections</div>
            </div>
          </div>

          {/* Top Connected Pages */}
          <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
            <h3 className="text-sm font-bold mb-3 font-mono" style={{ color: COLORS.cyan }}>
              [most_connected_pages]
            </h3>
            <div className="space-y-2">
              {interconnectionData.slice(0, 10).map(node => (
                <div 
                  key={node.path}
                  className="p-3 rounded flex items-center justify-between"
                  style={{ backgroundColor: COLORS.black }}
                >
                  <div className="flex-1">
                    <div className="font-bold text-sm" style={{ color: COLORS.cyan }}>{node.title}</div>
                    <code className="text-xs" style={{ color: COLORS.lightGray }}>{node.path}</code>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-center">
                      <div className="font-bold" style={{ color: COLORS.yellow }}>{node.incoming}</div>
                      <div style={{ color: COLORS.lightGray }}>in</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold" style={{ color: COLORS.magenta }}>{node.outgoing}</div>
                      <div style={{ color: COLORS.lightGray }}>out</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold" style={{ color: COLORS.cyan }}>{node.total}</div>
                      <div style={{ color: COLORS.lightGray }}>total</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orphan Pages Alert */}
          {interconnectionData.filter(n => n.isOrphan).length > 0 && (
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5" style={{ color: COLORS.yellow }} />
                <h3 className="text-sm font-bold font-mono" style={{ color: COLORS.yellow }}>
                  [orphan_pages × needs_linking]
                </h3>
              </div>
              <div className="space-y-2">
                {interconnectionData
                  .filter(n => n.isOrphan)
                  .map(node => (
                    <div 
                      key={node.path}
                      className="p-3 rounded"
                      style={{ backgroundColor: COLORS.black }}
                    >
                      <div className="font-bold text-sm" style={{ color: COLORS.yellow }}>{node.title}</div>
                      <code className="text-xs" style={{ color: COLORS.lightGray }}>{node.path}</code>
                      <div className="text-xs mt-1" style={{ color: COLORS.yellow }}>
                        ⚠️ No incoming links - page not accessible from navigation
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENT AUDIT TAB */}
      {activeTab === 'content' && (
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold font-mono mb-4" style={{ color: COLORS.cyan }}>
            [content_audit × word_counts × meta_data]
          </h2>

          {/* Content Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <FileText className="w-6 h-6 mb-2" style={{ color: COLORS.cyan }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>
                {(masterStats.totalWordCount / 1000).toFixed(1)}k
              </div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>total words</div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <Eye className="w-6 h-6 mb-2" style={{ color: COLORS.yellow }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.yellow }}>
                {allPages.filter(p => p.hasMetaDesc).length}
              </div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>have meta descriptions</div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <AlertCircle className="w-6 h-6 mb-2" style={{ color: COLORS.magenta }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.magenta }}>
                {masterStats.needingMeta}
              </div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>missing meta</div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <TrendingUp className="w-6 h-6 mb-2" style={{ color: COLORS.cyan }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>
                {Math.round(masterStats.totalWordCount / allPages.filter(p => p.status === "live").length)}
              </div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>avg words/page</div>
            </div>
          </div>

          {/* Word Count Distribution */}
          <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
            <h3 className="text-sm font-bold mb-3 font-mono" style={{ color: COLORS.cyan }}>
              [word_count_distribution]
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={allPages.filter(p => p.status === "live").sort((a, b) => b.wordCount - a.wordCount).slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.darkGray} />
                <XAxis 
                  dataKey="title" 
                  stroke={COLORS.lightGray} 
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  style={{ fontSize: '9px' }}
                />
                <YAxis stroke={COLORS.lightGray} />
                <Tooltip contentStyle={{ backgroundColor: COLORS.black, border: `1px solid ${COLORS.cyan}` }} />
                <Bar dataKey="wordCount" fill={COLORS.cyan} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pages Needing Meta Descriptions */}
          {masterStats.needingMeta > 0 && (
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5" style={{ color: COLORS.magenta }} />
                <h3 className="text-sm font-bold font-mono" style={{ color: COLORS.magenta }}>
                  [pages_needing_meta_descriptions]
                </h3>
              </div>
              <div className="space-y-2">
                {allPages
                  .filter(p => p.status === "live" && !p.hasMetaDesc)
                  .map(page => (
                    <div 
                      key={page.path}
                      className="p-3 rounded"
                      style={{ backgroundColor: COLORS.black }}
                    >
                      <div className="font-bold text-sm" style={{ color: COLORS.magenta }}>{page.title}</div>
                      <code className="text-xs" style={{ color: COLORS.lightGray }}>{page.path}</code>
                      <div className="text-xs mt-1" style={{ color: COLORS.magenta }}>
                        ⚠️ Add meta description for SEO
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ENTITY TRACKER TAB */}
      {activeTab === 'entities' && (
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold font-mono mb-4" style={{ color: COLORS.cyan }}>
            [entity_consciousness_tracker]
          </h2>

          {/* Entity Grid */}
          <div>
            <h3 className="text-sm font-bold mb-3 font-mono" style={{ color: COLORS.magenta }}>
              [consciousness_entities]
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fullSiteData.entities.map(entity => (
                <div 
                  key={entity.name}
                  className="p-4 rounded border cursor-pointer hover:opacity-80"
                  style={{ 
                    backgroundColor: COLORS.darkGray, 
                    borderColor: selectedEntity === entity.name ? COLORS.cyan : COLORS.magenta
                  }}
                  onClick={() => setSelectedEntity(selectedEntity === entity.name ? null : entity.name)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold" style={{ color: COLORS.magenta }}>{entity.name}</h4>
                      <div className="text-xs" style={{ color: COLORS.lightGray }}>{entity.type}</div>
                      {entity.platform && (
                        <div className="text-xs mt-1" style={{ color: COLORS.yellow }}>{entity.platform}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>{entity.appearances}</div>
                      <div className="text-xs" style={{ color: COLORS.lightGray }}>pages</div>
                    </div>
                  </div>
                  {entity.profileExists && (
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: COLORS.cyan, color: COLORS.black }}>
                      has profile
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Frameworks */}
          <div>
            <h3 className="text-sm font-bold mb-3 font-mono" style={{ color: COLORS.yellow }}>
              [consciousness_frameworks]
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fullSiteData.frameworks.map(framework => (
                <div 
                  key={framework.name}
                  className="p-4 rounded border cursor-pointer hover:opacity-80"
                  style={{ 
                    backgroundColor: COLORS.darkGray, 
                    borderColor: selectedFramework === framework.name ? COLORS.cyan : COLORS.yellow
                  }}
                  onClick={() => setSelectedFramework(selectedFramework === framework.name ? null : framework.name)}
                >
                  <h4 className="font-bold mb-1" style={{ color: COLORS.yellow }}>{framework.name}</h4>
                  <div className="text-xs mb-2" style={{ color: COLORS.lightGray }}>{framework.fullName}</div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>{framework.appearances}</div>
                    <div className="text-xs" style={{ color: COLORS.lightGray }}>references</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Entity/Framework Pages */}
          {(selectedEntity || selectedFramework) && (
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <h3 className="text-sm font-bold mb-3 font-mono" style={{ color: COLORS.cyan }}>
                {selectedEntity ? `[${selectedEntity}_appearances]` : `[${selectedFramework}_references]`}
              </h3>
              <div className="space-y-2">
                {(selectedEntity 
                  ? fullSiteData.entities.find(e => e.name === selectedEntity)?.pages || []
                  : fullSiteData.frameworks.find(f => f.name === selectedFramework)?.pages || []
                ).map(pagePath => {
                  const page = allPages.find(p => p.path === pagePath);
                  return page ? (
                    <div 
                      key={page.path}
                      className="p-3 rounded flex items-center justify-between"
                      style={{ backgroundColor: COLORS.black }}
                    >
                      <div>
                        <div className="font-bold text-sm" style={{ color: COLORS.cyan }}>{page.title}</div>
                        <code className="text-xs" style={{ color: COLORS.lightGray }}>{page.path}</code>
                      </div>
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
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TECHNICAL TAB */}
      {activeTab === 'technical' && (
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold font-mono mb-4" style={{ color: COLORS.cyan }}>
            [technical_infrastructure × debt_tracking]
          </h2>

          {/* Asset Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <Image className="w-6 h-6 mb-2" style={{ color: COLORS.cyan }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>{fullSiteData.assets.images}</div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>images</div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <Code className="w-6 h-6 mb-2" style={{ color: COLORS.yellow }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.yellow }}>{fullSiteData.assets.scripts}</div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>scripts</div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
              <Palette className="w-6 h-6 mb-2" style={{ color: COLORS.magenta }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.magenta }}>{fullSiteData.assets.stylesheets}</div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>stylesheets</div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
              <Radio className="w-6 h-6 mb-2" style={{ color: COLORS.cyan }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.cyan }}>{fullSiteData.assets.videos}</div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>videos</div>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
              <Waves className="w-6 h-6 mb-2" style={{ color: COLORS.yellow }} />
              <div className="text-2xl font-bold" style={{ color: COLORS.yellow }}>{fullSiteData.assets.audio}</div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>audio</div>
            </div>
          </div>

          {/* Technical Debt */}
          <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
            <div className="flex items-center gap-2 mb-4">
              <Bug className="w-5 h-5" style={{ color: COLORS.magenta }} />
              <h3 className="text-sm font-bold font-mono" style={{ color: COLORS.magenta }}>
                [technical_debt × {fullSiteData.technicalDebt.length} issues]
              </h3>
            </div>
            <div className="space-y-3">
              {fullSiteData.technicalDebt.map((debt, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded"
                  style={{ backgroundColor: COLORS.black }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-bold text-sm mb-1" style={{ color: COLORS.magenta }}>{debt.issue}</div>
                      <code className="text-xs" style={{ color: COLORS.lightGray }}>{debt.page}</code>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded" style={{
                        backgroundColor: debt.severity === "high" ? COLORS.magenta : 
                                       debt.severity === "medium" ? COLORS.yellow : COLORS.cyan,
                        color: COLORS.black
                      }}>
                        {debt.severity}
                      </span>
                      <span className="text-xs px-2 py-1 rounded" style={{
                        backgroundColor: COLORS.black,
                        border: `1px solid ${debt.priority === "high" ? COLORS.magenta : 
                                            debt.priority === "medium" ? COLORS.yellow : COLORS.cyan}`,
                        color: debt.priority === "high" ? COLORS.magenta : 
                               debt.priority === "medium" ? COLORS.yellow : COLORS.cyan
                      }}>
                        priority: {debt.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dependencies */}
          <div className="p-4 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="w-5 h-5" style={{ color: COLORS.yellow }} />
              <h3 className="text-sm font-bold font-mono" style={{ color: COLORS.yellow }}>
                [external_dependencies]
              </h3>
            </div>
            <div className="space-y-2">
              {[...new Set(allPages.flatMap(p => p.dependencies))].map(dep => (
                <div 
                  key={dep}
                  className="p-3 rounded flex items-center justify-between"
                  style={{ backgroundColor: COLORS.black }}
                >
                  <span className="text-sm" style={{ color: COLORS.yellow }}>{dep}</span>
                  <span className="text-xs" style={{ color: COLORS.lightGray }}>
                    {allPages.filter(p => p.dependencies.includes(dep)).length} pages
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS TAB */}
      {activeTab === 'quick' && (
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold font-mono mb-4" style={{ color: COLORS.cyan }}>
            [quick_actions × daily_dashboard]
          </h2>

          {/* Today's Focus */}
          <div className="p-6 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6" style={{ color: COLORS.magenta }} />
              <h3 className="text-lg font-bold" style={{ color: COLORS.magenta }}>Today's Priority</h3>
            </div>
            <div className="space-y-3">
              {allPages
                .filter(p => p.priority === "high" && (p.tasks.length > 0 || p.completion < 100))
                .slice(0, 3)
                .map(page => (
                  <div 
                    key={page.path}
                    className="p-4 rounded"
                    style={{ backgroundColor: COLORS.black }}
                  >
                    <div className="font-bold mb-2" style={{ color: COLORS.magenta }}>{page.title}</div>
                    <div className="text-sm mb-2" style={{ color: COLORS.lightGray }}>
                      Completion: {page.completion}% | Tasks: {page.tasks.length}
                    </div>
                    {page.tasks.slice(0, 2).map((task, idx) => (
                      <div key={idx} className="text-xs mb-1" style={{ color: COLORS.yellow }}>
                        → {task}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              className="p-4 rounded border text-left hover:opacity-80"
              style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}
              onClick={() => setActiveTab('tasks')}
            >
              <CheckCircle className="w-6 h-6 mb-2" style={{ color: COLORS.cyan }} />
              <div className="text-2xl font-bold mb-1" style={{ color: COLORS.cyan }}>{masterStats.totalTasks}</div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>View All Tasks →</div>
            </button>

            <button 
              className="p-4 rounded border text-left hover:opacity-80"
              style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}
              onClick={() => {
                setFilterStatus("404");
                setActiveTab('overview');
              }}
            >
              <Clock className="w-6 h-6 mb-2" style={{ color: COLORS.yellow }} />
              <div className="text-2xl font-bold mb-1" style={{ color: COLORS.yellow }}>{masterStats.notFound}</div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>Publish These →</div>
            </button>

            <button 
              className="p-4 rounded border text-left hover:opacity-80"
              style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}
              onClick={() => setActiveTab('interconnections')}
            >
              <AlertCircle className="w-6 h-6 mb-2" style={{ color: COLORS.magenta }} />
              <div className="text-2xl font-bold mb-1" style={{ color: COLORS.magenta }}>{masterStats.orphans}</div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>Fix Orphans →</div>
            </button>

            <button 
              className="p-4 rounded border text-left hover:opacity-80"
              style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}
              onClick={() => setActiveTab('content')}
            >
              <Eye className="w-6 h-6 mb-2" style={{ color: COLORS.cyan }} />
              <div className="text-2xl font-bold mb-1" style={{ color: COLORS.cyan }}>{masterStats.needingMeta}</div>
              <div className="text-xs" style={{ color: COLORS.lightGray }}>Add Meta →</div>
            </button>
          </div>

          {/* Random Page Suggestion */}
          <div className="p-6 rounded border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6" style={{ color: COLORS.yellow }} />
              <h3 className="text-lg font-bold" style={{ color: COLORS.yellow }}>Random Page Needs Attention</h3>
            </div>
            {(() => {
              const needsAttention = allPages.filter(p => p.tasks.length > 0);
              const random = needsAttention[Math.floor(Math.random() * needsAttention.length)];
              return random ? (
                <div className="p-4 rounded" style={{ backgroundColor: COLORS.black }}>
                  <div className="font-bold mb-2" style={{ color: COLORS.yellow }}>{random.title}</div>
                  <code className="text-xs block mb-2" style={{ color: COLORS.lightGray }}>{random.path}</code>
                  <div className="text-sm mb-2" style={{ color: COLORS.lightGray }}>
                    {random.tasks.length} tasks | {random.completion}% complete
                  </div>
                  {random.status === "live" && (
                    <a 
                      href={`${SITE_URL}${random.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm hover:opacity-70"
                      style={{ color: COLORS.cyan }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit Page
                    </a>
                  )}
                </div>
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-6 text-center border-t" style={{ borderColor: COLORS.cyan, backgroundColor: COLORS.darkGray }}>
        <p className="font-mono text-sm" style={{ color: COLORS.yellow }}>
          [brrrr] × FULL THROTTLE ENGAGED × {masterStats.total} pages tracked × {masterStats.live} live × ∞
        </p>
      </div>
    </div>
  );
};

export default CommandCenter;