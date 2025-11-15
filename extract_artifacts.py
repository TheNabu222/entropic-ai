#!/usr/bin/env python3
"""
Extract code artifacts from conversations.json
"""
import json
import os
import re
from pathlib import Path

def sanitize_filename(name):
    """Convert a string into a safe filename"""
    # Remove invalid characters
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    # Replace spaces with underscores
    name = name.replace(' ', '_')
    # Limit length
    if len(name) > 200:
        name = name[:200]
    return name or 'unnamed'

def extract_code_artifacts(json_file, output_dir):
    """Extract code artifacts from conversations JSON"""

    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)

    # Load JSON
    print(f"Loading {json_file}...")
    with open(json_file, 'r', encoding='utf-8') as f:
        conversations = json.load(f)

    print(f"Found {len(conversations)} conversations")

    artifact_count = 0
    conversation_count = 0

    # Track all artifacts for index
    all_artifacts = []

    # Process each conversation
    for conv in conversations:
        conv_name = conv.get('name', '').strip()
        conv_uuid = conv.get('uuid', 'unknown')
        messages = conv.get('chat_messages', [])

        if not messages:
            continue

        conversation_count += 1
        conv_artifacts = []

        # Process each message
        for msg_idx, msg in enumerate(messages):
            sender = msg.get('sender', 'unknown')
            content_blocks = msg.get('content', [])

            # Look for code/artifacts in content blocks
            for block_idx, block in enumerate(content_blocks):
                block_type = block.get('type', '')

                # Check for tool_use blocks (artifacts)
                if block_type == 'tool_use':
                    tool_name = block.get('name', '')
                    tool_input = block.get('input', {})

                    if tool_name == 'artifacts' and isinstance(tool_input, dict):
                        artifact_content = tool_input.get('content', '')
                        artifact_title = tool_input.get('title', f'artifact_{artifact_count}')
                        artifact_type = tool_input.get('type', 'text/plain')
                        artifact_id = tool_input.get('id', f'artifact_{artifact_count}')

                        if artifact_content:
                            # Determine file extension based on type
                            ext_map = {
                                'text/html': '.html',
                                'text/javascript': '.js',
                                'text/css': '.css',
                                'application/vnd.ant.code': '.code',
                                'text/markdown': '.md',
                                'image/svg+xml': '.svg',
                                'application/vnd.ant.mermaid': '.mmd',
                                'application/vnd.ant.react': '.jsx',
                                'text/plain': '.txt',
                            }

                            ext = ext_map.get(artifact_type, '.txt')

                            # Create filename
                            safe_title = sanitize_filename(artifact_title)
                            filename = f"{artifact_count:04d}_{safe_title}{ext}"
                            filepath = output_path / filename

                            # Save artifact
                            with open(filepath, 'w', encoding='utf-8') as f:
                                f.write(artifact_content)

                            artifact_info = {
                                'file': filename,
                                'title': artifact_title,
                                'type': artifact_type,
                                'conversation': conv_name or f"Conversation {conv_uuid[:8]}",
                                'conversation_uuid': conv_uuid,
                                'message_index': msg_idx,
                                'sender': sender
                            }

                            all_artifacts.append(artifact_info)
                            conv_artifacts.append(artifact_info)
                            artifact_count += 1

                            print(f"  Extracted: {filename} ({artifact_type})")

                # Also check for inline code blocks in text content
                elif block_type == 'text':
                    text = block.get('text', '')
                    # Look for markdown code blocks
                    code_blocks = re.findall(r'```(\w+)?\n(.*?)```', text, re.DOTALL)

                    for cb_idx, (lang, code) in enumerate(code_blocks):
                        if code.strip() and len(code.strip()) > 50:  # Only save substantial code blocks
                            lang = lang or 'txt'
                            ext_map = {
                                'python': '.py',
                                'javascript': '.js',
                                'html': '.html',
                                'css': '.css',
                                'typescript': '.ts',
                                'jsx': '.jsx',
                                'tsx': '.tsx',
                                'bash': '.sh',
                                'sh': '.sh',
                                'json': '.json',
                                'yaml': '.yaml',
                                'yml': '.yml',
                                'sql': '.sql',
                                'go': '.go',
                                'rust': '.rs',
                                'java': '.java',
                                'c': '.c',
                                'cpp': '.cpp',
                                'markdown': '.md',
                                'md': '.md',
                            }

                            ext = ext_map.get(lang.lower(), f'.{lang}')

                            # Create filename
                            conv_prefix = sanitize_filename(conv_name) if conv_name else conv_uuid[:8]
                            filename = f"{artifact_count:04d}_code_{conv_prefix}_msg{msg_idx}_{cb_idx}{ext}"
                            filepath = output_path / filename

                            # Save code block
                            with open(filepath, 'w', encoding='utf-8') as f:
                                f.write(code)

                            artifact_info = {
                                'file': filename,
                                'title': f"Code block ({lang})",
                                'type': f'code/{lang}',
                                'conversation': conv_name or f"Conversation {conv_uuid[:8]}",
                                'conversation_uuid': conv_uuid,
                                'message_index': msg_idx,
                                'sender': sender
                            }

                            all_artifacts.append(artifact_info)
                            artifact_count += 1

                            print(f"  Extracted code block: {filename}")

    # Create index file
    index_path = output_path / 'INDEX.md'
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(f"# Code Artifacts Index\n\n")
        f.write(f"Total artifacts extracted: **{artifact_count}**\n\n")
        f.write(f"From {conversation_count} conversations\n\n")
        f.write(f"---\n\n")

        # Group by conversation
        by_conversation = {}
        for artifact in all_artifacts:
            conv_name = artifact['conversation']
            if conv_name not in by_conversation:
                by_conversation[conv_name] = []
            by_conversation[conv_name].append(artifact)

        for conv_name, artifacts in by_conversation.items():
            f.write(f"## {conv_name}\n\n")
            for artifact in artifacts:
                f.write(f"- **{artifact['file']}**\n")
                f.write(f"  - Title: {artifact['title']}\n")
                f.write(f"  - Type: {artifact['type']}\n")
                f.write(f"  - Sender: {artifact['sender']}\n")
                f.write(f"\n")
            f.write(f"\n")

    print(f"\n✓ Extraction complete!")
    print(f"  - Total artifacts: {artifact_count}")
    print(f"  - From conversations: {conversation_count}")
    print(f"  - Output directory: {output_dir}")
    print(f"  - Index file: {index_path}")

if __name__ == '__main__':
    json_file = '/home/user/entropic-ai/conversations.json'
    output_dir = '/home/user/entropic-ai/extracted_artifacts'

    extract_code_artifacts(json_file, output_dir)
