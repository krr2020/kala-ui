# kala-ui token spec

kala-ui is **format-agnostic**: every color is a whole CSS value consumed via
`var(--token)`. A host overrides the entire design standard by defining these
custom properties — in **hsl, oklch, hex, or color** — without touching
component class strings. Alpha (Tailwind's `/90`, translucent borders, shadows)
is applied with `color-mix`, so it works with any format.

## Override model

1. Import the component styles once: `@kala-ui/react/styles` (the `globals.css`
   default theme), **or** define `:root` yourself and skip it.
2. Define `:root` (and your dark selector, e.g. `[data-theme="dark"]` / `.dark`)
   with the tokens below. Provide a dark block — kala expects both.
3. Flip themes by toggling the dark class/attribute on `<html>`.

That's the whole override surface. No `!important` wrestling, no re-vendoring
helpers.

## Required tokens

Define all of these in `:root` and the dark block (values differ, names same).

| token | role |
|---|---|
| `--background` / `--foreground` | app canvas + base text |
| `--card` / `--card-foreground` | card surfaces |
| `--popover` / `--popover-foreground` | menus, dropdowns, popovers |
| `--primary` / `--primary-foreground` | main action color + its text |
| `--secondary` / `--secondary-foreground` | secondary action |
| `--muted` / `--muted-foreground` | recessed bg + muted text |
| `--accent` / `--accent-foreground` | hover/active bg (ghost, outline) |
| `--destructive` / `--destructive-foreground` | danger action |
| `--success` / `--success-foreground` | success semantic |
| `--warning` / `--warning-foreground` | warning semantic |
| `--error` / `--error-foreground` | error semantic |
| `--info` / `--info-foreground` | info semantic |
| `--border` | default 1px hairline |
| `--input` | input border |
| `--ring` / `--ring-offset-color` | focus ring + its offset (background) |
| `--separator` | dividers (defaults to `--border`) |
| `--radius` | base radius (kala derives sm/md/lg/xl) |

## Optional tokens

| token | default | role |
|---|---|---|
| `--background-alpha` | `1` | canvas translucency |
| `--border-alpha` | `1` | hairline translucency |
| `--card-border-alpha` | `= --border-alpha` | per-card border translucency |
| `--shadow-color` | black | elevation tint |
| `--shadow-alpha` | `0` | elevation strength (`0` = flat) |
| `--shadow-spread` | `0px` | elevation spread |

## Shape & density (K2 — done)

Component shape is token-driven. A host sets the shape language once via these
`--kala-*` vars (defaults provided in `globals.css`):

| token | default | role |
|---|---|---|
| `--kala-radius-control` | `0.375rem` | buttons, inputs, select triggers, tab triggers |
| `--kala-radius-card` | `0.5rem` | cards, alerts, popovers, dialogs |
| `--kala-control-h` | `2.5rem` | default control height (button/input/select) |
| `--kala-control-px` | `1rem` | default control horizontal padding |
| `--kala-card-pad` | `1.5rem` | card header/body/footer padding |

Intentionally **not** tokenized: checkbox/switch/badge radii (small/pill are
semantic, not part of the shape language).

## Contrast contract

kala-ui pairs every fill with a `*-foreground`. **The host is responsible for
AA contrast** between each `--x` and `--x-foreground`. Note: saturated fills
often need a **dark** foreground (e.g. amber/yellow), not white — pick the
foreground that clears 4.5:1 in both themes.
