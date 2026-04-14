
# Let me analyze the JSON data to get a better picture
print("=== COMPLETE ZETTELKASTEN STRUCTURE (from JSON) ===\n")

# Group by trunk
trunks = {}
for entry in zetz_data:
    trunk_id = entry['id'].split('/')[0].split('-')[0]
    if trunk_id not in trunks:
        trunks[trunk_id] = {
            'entries': [],
            'title': '',
            'kingdom': '',
            'tierI': ''
        }
    trunks[trunk_id]['entries'].append(entry)
    if entry['type'] == 'trunk':
        trunks[trunk_id]['title'] = entry['title']
        trunks[trunk_id]['kingdom'] = entry.get('kingdom', '')
        trunks[trunk_id]['tierI'] = entry.get('tierI', '')

# Sort by trunk ID
sorted_trunks = sorted(trunks.items(), key=lambda x: int(x[0]) if x[0].isdigit() else 999999)

print(f"Total Trunk Categories: {len(sorted_trunks)}\n")

for trunk_id, trunk_data in sorted_trunks:
    print(f"\nTrunk {trunk_id}: {trunk_data['title']}")
    print(f"  Kingdom: {trunk_data['kingdom']}")
    print(f"  Tier I: {trunk_data['tierI']}")
    print(f"  Total Entries: {len(trunk_data['entries'])}")
    
    # Show entry types
    types = {}
    for entry in trunk_data['entries']:
        etype = entry.get('type', 'unknown')
        types[etype] = types.get(etype, 0) + 1
    print(f"  Entry Types: {types}")
