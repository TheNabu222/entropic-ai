#!/usr/bin/env python3
"""
Cross-reference extracted HTML files with existing published files
"""
import os
from pathlib import Path
import difflib

# Get list of extracted clean HTML files
extracted_dir = Path('/home/user/entropic-ai/html_artifacts_clean')
extracted_files = [f.name for f in extracted_dir.glob('*.html') if f.name != 'INDEX.html']

print(f"Found {len(extracted_files)} extracted HTML files\n")

# Get list of existing published files
existing_files = []
with open('/tmp/existing_html.txt', 'r') as f:
    for line in f:
        filepath = line.strip()
        filename = os.path.basename(filepath)
        existing_files.append((filename, filepath))

existing_filenames = [f[0] for f in existing_files]

print(f"Found {len(existing_files)} existing HTML files in repo\n")
print("="*80)

# Find NEW files (not published yet)
new_files = []
potentially_duplicate = []

for extracted in sorted(extracted_files):
    # Check exact match
    if extracted in existing_filenames:
        print(f"✓ ALREADY EXISTS: {extracted}")
        continue

    # Check for similar names (fuzzy match)
    close_matches = difflib.get_close_matches(extracted, existing_filenames, n=3, cutoff=0.6)

    if close_matches:
        potentially_duplicate.append((extracted, close_matches))
        print(f"? SIMILAR EXISTS: {extracted}")
        for match in close_matches:
            for fname, fpath in existing_files:
                if fname == match:
                    print(f"    → {fpath}")
    else:
        new_files.append(extracted)
        print(f"★ NEW FILE: {extracted}")

print("\n" + "="*80)
print(f"\n📊 SUMMARY:")
print(f"  Total extracted: {len(extracted_files)}")
print(f"  Already published: {len(extracted_files) - len(new_files) - len(potentially_duplicate)}")
print(f"  Potentially duplicate: {len(potentially_duplicate)}")
print(f"  COMPLETELY NEW: {len(new_files)}")

if new_files:
    print(f"\n🆕 UNPUBLISHED FILES ({len(new_files)}):")
    for f in new_files:
        print(f"  - {f}")

if potentially_duplicate:
    print(f"\n🤔 POTENTIALLY DUPLICATE ({len(potentially_duplicate)}):")
    for extracted, matches in potentially_duplicate:
        print(f"  - {extracted}")
        for m in matches:
            print(f"      similar to: {m}")
