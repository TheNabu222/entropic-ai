import os
import hashlib
import re
import shutil
from html.parser import HTMLParser

# Configuration
ROOT_DIR = "unpublished"
EXCLUDE_DIRS = {'.git', 'node_modules', '__pycache__', '_duplicates', 'ttrpg'}
EXCLUDE_EXTS = {'.py', '.pyc', '.json', '.map', '.png', '.jpg', '.jpeg', '.gif', '.mp3', '.wav', '.ogg'}
DUPE_DIR = os.path.join(ROOT_DIR, "_duplicates")
BATCH_SIZE = 10

class ContentExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.h1 = ""
        self.text_content = []
        self.in_title = False
        self.in_h1 = False

    def handle_starttag(self, tag, attrs):
        if tag == 'title':
            self.in_title = True
        elif tag == 'h1':
            self.in_h1 = True

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        elif tag == 'h1':
            self.in_h1 = False

    def handle_data(self, data):
        if self.in_title and not self.title:
            self.title = data.strip()
        elif self.in_h1 and not self.h1:
            self.h1 = data.strip()

        clean_text = data.strip()
        if clean_text and len(clean_text) > 1:
            if len(self.text_content) < 50:
                self.text_content.append(clean_text)

def get_file_hash(filepath):
    hash_md5 = hashlib.md5()
    try:
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception:
        return None

def extract_metadata(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    content_str = ""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content_str = f.read(50000)
    except Exception:
        return None

    metadata = {
        'filepath': filepath,
        'filename': os.path.basename(filepath),
        'title': '',
        'h1': '',
        'signature_text': '',
        'size': os.path.getsize(filepath)
    }

    if ext in ['.html', '.htm']:
        parser = ContentExtractor()
        try:
            parser.feed(content_str)
            metadata['title'] = parser.title
            metadata['h1'] = parser.h1
            metadata['signature_text'] = " ".join(parser.text_content[:20])
        except Exception:
            pass

    elif ext in ['.txt', '.md']:
        lines = [l.strip() for l in content_str.splitlines() if l.strip()]
        if lines:
            metadata['title'] = lines[0][:50]
            metadata['signature_text'] = " ".join(lines[:10])

    if not metadata['title']:
        if metadata['h1']:
            metadata['title'] = metadata['h1']
        else:
            if metadata['signature_text']:
                metadata['title'] = metadata['signature_text'][:50]

    return metadata

def clean_filename(text):
    if not text:
        return "untitled"
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text).strip().lower()
    return text[:80]

def analyze_and_execute():
    all_files = []

    # 1. Scan
    print("Scanning files...")
    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        for file in files:
            filepath = os.path.join(root, file)
            ext = os.path.splitext(file)[1].lower()
            if ext in EXCLUDE_EXTS: continue
            if file == "audit_direct.py": continue

            try:
                if os.path.getsize(filepath) > 5 * 1024 * 1024: continue
            except OSError: continue

            file_hash = get_file_hash(filepath)
            if file_hash:
                metadata = extract_metadata(filepath)
                if metadata:
                    metadata['hash'] = file_hash
                    all_files.append(metadata)

    # 2. Identify Actions
    actions = []
    hash_map = {}
    for f in all_files:
        h = f['hash']
        if h not in hash_map: hash_map[h] = []
        hash_map[h].append(f)

    # Handle Duplicates
    if not os.path.exists(DUPE_DIR):
        os.makedirs(DUPE_DIR, exist_ok=True)

    unique_files = []
    for h, group in hash_map.items():
        group.sort(key=lambda x: (x['filepath'].count(os.sep), len(x['filepath'])))
        primary = group[0]
        unique_files.append(primary)

        if len(group) > 1:
            for dupe in group[1:]:
                safe_name = f"{primary['hash'][:6]}_{os.path.basename(dupe['filepath'])}"
                dest = os.path.join(DUPE_DIR, safe_name)
                actions.append(('move', dupe['filepath'], dest))

    # Handle Renames
    content_clusters = {}
    for f in unique_files:
        raw_name = f['title'] or f['filename']
        if "untitled" in raw_name.lower() or "index" in raw_name.lower():
             if f['h1']: raw_name = f['h1']
             elif f['signature_text']: raw_name = f['signature_text']

        base = clean_filename(raw_name)
        if not base or base in ['untitled', 'index', 'template']:
             parent = os.path.basename(os.path.dirname(f['filepath']))
             base = f"{parent}-artifact"

        if base not in content_clusters: content_clusters[base] = []
        content_clusters[base].append(f)

    for base, group in content_clusters.items():
        group.sort(key=lambda x: x['size'], reverse=True)
        for i, f in enumerate(group):
            ext = os.path.splitext(f['filepath'])[1]
            suffix = f"-v{i+1}" if len(group) > 1 else ""
            new_name = f"{base}{suffix}{ext}"
            new_path = os.path.join(os.path.dirname(f['filepath']), new_name)

            if os.path.basename(f['filepath']) != new_name:
                actions.append(('rename', f['filepath'], new_path))

    # 3. Execute Batch
    # Sort: moves first to clear dupes, then renames
    actions.sort(key=lambda x: (x[0] == 'rename', x[1]))

    print(f"Total potential actions found: {len(actions)}")

    executed = 0
    for action_type, src, dest in actions:
        if executed >= BATCH_SIZE:
            break

        if not os.path.exists(src): continue
        if os.path.exists(dest) and os.path.abspath(src) != os.path.abspath(dest): continue

        try:
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            shutil.move(src, dest)
            executed += 1
            # print(f"Action: {src} -> {dest}")
        except Exception as e:
            print(f"Error moving {src}: {e}")

    print(f"Executed {executed} actions.")
    return executed

if __name__ == "__main__":
    analyze_and_execute()
