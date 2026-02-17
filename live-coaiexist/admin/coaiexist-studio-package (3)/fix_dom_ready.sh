#!/bin/bash

# This script fixes DOMContentLoaded event listeners to execute immediately if DOM is already loaded

fix_file() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    # Check if file contains DOMContentLoaded
    if ! grep -q "DOMContentLoaded" "$file"; then
        return
    fi
    
    echo "Fixing $file..."
    
    # Create a backup
    cp "$file" "${file}.backup"
    
    # Use Python to fix the file (more reliable for complex replacements)
    python3 << 'PYTHON_EOF'
import sys
import re

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    content = f.read()

# Pattern to match: window.addEventListener('DOMContentLoaded', () => {
# or addEventListener('DOMContentLoaded', () => {
# We need to find the matching closing });

# Simple fix: replace the pattern at the end of the listener
# Find all DOMContentLoaded listeners
pattern = r"(window\.)?addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{"

if re.search(pattern, content):
    # For simplicity, we'll add the readyState check after each DOMContentLoaded block
    # This is a simple approach - find the listener and wrap it
    
    # Replace window.addEventListener('DOMContentLoaded', () => {
    # with const initFunc = () => {
    # and add the readyState check at the end
    
    # Count how many DOMContentLoaded listeners there are
    matches = list(re.finditer(pattern, content))
    
    if len(matches) == 1:
        # Single listener - straightforward fix
        # Find the opening
        match = matches[0]
        
        # Replace the opening
        before_match = content[:match.start()]
        after_match = content[match.end():]
        
        # Create the new function wrapper
        new_opening = "const initDOMReady = () => {"
        
        # Find the closing }); for this listener
        # This is tricky - we need to match braces
        # For now, let's assume it's at the end of the file or before the next major block
        
        # Simple approach: replace at the very end
        # Look for the last occurrence of });\n before end of file
        last_close = content.rfind('});')
        
        if last_close != -1:
            # Check if this is likely our closing
            middle_content = content[match.end():last_close]
            new_middle = middle_content
            
            # Build new content
            new_content = before_match + new_opening + new_middle + '};\n\n'
            new_content += '// Execute init immediately if DOM is already loaded\n'
            new_content += 'if (document.readyState === "loading") {\n'
            new_content += '    window.addEventListener("DOMContentLoaded", initDOMReady);\n'
            new_content += '} else {\n'
            new_content += '    initDOMReady();\n'
            new_content += '}\n'
            new_content += content[last_close+3:]  # Skip the });\n
            
            with open(file_path, 'w') as f:
                f.write(new_content)
            print(f"Fixed {file_path}")
        else:
            print(f"Could not find closing for {file_path}")
    else:
        print(f"Multiple DOMContentLoaded listeners in {file_path}, skipping automatic fix")
else:
    print(f"No DOMContentLoaded pattern found in {file_path}")

PYTHON_EOF
python3 -c "
import sys
sys.argv = ['', '$file']
exec(open('/dev/stdin').read())
" < /dev/stdin
}

# For now, let's use a simpler sed-based approach for files with simple structure
