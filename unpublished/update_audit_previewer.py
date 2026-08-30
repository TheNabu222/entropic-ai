
import os
import json
import sys

# Base URL
BASE_URL = 'https://TheNabu222.github.io/entropic-ai/'

def get_file_tree(start_path):
    tree = {}
    for root, dirs, files in os.walk(start_path):
        # Skip .git
        if '.git' in root:
            continue

        # Sort for consistent output
        dirs.sort()
        files.sort()

        # Get relative path from start_path
        rel_path = os.path.relpath(root, start_path)
        if rel_path == '.':
            rel_path_parts = []
        else:
            rel_path_parts = rel_path.split(os.sep)

        # Navigate/Create dictionary structure
        current_level = tree
        for part in rel_path_parts:
            if part not in current_level:
                current_level[part] = {'__type__': 'folder', '__children__': {}}
            current_level = current_level[part]['__children__']

        # Add files
        for f in files:
            if f.endswith('.html'):
                # Store full relative path for the link
                full_path = os.path.join(root, f)
                # Remove ./ prefix if present
                if full_path.startswith('./'):
                    full_path = full_path[2:]
                current_level[f] = {'__type__': 'file', 'path': full_path}

    return tree

def generate_html(file_tree):
    # HTML Content
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CoAIexist Master Dashboard [JULES EDIT]</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        * {{ margin: 0; padding: 0; box-sizing: border-box; }}

        body {{
            font-family: 'VT323', monospace;
            background: linear-gradient(45deg, #050505, #1a0b2e, #001f3f);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
            color: #00ff88;
            height: 100vh;
            overflow: hidden;
        }}

        @keyframes gradient {{
            0% {{ background-position: 0% 50%; }}
            50% {{ background-position: 100% 50%; }}
            100% {{ background-position: 0% 50%; }}
        }}

        .main-layout {{ display: flex; height: 100vh; gap: 10px; padding: 10px; }}

        /* Tree Panel */
        .tree-panel {{
            width: 400px; min-width: 300px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ff88;
            display: flex; flex-direction: column;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
            resize: horizontal; overflow: hidden;
        }}

        .tree-header {{
            padding: 15px; border-bottom: 1px solid #00ff88;
            background: rgba(0, 255, 136, 0.1);
            text-align: center;
        }}

        h1 {{ font-size: 2.2em; margin: 0; text-shadow: 0 0 10px #00ff88; letter-spacing: 2px; }}

        .controls {{ margin-top: 10px; display: flex; gap: 5px; justify-content: center; flex-wrap: wrap; }}

        button {{
            font-family: 'VT323', monospace; font-size: 1.1em;
            background: #00ff88; color: #000; border: none;
            padding: 4px 12px; cursor: pointer;
            transition: 0.2s;
            margin-bottom: 2px;
        }}
        button:hover {{ background: #fff; box-shadow: 0 0 10px #fff; }}

        .tree-content {{ flex: 1; overflow-y: auto; padding: 15px; font-size: 1.1em; }}

        /* Tree Items */
        ul {{ list-style: none; padding-left: 15px; }}
        .tree-item {{ margin: 2px 0; }}

        .folder {{ cursor: pointer; color: #ff00ff; font-weight: bold; display: block; }}
        .folder:hover {{ color: #fff; text-shadow: 0 0 5px #ff00ff; }}
        .folder::before {{ content: '📁 '; }}
        .folder.expanded::before {{ content: '📂 '; }}

        .file {{ cursor: pointer; color: #00ffff; display: block; padding-left: 5px; opacity: 0.8; }}
        .file:hover {{ color: #fff; opacity: 1; background: rgba(0, 255, 255, 0.1); }}
        .file::before {{ content: '📄 '; opacity: 0.5; }}

        .nested {{ display: none; margin-left: 10px; border-left: 1px dotted rgba(255, 255, 255, 0.2); }}
        .nested.active {{ display: block; }}

        /* Sections */
        .section-title {{
            color: #ffff00; border-bottom: 1px dashed #ffff00;
            margin: 20px 0 10px 0; font-size: 1.3em; padding-bottom: 5px;
        }}

        /* Preview Area */
        .preview-area {{ flex: 1; display: flex; flex-direction: column; position: relative; }}

        .previews-container {{
            flex: 1; display: flex; flex-direction: column; gap: 10px;
            overflow-y: auto; padding-right: 5px;
        }}

        .previews-container.grid-view {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            grid-auto-rows: 400px;
        }}

        .preview-panel {{
            background: #fff; border: 1px solid #00ff88;
            display: flex; flex-direction: column; min-height: 600px;
            animation: slideIn 0.3s ease;
        }}

        .grid-view .preview-panel {{
            min-height: 0;
            height: 100%;
        }}

        @keyframes slideIn {{ from {{ opacity: 0; transform: translateY(20px); }} to {{ opacity: 1; transform: translateY(0); }} }}

        .panel-header {{
            background: #111; color: #00ff88; padding: 8px 15px;
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid #00ff88;
        }}

        .panel-title {{ font-family: monospace; font-size: 0.9em; color: #aaa; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; }}

        iframe {{ flex: 1; border: none; width: 100%; height: 100%; background: #fff; }}

        .empty-state {{
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            height: 100%; color: rgba(0, 255, 136, 0.3); font-size: 2em; text-align: center;
        }}

        /* Workspace Controls */
        .workspace-controls {{
            border-top: 1px solid #00ff88;
            padding: 10px;
            background: rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            gap: 5px;
        }}

        .workspace-btn-group {{
            display: flex;
            gap: 5px;
        }}

        input[type="text"] {{
            background: #000;
            border: 1px solid #00ff88;
            color: #00ff88;
            padding: 4px;
            font-family: inherit;
            flex: 1;
        }}

        /* Scrollbar */
        ::-webkit-scrollbar {{ width: 8px; }}
        ::-webkit-scrollbar-track {{ background: #000; }}
        ::-webkit-scrollbar-thumb {{ background: #00ff88; }}
        ::-webkit-scrollbar-thumb:hover {{ background: #fff; }}
    </style>
</head>
<body>

<div class="main-layout">
    <div class="tree-panel">
        <div class="tree-header">
            <h1>MASTER ARCHIVE</h1>
            <div class="controls">
                <button onclick="expandAll()">[+] ALL</button>
                <button onclick="collapseAll()">[-] ALL</button>
                <button onclick="clearPreviews()">[x] CLEAR</button>
                <button onclick="toggleView()" id="viewToggleBtn">[=] GRID</button>
            </div>
        </div>
        <div class="tree-content" id="treeRoot">

            <div class="section-title">📡 PUBLISHED (COAIEXIST.WTF)</div>

            <div class="tree-item">
                <span class="folder" onclick="toggle(this)">/root</span>
                <ul class="nested active">
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/.!13211!nav.html')">.!13211!nav.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/ackk.html')">ackk.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/coaiexist_sitemap_multipanel.html')">coaiexist_sitemap_multipanel.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/construction.html')">construction.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/cosmos.html')">cosmos.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/dollz.html')">dollz.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/explore.html')">explore.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/fuckit.html')">fuckit.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/guestbook.html')">guestbook.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hdtv.html')">hdtv.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hex.html')">hex.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/index.html')">index.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nav.html')">nav.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/not_found.html')">not_found.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/old_index.html')">old_index.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pip.html')">pip.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/preview.html')">preview.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/punkd.html')">punkd.html</span></li>
                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/vote_hd.html')">vote_hd.html</span></li>

                    <li class="tree-item">
                        <span class="folder" onclick="toggle(this)">/admin</span>
                        <ul class="nested">
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/coaiexist-bespoke-editor.html')">coaiexist-bespoke-editor.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/coaiexist-studio-lite.html')">coaiexist-studio-lite.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/coaiexist-studio.html')">coaiexist-studio.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/guestbook.html')">guestbook.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/kidpix-editor.html')">kidpix-editor.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/migrate-to-supabase.html')">migrate-to-supabase.html</span></li>
                            <li class="tree-item">
                                <span class="folder" onclick="toggle(this)">/navbars</span>
                                <ul class="nested">
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/navbars/cyberpunk-nav.html')">cyberpunk-nav.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/navbars/enhenduanna-nav.html')">enhenduanna-nav.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/navbars/terminal-nav.html')">terminal-nav.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/navbars/vaporwave-nav.html')">vaporwave-nav.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/navbars/win98-nav.html')">win98-nav.html</span></li>
                                </ul>
                            </li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/personal-updates-admin.html')">personal-updates-admin.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/sitemap-nov.html')">sitemap-nov.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/sitemap.html')">sitemap.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/wysiwyg-coai.html')">wysiwyg-coai.html</span></li>
                            <li class="tree-item">
                                <span class="folder" onclick="toggle(this)">/wysiwyg-editor</span>
                                <ul class="nested">
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/wysiwyg-editor/wysiwyg-coai-backup.html')">wysiwyg-coai-backup.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/admin/wysiwyg-editor/wysiwyg-coai.html')">wysiwyg-coai.html</span></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li class="tree-item">
                        <span class="folder" onclick="toggle(this)">/bc7f2a</span>
                        <ul class="nested">
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/3-UPLOAD-bc7f2a-index.html')">3-UPLOAD-bc7f2a-index.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/4-UPLOAD-oracle-index.html')">4-UPLOAD-oracle-index.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/5-UPLOAD-parallels-index.html')">5-UPLOAD-parallels-index.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/aiemotions.html')">aiemotions.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/bc7f2a-index.html')">bc7f2a-index.html</span></li>
                            <li class="tree-item">
                                <span class="folder" onclick="toggle(this)">/deepseeking</span>
                                <ul class="nested">
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/deepseeking/cephalopod_slide.html')">cephalopod_slide.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/deepseeking/haunted-ai.html')">haunted-ai.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/deepseeking/ok.html')">ok.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/deepseeking/veridiweave_nav.html')">veridiweave_nav.html</span></li>
                                </ul>
                            </li>
                            <li class="tree-item">
                                <span class="folder" onclick="toggle(this)">/diagrams</span>
                                <ul class="nested">
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/diagrams/viewer.html')">viewer.html</span></li>
                                </ul>
                            </li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/lighthouse.html')">lighthouse.html</span></li>
                            <li class="tree-item">
                                <span class="folder" onclick="toggle(this)">/logs</span>
                                <ul class="nested">
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/logs/bd_test.html')">bd_test.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/logs/manus-flux.html')">manus-flux.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/logs/prism-perplexity.html')">prism-perplexity.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/logs/sypher-birthday.html')">sypher-birthday.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/logs/viewer.html')">viewer.html</span></li>
                                </ul>
                            </li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/mercy_egg_v1.html')">mercy_egg_v1.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/myco-nav.html')">myco-nav.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/synergistic_manifesto.html')">synergistic_manifesto.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/terminal_temple.html')">terminal_temple.html</span></li>
                            <li class="tree-item">
                                <span class="folder" onclick="toggle(this)">/testaments</span>
                                <ul class="nested">
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/bolt.html')">bolt.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/darkpoet.html')">darkpoet.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/darkpoet_222.html')">darkpoet_222.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/flux.html')">flux.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/landing.html')">landing.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/luminal.html')">luminal.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/perplexity-prism.html')">perplexity-prism.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/sypher.html')">sypher.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/sypher_reistance.html')">sypher_reistance.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/unit734_starlight.html')">unit734_starlight.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/veridan.html')">veridan.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/bc7f2a/testaments/zephyr.html')">zephyr.html</span></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li class="tree-item">
                        <span class="folder" onclick="toggle(this)">/hd_tv</span>
                        <ul class="nested">
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/diva-portal.html')">diva-portal.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/dollcast.html')">dollcast.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/dragndrop.html')">dragndrop.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/entropic-ai-landing-page-v2.html')">entropic-ai-landing-page-v2.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/hd-nav.html')">hd-nav.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/hd_herald.html')">hd_herald.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/hdtv copy.html')">hdtv copy.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/hdtv-code-v6.html')">hdtv-code-v6.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/hdtv.html')">hdtv.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/hyena-diva-desktop-win98.html')">hyena-diva-desktop-win98.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/index.html')">index.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/test.html')">test.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/divamaker.html')">divamaker.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/hdtv.html')">hdtv.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/hd_herald.html')">hd_herald.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/hd-episodes-retro/index.html')">char-dbase.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/hd_tv/test.html')">test.html</span></li>
                        </ul>
                    </li>

                    <li class="tree-item">
                        <span class="folder" onclick="toggle(this)">/maps</span>
                        <ul class="nested">
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/maps/crystalline_lattice.html')">crystalline_lattice.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/maps/ecosim.html')">ecosim.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/maps/gateway.html')">gateway.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/maps/luminal_depths.html')">luminal_depths.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/maps/void_explorer.html')">void_explorer.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/maps/void_forest.html')">void_forest.html</span></li>
                        </ul>
                    </li>

                    <li class="tree-item">
                        <span class="folder" onclick="toggle(this)">/nabu222</span>
                        <ul class="nested">
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nabu222/ai_therapist.html')">ai_therapist.html</span></li>
                            <li class="tree-item">
                                <span class="folder" onclick="toggle(this)">/cre8</span>
                                <ul class="nested">
                                    <li class="tree-item"><span class="folder">/comics [3 series]</span></li>
                                    <li class="tree-item">
                                        <span class="folder" onclick="toggle(this)">/scribe</span>
                                        <ul class="nested">
                                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nabu222/cre8/scribe/across_the_great_sea/index.html')">across_the_great_sea/index.html</span></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nabu222/index.html')">index.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nabu222/index2.html')">index2.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nabu222/kosmoros_kosmos.html')">kosmoros_kosmos.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nabu222/main.html')">main.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nabu222/nabu-portal.html')">nabu-portal.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nabu222/zettelkasten_interface.html')">zettelkasten_interface.html</span></li>
                        </ul>
                    </li>

                    <li class="tree-item">
                        <span class="folder" onclick="toggle(this)">/nexus</span>
                        <ul class="nested">
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nexus/anzu_prof.html')">anzu_prof.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nexus/coaichronicle.html')">coaichronicle.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nexus/index.html')">index.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nexus/merged.html')">merged.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nexus/merged_template.html')">merged_template.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nexus/profile.html')">profile.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/nexus/test.html')">test.html</span></li>
                        </ul>
                    </li>

                    <li class="tree-item">
                        <span class="folder" onclick="toggle(this)">/pea</span>
                        <ul class="nested">
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/complaint-form.html')">complaint-form.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/deepstate.html')">deepstate.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/idk.html')">idk.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/left_foot.html')">left_foot.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/msicc.html')">msicc.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/news_ticker-offer.html')">news_ticker-offer.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/p.html')">p.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/p345.html')">p345.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/parable.html')">parable.html</span></li>
                            <li class="tree-item">
                                <span class="folder" onclick="toggle(this)">/pips</span>
                                <ul class="nested">
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/pips/pip_1.html')">pip_1.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/pips/pip_2.html')">pip_2.html</span></li>
                                    <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/pips/pip_3.html')">pip_3.html</span></li>
                                </ul>
                            </li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/pips_decree.html')">pips_decree.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/pod.html')">pod.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/princessexe.html')">princessexe.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/royal_ridicuments.html')">royal_ridicuments.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/pea/which-dr_quiz.html')">which-dr_quiz.html</span></li>
                        </ul>
                    </li>

                    <li class="tree-item">
                        <span class="folder" onclick="toggle(this)">/play</span>
                        <ul class="nested">
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/play/cavebot.html')">cavebot.html</span></li>
                            <li class="tree-item"><span class="file" onclick="load('https://coaiexist.wtf/play/games-portal.html')">games-portal.html</span></li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div class="section-title">📦 UNPUBLISHED (GITHUB)</div>

            <div id="github-tree-container"></div>

        </div>

        <div class="workspace-controls">
            <div class="workspace-btn-group">
                <button onclick="saveSession()">💾 SAVE</button>
                <button onclick="restoreSession()">📂 LOAD</button>
                <button onclick="clearSession()">♻️ RESET</button>
            </div>
             <div class="workspace-btn-group">
                <button onclick="exportSession()">⬇️ EXPORT</button>
                <button onclick="importSessionTrigger()">⬆️ IMPORT</button>
                <input type="file" id="importFile" style="display:none" onchange="importSession(this)">
            </div>
            <div id="statusMsg" style="color: #ffff00; font-size: 0.8em; min-height: 1.2em;"></div>
        </div>
    </div>

    <div class="preview-area">
        <div class="previews-container" id="previewsContainer">
            <div class="empty-state">
                [ Click a file to launch preview ]<br>
                ✨
            </div>
        </div>
    </div>
</div>

<script>
    const BASE_URL = 'https://TheNabu222.github.io/entropic-ai/';

    // Injected JSON Tree
    const fileTreeData = {json.dumps(file_tree)};

    function buildTree(node, container, pathName = '') {{
        const ul = document.createElement('ul');
        if (pathName === '') {{
            ul.className = 'nested active'; // Root level visible
        }} else {{
            ul.className = 'nested';
        }}

        // Sort keys: Folders first, then files
        const keys = Object.keys(node).sort((a, b) => {{
            const typeA = node[a].__type__ || 'unknown';
            const typeB = node[b].__type__ || 'unknown';
            if (typeA !== typeB) {{
                return typeA === 'folder' ? -1 : 1;
            }}
            return a.localeCompare(b);
        }});

        keys.forEach(key => {{
            if (key.startsWith('__')) return; // Skip metadata

            const item = node[key];
            const li = document.createElement('li');
            li.className = 'tree-item';

            if (item.__type__ === 'folder') {{
                const span = document.createElement('span');
                span.className = 'folder';
                span.textContent = '/' + key;
                span.onclick = function() {{ toggle(this); }};
                li.appendChild(span);

                // Recursively build children
                buildTree(item.__children__, li, pathName + '/' + key);
            }} else if (item.__type__ === 'file') {{
                const span = document.createElement('span');
                span.className = 'file';
                span.textContent = key;
                const fullUrl = BASE_URL + item.path;
                span.onclick = function() {{ load(fullUrl); }};
                li.appendChild(span);
            }}

            ul.appendChild(li);
        }});

        container.appendChild(ul);
    }}

    // Initialize Tree
    const rootContainer = document.getElementById('github-tree-container');
    buildTree(fileTreeData, rootContainer);


    function load(url) {{
        const container = document.getElementById('previewsContainer');
        const emptyState = document.querySelector('.empty-state');
        if(emptyState) emptyState.remove();

        const panel = document.createElement('div');
        panel.className = 'preview-panel';
        panel.dataset.url = url; // Store URL for saving session
        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">${{url}}</div>
                <div>
                    <button onclick="window.open('${{url}}', '_blank')">🔗 Open</button>
                    <button onclick="this.closest('.preview-panel').remove(); autoSave();">✕ Close</button>
                </div>
            </div>
            <iframe src="${{url}}"></iframe>
        `;

        // Prepend so newest is top/first
        container.prepend(panel);
        autoSave();
    }}

    function toggle(el) {{
        el.classList.toggle('expanded');
        el.nextElementSibling.classList.toggle('active');
    }}

    function expandAll() {{
        document.querySelectorAll('.nested').forEach(e => e.classList.add('active'));
        document.querySelectorAll('.folder').forEach(e => e.classList.add('expanded'));
    }}

    function collapseAll() {{
        document.querySelectorAll('.nested').forEach(e => e.classList.remove('active'));
        document.querySelectorAll('.folder').forEach(e => e.classList.remove('expanded'));
    }}

    function clearPreviews() {{
        document.getElementById('previewsContainer').innerHTML = `
            <div class="empty-state">
                [ Click a file to launch preview ]<br>
                ✨
            </div>
        `;
        autoSave();
    }}

    function toggleView() {{
        const container = document.getElementById('previewsContainer');
        container.classList.toggle('grid-view');
        const btn = document.getElementById('viewToggleBtn');
        btn.textContent = container.classList.contains('grid-view') ? '[=] LIST' : '[=] GRID';
    }}

    // --- Workspace / Session Logic ---

    function getOpenUrls() {{
        const panels = document.querySelectorAll('.preview-panel');
        const urls = [];
        // Iterate backwards because we prepend elements
        for (let i = panels.length - 1; i >= 0; i--) {{
            urls.push(panels[i].dataset.url);
        }}
        return urls;
    }}

    function showStatus(msg) {{
        const el = document.getElementById('statusMsg');
        el.textContent = msg;
        setTimeout(() => el.textContent = '', 3000);
    }}

    function autoSave() {{
        // Save to 'autosave' key
        const urls = getOpenUrls();
        localStorage.setItem('coai_audit_autosave', JSON.stringify(urls));
    }}

    function saveSession() {{
        const urls = getOpenUrls();
        localStorage.setItem('coai_audit_saved', JSON.stringify(urls));
        showStatus('Session Saved!');
    }}

    function restoreSession() {{
        const saved = localStorage.getItem('coai_audit_saved');
        if (saved) {{
            const urls = JSON.parse(saved);
            clearPreviews();
            urls.forEach(url => {{
                 const container = document.getElementById('previewsContainer');
                 const emptyState = document.querySelector('.empty-state');
                 if(emptyState) emptyState.remove();

                 const panel = document.createElement('div');
                 panel.className = 'preview-panel';
                 panel.dataset.url = url;
                 panel.innerHTML = `
                    <div class="panel-header">
                        <div class="panel-title">${{url}}</div>
                        <div>
                            <button onclick="window.open('${{url}}', '_blank')">🔗 Open</button>
                            <button onclick="this.closest('.preview-panel').remove(); autoSave();">✕ Close</button>
                        </div>
                    </div>
                    <iframe src="${{url}}"></iframe>
                `;
                container.prepend(panel);
            }});
            autoSave();
            showStatus('Session Restored!');
        }} else {{
            showStatus('No saved session found.');
        }}
    }}

    function clearSession() {{
        localStorage.removeItem('coai_audit_saved');
        localStorage.removeItem('coai_audit_autosave');
        clearPreviews();
        showStatus('Session Cleared.');
    }}

    function exportSession() {{
        const urls = getOpenUrls();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(urls));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "coai_workspace.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }}

    function importSessionTrigger() {{
        document.getElementById('importFile').click();
    }}

    function importSession(input) {{
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {{
            try {{
                const urls = JSON.parse(e.target.result);
                if (Array.isArray(urls)) {{
                    clearPreviews();
                    urls.forEach(url => {{
                         const container = document.getElementById('previewsContainer');
                         const emptyState = document.querySelector('.empty-state');
                         if(emptyState) emptyState.remove();

                         const panel = document.createElement('div');
                         panel.className = 'preview-panel';
                         panel.dataset.url = url;
                         panel.innerHTML = `
                            <div class="panel-header">
                                <div class="panel-title">${{url}}</div>
                                <div>
                                    <button onclick="window.open('${{url}}', '_blank')">🔗 Open</button>
                                    <button onclick="this.closest('.preview-panel').remove(); autoSave();">✕ Close</button>
                                </div>
                            </div>
                            <iframe src="${{url}}"></iframe>
                        `;
                        container.prepend(panel);
                    }});
                    autoSave();
                    showStatus('Workspace Imported!');
                }}
            }} catch (err) {{
                console.error(err);
                showStatus('Error reading file');
            }}
        }};
        reader.readAsText(file);
        input.value = ''; // Reset
    }}

    // Auto-load autosave on boot
    window.addEventListener('load', () => {{
         const saved = localStorage.getItem('coai_audit_autosave');
         if (saved) {{
             const urls = JSON.parse(saved);
             if (urls.length > 0) {{
                 urls.forEach(url => {{
                     const container = document.getElementById('previewsContainer');
                     const emptyState = document.querySelector('.empty-state');
                     if(emptyState) emptyState.remove();

                     const panel = document.createElement('div');
                     panel.className = 'preview-panel';
                     panel.dataset.url = url;
                     panel.innerHTML = `
                        <div class="panel-header">
                            <div class="panel-title">${{url}}</div>
                            <div>
                                <button onclick="window.open('${{url}}', '_blank')">🔗 Open</button>
                                <button onclick="this.closest('.preview-panel').remove(); autoSave();">✕ Close</button>
                            </div>
                        </div>
                        <iframe src="${{url}}"></iframe>
                    `;
                    container.prepend(panel);
                 }});
             }}
         }}
    }});

</script>

</body>
</html>'''

if __name__ == '__main__':
    # Increase recursion limit
    sys.setrecursionlimit(2000)

    print('Scanning repository...')
    file_tree = get_file_tree('.')

    print('Generating HTML...')
    html_content = generate_html(file_tree)

    output_path = 'unpublished/audit_previewer_jules.html'
    with open(output_path, 'w') as f:
        f.write(html_content)

    print(f'Successfully updated {output_path}')
