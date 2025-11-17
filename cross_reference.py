#!/usr/bin/env python3
"""Cross-reference extracted HTML files with the repository contents."""

from __future__ import annotations

import hashlib
import difflib
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List, Sequence


REPO_ROOT = Path(__file__).resolve().parent
CANDIDATE_EXTRACTED_DIRS = ["html_artifacts_clean", "html_artifacts", "extracted_artifacts"]
REPORT_DIR = REPO_ROOT / "reports"
IGNORE_DIRS = {"html_artifacts", "html_artifacts_clean", "extracted_artifacts", ".git"}


def iter_repo_html_files(root: Path) -> Iterable[Path]:
    """Yield HTML files from the repo while ignoring generated folders."""

    for path in root.rglob("*.html"):
        try:
            relative_parts = path.relative_to(root).parts
        except ValueError:
            continue

        if any(part in IGNORE_DIRS for part in relative_parts):
            continue

        yield path


def read_file_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def file_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def ensure_reports_dir() -> None:
    REPORT_DIR.mkdir(exist_ok=True)


def write_report(lines: Sequence[str]) -> Path:
    ensure_reports_dir()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = REPORT_DIR / f"cross_reference_{timestamp}.md"
    report_path.write_text("\n".join(lines), encoding="utf-8")
    return report_path


def find_extracted_dir() -> Path:
    for folder in CANDIDATE_EXTRACTED_DIRS:
        candidate = REPO_ROOT / folder
        if candidate.exists():
            return candidate
    raise SystemExit(
        "Unable to locate extracted HTML. Expected one of: "
        + ", ".join(CANDIDATE_EXTRACTED_DIRS)
    )


def main() -> None:
    extracted_dir = find_extracted_dir()

    extracted_files = [
        path for path in extracted_dir.glob("*.html") if path.name != "INDEX.html"
    ]
    extracted_files.sort(key=lambda p: p.name.lower())

    existing_files = list(iter_repo_html_files(REPO_ROOT))

    print(f"Found {len(extracted_files)} extracted HTML files\n")
    print(f"Scanning repo for published HTML… {len(existing_files)} files detected\n")
    print("=" * 80)

    existing_by_name: Dict[str, List[Path]] = {}
    existing_by_hash: Dict[str, List[Path]] = {}

    for html_file in existing_files:
        text = read_file_text(html_file)
        hashed = file_hash(text)
        existing_by_name.setdefault(html_file.name, []).append(html_file)
        existing_by_hash.setdefault(hashed, []).append(html_file)

    existing_filenames = list(existing_by_name.keys())

    already_published: List[Path] = []
    content_matches: List[tuple[Path, List[Path]]] = []
    potential_duplicates: List[tuple[Path, List[str]]] = []
    new_files: List[Path] = []

    report_lines: List[str] = ["# Cross-reference report", ""]
    report_lines.append(f"Generated: {datetime.now().isoformat(timespec='seconds')}")
    report_lines.append("")

    for extracted in extracted_files:
        extracted_text = read_file_text(extracted)
        extracted_hash = file_hash(extracted_text)

        if extracted.name in existing_by_name:
            already_published.append(extracted)
            print(f"✓ ALREADY EXISTS: {extracted.name}")
            continue

        if extracted_hash in existing_by_hash:
            matches = existing_by_hash[extracted_hash]
            content_matches.append((extracted, matches))
            print(f"≣ CONTENT MATCH: {extracted.name}")
            for match in matches:
                print(f"    → identical to: {match.relative_to(REPO_ROOT)}")
            continue

        close_matches = difflib.get_close_matches(
            extracted.name, existing_filenames, n=3, cutoff=0.6
        )

        if close_matches:
            potential_duplicates.append((extracted, close_matches))
            print(f"? SIMILAR EXISTS: {extracted.name}")
            for match in close_matches:
                for match_path in existing_by_name.get(match, []):
                    print(f"    → {match_path.relative_to(REPO_ROOT)}")
        else:
            new_files.append(extracted)
            print(f"★ NEW FILE: {extracted.name}")

    print("\n" + "=" * 80)
    print("\n📊 SUMMARY:")
    print(f"  Total extracted: {len(extracted_files)}")
    print(f"  Already published: {len(already_published)}")
    print(f"  Content matches: {len(content_matches)}")
    print(f"  Potentially duplicate: {len(potential_duplicates)}")
    print(f"  COMPLETELY NEW: {len(new_files)}")

    if new_files:
        print(f"\n🆕 UNPUBLISHED FILES ({len(new_files)}):")
        for f in new_files:
            print(f"  - {f.name}")

    if content_matches:
        print(f"\n≣ CONTENT MATCH ({len(content_matches)}):")
        for extracted, matches in content_matches:
            print(f"  - {extracted.name}")
            for match in matches:
                print(f"      identical to: {match.relative_to(REPO_ROOT)}")

    if potential_duplicates:
        print(f"\n🤔 POTENTIALLY DUPLICATE ({len(potential_duplicates)}):")
        for extracted, matches in potential_duplicates:
            print(f"  - {extracted.name}")
            for match in matches:
                print(f"      similar to: {match}")

    report_lines.extend(
        [
            "## Summary",
            "",
            f"- Total extracted: {len(extracted_files)}",
            f"- Already published: {len(already_published)}",
            f"- Content matches: {len(content_matches)}",
            f"- Potential duplicates: {len(potential_duplicates)}",
            f"- Completely new: {len(new_files)}",
            "",
        ]
    )

    def add_section(title: str, entries: Sequence[str]) -> None:
        if not entries:
            return
        report_lines.append(f"## {title}")
        report_lines.append("")
        report_lines.extend(entries)
        report_lines.append("")

    add_section(
        "Unpublished files",
        [f"- {f.name}" for f in new_files],
    )

    add_section(
        "Content matches",
        [
            "- {} → {}".format(
                extracted.name,
                ", ".join(str(match.relative_to(REPO_ROOT)) for match in matches),
            )
            for extracted, matches in content_matches
        ],
    )

    add_section(
        "Potential duplicates",
        [
            "- {} → {}".format(extracted.name, ", ".join(matches))
            for extracted, matches in potential_duplicates
        ],
    )

    report_path = write_report(report_lines)
    print(f"\nReport saved to {report_path.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
