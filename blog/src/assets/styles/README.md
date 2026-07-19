# Styles Architecture

A small, modular SCSS **Neobrutalism** design system: flat solid fills, thick
ink borders, hard offset shadows, sharp corners, and a tactile press
interaction. Colors are CSS custom properties so the light/dark theme toggle
(`data-theme` on `<body>`) swaps them with no markup changes.

## Directory Structure

```
src/
├── tailwind.css              # Tailwind 4, daisyUI themes, and utility tokens
└── assets/styles/
    ├── main.scss             # Entry point: Prism + the modules below
    ├── base/
    │   ├── _variables.scss   # Design tokens (fonts, borders) + theme color vars
    │   ├── _reset.scss       # Global reset, focus ring, and scrollbar
    │   └── _typography.scss  # Display, body, and utility font rules
    ├── components/           # Buttons, forms, cards, navigation, blog, and TOC
    └── utilities/
        └── _nb.scss          # Shared neobrutalist primitives and mixins
```

## Design tokens

Defined in `base/_variables.scss` as CSS custom properties, scoped per theme:

- Colors: `--paper`, `--surface`, `--ash`, `--ink`, `--muted`, `--red`,
  `--red-ink`, `--link`, `--on-red`
- Shadows: `--nb-shadow`, `--nb-shadow-sm`, `--nb-shadow-lg` (hard, no blur)

Tailwind mirrors these in `src/tailwind.css` (`bg-paper`, `text-ink`,
`border-3`, `shadow-nb`, `font-display`, `font-mono`, …) so utilities and the
component classes share one source of truth. daisyUI's two custom themes also
live in that CSS-first configuration.

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
