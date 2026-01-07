
# Now let's create a comprehensive organizational plan based on the guide
# First, let's see what needs to be organized

print("=== ORGANIZATIONAL RECOMMENDATIONS ===\n")

# Analyze the current state
print("CURRENT STATE ANALYSIS:")
print(f"- You have {len(sorted_trunks)} trunk-level categories")
print(f"- Main structured trunks: 1000, 2000, 3000 (with proper hierarchy)")
print(f"- Orphaned/unstructured entries: {len(sorted_trunks) - 3} items\n")

# Identify unstructured entries
unstructured = []
for trunk_id, trunk_data in sorted_trunks:
    if not trunk_id.isdigit() or len(trunk_data['entries']) == 1:
        if trunk_data['entries'][0].get('type') != 'trunk':
            unstructured.append({
                'id': trunk_id,
                'entry': trunk_data['entries'][0]
            })

print("\nUNSTRUCTURED/ORPHANED ENTRIES:")
for item in unstructured[:15]:
    entry = item['entry']
    print(f"  - ID: {entry.get('id', 'N/A')}")
    print(f"    Title: {entry.get('title', 'N/A')}")
    print(f"    Type: {entry.get('type', 'N/A')}")
    print(f"    Hashtags: {', '.join(entry.get('hashtags', []))}")
    print()
