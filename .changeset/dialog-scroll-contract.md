---
"@kala-ui/react": patch
---

Fix dialog content spilling past the card when taller than the 90vh cap, and ship the scroll layout contract: `DialogContent` now clips with `overflow-hidden` (nothing can render outside the card bounds), `DialogHeader`/`DialogFooter` are always `shrink-0` (pinned, never compressed or scrolled away — the now-redundant `fixed` prop on both is removed; delete any `fixed` props when upgrading), and `DialogBody` is the one blessed scrollable region (`flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4`). Long content scrolls inside the body while header and footer stay pinned; single-`<form>` compositions with their own inner `overflow-y-auto` region keep working unchanged, and the mobile full-screen variant is untouched.
