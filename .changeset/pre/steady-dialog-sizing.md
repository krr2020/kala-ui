---
"@kala-ui/react": patch
---

Fix responsive dialog sizing when consumer stylesheets emit overlapping utilities. Desktop dialogs stay centered and fit their content, with independent dialog widths for sm (24rem), md (32rem), lg (42rem), and xl (56rem), rather than page-container widths. Mobile dialogs and the explicit full size fill the viewport with square corners, even when consumer styles add a radius. Consumers no longer need sizing overrides.
