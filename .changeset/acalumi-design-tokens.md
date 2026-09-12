---
"@kala-ui/react": minor
---

Add design-extension tokens for per-project theming: `--font-heading` (two-font systems, consumed by `Heading` via the new `font-heading` utility), `--kala-radius-input` (inputs/selects can now diverge from control radius; falls back to `--kala-radius-control`), and motion tokens `--kala-duration-fast/base/slow` + `--kala-ease` wired through Tailwind's default transition chain so every `transition-*` utility retunes from one override. Also export the cva style configs via the new `@kala-ui/react/config` subpath for wrapper composition.
