"""Generate a JSON index of all HTML/HTM files in the repository.

The resulting list is saved to reports/html_files.json for use by the
unpublished/master_archive.html previewer. It walks the repo recursively
and skips common tooling directories (e.g., .git, node_modules, venvs).
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

EXCLUDED_DIRS = {
    ".git",
    ".github",
    ".idea",
    "node_modules",
    "venv",
    ".venv",
    "env",
    "__pycache__",
}

HTML_EXTS = {".html", ".htm"}


def is_excluded(path: Path) -> bool:
    """Return True if the path is inside a directory we should skip."""
    return any(part in EXCLUDED_DIRS for part in path.parts)


def iter_html_files(root: Path) -> Iterable[Path]:
    """Yield all HTML files under root, skipping excluded directories."""
    for path in root.rglob("*"):
        if path.is_file() and path.suffix.lower() in HTML_EXTS and not is_excluded(path):
            yield path


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    output_path = repo_root / "reports" / "html_files.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    html_files = sorted(
        (p.relative_to(repo_root).as_posix() for p in iter_html_files(repo_root)),
        key=str.lower,
    )

    output_path.write_text(json.dumps(html_files, indent=2))
    print(f"Indexed {len(html_files)} HTML files -> {output_path}")


if __name__ == "__main__":
    main()
