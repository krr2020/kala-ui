---
"@kala-ui/react": minor
---

Adds the `slotStyles` per-part styling contract to the web package, mirroring `@kala-ui/react-native` — users can now override and restyle every part of a component, including previously unreachable internal chrome (close buttons, chevrons, stepper buttons, loading spinners, skeleton arms).

- Full-family coverage: every component family in the web package now accepts `slotStyles={{ root: ..., <part>: ... }}` (layout primitives, form controls, overlays/menus, feedback/data display, and identity/text families alike), including previously unreachable internal chrome (close buttons, chevrons, stepper buttons, loading spinners, skeleton arms).
- A slot value is either a Tailwind class string or an inline-style object. Precedence is uniform: library defaults → legacy `className`/`style` → slot entry (slots win).
- Exported helpers `applySlot` / `mergeStyle` and types `SlotStyle` / `SlotStyles` from the package root for downstream composite libraries.
- Per-part base classes now live in `src/config/<name>.ts` style tables (`dialogStyles`, `tooltipStyles`, `tagStyles`, `bannerStyles`, `emptyStateStyles`, `numberInputStyles`, `tagInputStyles`, `timePickerStyles`, `datePickerStyles`, `fileUploadStyles`, `avatarGroupStyles`, `progressStyles`, plus new part keys on the existing button/alert/popover/select tables) — the config table doubles as the per-family slot vocabulary reference, and component files keep component code only.
- Absent `slotStyles`, rendered output is unchanged.

Follow-ups staged separately: `@kala-ui/react-app` composites adoption and normalizing `data-slot` names to the unprefixed vocabulary.
