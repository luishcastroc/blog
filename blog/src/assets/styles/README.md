# Styles Architecture

A small, modular SCSS **Neobrutalism** design system: flat solid fills, thick
ink borders, hard offset shadows, sharp corners, and a tactile press
interaction. Colors are CSS custom properties so the light/dark theme toggle
(`data-theme` on `<body>`) swaps them with no markup changes.

## Directory Structure

```
src/assets/styles/
├── main.scss                 # Entry point: Tailwind + Prism + the modules below
├── base/
│   ├── _variables.scss       # Design tokens (fonts, borders) + theme color vars
│   ├── _reset.scss           # HTML/body reset, global focus-visible ring, scrollbar
│   └── _typography.scss      # Bricolage display / Inter body / JetBrains Mono utility
├── components/
│   ├── _buttons.scss         # .nb-btn (+ --primary / --ghost / --square)
│   ├── _forms.scss           # .nb-input / .nb-textarea / .nb-label / .nb-error
│   ├── _card.scss            # .nb-card / .nb-panel / .nb-badge / .nb-chip / .nb-mark
│   ├── _navigation.scss      # .nb-navlink and the mobile .nb-menu dropdown
│   └── _blog.scss            # Article markdown + neobrutalist Prism code blocks
└── utilities/
    └── _nb.scss              # Shared primitives: block() + press() mixins, .nb-block / .nb-press
```

## Design tokens

Defined in `base/_variables.scss` as CSS custom properties, scoped per theme:

- Colors: `--paper`, `--surface`, `--ash`, `--ink`, `--muted`, `--red`,
  `--red-ink`, `--link`, `--on-red`
- Shadows: `--nb-shadow`, `--nb-shadow-sm`, `--nb-shadow-lg` (hard, no blur)

Tailwind mirrors these in `blog/tailwind.config.cjs` (`bg-paper`, `text-ink`,
`border-3`, `shadow-nb`, `font-display`, `font-mono`, …) so utilities and the
component classes share one source of truth.

## Conventions

- **Neobrutalism primitives**: reuse `@include nb.block;` / `@include nb.press;`
  (or the `.nb-block` / `.nb-press` classes) rather than re-authoring borders,
  shadows, and hover/press behavior.
- **Motion**: any transform/transition must sit inside
  `@media (prefers-reduced-motion: no-preference)` — the `press()` mixin already
  does this.
- **Accessibility**: keep contrast at WCAG AA; use `--link` / `--red-ink` for
  accent *text*, and `--red` fills only with `--on-red` text.
- Partials are `_prefixed` and imported via `@use` in `main.scss`.
