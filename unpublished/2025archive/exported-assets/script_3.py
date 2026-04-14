
# Create a comprehensive analysis of the Zettelkasten system
import re

# Parse the zettels text to extract entries
entries = []
current_trunk = None

lines = zettels_txt.split('\n')
for line in lines:
    # Look for trunk headers
    trunk_match = re.search(r'🧠\s*(\d+)\s*—\s*(.+?)\s*\(Trunk\s+(\d+)\)', line)
    if trunk_match:
        current_trunk = {
            'number': trunk_match.group(1),
            'trunk_id': trunk_match.group(3),
            'title': trunk_match.group(2),
            'entries': []
        }
        entries.append(current_trunk)
        continue
    
    # Look for zettel entries
    zettel_match = re.search(r'\[(\d+[/\-A-Za-z0-9]*)\]', line)
    if zettel_match and current_trunk:
        current_trunk['entries'].append({
            'id': zettel_match.group(1),
            'line': line.strip()
        })

print("=== ANALYSIS OF CURRENT ZETTELKASTEN ===\n")
print(f"Total Trunks Found: {len(entries)}\n")

for trunk in entries[:8]:  # Show first 8 trunks
    print(f"\nTrunk {trunk['trunk_id']}: {trunk['title']}")
    print(f"  Entries: {len(trunk['entries'])}")
    if trunk['entries']:
        print(f"  Sample entries:")
        for entry in trunk['entries'][:3]:
            print(f"    - {entry['id']}: {entry['line'][:80]}")
