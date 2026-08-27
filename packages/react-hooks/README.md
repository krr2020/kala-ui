# @kala-ui/react-hooks

37 reusable React hooks for building modern web applications — the foundation
layer of [Kala UI](https://github.com/krr2020/kala-ui) (`@kala-ui/react`
depends on this package). SSR-safe, React 19 typed, zero dependencies.

## Installation

```bash
pnpm add @kala-ui/react-hooks@beta
# or
npm install @kala-ui/react-hooks@beta
```

Requires React 19.2+ (peer dependency).

## Hooks

### State & values
- `useToggle` — boolean state with a toggle helper
- `useCounter` — counter with min/max/step guards
- `useDisclosure` — boolean state with `open`/`close`/`toggle` handlers
- `usePrevious` — previous value of state
- `useUncontrolled` — controlled/uncontrolled duality (`value` or `defaultValue`)
- `useListState` — array state with item-level operations
- `usePagination` — page/total logic with navigation helpers

### Debounce & timing
- `useDebounce` — debounced callback
- `useDebouncedValue` — debounced value with cancel support
- `useInterval` — declarative `setInterval` (reactive `active` state)
- `useTimeout` — declarative `setTimeout`
- `useIdle` — user-idle detection with a configurable timeout

### Elements & DOM
- `useClickOutside` — `(handler, { events, ignore })` options API, stable ref
- `useHover` — hover state via a stable callback ref
- `useFocusTrap` — focus trap for portals that mount late
- `useElementSize` — ResizeObserver size via a callback ref
- `useIntersection` — IntersectionObserver entry via a callback ref
- `useMergedRef` — merge multiple refs (React 19 `RefObject<T | null>` aware)
- `useMouse` — mouse position (`MousePosition`)
- `useMove` — pointer move/drag with clamped 2D position (`clamp` util included)
- `useViewportSize` — viewport width/height
- `useWindowScroll` — window scroll position
- `useWindowEvent` — typed window event listener
- `useScrollLock` — reference-counted body scroll lock

### Browser APIs
- `useClipboard` — copy to clipboard with settled feedback
- `useLocalStorage` / `useSessionStorage` — state synced to storage
- `useMediaQuery` — media query subscription (SSR-safe guards)
- `useColorScheme` — `prefers-color-scheme` subscription
- `useNetwork` — online status and connection info
- `useReducedMotion` — `prefers-reduced-motion` subscription
- `useOs` — best-effort OS detection (`OS` type)
- `useDocumentTitle` — set the document title, restore on unmount
- `useHotkeys` — keyboard shortcuts (`HotkeyItem` bindings)

### SSR & utilities
- `useIsomorphicEffect` — `useLayoutEffect` on the client, no-op on the server
- `useMounted` — mounted flag
- `useId` — unique id generator
- `useCallbackRef` — stable ref for the latest callback

## Usage examples

### useDebouncedValue

```tsx
import { useDebouncedValue } from "@kala-ui/react-hooks";
import { useEffect, useState } from "react";

function SearchInput() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebouncedValue(value, 500);

  useEffect(() => {
    if (debouncedValue) searchApi(debouncedValue);
  }, [debouncedValue]);

  return <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search…" />;
}
```

### useLocalStorage

```tsx
import { useLocalStorage } from "@kala-ui/react-hooks";

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Current theme: {theme}
    </button>
  );
}
```

### useMediaQuery

```tsx
import { useMediaQuery } from "@kala-ui/react-hooks";

function ResponsiveComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return <div>{isMobile ? "Mobile" : "Desktop"} view</div>;
}
```

## License

MIT
