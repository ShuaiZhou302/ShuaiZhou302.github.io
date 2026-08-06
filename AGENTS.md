# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **static site** (HTML/CSS/vanilla JS) with **no build step, no package manager, and no dependencies to install**. Python 3 is the only runtime requirement (used purely for local static file servers) and is preinstalled in the Cloud environment.

There are two independent static "products", each served on its own port:

- **Personal homepage** (repo root): `index.html`, `stylesheet.css`, `images/`, `documents/`.
  - Run: `python3 -m http.server 8080` from the repo root, then open `http://localhost:8080/`.
- **EgoANT × HomER research report** (`egoant-wgo-report/`): interactive bilingual (ZH/EN) report.
  - Run: `python3 serve_report.py --port 8765` from inside `egoant-wgo-report/` (see `egoant-wgo-report/README.md`), then open `http://localhost:8765/`.

Non-obvious caveats:

- The report **must** be served over HTTP, not opened as a `file://` path: it uses `fetch()` to load `data/*.json` (blocked under `file://`, which shows a "Could not load data files" banner) and needs HTTP **Range** support for HTML5 video seeking. Use `serve_report.py` (Range-enabled); plain `python3 -m http.server` does not serve Range requests. `egoant-wgo-report/serve.py` is an equivalent alternative.
- There are no lint or automated-test suites in this repo. "Testing" means serving the site and visually verifying it in a browser.
- The GitHub Pages deploy workflow (`.github/workflows/deploy.yaml`) is intentionally disabled (`if: false`); the other workflows are Hugo Blox template leftovers and do not affect the site.
