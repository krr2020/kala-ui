---
"@kala-ui/react": patch
---

**TabsTrigger** now spaces icon + label children with a built-in `gap-1.5` on its content wrapper — previously the wrapper span swallowed any gap utility set on the trigger, so icon-and-text tabs rendered with zero spacing. Consumers no longer need `gap-*` on `TabsTrigger` for icon spacing.
