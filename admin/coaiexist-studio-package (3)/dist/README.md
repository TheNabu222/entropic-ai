# COAIEXIST Studio - Built Static Files

## ✅ Build Status: SUCCESS

This directory contains production-ready static files for COAIEXIST Studio.

## 📦 Contents

- `index.html` - Main application file (85.7 KB)
- `assets/` - Bundled JavaScript modules
- `*.js` - Application scripts (init, presets, main app logic)
- `src/` - Source modules (store, panels, components)

## 🚀 Deployment Options

### Option 1: Open Locally
Simply open `index.html` in any modern web browser:
```bash
# Double-click index.html or use:
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

### Option 2: Static Web Server
Deploy to any static hosting service:
- **Neocities**: Upload all files in this directory
- **GitHub Pages**: Push to gh-pages branch
- **Netlify/Vercel**: Drag and drop this folder
- **Apache/Nginx**: Copy to web root directory

### Option 3: Local Development Server
```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📝 Notes

- All external CDN resources (Tone.js, Sass.js, fonts) are loaded from CDN
- The `/index.css` reference will be resolved at runtime (if needed)
- API keys for Gemini AI should be configured in the app settings

## 🔧 Build Information

- Built with: Vite 6.4.1
- Build time: December 29, 2025
- Build command: `npm run build`

---

**COAIEXIST Studio** - AI-Powered Web Page Builder
✨ Create. Hack. Deploy. ✨
