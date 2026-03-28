#!/usr/bin/env python3
"""
generate_manifest.py
Scans the repository folder structure and generates a manifest.json
listing only .html and .docx files in a nested tree format.

Usage:
    python generate_manifest.py            # just regenerate manifest.json
    python generate_manifest.py --serve    # regenerate + start server + open browser
    python generate_manifest.py --serve 3000  # same but on custom port

Designed to be called from a pre-commit git hook so the explorer
page (index.html) always reflects the latest project structure.
"""

import argparse
import http.server
import json
import os
import socketserver
import sys
import threading
import webbrowser
from pathlib import Path

# ── Configuration ──────────────────────────────────────────────
REPO_ROOT = Path(__file__).resolve().parent
OUTPUT_FILE = REPO_ROOT / "manifest.json"

# Extensions to include
INCLUDE_EXTENSIONS = {".html", ".docx"}

# Directories / files to skip entirely
SKIP_DIRS = {
    ".git",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
    ".claude",
}

# Files to skip by their relative path from repo root
SKIP_FILES = {
    "index.html",          # the root explorer page
    "manifest.json",
    "generate_manifest.py",
}


def build_tree(root_path: Path) -> dict:
    """
    Recursively build a nested dict representing the folder tree.
    Only includes folders that (eventually) contain .html or .docx files.

    Returns:
        {
            "name": "folder-name",
            "type": "folder",
            "children": [
                { "name": "file.html", "type": "file", "path": "relative/path/file.html" },
                { "name": "subfolder", "type": "folder", "children": [...] },
                ...
            ]
        }
    """
    node = {
        "name": root_path.name or "root",
        "type": "folder",
        "children": [],
    }

    try:
        entries = sorted(root_path.iterdir(), key=lambda e: (not e.is_dir(), e.name.lower()))
    except PermissionError:
        return node

    for entry in entries:
        # Skip hidden dirs/files and blacklisted dirs
        if entry.name.startswith(".") and entry.name != ".":
            continue
        if entry.is_dir() and entry.name in SKIP_DIRS:
            continue

        if entry.is_dir():
            child = build_tree(entry)
            # Only include folders that contain at least one valid file
            if child["children"]:
                node["children"].append(child)

        elif entry.is_file():
            # Only skip files at the repo root level that are in SKIP_FILES
            rel_path = entry.relative_to(REPO_ROOT).as_posix()
            if rel_path in SKIP_FILES:
                continue
            if entry.suffix.lower() in INCLUDE_EXTENSIONS:
                rel_path = entry.relative_to(REPO_ROOT).as_posix()
                node["children"].append({
                    "name": entry.name,
                    "type": "file",
                    "ext": entry.suffix.lower().lstrip("."),
                    "size": entry.stat().st_size,
                    "path": rel_path,
                })

    return node


def main():
    print(f"📂 Scanning: {REPO_ROOT}")
    tree = build_tree(REPO_ROOT)

    # Add metadata
    manifest = {
        "generated": True,
        "root": tree,
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    # Count files
    def count_files(node):
        total = 0
        for child in node.get("children", []):
            if child["type"] == "file":
                total += 1
            else:
                total += count_files(child)
        return total

    n = count_files(tree)
    print(f"✅ manifest.json generated with {n} files")
    return 0


def serve(port=8080):
    """Start a local HTTP server and auto-open the browser."""
    os.chdir(REPO_ROOT)

    handler = http.server.SimpleHTTPRequestHandler
    handler.log_message = lambda *args: None  # quiet logs

    with socketserver.TCPServer(("", port), handler) as httpd:
        url = f"http://localhost:{port}"
        print(f"🚀 Server running at {url}")
        print(f"   Press Ctrl+C to stop.\n")

        # Open browser after a short delay to let server start
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped.")
            httpd.shutdown()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate manifest & optionally serve")
    parser.add_argument("--serve", nargs="?", const=8080, type=int,
                        metavar="PORT", help="Start server & open browser (default port: 8080)")
    args = parser.parse_args()

    main()

    if args.serve is not None:
        serve(args.serve)
