
# Now let's look at the JSON structure to understand the zettel entries
with open('zetz.json', 'r') as f:
    zetz_data = json.load(f)

print("=== ZETZ.JSON STRUCTURE ===")
print(f"Type: {type(zetz_data)}")
if isinstance(zetz_data, dict):
    print(f"Keys: {list(zetz_data.keys())[:10]}")
    # Show a sample entry
    sample_key = list(zetz_data.keys())[0]
    print(f"\nSample entry (key: {sample_key}):")
    print(json.dumps(zetz_data[sample_key], indent=2))
elif isinstance(zetz_data, list):
    print(f"Length: {len(zetz_data)}")
    print("\nFirst entry:")
    print(json.dumps(zetz_data[0], indent=2))
