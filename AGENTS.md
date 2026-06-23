# AGENTS.md — Project Architecture

## What This Is

A single-page static website in Ukrainian with a fictional "classified archive" aesthetic.
No build tools, no framework, no server-side code.

## File Map

```
/
├── index.html       — All markup: six sections + modal + status bar
├── style.css        — All styles; CSS custom properties at :root
├── script.js        — All behaviour; no external dependencies
├── netlify.toml     — Optional Netlify static publish config + security headers
├── .nojekyll        — Keeps GitHub Pages from running Jekyll processing
├── .gitignore       — Ignores local/editor/Codex workspace files
├── .gitattributes   — Keeps text files normalized as UTF-8/LF
├── README.md        — User-facing documentation
└── AGENTS.md        — This file
```

## Key Conventions

### HTML
- All content in Ukrainian (`lang="uk"`)
- Each section has `id` matching its nav `data-section` attribute
- ARIA labels and roles on all interactive/landmark elements
- SVG images are inline inside `<figure>` elements — no external image files

### CSS
- Design tokens live entirely in `:root` variables (backgrounds, borders, text, accent, fonts)
- Two font families: `--ff-display` (VT323) for headings, `--ff-mono` (Share Tech Mono) for everything else
- Atmospheric overlays (vignette, scanlines, grain) are fixed `position: fixed` with `pointer-events: none` and high z-index (8998–9002)
- Scroll reveal: add class `reveal` in HTML; JS adds `visible` via IntersectionObserver
- Responsive breakpoints: 920px (tablet, 2-col grid), 640px (mobile, 1-col + drawer nav)
- Custom cursor disabled on touch/mobile via `@media (hover: none)`

### JavaScript
- Plain browser JavaScript, no imports, no transpilation needed
- Each feature is an immediately-invoked function scope — no global pollution
- `typeIn()` returns a Promise for sequential async typing animations
- Easter egg: 5 clicks on `#heroTitle` within 2.8 s opens the modal
- `IntersectionObserver` handles scroll-reveal; siblings within a shared parent get staggered `transitionDelay`
- Glitch effect uses `performance.now()` instead of `Math.random()` for pseudo-determinism

## Non-obvious Decisions

- `Math.random()` and `Date.now()` are intentionally avoided in the glitch scheduler and cursor
  movement — using `performance.now()` instead to avoid potential lint/build-tool warnings
  about non-deterministic code in static contexts.
- The `modal-backdrop` uses `hidden` attribute (not a class) for accessibility — screen readers
  treat `hidden` as truly absent from the tree.
- CRT grain overlay is `300% × 300%` offset `−100%` from origin so the animation
  (`grainShift`) can translate it without revealing background edges.
- The custom cursor `body.cursor-active` class is toggled on `mouseenter/mouseleave` so the
  crosshair is invisible until the user moves the mouse (avoids flash at 0,0 on page load).
