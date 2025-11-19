# Bulma Repo Page Bespoke Editor

This archived reference editor gives you a Bulma-based control surface to produce repo-focused landing sections. Adjust repository metadata, accent color, layout tone, and quick tags on the left; the live preview and generated markup update on the right. It now borrows rich text capabilities from the `richtexteditor` reference, letting you compose README excerpts with inline formatting, templates, source view, and stats. Pull-ins from other WYSIWYG builds add palette presets, a snippet library, and snapshot import/export so you can shuttle configs between sessions.

## Usage
1. Open `repo-pages-editor.html` in a browser.
2. Update the repo name, tagline, URL, accent color, layout (dark/light), topics, and highlight note.
3. Craft README highlights in the **README rich text** block. Use the toolbar for bold/italic/underline, bullets, numbered lists, block quotes, inline highlights, quick link creation, and drop-in templates (callout, code block, checklist). Tap the snippet dropdown to inject heroes, release bulletins, badge shelves, stack blurbs, and FAQ blocks. Toggle **Show/Hide HTML** to inspect the generated source or paste your own HTML snippets.
4. Monitor the live word count, estimated reading time, and HTML character length to keep your landing sections tight.
5. Use the color picker or preset chips to mirror palettes from other editors. Save or load session snapshots, or import/export JSON to share configs. Click **Refresh preview** to rebuild the Bulma markup or **Copy markup** to place the generated HTML on your repo page. State is persisted in localStorage so you can return later without losing edits.

The output is a ready-to-drop section that includes a hero, README snapshot, deployment status block, and sidebar callouts tailored for repository pages.
