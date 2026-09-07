---
"@kala-ui/react": patch
---

Fix Toast (Sonner Toaster) not following the active kala-ui theme — toasts stayed light when a dark theme was selected. The toaster now derives its theme from `useTheme().resolvedTheme` (`dark` and `high-contrast-dark` map to sonner `dark`, everything else to `light`, `system` resolved through `prefers-color-scheme`). An explicit `theme` prop still wins, and rendering without a `<ThemeProvider>` keeps the light default.
