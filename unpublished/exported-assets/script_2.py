
# Load and analyze the text files to see the actual zettel content
with open('zettels.txt', 'r', encoding='utf-8') as f:
    zettels_txt = f.read()

with open('zettels-10-2025.txt', 'r', encoding='utf-8') as f:
    zettels_oct = f.read()

print("=== ZETTELS.TXT STRUCTURE ===")
print(f"Length: {len(zettels_txt)} characters")
print("\nFirst 2000 characters:")
print(zettels_txt[:2000])
