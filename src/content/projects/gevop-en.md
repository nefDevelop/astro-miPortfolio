---
title: "Ge"
highlight: "vop"
lang: "en"
route: "gevop"
order: 4
---

## The Challenge
An IDE is the program a developer keeps open the longest and, at the same time, one of the hardest to write: it has to talk to language servers, debuggers, Git and a real terminal, without ever freezing. Gevop set out to do it in **Go**, with a single binary that works just as well on the desktop as in the browser.

## Technical Solution
Gevop strictly separates domain, use cases and infrastructure. The same binary starts as a desktop app with **Wails** or as a web server when passed a flag, so the logic is identical in both modes and only the transport of the interface changes.

### Key implementation points
- **Plugins as isolated processes:** Extensions run in separate processes and speak **JSON-RPC 2.0** over stdin/stdout. A failing plugin cannot bring the IDE down and can be written in any language.
- **Code intelligence:** Full **LSP** support (completion, definition, hover, rename, semantic tokens) and **DAP** for debugging.
- **Built-in terminal:** A real PTY with UTF-8 support and smooth resizing.
- **Security:** Protection against *path traversal*, secret scanning and trusted workspaces.
- **Local history:** Recover earlier versions of any file through delta snapshots signed with **SHA-256** and a retention of 50 versions.
- **Interface:** 58 Svelte components and four themes, one of them replicating **VS Code Dark+** token by token.

### Result
82 Go test files with **252 tests and 17 benchmarks**, plus 28 frontend test files with 450 assertions. Continuous integration runs six jobs with blocking thresholds: overall coverage ≥ 50%, `domain` ≥ 85% and `delivery/httpserver` ≥ 70%, with blocking `govulncheck` and `gosec` as a report with a documented baseline.

## What I learned
Writing an IDE teaches you that the hard part is not drawing the editor, but coordinating everything so a slow task never freezes the rest: every language, debugger and terminal is a process you have to negotiate with. Isolating plugins into processes was the decision that simplified the design the most and held up best under failure.
