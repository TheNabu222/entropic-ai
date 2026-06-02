/* ===== AI ASSET ANALYSIS MODULE ===== */
const AIAnalysis = {
  analyzing: false,
  queue: [],
  processed: 0,
  total: 0,
  apiKey: null,

  init() {
    // Try to get API key from environment or localStorage
    this.apiKey = localStorage.getItem('anzu_abacus_api_key') || null;
  },

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('anzu_abacus_api_key', key);
  },

  // Analyze a single asset using canvas-based color extraction + heuristics
  async analyzeAsset(asset) {
    const results = {
      vibeDescription: '',
      detectedType: 'Unsorted',
      colorPalette: [],
      suggestedTags: [],
      suggestedName: '',
    };

    try {
      // Extract color palette from image
      results.colorPalette = await this._extractPalette(asset.dataURL);

      // Detect content type based on dimensions and colors
      results.detectedType = this._detectType(asset);

      // Generate vibe description
      results.vibeDescription = this._generateVibe(asset, results.colorPalette, results.detectedType);

      // Suggest tags
      results.suggestedTags = this._suggestTags(asset, results);

      // Suggest name
      results.suggestedName = this._suggestName(asset, results);
    } catch(err) {
      console.warn('Analysis failed for:', asset.name, err);
    }

    return results;
  },

  // Try AI-powered analysis via Abacus.AI
  async analyzeWithAI(asset) {
    if (!this.apiKey) {
      return this.analyzeAsset(asset); // Fallback to local
    }

    try {
      // Call Abacus.AI vision endpoint
      const response = await fetch('https://api.abacus.ai/api/v0/describeImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          image: asset.dataURL,
          prompt: `Analyze this game asset image. Provide: 1) A one-sentence "vibe" description, 2) Content type (Background, Sprite, UI, Icon, Inventory, Tileset, Effect, or Other), 3) Five relevant tags, 4) A descriptive filename suggestion. Format as JSON with keys: vibe, type, tags, suggestedName`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          try {
            const parsed = JSON.parse(data.result);
            return {
              vibeDescription: parsed.vibe || '',
              detectedType: parsed.type || 'Unsorted',
              colorPalette: await this._extractPalette(asset.dataURL),
              suggestedTags: parsed.tags || [],
              suggestedName: parsed.suggestedName || '',
            };
          } catch(e) {
            // If not JSON, use as vibe description
            return {
              vibeDescription: data.result,
              detectedType: this._detectType(asset),
              colorPalette: await this._extractPalette(asset.dataURL),
              suggestedTags: this._suggestTags(asset, {}),
              suggestedName: '',
            };
          }
        }
      }
    } catch(err) {
      console.warn('AI analysis fallback to local:', err);
    }

    // Fallback to local analysis
    return this.analyzeAsset(asset);
  },

  // Bulk analyze all assets
  async bulkAnalyze(useAI = false) {
    if (this.analyzing) return;
    this.analyzing = true;
    const assets = State.project.assets.filter(a => !a.aiAnalyzed);
    this.total = assets.length;
    this.processed = 0;
    this.queue = [...assets];

    AssetManager.updateAIStatus('analyzing', `Analyzing 0/${this.total}...`);

    for (const asset of this.queue) {
      if (!this.analyzing) break; // Allow cancel

      const results = useAI ? await this.analyzeWithAI(asset) : await this.analyzeAsset(asset);

      // Apply results
      asset.vibeDescription = results.vibeDescription || asset.vibeDescription;
      asset.category = results.detectedType || asset.category || 'Unsorted';
      asset.colorPalette = results.colorPalette || [];
      asset.suggestedTags = results.suggestedTags || [];
      asset.suggestedName = results.suggestedName || '';
      asset.aiAnalyzed = true;

      // Merge suggested tags into existing tags
      if (!asset.tags) asset.tags = [];
      for (const tag of results.suggestedTags) {
        if (!asset.tags.includes(tag)) asset.tags.push(tag);
      }

      this.processed++;
      AssetManager.updateAIStatus('analyzing', `Analyzing ${this.processed}/${this.total}...`);
      AssetManager.render();

      // Small delay to not freeze UI
      await new Promise(r => setTimeout(r, 50));
    }

    this.analyzing = false;
    AssetManager.updateAIStatus('done', `Analysis complete: ${this.processed} assets`);
    State.autoSave();
    Toast.show(`Analyzed ${this.processed} assets`, 'success');
  },

  cancelAnalysis() {
    this.analyzing = false;
    AssetManager.updateAIStatus('idle', 'Analysis cancelled');
  },

  // --- Local analysis helpers ---
  async _extractPalette(dataURL, numColors = 6) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 64; // Sample at small size for speed
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Simple color quantization
        const colorMap = {};
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue; // Skip transparent
          // Quantize to reduce colors
          const r = Math.round(data[i] / 32) * 32;
          const g = Math.round(data[i + 1] / 32) * 32;
          const b = Math.round(data[i + 2] / 32) * 32;
          const key = `${r},${g},${b}`;
          colorMap[key] = (colorMap[key] || 0) + 1;
        }

        // Sort by frequency
        const sorted = Object.entries(colorMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, numColors)
          .map(([key]) => {
            const [r, g, b] = key.split(',').map(Number);
            return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
          });

        resolve(sorted);
      };
      img.onerror = () => resolve([]);
      img.src = dataURL;
    });
  },

  _detectType(asset) {
    const { width, height, name } = asset;
    const ratio = width / height;
    const n = (name || '').toLowerCase();

    // Name-based detection
    if (n.includes('bg') || n.includes('background') || n.includes('backdrop')) return 'Background';
    if (n.includes('sprite') || n.includes('char') || n.includes('npc') || n.includes('player')) return 'Sprite';
    if (n.includes('icon') || n.includes('btn') || n.includes('button')) return 'Icon';
    if (n.includes('ui') || n.includes('frame') || n.includes('panel') || n.includes('hud')) return 'UI';
    if (n.includes('item') || n.includes('inventory') || n.includes('weapon') || n.includes('potion')) return 'Inventory';
    if (n.includes('tile') || n.includes('tileset') || n.includes('tilemap')) return 'Tileset';
    if (n.includes('effect') || n.includes('fx') || n.includes('particle')) return 'Effect';

    // Dimension-based detection
    if (ratio > 1.5 && width > 400) return 'Background';
    if (width <= 64 && height <= 64) return 'Icon';
    if (width === height && width <= 128) return 'Icon';
    if (ratio > 0.7 && ratio < 1.3 && width <= 256) return 'Sprite';
    if (width > 500 && height > 500 && width === height) return 'Tileset';

    return 'Unsorted';
  },

  _generateVibe(asset, palette, type) {
    const moods = [];

    // Analyze palette mood
    if (palette.length > 0) {
      const avgBrightness = palette.reduce((sum, hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return sum + (r + g + b) / 3;
      }, 0) / palette.length;

      if (avgBrightness < 60) moods.push('dark', 'moody');
      else if (avgBrightness < 120) moods.push('atmospheric');
      else if (avgBrightness < 180) moods.push('warm');
      else moods.push('bright', 'vivid');

      // Check for dominant color hues
      const dominant = palette[0];
      const r = parseInt(dominant.slice(1, 3), 16);
      const g = parseInt(dominant.slice(3, 5), 16);
      const b = parseInt(dominant.slice(5, 7), 16);

      if (r > g && r > b) moods.push('warm-toned');
      else if (g > r && g > b) moods.push('natural');
      else if (b > r && b > g) moods.push('cool');
      if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) moods.push('neutral');
    }

    const typeDesc = {
      'Background': 'A scene background',
      'Sprite': 'A character or entity sprite',
      'Icon': 'A small icon or symbol',
      'UI': 'A UI element or interface piece',
      'Inventory': 'An inventory or item graphic',
      'Tileset': 'A tileset or tile graphic',
      'Effect': 'A visual effect',
      'Unsorted': 'An unclassified asset',
    };

    const base = typeDesc[type] || typeDesc['Unsorted'];
    const mood = moods.slice(0, 2).join(', ');
    const name = asset.name.replace(/[_-]/g, ' ');

    return `${base} with ${mood || 'mixed'} tones — "${name}" (${asset.width}×${asset.height})`;
  },

  _suggestTags(asset, results) {
    const tags = [];
    const n = (asset.name || '').toLowerCase();

    // From detected type
    if (results.detectedType) tags.push(results.detectedType.toLowerCase());

    // From name keywords
    const keywords = n.replace(/[_\-\.]/g, ' ').split(/\s+/);
    for (const kw of keywords) {
      if (kw.length > 2 && !tags.includes(kw)) {
        tags.push(kw);
      }
    }

    // From palette analysis
    if (results.colorPalette?.length > 0) {
      const dominant = results.colorPalette[0];
      const r = parseInt(dominant.slice(1, 3), 16);
      const g = parseInt(dominant.slice(3, 5), 16);
      const b = parseInt(dominant.slice(5, 7), 16);
      const brightness = (r + g + b) / 3;
      if (brightness < 80) tags.push('#dark');
      if (r > 180 && g < 100) tags.push('#red');
      if (g > 150 && r < 100 && b < 100) tags.push('#green');
      if (b > 150 && r < 100) tags.push('#blue');
      if (r > 150 && g > 100 && b < 80) tags.push('#golden');
    }

    // Size-based
    if (asset.width <= 32 || asset.height <= 32) tags.push('#tiny');
    if (asset.width >= 512 || asset.height >= 512) tags.push('#large');

    return [...new Set(tags)].slice(0, 8);
  },

  _suggestName(asset, results) {
    const type = (results.detectedType || 'asset').toLowerCase().replace(/\s+/g, '_');
    const name = asset.name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toLowerCase();

    // Remove generic prefixes
    let clean = name
      .replace(/^(img|image|screenshot|untitled|copy_of_copy|copy_of)_?/i, '')
      .replace(/_+$/,'');

    if (!clean || clean.length < 2) clean = type;

    return `${type}_${clean}`;
  },

  // Visual search - find assets matching a description
  visualSearch(query, assets) {
    if (!query) return assets;
    const q = query.toLowerCase();
    return assets.filter(a => {
      const searchable = [
        a.name,
        a.vibeDescription,
        a.category,
        ...(a.tags || []),
        a.lore,
      ].filter(Boolean).join(' ').toLowerCase();
      return searchable.includes(q);
    }).sort((a, b) => {
      // Prioritize matches in name, then vibe, then tags
      const aScore = (a.name?.toLowerCase().includes(q) ? 10 : 0) +
                     (a.vibeDescription?.toLowerCase().includes(q) ? 5 : 0) +
                     ((a.tags || []).some(t => t.toLowerCase().includes(q)) ? 3 : 0);
      const bScore = (b.name?.toLowerCase().includes(q) ? 10 : 0) +
                     (b.vibeDescription?.toLowerCase().includes(q) ? 5 : 0) +
                     ((b.tags || []).some(t => t.toLowerCase().includes(q)) ? 3 : 0);
      return bScore - aScore;
    });
  }
};
