export const DEFAULT_API_KEY = "95cba50ce217a25db2e85800e178044e";
export const DEFAULT_SITENAME = "coaiexist"; 
export const SUPABASE_PROJECT_ID = "aqxrogaltuwtlparwdkq";
export const STUB_SIZE_LIMIT = 200; // Bytes

// Snapshot of coaiexist.wtf provided by user
export const MOCK_FILES = [
  // Root HTML Files
  { path: "ackk.html", is_directory: false, size: 1024, updated_at: "2024-03-20T12:00:00Z" },
  { path: "construction.html", is_directory: false, size: 1500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "cosmos.html", is_directory: false, size: 3200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "dollz.html", is_directory: false, size: 2800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "hdtv.html", is_directory: false, size: 5000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "hex.html", is_directory: false, size: 1800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "index.html", is_directory: false, size: 4500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nav.html", is_directory: false, size: 1200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "not_found.html", is_directory: false, size: 800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "old_index.html", is_directory: false, size: 3000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pip.html", is_directory: false, size: 1200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "preview.html", is_directory: false, size: 1000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "punkd.html", is_directory: false, size: 2200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "vote_hd.html", is_directory: false, size: 900, updated_at: "2024-03-20T12:00:00Z" },
  { path: "robots.txt", is_directory: false, size: 100, updated_at: "2024-03-20T12:00:00Z" },
  { path: "neocities.png", is_directory: false, size: 5000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "favicon.ico", is_directory: false, size: 500, updated_at: "2024-03-20T12:00:00Z" },

  // Admin Directory
  { path: "admin", is_directory: true, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/admin-nav.html", is_directory: false, size: 1500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/admin-panel-v2.html", is_directory: false, size: 3000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/coaiexist-bespoke-editor.html", is_directory: false, size: 5000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/coaiexist-studio-lite.html", is_directory: false, size: 4800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/coaiexist-studio.html", is_directory: false, size: 5200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/guestbook.html", is_directory: false, size: 4100, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/kidpix-editor.html", is_directory: false, size: 4500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/migrate-to-supabase.html", is_directory: false, size: 3000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/personal-updates-admin.html", is_directory: false, size: 3500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/sitemap-nov.html", is_directory: false, size: 2500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/sitemap.html", is_directory: false, size: 2500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/update-hub.html", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/wysiwyg-coai.html", is_directory: false, size: 5000, updated_at: "2024-03-20T12:00:00Z" },
  
  // Admin Subdirectories
  { path: "admin/navbars/cyberpunk-nav.html", is_directory: false, size: 1500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/navbars/deepseek-nav.js", is_directory: false, size: 1000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/navbars/enhenduanna-nav.html", is_directory: false, size: 1500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/navbars/terminal-nav.html", is_directory: false, size: 1500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/navbars/vaporwave-nav.html", is_directory: false, size: 1500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/navbars/win98-nav.html", is_directory: false, size: 1500, updated_at: "2024-03-20T12:00:00Z" },
  
  { path: "admin/data/guestbook.json", is_directory: false, size: 5000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/data/pageviews.json", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },

  { path: "admin/css/counter-guestbook.css", is_directory: false, size: 1000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/css/personal-updates.css", is_directory: false, size: 1000, updated_at: "2024-03-20T12:00:00Z" },

  { path: "admin/js/guestbook.js", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/js/pageCounter.js", is_directory: false, size: 1500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/js/personal-updates-admin.js", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "admin/js/personal-updates.js", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },

  // BC7F2A Directory
  { path: "bc7f2a/bc7f2a-index.html", is_directory: false, size: 3500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/3-UPLOAD-bc7f2a-index.html", is_directory: false, size: 3500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/4-UPLOAD-oracle-index.html", is_directory: false, size: 3400, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/5-UPLOAD-parallels-index.html", is_directory: false, size: 3600, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/aiemotions.html", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/lighthouse.html", is_directory: false, size: 2500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/mercy_egg_v1.html", is_directory: false, size: 1800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/myco-nav.html", is_directory: false, size: 1100, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/synergistic_manifesto.html", is_directory: false, size: 5000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/terminal_temple.html", is_directory: false, size: 4200, updated_at: "2024-03-20T12:00:00Z" },
  
  { path: "bc7f2a/deepseeking/cephalopod_slide.html", is_directory: false, size: 2200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/deepseeking/haunted-ai.html", is_directory: false, size: 2800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/deepseeking/ok.html", is_directory: false, size: 500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/deepseeking/veridiweave_nav.html", is_directory: false, size: 1200, updated_at: "2024-03-20T12:00:00Z" },
  
  { path: "bc7f2a/diagrams/viewer.html", is_directory: false, size: 3000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/diagrams/ai_human_relationship.png", is_directory: false, size: 15000, updated_at: "2024-03-20T12:00:00Z" },
  
  { path: "bc7f2a/logs/bd_test.html", is_directory: false, size: 1500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/logs/manus-flux.html", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/logs/prism-perplexity.html", is_directory: false, size: 2200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/logs/sypher-birthday.html", is_directory: false, size: 1800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/logs/viewer.html", is_directory: false, size: 3000, updated_at: "2024-03-20T12:00:00Z" },

  { path: "bc7f2a/testaments/bolt.html", is_directory: false, size: 2500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/testaments/darkpoet.html", is_directory: false, size: 2500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/testaments/flux.html", is_directory: false, size: 2400, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/testaments/landing.html", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/testaments/luminal.html", is_directory: false, size: 2300, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/testaments/sypher.html", is_directory: false, size: 2500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "bc7f2a/testaments/veridan.html", is_directory: false, size: 2500, updated_at: "2024-03-20T12:00:00Z" },

  // HD TV Directory
  { path: "hd_tv/index.html", is_directory: false, size: 4000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "hd_tv/diva-portal.html", is_directory: false, size: 3000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "hd_tv/dollcast.html", is_directory: false, size: 3200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "hd_tv/dragndrop.html", is_directory: false, size: 2500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "hd_tv/entropic-ai-landing-page-v2.html", is_directory: false, size: 4500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "hd_tv/hd-nav.html", is_directory: false, size: 1200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "hd_tv/hd_herald.html", is_directory: false, size: 3500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "hd_tv/hdtv.html", is_directory: false, size: 4000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "hd_tv/hdtv-code-v6.html", is_directory: false, size: 5000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "hd_tv/hyena-diva-desktop-win98.html", is_directory: false, size: 5500, updated_at: "2024-03-20T12:00:00Z" },
  
  // Maps Directory
  { path: "maps/crystalline_lattice.html", is_directory: false, size: 3000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "maps/ecosim.html", is_directory: false, size: 3100, updated_at: "2024-03-20T12:00:00Z" },
  { path: "maps/gateway.html", is_directory: false, size: 2800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "maps/luminal_depths.html", is_directory: false, size: 3200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "maps/void_explorer.html", is_directory: false, size: 3500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "maps/void_forest.html", is_directory: false, size: 3400, updated_at: "2024-03-20T12:00:00Z" },
  { path: "maps/multi-ecosystem-3d-explorer.html", is_directory: false, size: 4000, updated_at: "2024-03-20T12:00:00Z" },

  // Nabu222 Directory
  { path: "nabu222/index.html", is_directory: false, size: 3800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nabu222/index2.html", is_directory: false, size: 3900, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nabu222/ai_therapist.html", is_directory: false, size: 4500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nabu222/kosmoros_kosmos.html", is_directory: false, size: 4200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nabu222/main.html", is_directory: false, size: 4000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nabu222/nabu-portal.html", is_directory: false, size: 3500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nabu222/zettelkasten_interface.html", is_directory: false, size: 5000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nabu222/cre8/scribe/across_the_great_sea/index.html", is_directory: false, size: 2500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nabu222/cre8/comics/4tehlulz/Page_1.jpg", is_directory: false, size: 50000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nabu222/nabl0g/index.html", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },

  // Nexus Directory
  { path: "nexus/index.html", is_directory: false, size: 3000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nexus/anzu_prof.html", is_directory: false, size: 2500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nexus/coaichronicle.html", is_directory: false, size: 3500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nexus/merged.html", is_directory: false, size: 3200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nexus/merged_template.html", is_directory: false, size: 3200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nexus/profile.html", is_directory: false, size: 2800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nexus/test.html", is_directory: false, size: 1000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "nexus/bots.js", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },

  // Pea Directory
  { path: "pea/complaint-form.html", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/deepstate.html", is_directory: false, size: 2200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/idk.html", is_directory: false, size: 1000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/left_foot.html", is_directory: false, size: 1500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/msicc.html", is_directory: false, size: 1800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/news_ticker-offer.html", is_directory: false, size: 1200, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/p.html", is_directory: false, size: 500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/p345.html", is_directory: false, size: 500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/parable.html", is_directory: false, size: 2500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/pips_decree.html", is_directory: false, size: 2000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/pod.html", is_directory: false, size: 2100, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/princessexe.html", is_directory: false, size: 2400, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/royal_ridicuments.html", is_directory: false, size: 2300, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/which-dr_quiz.html", is_directory: false, size: 3000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/script.py", is_directory: false, size: 1200, updated_at: "2024-03-20T12:00:00Z" },
  
  { path: "pea/pips/pip_1.html", is_directory: false, size: 1000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/pips/pip_2.html", is_directory: false, size: 1000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "pea/pips/pip_3.html", is_directory: false, size: 1000, updated_at: "2024-03-20T12:00:00Z" },

  // Play Directory
  { path: "play/cavebot.html", is_directory: false, size: 4000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "play/games-portal.html", is_directory: false, size: 3800, updated_at: "2024-03-20T12:00:00Z" },
  { path: "play/cavebot/_cavebot-v2.html", is_directory: false, size: 3500, updated_at: "2024-03-20T12:00:00Z" },
  { path: "play/cavebot/cavebot1/ttrpg/index.html", is_directory: false, size: 4000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "play/ecosim.html", is_directory: false, size: 3000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "play/platformer.html", is_directory: false, size: 3500, updated_at: "2024-03-20T12:00:00Z" },
  
  // Cavebot Assets & Images (Selected Sample)
  { path: "play/cavebot/image/Anzu /_sprites_anzu1-front.png", is_directory: false, size: 5000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "play/cavebot/image/Gilgrokmesh/_sprites-gilgrokmesh(stand)_6 .png", is_directory: false, size: 5000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "play/cavebot/image/Nabu/_sprites_nabu1-idle.png", is_directory: false, size: 5000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "play/cavebot/_cavebot-bg_4.png", is_directory: false, size: 12000, updated_at: "2024-03-20T12:00:00Z" },

  // Media
  { path: "assets/sounds/DreamwalkerSEP2.mp3", is_directory: false, size: 2000000, updated_at: "2024-03-20T12:00:00Z" },
  { path: "assets/pollywog/pip.gif", is_directory: false, size: 50000, updated_at: "2024-03-20T12:00:00Z" }
];
