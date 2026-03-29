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

# Folders with external URLs (e.g. React/Vite apps deployed on Netlify)
# These will show as links to the external URL instead of loading the local file
EXTERNAL_URLS = {
    "gradient-descent-react": "https://gradient-descent-saas.netlify.app",
}

# Category mapping for each project folder
# Used by the explorer UI for filtering by topic
FOLDER_CATEGORIES = {
    # Statistics & Probability
    "expected-value-vs-mean":           "Statistics & Probability",
    "variance-and-standard-deviation":  "Statistics & Probability",
    "normal-distribution-and-clt":      "Statistics & Probability",
    "hypothesis-testing":               "Statistics & Probability",
    "bayes-theorem":                    "Statistics & Probability",
    "correlation-vs-causation":         "Statistics & Probability",
    "why_start_with_iris":              "Statistics & Probability",
    "kdd_process":                      "Statistics & Probability",
    "probability-distributions":         "Statistics & Probability",
    # Linear Algebra
    "matrix-transformations":                       "Linear Algebra",
    "dot-product-and-cosine-similarity":            "Linear Algebra",
    "singular-value-decomposition(svd)":            "Linear Algebra",
    "eckart-young-the-closest-rank-k-matrix-to-A":  "Linear Algebra",
    "eigenvalues-and-eigenvectors":                "Linear Algebra",
    "vector-spaces-and-subspaces":                 "Linear Algebra",
    # Machine Learning
    "k-means-clustering":               "Machine Learning",
    "decision-trees-and-random-forest":  "Machine Learning",
    "bias-variance-tradeoff":            "Machine Learning",
    "confusion-matrix-and-metrics":      "Machine Learning",
    "cross-validation":                  "Machine Learning",
    "Regression-Models-Explained":       "Machine Learning",
    "gradient-descent-saas":             "Machine Learning",
    "gradient-descent-react":            "Machine Learning",
    "gradient-descent-deep-dive":        "Machine Learning",
    "dimensionality-reduction":          "Machine Learning",
    "regression-analysis":               "Machine Learning",
    "clustering-algorithms":             "Machine Learning",
    # Deep Learning
    "neural-networks-fundamentals":      "Deep Learning",
    "convolutional-neural-networks":     "Deep Learning",
    "neural-network-backpropagation":    "Deep Learning",
    "activation-functions":              "Deep Learning",
    "loss-functions":                    "Deep Learning",
    # Data Processing
    "feature-scaling":                   "Data Processing",
    "handling-missing-data":             "Data Processing",
    # Drone Research
    "drone-top20-research-topic":        "Drone Research",
    # Swarm Drone Research
    "swarm-drone-01-reynolds-boids":            "Swarm Drone Research",
    "swarm-drone-02-olfati-saber-flocking":     "Swarm Drone Research",
    "swarm-drone-03-kennedy-pso":               "Swarm Drone Research",
    "swarm-drone-04-dorigo-ant-colony":         "Swarm Drone Research",
    "swarm-drone-05-brambilla-swarm-robotics":  "Swarm Drone Research",
    "swarm-drone-06-chung-aerial-swarm-survey": "Swarm Drone Research",
    "swarm-drone-07-vasarhelyi-optimized-flocking": "Swarm Drone Research",
    "swarm-drone-08-preiss-crazyswarm":         "Swarm Drone Research",
    "swarm-drone-09-zhou-micro-flying-robots":  "Swarm Drone Research",
    "swarm-drone-10-schilling-vision-swarm":    "Swarm Drone Research",
    # Swarm Drone Complete Guide
    "swarm-drone-complete-guide":              "Swarm Drone Research",
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

    # Attach category if this folder is in the mapping
    if root_path.name in FOLDER_CATEGORIES:
        node["category"] = FOLDER_CATEGORIES[root_path.name]

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
                # Use parent folder name as display name for index.html
                display_name = entry.name
                if entry.name.lower() == "index.html":
                    display_name = root_path.name

                file_entry = {
                    "name": entry.name,
                    "displayName": display_name,
                    "type": "file",
                    "ext": entry.suffix.lower().lstrip("."),
                    "size": entry.stat().st_size,
                    "path": rel_path,
                }

                # Add external URL if this folder is mapped
                if root_path.name in EXTERNAL_URLS and entry.name.lower() == "index.html":
                    file_entry["externalUrl"] = EXTERNAL_URLS[root_path.name]

                node["children"].append(file_entry)

    return node


def main():
    print(f"📂 Scanning: {REPO_ROOT}")
    tree = build_tree(REPO_ROOT)

    # Collect unique categories in display order
    category_order = []
    seen = set()
    for cat in FOLDER_CATEGORIES.values():
        if cat not in seen:
            category_order.append(cat)
            seen.add(cat)

    # Add metadata
    manifest = {
        "generated": True,
        "categories": category_order,
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
