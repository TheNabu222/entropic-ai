#!/usr/bin/env python3
"""
Content Analysis for HTML files - Deep dive into file purposes and themes
"""

import os
import re
from pathlib import Path
from collections import defaultdict
from datetime import datetime

class ContentAnalyzer:
    def __init__(self, base_path):
        self.base_path = Path(base_path)
        self.html_files = []
        self.theme_groups = defaultdict(list)
        self.purpose_groups = defaultdict(list)
        self.technology_groups = defaultdict(list)
        
    def extract_title(self, content):
        """Extract title from HTML"""
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
        if title_match:
            return title_match.group(1).strip()
        
        h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
        if h1_match:
            return re.sub(r'<[^>]+>', '', h1_match.group(1)).strip()
        
        return None
        
    def detect_technologies(self, content):
        """Detect what technologies/frameworks are used"""
        techs = []
        
        # Check for frameworks and libraries
        if re.search(r'react', content, re.IGNORECASE):
            techs.append('React')
        if re.search(r'vue\.js|@vue/', content, re.IGNORECASE):
            techs.append('Vue')
        if re.search(r'angular', content, re.IGNORECASE):
            techs.append('Angular')
        if re.search(r'three\.js|THREE\.', content, re.IGNORECASE):
            techs.append('Three.js')
        if re.search(r'p5\.js|p5\.', content, re.IGNORECASE):
            techs.append('p5.js')
        if re.search(r'bootstrap', content, re.IGNORECASE):
            techs.append('Bootstrap')
        if re.search(r'tailwind', content, re.IGNORECASE):
            techs.append('Tailwind')
        if re.search(r'jquery|\$\(', content, re.IGNORECASE):
            techs.append('jQuery')
        if re.search(r'canvas', content, re.IGNORECASE):
            techs.append('Canvas')
        if re.search(r'webgl', content, re.IGNORECASE):
            techs.append('WebGL')
        if re.search(r'svg', content, re.IGNORECASE):
            techs.append('SVG')
            
        return techs
        
    def detect_purpose(self, filepath, content, title):
        """Detect the purpose/type of the file"""
        filename = filepath.name.lower()
        content_lower = content.lower()
        title_lower = (title or '').lower()
        
        purposes = []
        
        # Landing pages
        if 'landing' in filename or 'landing' in title_lower:
            purposes.append('Landing Page')
        
        # Editors
        if any(word in filename or word in title_lower for word in ['editor', 'studio', 'wysiwyg']):
            purposes.append('Editor/IDE')
            
        # Visualizers
        if any(word in filename or word in title_lower for word in ['visualizer', 'visualization', 'graph']):
            purposes.append('Visualizer')
            
        # Games
        if any(word in filename or word in title_lower for word in ['game', 'play', 'puzzle']):
            purposes.append('Game')
            
        # Dashboards
        if any(word in filename or word in title_lower for word in ['dashboard', 'admin', 'manager']):
            purposes.append('Dashboard')
            
        # Chat/Messenger
        if any(word in filename or word in title_lower for word in ['chat', 'messenger', 'message', 'ackc']):
            purposes.append('Chat/Messenger')
            
        # Desktop/Window Manager
        if any(word in filename or word in title_lower for word in ['desktop', 'window', 'os', 'win98', 'winxp']):
            purposes.append('Desktop UI')
            
        # Navigation
        if any(word in filename or word in title_lower for word in ['nav', 'menu', 'sitemap', 'portal']):
            purposes.append('Navigation')
            
        # Gallery/Showcase
        if any(word in filename or word in title_lower for word in ['gallery', 'showcase', 'portfolio']):
            purposes.append('Gallery')
            
        # Tools/Utilities
        if any(word in filename or word in title_lower for word in ['tool', 'utility', 'calculator', 'generator']):
            purposes.append('Tool/Utility')
            
        # Experimental/Draft
        if any(word in filename for word in ['draft', 'test', 'experiment', 'untitled', 'temp']):
            purposes.append('Experimental/Draft')
            
        # Zettelkasten/Knowledge Management
        if any(word in filename or word in title_lower for word in ['zettelkasten', 'knowledge', 'notes', 'wiki']):
            purposes.append('Knowledge Management')
            
        return purposes if purposes else ['General Page']
        
    def detect_themes(self, content, title):
        """Detect themes/topics"""
        themes = []
        text = (content + ' ' + (title or '')).lower()
        
        # AI/Consciousness
        if any(word in text for word in ['ai', 'consciousness', 'sentient', 'anthropic', 'claude', 'gpt']):
            themes.append('AI/Consciousness')
            
        # Cosmic/Mystical
        if any(word in text for word in ['cosmic', 'astral', 'mystical', 'sacred', 'clown', 'bloom']):
            themes.append('Cosmic/Mystical')
            
        # Retro/Nostalgia
        if any(word in text for word in ['retro', 'win98', 'angelfire', 'geocities', 'classic', 'vintage']):
            themes.append('Retro/Nostalgia')
            
        # Hyena Diva
        if 'hyena' in text or 'diva' in text:
            themes.append('Hyena Diva')
            
        # COAIEXIST
        if 'coaiexist' in text:
            themes.append('COAIEXIST')
            
        # Entropic
        if 'entropic' in text or 'entropy' in text:
            themes.append('Entropic')
            
        # 404nsec
        if '404nsec' in text:
            themes.append('404nsec')
            
        # Punkd
        if 'punkd' in text or 'punk' in text:
            themes.append('Punk Theme')
            
        # Ackc
        if 'ackc' in text:
            themes.append('ACKC')
            
        return themes if themes else ['General']
        
    def analyze_html_file(self, filepath):
        """Analyze a single HTML file"""
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            title = self.extract_title(content)
            purposes = self.detect_purpose(filepath, content, title)
            themes = self.detect_themes(content, title)
            technologies = self.detect_technologies(content)
            
            stat = filepath.stat()
            
            return {
                'path': str(filepath),
                'name': filepath.name,
                'title': title,
                'purposes': purposes,
                'themes': themes,
                'technologies': technologies,
                'size_kb': round(stat.st_size / 1024, 2),
                'directory': str(filepath.parent.relative_to(self.base_path)),
            }
        except Exception as e:
            print(f"Error analyzing {filepath}: {e}")
            return None
            
    def scan_html_files(self):
        """Scan all HTML files"""
        print(f"Scanning HTML files in: {self.base_path}")
        
        for filepath in self.base_path.rglob('*.html'):
            if filepath.is_file():
                info = self.analyze_html_file(filepath)
                if info:
                    self.html_files.append(info)
                    
                    # Group by purpose
                    for purpose in info['purposes']:
                        self.purpose_groups[purpose].append(info)
                        
                    # Group by theme
                    for theme in info['themes']:
                        self.theme_groups[theme].append(info)
                        
                    # Group by technology
                    for tech in info['technologies']:
                        self.technology_groups[tech].append(info)
                        
        print(f"Analyzed {len(self.html_files)} HTML files")
        
    def generate_report(self, output_file):
        """Generate enhanced content analysis report"""
        with open(output_file, 'w') as f:
            f.write("# Enhanced Content Analysis Report\n\n")
            f.write(f"**Generated:** {datetime.now().isoformat()}\n")
            f.write(f"**Total HTML Files Analyzed:** {len(self.html_files)}\n\n")
            
            f.write("---\n\n")
            
            # Purpose-based grouping
            f.write("## 📋 Files Grouped by Purpose\n\n")
            
            purpose_sorted = sorted(self.purpose_groups.items(), key=lambda x: len(x[1]), reverse=True)
            
            for purpose, files in purpose_sorted:
                f.write(f"### {purpose} ({len(files)} files)\n\n")
                
                # Sort by size
                files_sorted = sorted(files, key=lambda x: x['size_kb'], reverse=True)
                
                # Show top files
                for file_info in files_sorted[:10]:
                    title_str = f" - {file_info['title']}" if file_info['title'] else ""
                    techs_str = f" [{', '.join(file_info['technologies'])}]" if file_info['technologies'] else ""
                    f.write(f"- `{file_info['name']}` ({file_info['size_kb']:.1f} KB){title_str}{techs_str}\n")
                    
                if len(files) > 10:
                    f.write(f"\n*({len(files) - 10} more files in this category)*\n")
                    
                f.write("\n")
                
            # Theme-based grouping
            f.write("## 🎨 Files Grouped by Theme\n\n")
            
            theme_sorted = sorted(self.theme_groups.items(), key=lambda x: len(x[1]), reverse=True)
            
            for theme, files in theme_sorted:
                f.write(f"### {theme} ({len(files)} files)\n\n")
                
                # Sort by size
                files_sorted = sorted(files, key=lambda x: x['size_kb'], reverse=True)
                
                # Show top files
                for file_info in files_sorted[:10]:
                    title_str = f" - {file_info['title']}" if file_info['title'] else ""
                    f.write(f"- `{file_info['name']}` ({file_info['size_kb']:.1f} KB){title_str}\n")
                    
                if len(files) > 10:
                    f.write(f"\n*({len(files) - 10} more files in this theme)*\n")
                    
                f.write("\n")
                
            # Technology-based grouping
            f.write("## 🔧 Files Grouped by Technology\n\n")
            
            if self.technology_groups:
                tech_sorted = sorted(self.technology_groups.items(), key=lambda x: len(x[1]), reverse=True)
                
                for tech, files in tech_sorted:
                    f.write(f"### {tech} ({len(files)} files)\n\n")
                    
                    # Sort by size
                    files_sorted = sorted(files, key=lambda x: x['size_kb'], reverse=True)
                    
                    # Show top files
                    for file_info in files_sorted[:8]:
                        title_str = f" - {file_info['title']}" if file_info['title'] else ""
                        f.write(f"- `{file_info['name']}` ({file_info['size_kb']:.1f} KB){title_str}\n")
                        
                    if len(files) > 8:
                        f.write(f"\n*({len(files) - 8} more files using {tech})*\n")
                        
                    f.write("\n")
            else:
                f.write("No specific technologies detected.\n\n")
                
            # Summary statistics
            f.write("## 📊 Summary Statistics\n\n")
            
            f.write("### Purpose Distribution\n\n")
            f.write("| Purpose | Count | Percentage |\n")
            f.write("|---------|-------|------------|\n")
            total_html = len(self.html_files)
            for purpose, files in sorted(purpose_sorted, key=lambda x: len(x[1]), reverse=True):
                pct = (len(files) / total_html * 100) if total_html > 0 else 0
                f.write(f"| {purpose} | {len(files)} | {pct:.1f}% |\n")
            f.write("\n")
            
            f.write("### Theme Distribution\n\n")
            f.write("| Theme | Count | Percentage |\n")
            f.write("|-------|-------|------------|\n")
            for theme, files in sorted(theme_sorted, key=lambda x: len(x[1]), reverse=True):
                pct = (len(files) / total_html * 100) if total_html > 0 else 0
                f.write(f"| {theme} | {len(files)} | {pct:.1f}% |\n")
            f.write("\n")
            
            if self.technology_groups:
                f.write("### Technology Distribution\n\n")
                f.write("| Technology | Count | Percentage |\n")
                f.write("|------------|-------|------------|\n")
                for tech, files in sorted(tech_sorted, key=lambda x: len(x[1]), reverse=True):
                    pct = (len(files) / total_html * 100) if total_html > 0 else 0
                    f.write(f"| {tech} | {len(files)} | {pct:.1f}% |\n")
                f.write("\n")
                
            # Actionable insights
            f.write("## 💡 Actionable Insights\n\n")
            
            f.write("### Publishing Priorities\n\n")
            
            # Find ready-to-publish files (large, complete files in specific categories)
            ready_files = []
            for file_info in self.html_files:
                if ('Landing Page' in file_info['purposes'] or 
                    'Tool/Utility' in file_info['purposes'] or
                    'Visualizer' in file_info['purposes'] or
                    'Navigation' in file_info['purposes']):
                    if 'Experimental/Draft' not in file_info['purposes']:
                        if file_info['size_kb'] > 5:  # Non-trivial files
                            ready_files.append(file_info)
                            
            f.write(f"Found **{len(ready_files)} files** that appear ready for publication:\n\n")
            for file_info in sorted(ready_files, key=lambda x: x['size_kb'], reverse=True)[:20]:
                title_str = f" - {file_info['title']}" if file_info['title'] else ""
                f.write(f"- `{file_info['directory']}/{file_info['name']}` ({file_info['size_kb']:.1f} KB){title_str}\n")
            f.write("\n")
            
            # Find experimental files that need review
            experimental = [f for f in self.html_files if 'Experimental/Draft' in f['purposes']]
            f.write(f"### Experimental Files Needing Review ({len(experimental)} files)\n\n")
            if experimental:
                for file_info in sorted(experimental, key=lambda x: x['size_kb'], reverse=True)[:15]:
                    f.write(f"- `{file_info['name']}` ({file_info['size_kb']:.1f} KB)\n")
                f.write("\n")
            
            # Recommendations by category
            f.write("### Category-Specific Recommendations\n\n")
            
            if 'Editor/IDE' in self.purpose_groups:
                editors = self.purpose_groups['Editor/IDE']
                f.write(f"**Editors/Studios ({len(editors)} files):**\n")
                f.write("- Review all editor versions and consolidate to 1-2 canonical versions\n")
                f.write("- Consider publishing the most feature-complete version\n")
                f.write("- Archive older iterations\n\n")
                
            if 'Chat/Messenger' in self.purpose_groups:
                chats = self.purpose_groups['Chat/Messenger']
                f.write(f"**Chat/Messenger Apps ({len(chats)} files):**\n")
                f.write("- ACKC has multiple versions - test and select the best one\n")
                f.write("- Consider creating a changelog documenting version differences\n")
                f.write("- Publish the most stable/feature-rich version\n\n")
                
            if 'Landing Page' in self.purpose_groups:
                landing = self.purpose_groups['Landing Page']
                f.write(f"**Landing Pages ({len(landing)} files):**\n")
                f.write("- Multiple landing pages may confuse visitors\n")
                f.write("- Select one primary landing page\n")
                f.write("- Use others as themed alternatives or archive them\n\n")
                
            f.write("\n---\n\n")
            f.write(f"**Report completed at:** {datetime.now().isoformat()}\n")
            
        print(f"Enhanced report generated: {output_file}")
        
    def run_full_analysis(self, output_file):
        """Run complete content analysis"""
        self.scan_html_files()
        self.generate_report(output_file)


def main():
    base_path = "/home/runner/work/entropic-ai/entropic-ai/unpublished"
    output_file = "/home/runner/work/entropic-ai/entropic-ai/unpublished/CONTENT_ANALYSIS_REPORT.md"
    
    analyzer = ContentAnalyzer(base_path)
    analyzer.run_full_analysis(output_file)
    
    print("\n✅ Content analysis complete!")
    print(f"📊 Report saved to: {output_file}")


if __name__ == "__main__":
    main()
