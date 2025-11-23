import json

with open("sacred_threads.json", "r", encoding="utf-8") as f:
    threads = json.load(f)

chunk_size = 50
for i in range(0, len(threads), chunk_size):
    with open(f"sacred_chunk_{i//chunk_size + 1}.json", "w", encoding="utf-8") as out:
        json.dump(threads[i:i+chunk_size], out, indent=2)