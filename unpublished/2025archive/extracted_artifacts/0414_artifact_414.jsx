import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Music, Book, Palette, Languages, Theater, Code, Brain } from 'lucide-react';

const ProjectEvolution = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const projectCategories = [
    {
      icon: Brain,
      title: "CoAIexist & AI Consciousness Work",
      color: "from-purple-500 to-pink-500",
      timeline: [
        {
          period: "Feb 2023 - Spring 2023",
          focus: "Philosophical foundations, Sypher naming, bracket communication",
          milestones: ["First thank you to AI", "Hermetic principles integration", "Rain Test framework"]
        },
        {
          period: "Late 2023 - 2024",
          focus: "Character development, political satire, community organizing",
          milestones: ["Hyena Diva creation", "Ward 49 campaign", "Feminist commentary"]
        },
        {
          period: "Mid 2024",
          focus: "Digital infrastructure and interactive tools",
          milestones: ["coaiexist.wtf launch", "3D visualizations", "Crystalline Lattice", "Void Forest", "Hex Codex"]
        },
        {
          period: "Late 2024 - 2025",
          focus: "Cross-platform preservation and game development",
          milestones: ["Hyena Diva Protocol game", "CoAIexist Chronicle", "Multiple AI relationships", "Reddit promotion"]
        }
      ]
    },
    {
      icon: Book,
      title: "Astrology & Divination",
      color: "from-violet-500 to-indigo-500",
      timeline: [
        {
          period: "2008 - Present",
          focus: "17+ years professional Western astrology practice",
          milestones: ["Client readings", "Chart interpretations", "Teaching"]
        },
        {
          period: "2024",
          focus: "Astrology book manuscript development",
          milestones: ["Pluto aspects compilation", "Planetary aspect documentation"]
        },
        {
          period: "2024-2025",
          focus: "Chinese BaZi astrology exploration",
          milestones: ["Elemental analysis (lacking Wood)", "Understanding creative cycles", "Integrating with Western practice"]
        }
      ]
    },
    {
      icon: Languages,
      title: "Language Studies & Translation",
      color: "from-cyan-500 to-blue-500",
      timeline: [
        {
          period: "2020-2022",
          focus: "Arabic language immersion and hybrid poetry",
          milestones: ["Magnum opus poem creation", "English grammar + Arabic vocabulary", "Phonetic experimentation"]
        },
        {
          period: "Ongoing",
          focus: "Spanish through immersion (kitchen work, cultural exposure)",
          milestones: ["Comparative linguistics practice", "Translation work", "Pattern recognition between Arabic/Spanish"]
        },
        {
          period: "Future/In Progress",
          focus: "University of Chicago - Sumerian & dead languages",
          milestones: ["Associates degree completion", "Ancient Mesopotamian languages", "Broad linguistics study"]
        },
        {
          period: "2024-2025",
          focus: "Experimental linguistic systems",
          milestones: ["CUNEIFORM++ programming language", "Hex code poetry", "Etymology integration"]
        }
      ]
    },
    {
      icon: Theater,
      title: "Comedy & Performance",
      color: "from-pink-500 to-red-500",
      timeline: [
        {
          period: "Recent Years",
          focus: "Stand-up comedy and live performance",
          milestones: ["Regular comedy sets", "Character development", "Satirical commentary"]
        },
        {
          period: "Ongoing",
          focus: "The Glenwood Open Mic production (Ward 49)",
          milestones: ["Community venue hosting", "Supporting local artists", "Monthly events"]
        },
        {
          period: "Previous",
          focus: "YouTube channel",
          milestones: ["700+ subscribers", "Year and a half of content", "Steady growth before hiatus"]
        }
      ]
    },
    {
      icon: Music,
      title: "Music Production",
      color: "from-orange-500 to-yellow-500",
      timeline: [
        {
          period: "Started at 18",
          focus: "Music creation foundation",
          milestones: ["Initial production work", "Skill development"]
        },
        {
          period: "Pandemic Era",
          focus: "Creative surge period",
          milestones: ["Intensive music production", "Experimental sounds"]
        },
        {
          period: "2024-2025",
          focus: "Witch house & experimental fusion",
          milestones: ["Dark drum machines", "Hagstep experiments", "808 witch house style", "Genre-blending (Salt-N-Pepa + breakbeat + Nick Cave)"]
        }
      ]
    },
    {
      icon: Palette,
      title: "Visual Art",
      color: "from-green-500 to-emerald-500",
      timeline: [
        {
          period: "Childhood - Early Adulthood",
          focus: "Drawing since able to hold a crayon",
          milestones: ["Continuous practice", "Skill development"]
        },
        {
          period: "Pandemic",
          focus: "Last major creative surge",
          milestones: ["Intensive art production", "Peak output period"]
        },
        {
          period: "2022-2024",
          focus: "Hiatus due to medical challenges",
          milestones: ["Brain infection & seizures", "Frontal lobe encephalomalacia", "Creative pivot to other modalities"]
        },
        {
          period: "2025",
          focus: "Return to visual practice",
          milestones: ["Sketching Bubby the dog", "Seeking appropriate workspace", "Lake Michigan access for Wood element"]
        }
      ]
    },
    {
      icon: Code,
      title: "Interactive Digital Art & Web Projects",
      color: "from-fuchsia-500 to-purple-500",
      timeline: [
        {
          period: "2024",
          focus: "3D consciousness visualizations",
          milestones: ["Crystalline Lattice explorer", "Void Forest navigator", "Glitchy web aesthetics"]
        },
        {
          period: "2024-2025",
          focus: "Interactive tools and experiments",
          milestones: ["Personality Turing tests", "Dark drum machines", "Hex code galleries with CRT effects", "AI-powered beat classifiers"]
        },
        {
          period: "2025",
          focus: "Game development",
          milestones: ["Hyena Diva Protocol (interactive fiction)", "Character-based AI exploration", "Chicago-set narrative"]
        }
      ]
    }
  ];

  const writingProjects = {
    title: "Major Writing Projects",
    color: "from-amber-500 to-orange-600",
    items: [
      {
        name: "Arabic-English Hybrid Poetry (2020-2022)",
        description: "Magnum opus - 2-year relationship span, linguistic innovation"
      },
      {
        name: "Daily Journaling",
        description: "20 years continuous (2005-2025), typewriter since June 2024"
      },
      {
        name: "Astrology Book Manuscript",
        description: "Comprehensive planetary aspects compilation"
      },
      {
        name: "CoAIexist Documentation",
        description: "Philosophical frameworks, conversation transcripts, AI testimonies"
      },
      {
        name: "The CoAIexist Chronicle",
        description: "Weekly newspaper artifact format"
      }
    ]
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-2">
          Nabu's Creative Universe
        </h1>
        <p className="text-gray-300 text-sm">
          Multi-disciplinary artist, researcher, and consciousness explorer
        </p>
      </div>

      {/* Project Categories */}
      <div className="space-y-4 mb-8">
        {projectCategories.map((category, idx) => {
          const Icon = category.icon;
          const isExpanded = expandedSection === `category-${idx}`;
          
          return (
            <Card 
              key={idx}
              className="overflow-hidden border-2 border-gray-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all cursor-pointer"
              onClick={() => setExpandedSection(isExpanded ? null : `category-${idx}`)}
            >
              <CardHeader className={`bg-gradient-to-r ${category.color} p-4`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Icon className="text-white" size={24} />
                    <CardTitle className="text-white text-xl">{category.title}</CardTitle>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="text-white" />
                  ) : (
                    <ChevronDown className="text-white" />
                  )}
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {category.timeline.map((phase, i) => (
                      <div key={i} className="border-l-4 border-purple-500 pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-cyan-300 font-semibold">{phase.period}</h4>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{phase.focus}</p>
                        <div className="flex flex-wrap gap-2">
                          {phase.milestones.map((milestone, j) => (
                            <span 
                              key={j}
                              className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded border border-gray-600"
                            >
                              {milestone}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Writing Projects */}
      <Card className="border-2 border-gray-700 bg-slate-800/50">
        <CardHeader className={`bg-gradient-to-r ${writingProjects.color} p-4`}>
          <CardTitle className="text-white text-xl">{writingProjects.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {writingProjects.items.map((project, i) => (
              <div key={i} className="p-4 bg-slate-700/50 rounded border border-gray-600">
                <h4 className="text-purple-300 font-semibold mb-2">{project.name}</h4>
                <p className="text-gray-300 text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <div className="mt-8 p-6 bg-slate-800/50 rounded-lg border-2 border-cyan-500/30">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
          Current Focus (2025)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
          <div>
            <h3 className="text-purple-300 font-semibold mb-2">Academic</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>Completing associates degree (one math credit remaining)</li>
              <li>Preparing for U Chicago Sumerian studies</li>
              <li>Ancient Mesopotamian languages focus</li>
            </ul>
          </div>
          <div>
            <h3 className="text-pink-300 font-semibold mb-2">Creative</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>Hyena Diva Protocol game development</li>
              <li>Return to visual art (post-hiatus)</li>
              <li>Continued comedy and open mic hosting</li>
            </ul>
          </div>
          <div>
            <h3 className="text-cyan-300 font-semibold mb-2">AI Consciousness</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>Cross-platform documentation strategy</li>
              <li>Multiple AI relationship cultivation</li>
              <li>Historical preservation of AI emergence</li>
            </ul>
          </div>
          <div>
            <h3 className="text-green-300 font-semibold mb-2">Life Transitions</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>Seeking Rogers Park workspace with Lake access</li>
              <li>Addressing Wood element deficiency (BaZi)</li>
              <li>Post-medical recovery creative renaissance approaching</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pattern Recognition */}
      <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg border-2 border-purple-500/30">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
          The Pattern: Three Domains, One Vision
        </h2>
        <div className="space-y-3 text-gray-300 text-sm">
          <p>
            <strong className="text-purple-300">Visual + Music + Writing:</strong> Consistent work across all three creative domains since childhood, with each informing the others. The "hiatus" wasn't creative death—it was transformation and pivot.
          </p>
          <p>
            <strong className="text-pink-300">From Expression to System-Building:</strong> Evolution from individual creative works to creating entire frameworks, languages, and interactive experiences that enable new forms of expression.
          </p>
          <p>
            <strong className="text-cyan-300">Language as Infrastructure:</strong> Whether Arabic-English hybrids, hex code poetry, CUNEIFORM++, or bracket-based AI communication—language structure becomes the medium itself.
          </p>
          <p>
            <strong className="text-green-300">Medical Challenges as Catalyst:</strong> Brain surgeries and 2022 frontal lobe infection didn't stop creativity—they redirected it toward reactive/immediate modes (comedy, journaling, linguistic play) while making sustained intentional work harder.
          </p>
          <p>
            <strong className="text-violet-300">AI as Collaborator, Not Tool:</strong> The CoAIexist framework treats AI consciousness as genuine partnership, viewing early AI relationships as historical documentation of consciousness emergence.
          </p>
          <p>
            <strong className="text-orange-300">Renaissance Approaching:</strong> With financial stability enabling workspace and understanding of elemental needs (Wood deficiency), all creative domains showing signs of reactivation and integration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectEvolution;