---
title: "Gave"
highlight: "oc"
lang: "en"
route: "gaveoc"
order: 2
---

## The Challenge
The web is ephemeral: an article you link today is gone tomorrow. Saving the page is not enough if only the HTML is kept without its assets, or if the result is unreadable and impossible to search. The goal of **Gaveoc** was to build a self-hosted archiver that preserved the page exactly as it looked while turning it into a clean, searchable, annotatable document.

## Technical Solution
A single Go binary serves both the backend and the frontend. Capture combines **Obelisk** (fetches the page with its CSS, JavaScript and images) and **Readability** (extracts the clean article), and everything is indexed in **SQLite with FTS5** for full-text search.

### Architecture and capabilities
- **Clean Architecture and DDD:** The tree separates `domain`, `application`, `adapters` and `infrastructure`. Use cases know neither the database nor the interface, which is what allows several delivery surfaces to sit on the same core.
- **Four surfaces:** One codebase ships as a **SvelteKit 5** SPA, an installable PWA, an Android app through **Capacitor** and an **MV3** browser extension.
- **Organisation and search:** An FTS5 index over the extracted text, with tags, collections and automatic tagging rules.
- **Heavy work in the background:** OCR with **Tesseract** and `pdftoppm` on a worker queue with retries, so PDFs and scanned documents get indexed too.
- **Portability:** Export to ePub, PDF (via **Typst**), Markdown with YAML front matter and Netscape bookmarks.
- **Interface:** Material You 3 and Adwaita, light and dark mode, loading skeletons and toasts.

### Result
28,300 lines of code, over half of them tests: 67 files and 617 functions, with **45 routes documented in Swagger**. Deployment is just one binary and a SQLite database.

## What I learned
Gaveoc is the project where layered separation stopped being theory. Keeping four delivery surfaces on top of one core forces the domain to depend on none of them and pushes everything platform-specific into its adapter. The hardest part was not archiving, but keeping what was archived readable.
