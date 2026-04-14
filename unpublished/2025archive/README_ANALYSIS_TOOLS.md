# Unpublished Directory Analysis Tools

This directory contains comprehensive analysis tools and reports for managing the `/unpublished` directory.

## 📊 Generated Reports

### 1. MASTER_SUMMARY_REPORT.md
The primary report with executive summary, actionable recommendations, and a complete 4-phase cleanup plan.

**Key Sections:**
- Executive Summary with key metrics
- LUMP: What belongs together (duplicates, similar files)
- CONTRAST: What's different (version analysis)
- SPLIT: Actionable categories
- Immediate Action Plan (4 phases)
- Expected outcomes and success criteria

**Read this first** for a comprehensive overview of the directory state.

### 2. COMPREHENSIVE_COMPARE_CONTRAST_REPORT.md
Technical file analysis with detailed statistics.

**Key Sections:**
- File type breakdown (HTML, TXT, MD, JS, CSS, JSON)
- Directory structure analysis
- Exact duplicate files (81 groups)
- Similar named files (88 groups)
- Version groups (9 groups)
- Directory-by-directory summary
- Largest/smallest files

**Use this for** technical details and file-level comparisons.

### 3. CONTENT_ANALYSIS_REPORT.md
Semantic content analysis of HTML files.

**Key Sections:**
- Files grouped by purpose (13 categories)
- Files grouped by theme (10 themes)
- Files grouped by technology (10+ technologies)
- Summary statistics with percentages
- Publishing priorities (26 ready files)
- Category-specific recommendations

**Use this for** understanding what files are for and what's ready to publish.

## 🛠️ Analysis Scripts

### comprehensive_analyzer.py
Analyzes file structure, identifies duplicates, and generates comparison reports.

**Usage:**
```bash
# Analyze current directory
python3 comprehensive_analyzer.py

# Analyze specific directory
python3 comprehensive_analyzer.py /path/to/directory
```

**What it does:**
- Scans all files (HTML, MD, JSON, JS, CSS, TXT)
- Calculates MD5 hashes to find exact duplicates
- Groups files by similar names
- Identifies version patterns (v1, v2, (1), (2), etc.)
- Generates statistics and recommendations

**Output:** `COMPREHENSIVE_COMPARE_CONTRAST_REPORT.md`

### content_analyzer.py
Analyzes HTML content semantically to categorize by purpose and theme.

**Usage:**
```bash
# Analyze current directory
python3 content_analyzer.py

# Analyze specific directory
python3 content_analyzer.py /path/to/directory
```

**What it does:**
- Scans all HTML files
- Extracts titles from `<title>` or `<h1>` tags
- Detects technologies (React, Three.js, p5.js, etc.)
- Categorizes by purpose (Editor, Dashboard, Game, etc.)
- Groups by theme (AI/Consciousness, COAIEXIST, Retro, etc.)
- Identifies publication-ready files

**Output:** `CONTENT_ANALYSIS_REPORT.md`

## 📋 Quick Start Guide

### First Time Setup
```bash
cd /path/to/entropic-ai/unpublished
```

### Run Full Analysis
```bash
# Run both analyzers
python3 comprehensive_analyzer.py
python3 content_analyzer.py

# Review the master summary
cat MASTER_SUMMARY_REPORT.md
```

### Re-run After Changes
After making changes to the directory (deleting duplicates, moving files, etc.), re-run the analyzers to see updated statistics:

```bash
python3 comprehensive_analyzer.py
python3 content_analyzer.py
```

The reports will be regenerated with current data.

## 🎯 Common Use Cases

### Finding Duplicates
1. Open `COMPREHENSIVE_COMPARE_CONTRAST_REPORT.md`
2. Go to section "🔍 LUMP: Exact Duplicate Files"
3. Review duplicate groups sorted by count
4. Delete redundant files manually or with script

### Identifying Publication-Ready Files
1. Open `CONTENT_ANALYSIS_REPORT.md`
2. Go to section "💡 Actionable Insights → Publishing Priorities"
3. Review list of 26 ready files
4. Test each file in staging before publishing

### Consolidating Versions
1. Open `COMPREHENSIVE_COMPARE_CONTRAST_REPORT.md`
2. Go to section "🔀 CONTRAST: Version Groups"
3. Review each version group
4. Keep latest/best version, archive others

### Understanding File Organization
1. Open `MASTER_SUMMARY_REPORT.md`
2. Go to section "📂 SPLIT: Directory Organization"
3. Review current structure and proposed reorganization
4. Follow the 4-phase action plan

## 📈 Interpreting Results

### Duplicate Groups
- **Hash-based:** Files with identical content (MD5 match)
- **Action:** Delete all but one copy
- **Impact:** Immediate space savings

### Similar Name Groups
- **Pattern-based:** Files with similar names but different content
- **Examples:** `index (1).html`, `index (2).html`
- **Action:** Review and consolidate or rename for clarity

### Version Groups
- **Version-tagged:** Files with explicit versions (v1, v2, etc.)
- **Action:** Keep latest stable version, archive old versions
- **Impact:** Reduces confusion, improves maintainability

### Purpose Categories
- **Semantic analysis:** What the file is intended to do
- **Examples:** Editor, Dashboard, Game, Landing Page
- **Use:** Understand file ecosystem and identify gaps

### Theme Analysis
- **Content-based:** What topics/aesthetics the file represents
- **Examples:** AI/Consciousness, COAIEXIST, Retro/Nostalgia
- **Use:** Ensure brand consistency and identify focus areas

## 🔄 Regular Maintenance

### Monthly
- Run both analyzers to check for new duplicates
- Review any new files in root directory
- Move ready files to `_ready_to_publish/`

### Quarterly
- Full cleanup following the 4-phase action plan
- Update `MASTER_SUMMARY_REPORT.md` with progress
- Archive old versions
- Review experimental files

### After Major Changes
- Re-run analyzers to verify cleanup was successful
- Update documentation if file structure changed
- Test that no broken links resulted from moves/deletes

## 🚨 Important Notes

### Before Deleting Files
- Always review what the file contains
- Check if file is referenced elsewhere (links, imports)
- Verify hash match for duplicates before deleting
- Keep backups or use git to track deletions

### File Naming Best Practices
- Use descriptive kebab-case names
- Avoid "copy", "untitled", "temp" in production files
- Include version in name only if not in git: `project-v2.html`
- Date format: YYYYMMDD (e.g., `project-20250917.html`)

### Git Integration
- These scripts don't modify files, only analyze them
- Commit reports to track directory evolution over time
- Use git branches when doing major cleanup
- Tag successful cleanup milestones

## 📚 Dependencies

Both scripts use only Python 3 standard library:
- `pathlib` - File path handling
- `hashlib` - MD5 hashing for duplicates
- `re` - Pattern matching
- `collections` - Data structures
- `datetime` - Timestamps

No external dependencies required!

## 🤝 Contributing

To improve the analysis tools:

1. **Add new file types:** Modify `extensions` set in `scan_directory()`
2. **Add new purposes:** Update `detect_purpose()` in `content_analyzer.py`
3. **Add new themes:** Update `detect_themes()` in `content_analyzer.py`
4. **Add new technologies:** Update `detect_technologies()` in `content_analyzer.py`

## 📞 Support

For questions or issues:
1. Review the generated reports first
2. Check if your question is answered in this README
3. Open an issue in the repository
4. Tag the maintainer

## 📅 Version History

- **2025-11-23:** Initial release
  - comprehensive_analyzer.py v1.0
  - content_analyzer.py v1.0
  - Three comprehensive reports generated
  - 861 files analyzed
  - 81 duplicate groups identified
  - 26 publication-ready files identified

---

**Last Updated:** 2025-11-23  
**Maintained By:** Repository Owner
