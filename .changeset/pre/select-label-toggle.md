---
"@kala-ui/react": patch
---

Fix the Select label-click toggle so tapping a field label while options are open just closes the popup instead of closing and immediately reopening it. Label taps never pointerdown on the trigger, so the earlier trigger-gesture guard missed the label-forwarded synthetic click; the trigger now suppresses that forwarded click (detail 0) whenever the press that dismissed the content landed outside the trigger and content.
