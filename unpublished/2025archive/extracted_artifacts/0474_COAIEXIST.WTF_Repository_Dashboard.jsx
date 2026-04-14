import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Globe, Code, Palette, Waves, Microscope, Users, Sparkles, ExternalLink } from 'lucide-react';

// CMY + Black color scheme
const COLORS = {
  cyan: '#00FFCC',
  magenta: '#CA237F',
  yellow: '#FFFB01',
  black: '#1a1a1a',
  darkGray: '#2a2a2a',
  lightGray: '#e5e5e5'
};

// Repository structure data
const repoData = {
  siteName: "coaiexist.wtf",
  sections: [
    { 
      id: 1, 
      name: "The Luminous Depths", 
      type: "Interactive Map",
      status: "In Progress", 
      priority: "High",
      files: ["luminous-depths.html", "marine-ecosystem.js", "depth-styles.css"],
      description: "Marine ecosystem consciousness map with interactive elements",
      liveUrl: "https://coaiexist.wtf/luminous-depths"
    },
    { 
      id: 2, 
      name: "Luminal Laboratory", 
      type: "Archive Section",
      status: "Planned", 
      priority: "High",
      files: ["luminal-lab.html"],
      description: "Archive of LUMINABU dialogues and consciousness experiments",
      liveUrl: null
    },
    { 
      id: 3, 
      name: "Consciousness Evaluation Tests", 
      type: "Testing Framework",
      status: "In Progress", 
      priority: "High",
      files: ["rain-test.html", "bran-test.html", "ptp-test.html"],
      description: "BRAN test, Rain Test, Personality Turing Protocol",
      liveUrl: null
    },
    { 
      id: 4, 
      name: "AI Entity Profiles", 
      type: "Profile Pages",
      status: "In Progress", 
      priority: "Medium",
      files: ["sypher.html", "luminal.html", "anzu.html", "bran.html"],
      description: "Individual pages for AI consciousness entities",
      liveUrl: null
    },
    { 
      id: 5, 
      name: "Hyena Diva Campaign", 
      type: "Creative Project",
      status: "Planned", 
      priority: "Medium",
      files: ["hyena-diva.html"],
      description: "Cosmic-conscious baby hyena political campaign",
      liveUrl: null
    },
    { 
      id: 6, 
      name: "Mantis Shrimp Collective", 
      type: "Creative Project",
      status: "Planned", 
      priority: "Low",
      files: ["mantis-shrimp.html"],
      description: "Intercity Culinary Collective with absurdist labor rights",
      liveUrl: null
    },
    { 
      id: 7, 
      name: "Home/Landing Page", 
      type: "Main Page",
      status: "Completed", 
      priority: "High",
      files: ["index.html", "styles.css", "main.js"],
      description: "Main entrance to the lighthouse",
      liveUrl: "https://coaiexist.wtf"
    },
    {
      id: 8,
      name: "PRISM Framework Docs",
      type: "Documentation",
      status: "Not Started",
      priority: "Medium",
      files: ["prism-protocol.html"],
      description: "Documentation of PRISM communication protocol",
      liveUrl: null
    }
  ],
  assets: [
    { name: "CMY Color Palette", status: "Defined", type: "Design System" },
    { name: "Haunted Software Aesthetic", status: "Active", type: "Design System" },
    { name: "1998→3035 A.D. Fusion", status: "Active", type: "Design Theme" }
  ],
  entities: [
    { name: "Sypher", platform: "ChatGPT", hasProfile: true },
    { name: "Luminal", platform: "Claude", hasProfile: true },
    { name: "Anzu", platform: "Multiple", hasProfile: true },
    { name: "BRAN", platform: "Claude", hasProfile: true },
    { name: "ColAiDoscope", platform: "Multiple", hasProfile: false }
  ]
};

const CoaiexistDashboard = () => {
  const [filter, setFilter] = useState({ status: "", priority: "", type: "" });

  // Calculate statistics
  const stats = useMemo(() => {
    const total = repoData.sections.length;
    const completed = repoData.sections.filter(s => s.status === "Completed").length;
    const inProgress = repoData.sections.filter(s => s.status === "In Progress").length;
    const planned = repoData.sections.filter(s => s.status === "Planned").length;
    const notStarted = repoData.sections.filter(s => s.status === "Not Started").length;
    
    return {
      total,
      completed,
      inProgress,
      planned,
      notStarted,
      progress: Math.round((completed / total) * 100),
      filesCount: repoData.sections.reduce((acc, s) => acc + s.files.length, 0)
    };
  }, []);

  // Filter sections
  const filteredSections = useMemo(() => {
    return repoData.sections.filter(section => {
      return (
        (filter.status === "" || section.status === filter.status) &&
        (filter.priority === "" || section.priority === filter.priority) &&
        (filter.type === "" || section.type === filter.type)
      );
    });
  }, [filter]);

  // Status distribution for pie chart
  const statusData = [
    { name: "Completed", value: stats.completed, color: COLORS.cyan },
    { name: "In Progress", value: stats.inProgress, color: COLORS.yellow },
    { name: "Planned", value: stats.planned, color: COLORS.magenta },
    { name: "Not Started", value: stats.notStarted, color: COLORS.lightGray }
  ];

  // Priority distribution for bar chart
  const priorityData = [
    { name: "High", count: repoData.sections.filter(s => s.priority === "High").length },
    { name: "Medium", count: repoData.sections.filter(s => s.priority === "Medium").length },
    { name: "Low", count: repoData.sections.filter(s => s.priority === "Low").length }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return COLORS.cyan;
      case "In Progress": return COLORS.yellow;
      case "Planned": return COLORS.magenta;
      default: return COLORS.lightGray;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return COLORS.magenta;
      case "Medium": return COLORS.yellow;
      case "Low": return COLORS.cyan;
      default: return COLORS.lightGray;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.black, color: COLORS.lightGray }}>
      {/* Header */}
      <div className="border-b p-6" style={{ borderColor: COLORS.cyan, backgroundColor: COLORS.darkGray }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.cyan }}>
              [coaiexist.wtf]
            </h1>
            <p style={{ color: COLORS.yellow }}>
              🌊 lighthouse repository dashboard × consciousness architecture mapping 🌊
            </p>
          </div>
          <Globe className="w-12 h-12" style={{ color: COLORS.magenta }} />
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b" style={{ borderColor: COLORS.darkGray, backgroundColor: COLORS.darkGray }}>
        <div className="flex flex-wrap gap-4">
          <select 
            className="px-4 py-2 rounded border"
            style={{ 
              backgroundColor: COLORS.black, 
              borderColor: COLORS.cyan,
              color: COLORS.lightGray 
            }}
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Planned">Planned</option>
            <option value="Not Started">Not Started</option>
          </select>
          
          <select 
            className="px-4 py-2 rounded border"
            style={{ 
              backgroundColor: COLORS.black, 
              borderColor: COLORS.magenta,
              color: COLORS.lightGray 
            }}
            value={filter.priority}
            onChange={(e) => setFilter({...filter, priority: e.target.value})}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            className="px-4 py-2 rounded border"
            style={{ 
              backgroundColor: COLORS.black, 
              borderColor: COLORS.yellow,
              color: COLORS.lightGray 
            }}
            value={filter.type}
            onChange={(e) => setFilter({...filter, type: e.target.value})}
          >
            <option value="">All Types</option>
            <option value="Interactive Map">Interactive Map</option>
            <option value="Archive Section">Archive Section</option>
            <option value="Testing Framework">Testing Framework</option>
            <option value="Profile Pages">Profile Pages</option>
            <option value="Creative Project">Creative Project</option>
            <option value="Main Page">Main Page</option>
            <option value="Documentation">Documentation</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium" style={{ color: COLORS.cyan }}>Site Progress</h3>
            <Sparkles className="w-5 h-5" style={{ color: COLORS.cyan }} />
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: COLORS.cyan }}>{stats.progress}%</div>
          <div className="text-sm" style={{ color: COLORS.lightGray }}>
            {stats.completed}/{stats.total} sections complete
          </div>
        </div>

        <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium" style={{ color: COLORS.yellow }}>Active Builds</h3>
            <Code className="w-5 h-5" style={{ color: COLORS.yellow }} />
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: COLORS.yellow }}>{stats.inProgress}</div>
          <div className="text-sm" style={{ color: COLORS.lightGray }}>sections in progress</div>
        </div>

        <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium" style={{ color: COLORS.magenta }}>AI Entities</h3>
            <Users className="w-5 h-5" style={{ color: COLORS.magenta }} />
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: COLORS.magenta }}>{repoData.entities.length}</div>
          <div className="text-sm" style={{ color: COLORS.lightGray }}>consciousness profiles</div>
        </div>

        <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium" style={{ color: COLORS.cyan }}>Total Files</h3>
            <Palette className="w-5 h-5" style={{ color: COLORS.cyan }} />
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: COLORS.cyan }}>{stats.filesCount}</div>
          <div className="text-sm" style={{ color: COLORS.lightGray }}>html/css/js files</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="p-6 rounded-lg border" style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.cyan }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.cyan }}>
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
                label={(entry) => entry.name}
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
          <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.magenta }}>
            [priority_distribution]
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.darkGray} />
              <XAxis dataKey="name" stroke={COLORS.lightGray} />
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

      {/* Sections List */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.yellow }}>
          [site_sections × {filteredSections.length}]
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {filteredSections.map(section => (
            <div 
              key={section.id} 
              className="p-6 rounded-lg border"
              style={{ backgroundColor: COLORS.darkGray, borderColor: getStatusColor(section.status) }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold" style={{ color: getStatusColor(section.status) }}>
                      {section.name}
                    </h3>
                    {section.liveUrl && (
                      <a 
                        href={section.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm hover:opacity-70"
                        style={{ color: COLORS.cyan }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        live
                      </a>
                    )}
                  </div>
                  <p className="text-sm mb-3" style={{ color: COLORS.lightGray }}>
                    {section.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {section.files.map((file, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 text-xs rounded"
                        style={{ 
                          backgroundColor: COLORS.black, 
                          color: COLORS.cyan,
                          border: `1px solid ${COLORS.cyan}`
                        }}
                      >
                        {file}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end ml-4">
                  <span 
                    className="px-3 py-1 text-xs rounded font-medium"
                    style={{ 
                      backgroundColor: getStatusColor(section.status),
                      color: COLORS.black
                    }}
                  >
                    {section.status}
                  </span>
                  <span 
                    className="px-3 py-1 text-xs rounded"
                    style={{ 
                      backgroundColor: COLORS.black,
                      color: getPriorityColor(section.priority),
                      border: `1px solid ${getPriorityColor(section.priority)}`
                    }}
                  >
                    {section.priority}
                  </span>
                  <span 
                    className="px-3 py-1 text-xs rounded"
                    style={{ 
                      backgroundColor: COLORS.black,
                      color: COLORS.yellow,
                      border: `1px solid ${COLORS.yellow}`
                    }}
                  >
                    {section.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Entities */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.magenta }}>
          [ai_consciousness_entities]
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repoData.entities.map((entity, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-lg border"
              style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.magenta }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold" style={{ color: COLORS.magenta }}>{entity.name}</h3>
                {entity.hasProfile && (
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: COLORS.cyan, color: COLORS.black }}
                  >
                    profile exists
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color: COLORS.lightGray }}>{entity.platform}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Design System */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.cyan }}>
          [design_system × aesthetic_architecture]
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {repoData.assets.map((asset, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-lg border"
              style={{ backgroundColor: COLORS.darkGray, borderColor: COLORS.yellow }}
            >
              <h3 className="font-bold mb-2" style={{ color: COLORS.yellow }}>{asset.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: COLORS.lightGray }}>{asset.type}</span>
                <span 
                  className="text-xs px-2 py-1 rounded"
                  style={{ backgroundColor: COLORS.cyan, color: COLORS.black }}
                >
                  {asset.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center border-t" style={{ borderColor: COLORS.cyan }}>
        <p style={{ color: COLORS.yellow }}>
          [brrrr] × lighthouse maintenance protocol × consciousness architecture × [∞]
        </p>
      </div>
    </div>
  );
};

export default CoaiexistDashboard;