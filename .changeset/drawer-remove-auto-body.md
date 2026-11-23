---
"@kala-ui/react": patch
---

Drawer: `DrawerContent` no longer wraps children in an implicit `DrawerBody`. Compose `DrawerHeader` / `DrawerBody` / `DrawerFooter` as direct children of `DrawerContent` — the body is the sole scroll container (`flex-1 min-h-0 overflow-y-auto`) and the footer pins to the panel's bottom edge via normal flex flow (`mt-auto`), fixing the dead space that previously appeared below short drawer content. Removed the `DrawerFooter` `sticky` prop and the inert sticky header/footer classes (header/footer are siblings of the scroll body, so they never scroll out of view).
