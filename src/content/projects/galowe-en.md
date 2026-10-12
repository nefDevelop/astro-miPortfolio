---
title: "Galo"
highlight: "we"
lang: "en"
route: "galowe"
order: 3
---

## The Challenge
Managing your own digital library usually ends up depending on a machine that is always on and on a closed ecosystem. Galowe starts from the opposite idea: a library you can read and sync from the browser, but also from a **Kindle**, a **Kobo** or **KOReader**, without handing your data to third parties.

## Technical Solution
Galowe is **Go from scratch** —not a Calibre fork— with a built-in sync server. It accepts eleven input formats and seven output ones, and talks to each reader over the channel that reader understands.

### Key implementation points
- **In-house conversion engine:** 11 input formats × 7 output formats, with a **MOBI and PalmDB parser written from scratch**, PalmDOC compressor included.
- **Native KOSync:** Implements the standard KOReader protocol and reimplements KOReader's fast-sampling `partialMD5` in Go, so the reading position is shared between the web reader and the device.
- **Four ways to the Kindle:** Send-to-Kindle over **SMTP**, an **USB/MTP** connection through `gio copy`, an E-Ink portal and **KOSync**.
- **JavaScript-free E-Ink portal:** Plain HTML and CSS with server-side pagination, built for the Kindle experimental browser and high-contrast screens.
- **Built-in web reader:** **Foliate.js** with five themes and four typefaces, OpenDyslexic included, plus in-book search.
- **PDF through Typst:** A Typst engine compiled to **WebAssembly** to produce PDFs with no external dependency.

### Result
A book converts, reads, and resumes where you left it on web, Kindle, or KOReader, with direct import from Calibre's `metadata.db`.

## What I learned
Galowe pushed me down to the level of the file format: writing a MOBI parser and its compressor teaches you that a book is nothing more than a block structure backed by a specification. And reimplementing KOReader's hash proved that real interoperability is not achieved by reading the docs, but by making the numbers match the other engine's.
