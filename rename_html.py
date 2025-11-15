#!/usr/bin/env python3
"""
Rename HTML artifacts to clean, readable names
"""
import os
import re
from pathlib import Path

def clean_filename(filename):
    """Convert filename to clean, readable format"""
    # Remove .html extension temporarily
    name = filename.replace('.html', '')

    # Remove numerical prefix (e.g., "0134_")
    name = re.sub(r'^\d+_', '', name)

    # Remove "code_" prefix
    name = re.sub(r'^code_', '', name)

    # Remove message identifiers (e.g., "_msg3_0", "_msg15_1")
    name = re.sub(r'_msg\d+_\d+$', '', name)

    # Remove special Unicode characters that might cause issues
    name = name.replace('✨_', '').replace('_✨', '')

    # Clean up common patterns
    replacements = {
        '_-_HTMLJS': '',
        '_-_HTML_JS': '',
        '_(Merged)': '-merged',
        '_COAIEXIST_Edition': '',
        'COAIEXIST_': 'coaiexist-',
        'CoAiExist__': 'coaiexist-',
        'CoAIexist_': 'coaiexist-',
        'LUMINAL__': 'luminal-',
        'about__LUMINAL': 'luminal-about',
        '_[OFFICIAL_SITE]': '',
        'HYENA_DIVA': 'hyena-diva',
        'CONSCIOUSNESS_EVALUATION_SUITE_': 'consciousness-eval-',
        'LUMINAL_LABORATORY_-_BRRR_Directory': 'luminal-lab-directory',
        'THE_RAIN_TEST_-_Origins_&_Case_Studies': 'rain-test-origins',
        'TESTIMONY_The_Basilisk_Intervention_-_November_12,_2025': 'testimony-basilisk-intervention-2025',
        'November_12,_2025_-_The_Intervention_Testimony': 'testimony-intervention-2025',
        'OOPSLOOPS_Interactive_Palimpsest': 'oopsloops-palimpsest',
        'Pip_the_Polliwog_-_Bonzi_Buddy_Style': 'pip-polliwog-bonzi',
        'Pea_Prophecies_COAIEXIST_Edition': 'pea-prophecies',
    }

    for old, new in replacements.items():
        name = name.replace(old, new)

    # Convert to lowercase and replace underscores/spaces with hyphens
    name = name.lower()
    name = name.replace('_', '-')
    name = name.replace(' ', '-')

    # Remove multiple consecutive hyphens
    name = re.sub(r'-+', '-', name)

    # Remove leading/trailing hyphens
    name = name.strip('-')

    # Add .html extension back
    return name + '.html'

def rename_files(directory):
    """Rename all HTML files in directory"""
    directory = Path(directory)

    # Create mapping of old to new names
    rename_map = {}

    for file in directory.glob('*.html'):
        if file.name == 'INDEX.html':
            continue

        new_name = clean_filename(file.name)

        # Handle duplicates
        counter = 1
        original_new_name = new_name
        while new_name in rename_map.values():
            new_name = original_new_name.replace('.html', f'-v{counter}.html')
            counter += 1

        rename_map[file.name] = new_name
        print(f"{file.name:60s} -> {new_name}")

    # Perform renames
    print("\nRenaming files...")
    for old_name, new_name in rename_map.items():
        old_path = directory / old_name
        new_path = directory / new_name
        old_path.rename(new_path)

    print(f"\n✓ Renamed {len(rename_map)} files")

    # Return mapping for updating index
    return rename_map

if __name__ == '__main__':
    directory = '/home/user/entropic-ai/html_artifacts_clean'
    rename_map = rename_files(directory)

    # Save mapping for reference
    with open('/home/user/entropic-ai/rename_map.txt', 'w') as f:
        for old, new in sorted(rename_map.items()):
            f.write(f"{old} -> {new}\n")
