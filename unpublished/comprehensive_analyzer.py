#!/usr/bin/env python3
"""
Comprehensive Compare/Contrast/Lump/Splitter Analysis Tool
Analyzes all files in the /unpublished directory and subdirectories
"""

import os
import hashlib
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime
import re

class FileAnalyzer:
    def __init__(self, base_path):
        self.base_path = Path(base_path)
        self.files = []
        self.file_groups = defaultdict(list)
        self.duplicates = defaultdict(list)
        self.similar_files = defaultdict(list)
        self.version_groups = defaultdict(list)
        
    def calculate_hash(self, filepath):
        """Calculate MD5 hash of file content"""
        try:
            with open(filepath, 'rb') as f:
                return hashlib.md5(f.read()).hexdigest()
        except Exception as e:
            return None
            
    def get_file_info(self, filepath):
        """Extract comprehensive file information"""
        path = Path(filepath)
        stat = path.stat()
        
        info = {
            'path': str(filepath),
            'name': path.name,
            'size': stat.st_size,
            'size_kb': round(stat.st_size / 1024, 2),
            'extension': path.suffix,
            'directory': str(path.parent.relative_to(self.base_path)),
            'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
            'hash': self.calculate_hash(filepath)
        }
        
        # Extract version info from filename
        version_match = re.search(r'v(\d+)', path.name, re.IGNORECASE)
        if version_match:
            info['version'] = version_match.group(1)
            
        # Extract date info from filename
        date_match = re.search(r'(\d{8})', path.name)
        if date_match:
            info['date'] = date_match.group(1)
            
        # Check for common naming patterns
        info['is_copy'] = 'copy' in path.name.lower()
        info['is_draft'] = 'draft' in path.name.lower()
        info['is_old'] = 'old' in path.name.lower()
        info['is_backup'] = 'backup' in path.name.lower()
        info['has_number'] = bool(re.search(r'\(\d+\)', path.name))
        
        return info
    
    def scan_directory(self):
        """Scan directory and collect all file information"""
        print(f"Scanning directory: {self.base_path}")
        
        extensions = {'.html', '.md', '.json', '.js', '.css', '.txt'}
        
        for filepath in self.base_path.rglob('*'):
            if filepath.is_file() and filepath.suffix in extensions:
                info = self.get_file_info(filepath)
                if info:
                    self.files.append(info)
                    
        print(f"Found {len(self.files)} files")
        
    def find_duplicates(self):
        """Find exact duplicate files by hash"""
        hash_map = defaultdict(list)
        
        for file_info in self.files:
            if file_info['hash']:
                hash_map[file_info['hash']].append(file_info)
                
        # Only keep groups with 2+ files
        self.duplicates = {h: files for h, files in hash_map.items() if len(files) > 1}
        print(f"Found {len(self.duplicates)} duplicate groups")
        
    def find_similar_names(self):
        """Group files with similar names"""
        # Group by base name (without extension and numbers)
        for file_info in self.files:
            # Extract base name
            name = file_info['name']
            # Remove extension
            base = Path(name).stem
            # Remove common patterns
            base = re.sub(r'\s*\(\d+\)\s*', '', base)  # Remove (1), (2), etc.
            base = re.sub(r'\s*copy\s*\d*\s*', '', base, flags=re.IGNORECASE)
            base = re.sub(r'\s*v\d+\s*', '', base, flags=re.IGNORECASE)
            base = re.sub(r'\s*-\d+\s*', '', base)
            base = re.sub(r'\s*\d{8}\s*', '', base)  # Remove dates
            base = base.strip().lower()
            
            if base:
                self.similar_files[base].append(file_info)
                
    def find_version_groups(self):
        """Group files that appear to be different versions"""
        for file_info in self.files:
            if 'version' in file_info or file_info['has_number']:
                # Extract base name without version
                name = file_info['name']
                base = re.sub(r'v\d+', '', name, flags=re.IGNORECASE)
                base = re.sub(r'\(\d+\)', '', base)
                base = re.sub(r'-\d+', '', base)
                base = base.strip().lower()
                
                self.version_groups[base].append(file_info)
                
    def categorize_by_directory(self):
        """Group files by directory"""
        for file_info in self.files:
            dir_name = file_info['directory']
            if dir_name == '.':
                dir_name = 'root'
            self.file_groups[dir_name].append(file_info)
            
    def get_statistics(self):
        """Calculate comprehensive statistics"""
        stats = {
            'total_files': len(self.files),
            'by_extension': defaultdict(int),
            'by_directory': defaultdict(int),
            'total_size_mb': 0,
            'largest_files': [],
            'smallest_files': [],
            'duplicate_groups': len(self.duplicates),
            'total_duplicates': sum(len(files) - 1 for files in self.duplicates.values()),
            'version_groups': len([g for g in self.version_groups.values() if len(g) > 1]),
            'similar_name_groups': len([g for g in self.similar_files.values() if len(g) > 1]),
        }
        
        for file_info in self.files:
            stats['by_extension'][file_info['extension']] += 1
            stats['by_directory'][file_info['directory']] += 1
            stats['total_size_mb'] += file_info['size']
            
        stats['total_size_mb'] = round(stats['total_size_mb'] / (1024 * 1024), 2)
        
        # Get largest and smallest files
        sorted_files = sorted(self.files, key=lambda x: x['size'], reverse=True)
        stats['largest_files'] = sorted_files[:10]
        stats['smallest_files'] = sorted_files[-10:]
        
        return stats
        
    def generate_report(self, output_file):
        """Generate comprehensive markdown report"""
        stats = self.get_statistics()
        
        with open(output_file, 'w') as f:
            f.write("# Comprehensive Compare/Contrast/Lump/Splitter Report\n\n")
            f.write(f"**Generated:** {datetime.now().isoformat()}\n")
            f.write(f"**Directory:** {self.base_path}\n\n")
            
            f.write("---\n\n")
            
            # Executive Summary
            f.write("## Executive Summary\n\n")
            f.write(f"- **Total Files:** {stats['total_files']}\n")
            f.write(f"- **Total Size:** {stats['total_size_mb']} MB\n")
            f.write(f"- **Duplicate Groups:** {stats['duplicate_groups']} ({stats['total_duplicates']} redundant files)\n")
            f.write(f"- **Version Groups:** {stats['version_groups']}\n")
            f.write(f"- **Similar Name Groups:** {stats['similar_name_groups']}\n\n")
            
            # File Type Breakdown
            f.write("## File Type Breakdown\n\n")
            f.write("| Extension | Count | Percentage |\n")
            f.write("|-----------|-------|------------|\n")
            for ext, count in sorted(stats['by_extension'].items(), key=lambda x: x[1], reverse=True):
                pct = (count / stats['total_files'] * 100)
                f.write(f"| `{ext}` | {count} | {pct:.1f}% |\n")
            f.write("\n")
            
            # Directory Structure
            f.write("## Directory Structure Analysis\n\n")
            f.write("| Directory | File Count | Total Size (KB) |\n")
            f.write("|-----------|------------|----------------|\n")
            
            dir_stats = defaultdict(lambda: {'count': 0, 'size': 0})
            for file_info in self.files:
                dir_name = file_info['directory']
                dir_stats[dir_name]['count'] += 1
                dir_stats[dir_name]['size'] += file_info['size_kb']
                
            for dir_name, data in sorted(dir_stats.items(), key=lambda x: x[1]['count'], reverse=True):
                f.write(f"| `{dir_name}` | {data['count']} | {data['size']:.1f} |\n")
            f.write("\n")
            
            # LUMP: Duplicate Files
            f.write("## 🔍 LUMP: Exact Duplicate Files\n\n")
            if self.duplicates:
                f.write(f"Found **{len(self.duplicates)} groups** of exact duplicates "
                       f"({stats['total_duplicates']} redundant files):\n\n")
                
                for idx, (hash_val, files) in enumerate(sorted(self.duplicates.items(), 
                                                               key=lambda x: len(x[1]), 
                                                               reverse=True)[:20], 1):
                    f.write(f"### Duplicate Group #{idx} ({len(files)} files, {files[0]['size_kb']:.1f} KB each)\n\n")
                    for file_info in files:
                        f.write(f"- `{file_info['path'].replace(str(self.base_path) + '/', '')}`\n")
                    f.write("\n")
                    
                if len(self.duplicates) > 20:
                    f.write(f"*({len(self.duplicates) - 20} more duplicate groups not shown)*\n\n")
            else:
                f.write("No exact duplicates found.\n\n")
                
            # LUMP: Similar Named Files
            f.write("## 🔍 LUMP: Similar Named Files (Likely Related)\n\n")
            similar_groups = [(base, files) for base, files in self.similar_files.items() if len(files) > 1]
            similar_groups.sort(key=lambda x: len(x[1]), reverse=True)
            
            if similar_groups:
                f.write(f"Found **{len(similar_groups)} groups** of files with similar names:\n\n")
                
                for idx, (base_name, files) in enumerate(similar_groups[:30], 1):
                    if len(files) > 1:
                        f.write(f"### Group #{idx}: `{base_name}` ({len(files)} files)\n\n")
                        for file_info in sorted(files, key=lambda x: x['size'], reverse=True):
                            f.write(f"- `{file_info['name']}` ({file_info['size_kb']:.1f} KB) "
                                   f"- {file_info['directory']}\n")
                        f.write("\n")
                        
                if len(similar_groups) > 30:
                    f.write(f"*({len(similar_groups) - 30} more similar name groups not shown)*\n\n")
            else:
                f.write("No similar named file groups found.\n\n")
                
            # CONTRAST: Version Groups
            f.write("## 🔀 CONTRAST: Version Groups\n\n")
            version_groups = [(base, files) for base, files in self.version_groups.items() if len(files) > 1]
            version_groups.sort(key=lambda x: len(x[1]), reverse=True)
            
            if version_groups:
                f.write(f"Found **{len(version_groups)} groups** of versioned files:\n\n")
                
                for idx, (base_name, files) in enumerate(version_groups[:20], 1):
                    f.write(f"### Version Group #{idx}: `{base_name}` ({len(files)} versions)\n\n")
                    for file_info in sorted(files, key=lambda x: (x.get('version', ''), x.get('date', '')), reverse=True):
                        version_info = ""
                        if 'version' in file_info:
                            version_info += f"v{file_info['version']} "
                        if 'date' in file_info:
                            version_info += f"({file_info['date']}) "
                        f.write(f"- `{file_info['name']}` {version_info}- {file_info['size_kb']:.1f} KB\n")
                    f.write("\n")
                    
                if len(version_groups) > 20:
                    f.write(f"*({len(version_groups) - 20} more version groups not shown)*\n\n")
            else:
                f.write("No version groups found.\n\n")
                
            # SPLIT: Categorization Recommendations
            f.write("## 📊 SPLIT: Categorization Recommendations\n\n")
            
            # Identify different categories
            categories = {
                'duplicates': [],
                'versions': [],
                'copies': [],
                'drafts': [],
                'backups': [],
                'large_files': [],
                'small_files': [],
            }
            
            for file_info in self.files:
                if file_info['is_copy']:
                    categories['copies'].append(file_info)
                if file_info['is_draft']:
                    categories['drafts'].append(file_info)
                if file_info['is_backup'] or file_info['is_old']:
                    categories['backups'].append(file_info)
                if file_info['size_kb'] > 500:  # Files larger than 500KB
                    categories['large_files'].append(file_info)
                if file_info['size_kb'] < 10:  # Files smaller than 10KB
                    categories['small_files'].append(file_info)
                    
            f.write("### Files Marked as 'Copy'\n\n")
            if categories['copies']:
                f.write(f"Found **{len(categories['copies'])} files** marked as copies:\n\n")
                for file_info in sorted(categories['copies'], key=lambda x: x['size'], reverse=True)[:20]:
                    f.write(f"- `{file_info['name']}` ({file_info['size_kb']:.1f} KB) - {file_info['directory']}\n")
                f.write("\n")
            else:
                f.write("No files marked as copies.\n\n")
                
            f.write("### Files Marked as 'Draft'\n\n")
            if categories['drafts']:
                f.write(f"Found **{len(categories['drafts'])} files** marked as drafts:\n\n")
                for file_info in sorted(categories['drafts'], key=lambda x: x['size'], reverse=True)[:20]:
                    f.write(f"- `{file_info['name']}` ({file_info['size_kb']:.1f} KB) - {file_info['directory']}\n")
                f.write("\n")
            else:
                f.write("No files marked as drafts.\n\n")
                
            f.write("### Backup/Old Files\n\n")
            if categories['backups']:
                f.write(f"Found **{len(categories['backups'])} files** marked as backups/old:\n\n")
                for file_info in sorted(categories['backups'], key=lambda x: x['size'], reverse=True)[:20]:
                    f.write(f"- `{file_info['name']}` ({file_info['size_kb']:.1f} KB) - {file_info['directory']}\n")
                f.write("\n")
            else:
                f.write("No files marked as backups/old.\n\n")
                
            # Largest Files
            f.write("### Largest Files (Top 20)\n\n")
            f.write("| Rank | File | Size | Directory |\n")
            f.write("|------|------|------|----------|\n")
            for idx, file_info in enumerate(stats['largest_files'][:20], 1):
                size_str = f"{file_info['size_kb']:.1f} KB" if file_info['size_kb'] < 1024 else f"{file_info['size_kb']/1024:.1f} MB"
                f.write(f"| {idx} | `{file_info['name']}` | {size_str} | {file_info['directory']} |\n")
            f.write("\n")
            
            # Recommendations
            f.write("## 💡 Recommendations\n\n")
            
            f.write("### Immediate Actions\n\n")
            
            if stats['total_duplicates'] > 0:
                f.write(f"1. **Remove {stats['total_duplicates']} duplicate files** "
                       f"- Could save {sum(files[0]['size_kb'] * (len(files) - 1) for files in self.duplicates.values()):.1f} KB\n")
            
            if len(categories['copies']) > 0:
                f.write(f"2. **Review {len(categories['copies'])} 'copy' files** "
                       f"- Determine if they should be renamed, merged, or deleted\n")
                
            if len(version_groups) > 10:
                f.write(f"3. **Consolidate version groups** - {len(version_groups)} groups with multiple versions "
                       f"- Archive old versions or keep only the latest\n")
                
            if len(categories['drafts']) > 0:
                f.write(f"4. **Review {len(categories['drafts'])} draft files** "
                       f"- Promote to final or archive\n")
                
            if len(categories['large_files']) > 0:
                f.write(f"5. **Review {len(categories['large_files'])} large files (>500KB)** "
                       f"- Consider optimization or archiving\n")
                
            f.write("\n### Long-term Organization\n\n")
            f.write("1. Establish clear naming conventions\n")
            f.write("2. Create `_archive/` subdirectory for old versions\n")
            f.write("3. Implement version control tags instead of filename versioning\n")
            f.write("4. Regular cleanup schedule (quarterly)\n")
            f.write("5. Document which files are production vs. experimental\n\n")
            
            # Summary by Directory
            f.write("## 📁 Directory-by-Directory Summary\n\n")
            
            for dir_name, files in sorted(self.file_groups.items(), key=lambda x: len(x[1]), reverse=True):
                if len(files) > 0:
                    total_size = sum(fi['size_kb'] for fi in files)
                    extensions = defaultdict(int)
                    for fi in files:
                        extensions[fi['extension']] += 1
                        
                    f.write(f"### `{dir_name}/` ({len(files)} files, {total_size:.1f} KB)\n\n")
                    
                    ext_summary = ", ".join([f"{count} {ext}" for ext, count in sorted(extensions.items())])
                    f.write(f"**File types:** {ext_summary}\n\n")
                    
                    # Show a few example files
                    sample_files = sorted(files, key=lambda x: x['size'], reverse=True)[:5]
                    f.write("**Sample files:**\n")
                    for file_info in sample_files:
                        f.write(f"- `{file_info['name']}` ({file_info['size_kb']:.1f} KB)\n")
                    f.write("\n")
            
            f.write("\n---\n\n")
            f.write(f"**Report completed at:** {datetime.now().isoformat()}\n")
            
        print(f"Report generated: {output_file}")
        
    def run_full_analysis(self, output_file):
        """Run complete analysis pipeline"""
        self.scan_directory()
        self.find_duplicates()
        self.find_similar_names()
        self.find_version_groups()
        self.categorize_by_directory()
        self.generate_report(output_file)
        

def main():
    base_path = "/home/runner/work/entropic-ai/entropic-ai/unpublished"
    output_file = "/home/runner/work/entropic-ai/entropic-ai/unpublished/COMPREHENSIVE_COMPARE_CONTRAST_REPORT.md"
    
    analyzer = FileAnalyzer(base_path)
    analyzer.run_full_analysis(output_file)
    
    print("\n✅ Analysis complete!")
    print(f"📊 Report saved to: {output_file}")


if __name__ == "__main__":
    main()
