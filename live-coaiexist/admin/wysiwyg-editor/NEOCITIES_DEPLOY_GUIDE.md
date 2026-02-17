# 🚀 Neocities PRO Deployment Guide

## Quick Start (3 Steps!)

1. **Open WYSIWYG Editor** → Click **"🚀 Deploy to Neocities"** button
2. **Test Connection** → Click **"🔌 Test"** (API key already configured!)
3. **Deploy!** → Enter filename → Click **"🚀 Deploy Now"**

Done! Your page is LIVE! 🎉

---

## 📋 Features Overview

### 🔑 API Configuration
- **Pre-configured**: Your API key is already set up!
- **Show/Hide**: Toggle password visibility with 👁️ button
- **Test Connection**: Verify your API works
- **Secure**: Stored in localStorage, never in exported HTML

### 📊 Site Statistics
After testing connection, you'll see:
- **Total Hits**: How many people visited your site
- **Site Name**: Your Neocities username
- **Created Date**: When you made your site
- **Last Updated**: Most recent deployment time

### 📁 File Browser
Click **"🔄 Refresh Files"** to see:
- All files on your Neocities site
- File sizes (KB/MB)
- Last modified dates
- File type icons (📄 HTML, 🎨 CSS, ⚡ JS, 🖼️ images)
- **Delete** button for any file (except index.html)

### 🎯 Quick Deploy
1. Enter filename (e.g., `construction.html`)
2. Click **"🚀 Deploy Now"**
3. Wait for success message
4. Your page is LIVE!

**Rate Limit**: Max 1 deploy per minute (Neocities rule)

### ⚡ Auto-Deploy Mode
**Enable it for magic!**
- ✅ Check "Enable Auto-Deploy"
- Make changes in editor
- Wait 3 seconds
- Automatically deploys!
- No manual clicking needed

**Perfect for**: Live editing, quick iterations, seeing changes instantly

### 📜 Deployment History
See your last 20 deployments:
- ✅ **Green** = Success
- ❌ **Red** = Failed
- Timestamp with "time ago"
- File sizes
- Error messages (if failed)
- **Rollback** button (coming soon!)

---

## 🎯 Common Workflows

### Workflow 1: Edit Existing Page
```
1. Click "📄 Load Page" → Select "construction.html"
2. Edit the page in WYSIWYG
3. Click "🚀 Deploy to Neocities"
4. Enter filename: "construction.html"
5. Click "🚀 Deploy Now"
6. ✅ Success! Changes are live!
```

### Workflow 2: Create New Page
```
1. Build page in WYSIWYG with drag & drop
2. Click "🚀 Deploy to Neocities"
3. Enter new filename: "about.html"
4. Click "🚀 Deploy Now"
5. ✅ New page created at yoursite.neocities.org/about.html!
```

### Workflow 3: Auto-Deploy for Live Editing
```
1. Load a page
2. Click "🚀 Deploy to Neocities"
3. Enable "⚡ Auto-Deploy"
4. Make changes in editor
5. Changes auto-deploy every 3 seconds!
6. Refresh your Neocities page to see updates
```

### Workflow 4: Clean Up Old Files
```
1. Click "🚀 Deploy to Neocities"
2. Click "🔄 Refresh Files"
3. See all files on your site
4. Click 🗑️ next to old files
5. Confirm deletion
6. Files removed from Neocities!
```

---

## ⚠️ Important Notes

### Rate Limiting
- **Limit**: 1 deployment per minute
- **Why**: Neocities API requirement
- **What happens**: If you try too fast, you'll see a wait time message
- **Auto-deploy**: Built-in rate limiting protection

### File Restrictions
- **Can't delete**: index.html (Neocities protection)
- **Can delete**: Everything else
- **Careful**: Deletions are permanent!

### API Key Security
- **Stored**: localStorage (browser only)
- **Not in HTML**: Never appears in exported code
- **Show/Hide**: Use 👁️ button to view your key
- **Save**: Click 💾 to update if you change it

### Deployment Confirmation
After deploying, you'll see:
```
🚀 Successfully deployed construction.html!

🌐 Live at: https://yoursite.neocities.org/construction.html
📊 File size: 15.2 KB
```

---

## 🐛 Troubleshooting

### "Please wait X seconds before deploying"
- **Cause**: Rate limit (1 per minute)
- **Solution**: Wait the specified time
- **Prevention**: Use auto-deploy (handles timing automatically)

### "Error: Invalid API key"
- **Cause**: API key is wrong or expired
- **Solution**: Get new key from Neocities.org/settings
- **Update**: Paste in API key field → Click 💾 Save

### "Connection failed"
- **Cause**: No internet or Neocities down
- **Solution**: Check internet connection
- **Test**: Click "🔌 Test" to verify

### "File not found"
- **Cause**: Trying to load non-existent page
- **Solution**: Click "🔄 Refresh Files" to see available files

### Auto-deploy not working
- **Check**: Is checkbox enabled?
- **Check**: Are you making changes in the canvas?
- **Wait**: 3-second delay before deploy
- **Rate limit**: Only deploys once per minute max

---

## 💡 Pro Tips

### Tip 1: Preview Before Deploy
1. Make changes in editor
2. Click **"👁️ Preview"** button
3. Check how it looks
4. Then deploy if happy!

### Tip 2: Use Deployment History
- Check what you deployed when
- See if deployments succeeded
- Track file sizes over time

### Tip 3: Save Components First
1. Build cool component in editor
2. Click **"💾 Save as Component"**
3. Then deploy the page
4. Reuse component in other pages!

### Tip 4: Batch Deploy Multiple Pages
1. Edit page 1 → Deploy
2. Wait 1 minute (rate limit)
3. Edit page 2 → Deploy
4. Repeat for all pages

### Tip 5: Use Auto-Deploy for Development
- Enable auto-deploy
- Open your Neocities site in another tab
- Make changes in editor
- Refresh Neocities tab to see updates
- Instant feedback loop!

---

## 🚧 Coming Soon

Features in development:
- ⏪ **Rollback**: Restore previous versions
- 🔍 **Diff Viewer**: See exactly what changed
- 📊 **Compare**: Local vs Remote file comparison
- 🐙 **GitHub Integration**: Sync with GitHub repos
- 📦 **Batch Upload**: Deploy multiple files at once

---

## 🎉 You're Ready!

Your WYSIWYG editor now has:
- ✅ Direct Neocities deployment
- ✅ File management
- ✅ Auto-deploy mode
- ✅ Deployment history
- ✅ Site statistics
- ✅ Rate limiting protection

**Go build and deploy!** 🚀✨

---

## 📞 Need Help?

Check deployment history for error messages, or:
1. Click "🔌 Test" to verify connection
2. Click "🔄 Refresh Files" to see site status
3. Check browser console for detailed errors

**Happy deploying!** 🎨🌐
