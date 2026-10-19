---
"@kala-ui/react": patch
---

Fix Input suffix adornments swallowing clicks on interactive children (e.g. DataTable's Clear search button): the pointer-events-none wrapper now re-enables pointer events on nested buttons and links while decorative icons stay click-through.
