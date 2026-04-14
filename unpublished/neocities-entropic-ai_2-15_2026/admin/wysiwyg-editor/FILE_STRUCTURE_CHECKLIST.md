# 📁 WYSIWYG Editor - File Structure Checklist

## ✅ Required Files (All in `/admin/` folder)

### Main HTML File
```
📄 wysiwyg-coai.html (138KB)
   ↳ The main WYSIWYG editor interface
   ↳ Must load the 3 enhancement scripts below
```

### Enhancement JavaScript Files (loaded by wysiwyg-coai.html)
```
⚡ wysiwyg-enhancements.js (23KB)
   ↳ Bulma components (24 components)
   ↳ RTF formatting toolbar
   ↳ Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)

📚 page-loader-and-components.js (17KB)
   ↳ Page loader (14 source pages)
   ↳ Component library system
   ↳ Import/export components

🚀 neocities-deploy-pro.js (25KB)
   ↳ Neocities API integration
   ↳ Auto-deploy system
   ↳ File browser & deployment history
```

## 🔗 How They Connect

```
wysiwyg-coai.html
   │
   ├─── <script src="wysiwyg-enhancements.js"></script>
   ├─── <script src="page-loader-and-components.js"></script>
   └─── <script src="neocities-deploy-pro.js"></script>
```

All 3 enhancement files MUST be in the same folder as `wysiwyg-coai.html`

## ✅ Verification Commands

Run these to verify everything is in place:

```bash
cd /home/user/entropic-ai/admin

# Check all required files exist
ls -lh wysiwyg-coai.html \
       wysiwyg-enhancements.js \
       page-loader-and-components.js \
       neocities-deploy-pro.js

# Verify script tags are in the HTML
grep -E "(wysiwyg-enhancements|page-loader-and-components|neocities-deploy-pro)" wysiwyg-coai.html

# Syntax check all JS files
node -c wysiwyg-enhancements.js && \
node -c page-loader-and-components.js && \
node -c neocities-deploy-pro.js && \
echo "✅ All JavaScript files valid!"
```

## 🎯 What Each File Does

### wysiwyg-enhancements.js
- **Bulma Hero** - Gradient hero sections
- **Bulma Navbar** - Navigation bars
- **Bulma Card** - Card components
- **Bulma Forms** - Input, textarea, select, checkbox, radio
- **RTF Toolbar** - Bold, italic, underline, align, lists, colors
- **16 UI Components + 8 Form Components**

### page-loader-and-components.js
- **Load Pages**: index.html, construction.html, cosmos.html, hdtv.html, hex.html, guestbook.html, cavebot.html, punkd.html, vote_hd.html, pip.html, dollz.html, not_found.html, explore.html, ackk.html
- **Save Components**: Select any element → Save as Component
- **Component Library**: Reuse saved components across pages
- **Export/Import**: Share component libraries

### neocities-deploy-pro.js
- **API Configuration**: Save Neocities API key
- **Deploy**: Push current page to Neocities
- **Auto-Deploy**: Automatic deployment on changes (3s debounce)
- **File Browser**: View/delete remote files
- **Site Stats**: View hits, creation date, last update
- **Deployment History**: Last 20 deployments tracked

## 🚦 Current Status

✅ All files present in `/admin/`
✅ Script tags added to wysiwyg-coai.html (lines 1837-1839)
✅ All syntax validated
✅ Bugs fixed:
   - Auto-deploy detection (now uses HTML comparison)
   - insertImage() logic fixed
   - Defensive null checks added
✅ All commits pushed to: `claude/check-a-01EgE12Sg6Qd7uqY2Doy7P97`

## 🎮 How to Use

1. Open `/admin/wysiwyg-coai.html` in your browser
2. You'll see new buttons in the toolbar:
   - 📄 **Load Page** - Load from source files
   - 💎 **Components** - Access component library
   - 🚀 **Deploy to Neocities** - Deployment center
3. Use existing WYSIWYG features + new enhancements
4. Deploy directly to Neocities when ready!

## 🔧 Troubleshooting

**If buttons don't appear:**
- Check browser console for errors (F12)
- Verify all 3 .js files are in same folder as .html
- Hard refresh (Ctrl+F5) to clear cache

**If auto-deploy doesn't work:**
- Open Deploy modal, enable "Auto-Deploy" checkbox
- Make changes in canvas
- Should auto-deploy after 3 seconds
- Check console for "🔍 Change detected!" messages

**If Neocities deploy fails:**
- Verify API key is correct
- Wait 60 seconds between deploys (rate limit)
- Check network connection
- View error in deployment history

## 📝 API Key Setup

Your Neocities API key is pre-configured:
```
95cba50ce217a25db2e85800e178044e
```

To change it:
1. Open Deploy modal
2. Enter new key in "API Configuration"
3. Click "💾 Save"
4. Click "🔌 Test" to verify

## 🎉 Ready!

Everything is in place and tested. Just open `wysiwyg-coai.html` and start building!
