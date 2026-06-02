/* ===== ASSET OPTIMIZATION TOOLS ===== */
const AssetTools = {

  // Convert PNG/other to WebP
  async convertToWebP(asset, quality = 0.85) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const webpURL = canvas.toDataURL('image/webp', quality);
        asset.dataURL = webpURL;
        asset.name = asset.name.replace(/\.[^.]+$/, '') + '_webp';
        resolve(asset);
      };
      img.src = asset.dataURL;
    });
  },

  // Batch convert all to WebP
  async batchConvertWebP(assets, quality = 0.85) {
    let count = 0;
    for (const asset of assets) {
      await this.convertToWebP(asset, quality);
      count++;
    }
    return count;
  },

  // Resize asset to specific dimensions
  async resize(asset, targetW, targetH, maintainAspect = true) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let w = targetW, h = targetH;
        if (maintainAspect) {
          const ratio = img.naturalWidth / img.naturalHeight;
          if (w / h > ratio) { w = Math.round(h * ratio); }
          else { h = Math.round(w / ratio); }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // Pixel art friendly
        ctx.drawImage(img, 0, 0, w, h);
        asset.dataURL = canvas.toDataURL('image/png');
        asset.width = w;
        asset.height = h;
        resolve(asset);
      };
      img.src = asset.dataURL;
    });
  },

  // Force icons to specific size
  async forceIconSize(assets, size = 64) {
    let count = 0;
    for (const asset of assets) {
      if (asset.category === 'Icon' || asset.width <= 128) {
        await this.resize(asset, size, size, false);
        count++;
      }
    }
    return count;
  },

  // Trim transparent margins
  async trimTransparent(asset) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = data.data;

        let top = canvas.height, bottom = 0, left = canvas.width, right = 0;

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const alpha = pixels[(y * canvas.width + x) * 4 + 3];
            if (alpha > 10) {
              if (y < top) top = y;
              if (y > bottom) bottom = y;
              if (x < left) left = x;
              if (x > right) right = x;
            }
          }
        }

        if (top >= bottom || left >= right) {
          resolve(asset); // All transparent or single pixel
          return;
        }

        // Add 1px margin
        top = Math.max(0, top - 1);
        left = Math.max(0, left - 1);
        bottom = Math.min(canvas.height - 1, bottom + 1);
        right = Math.min(canvas.width - 1, right + 1);

        const trimW = right - left + 1;
        const trimH = bottom - top + 1;
        const trimCanvas = document.createElement('canvas');
        trimCanvas.width = trimW;
        trimCanvas.height = trimH;
        const trimCtx = trimCanvas.getContext('2d');
        trimCtx.drawImage(canvas, left, top, trimW, trimH, 0, 0, trimW, trimH);

        asset.dataURL = trimCanvas.toDataURL('image/png');
        asset.width = trimW;
        asset.height = trimH;
        resolve(asset);
      };
      img.src = asset.dataURL;
    });
  },

  // Detect duplicate assets
  findDuplicates(assets) {
    const dupes = [];
    const seen = new Map();

    for (const asset of assets) {
      // Hash based on name similarity and dimensions
      const nameKey = asset.name.toLowerCase()
        .replace(/copy_of_|copy of |_\(\d+\)|\(\d+\)|\s*-\s*copy/gi, '')
        .replace(/[^a-z0-9]/g, '');
      const dimKey = `${asset.width}x${asset.height}`;
      const key = `${nameKey}_${dimKey}`;

      if (seen.has(key)) {
        dupes.push({
          original: seen.get(key),
          duplicate: asset,
          reason: 'Similar name and dimensions'
        });
      } else {
        seen.set(key, asset);
      }
    }

    // Also check for exact dataURL matches
    const urlMap = new Map();
    for (const asset of assets) {
      // Use first 200 chars of dataURL as fingerprint (faster than full compare)
      const fp = asset.dataURL.slice(0, 200);
      if (urlMap.has(fp)) {
        const existing = dupes.find(d => d.duplicate.id === asset.id);
        if (!existing) {
          dupes.push({
            original: urlMap.get(fp),
            duplicate: asset,
            reason: 'Identical image data'
          });
        }
      } else {
        urlMap.set(fp, asset);
      }
    }

    return dupes;
  },

  // Sprite sheet slicer
  async sliceSpriteSheet(asset, cols, rows) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const frameW = Math.floor(img.naturalWidth / cols);
        const frameH = Math.floor(img.naturalHeight / rows);
        const frames = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const canvas = document.createElement('canvas');
            canvas.width = frameW;
            canvas.height = frameH;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, c * frameW, r * frameH, frameW, frameH, 0, 0, frameW, frameH);

            // Check if frame is not entirely transparent
            const data = ctx.getImageData(0, 0, frameW, frameH).data;
            let hasContent = false;
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] > 10) { hasContent = true; break; }
            }

            if (hasContent) {
              frames.push({
                id: Utils.uid(),
                name: `${asset.name}_frame_${r * cols + c}`,
                dataURL: canvas.toDataURL('image/png'),
                width: frameW,
                height: frameH,
                category: 'Sprite',
                tags: ['sliced', 'frame'],
                sourceAsset: asset.id,
              });
            }
          }
        }

        resolve(frames);
      };
      img.src = asset.dataURL;
    });
  },

  // Generate placeholder
  generatePlaceholder(label, width = 128, height = 128, color = '#333') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // Diagonal lines
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#aaa';
    ctx.font = `${Math.min(14, width / 8)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label || 'PLACEHOLDER', width / 2, height / 2);

    return {
      id: Utils.uid(),
      name: Utils.sanitizeName(label || 'placeholder'),
      dataURL: canvas.toDataURL('image/png'),
      width,
      height,
      category: 'UI',
      tags: ['placeholder'],
      needsAttention: true,
    };
  },

  // Smart bulk rename
  generateRenames(assets) {
    const renames = [];
    const counter = {};

    for (const asset of assets) {
      const type = (asset.category || 'asset').toLowerCase().replace(/\s+/g, '_');
      const baseName = asset.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .replace(/^(img|image|screenshot|untitled|copy_of_copy_of|copy_of|copy)_?/i, '');

      let newName;
      if (baseName && baseName.length > 2) {
        newName = `${type}_${baseName}`;
      } else {
        counter[type] = (counter[type] || 0) + 1;
        newName = `${type}_${String(counter[type]).padStart(2, '0')}`;
      }

      // If AI suggested a name, prefer that
      if (asset.suggestedName && asset.suggestedName.length > 3) {
        newName = asset.suggestedName;
      }

      renames.push({
        asset,
        oldName: asset.name,
        newName: newName,
      });
    }

    return renames;
  },

  // Apply renames
  applyRenames(renames) {
    for (const r of renames) {
      r.asset.name = r.newName;
    }
    Assets.render();
    AssetManager.render();
    State.autoSave();
  },

  // Generate markdown manifest
  generateManifest(assets) {
    let md = `# Asset Manifest\n\n`;
    md += `Generated: ${new Date().toISOString()}\n`;
    md += `Total assets: ${assets.length}\n\n`;

    // Group by category
    const categories = {};
    for (const a of assets) {
      const cat = a.category || 'Unsorted';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(a);
    }

    for (const [cat, items] of Object.entries(categories).sort()) {
      md += `## ${cat} (${items.length})\n\n`;
      md += `| Name | Dimensions | Tags | Description |\n`;
      md += `|------|-----------|------|-------------|\n`;
      for (const item of items) {
        const tags = (item.tags || []).join(', ');
        const desc = (item.vibeDescription || '').replace(/\|/g, '\\|');
        md += `| ${item.name} | ${item.width}×${item.height} | ${tags} | ${desc} |\n`;
      }
      md += '\n';
    }

    // Lore entries
    const withLore = assets.filter(a => a.lore);
    if (withLore.length > 0) {
      md += `## Lore Entries\n\n`;
      for (const a of withLore) {
        md += `### ${a.name}\n${a.lore}\n\n`;
      }
    }

    return md;
  },

  // Get asset usage across scenes
  getAssetUsage(assetId) {
    const usage = [];
    for (const scene of State.project.scenes) {
      const objs = scene.objects.filter(o => o.assetId === assetId);
      if (objs.length > 0) {
        usage.push({ scene, count: objs.length });
      }
    }
    return usage;
  }
};
