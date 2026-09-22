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

## React Native & no-DOM environments

The root entry (`@kala-ui/react-hooks`) is web-only. For React Native (or
any DOM-free runtime) import the portable subset instead — it is guaranteed
to contain no `window`/`document`/`navigator` access and no `react-dom`
import (enforced by a fail-closed test):

```tsx
import { useUncontrolled } from "@kala-ui/react-hooks/portable";
```

Portable hooks: `useCounter`, `useDebounce`, `useDisclosure`, `useListState`,
`useMergedRef` (+ `mergeRefs`, `assignRef`), `useMounted`, `usePagination`,
`usePrevious`, `useToggle`, `useUncontrolled`, `useCallbackRef`.

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
  const [theme, setTheme] = useLocalStorage({
    key: "app-theme",
    defaultValue: "light",
  });

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

### useDisclosure

```tsx
import { useDisclosure } from "@kala-ui/react-hooks";

function ModalExample() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      <button onClick={open}>Open Modal</button>
      {opened && (
        <div className="modal">
          <h2>Modal Content</h2>
          <button onClick={close}>Close</button>
        </div>
      )}
    </div>
  );
}
```

### useClickOutside

```tsx
import { useState } from "react";
import { useClickOutside } from "@kala-ui/react-hooks";

function Dropdown() {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));

  return (
    <div ref={ref}>
      <button onClick={() => setOpened(!opened)}>Toggle Dropdown</button>
      {opened && <div className="dropdown-menu">…</div>}
    </div>
  );
}
```

### useClipboard

```tsx
import { useClipboard } from "@kala-ui/react-hooks";

function CopyButton({ text }: { text: string }) {
  const { copy, copied } = useClipboard({ timeout: 2000 });

  return <button onClick={() => copy(text)}>{copied ? "✓ Copied!" : "Copy"}</button>;
}
```

### useIntersection

```tsx
import { useIntersection } from "@kala-ui/react-hooks";

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const { ref, entry } = useIntersection({
    threshold: 0.1,
    disconnectOnIntersect: true,
  });

  return <div ref={ref}>{entry?.isIntersecting ? <img src={src} alt={alt} /> : <div className="placeholder" />}</div>;
}
```

### useInterval

```tsx
import { useInterval } from "@kala-ui/react-hooks";

function AutoRefresh() {
  const interval = useInterval(() => refetch(), 5000, { autoInvoke: true });

  return (
    <button onClick={interval.toggle}>
      {interval.active ? "Pause" : "Resume"} refresh
    </button>
  );
}
```

### useElementSize

```tsx
import { useElementSize } from "@kala-ui/react-hooks";

function ResponsiveComponent() {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();

  return (
    <div ref={ref} style={{ resize: "both", overflow: "auto", border: "1px solid" }}>
      <p>
        {Math.round(width)}×{Math.round(height)}px — resize me!
      </p>
    </div>
  );
}
```

### usePrevious

```tsx
import { useState } from "react";
import { usePrevious } from "@kala-ui/react-hooks";

function Counter() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {previousCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## License

MIT
