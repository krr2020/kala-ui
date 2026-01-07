# @kala-ui/react-hooks

Collection of reusable React hooks for building modern web applications.

## Installation

```bash
npm install @kala-ui/react-hooks
# or
yarn add @kala-ui/react-hooks
# or
pnpm add @kala-ui/react-hooks
```

## Hooks

### State Management
- `useDebounce` - Debounces a value
- `useDebouncedValue` - Debounces value changes with cancel support
- `useDebouncedState` - Debounced useState hook
- `useThrottledValue` - Throttles value changes
- `usePrevious` - Returns previous value of state
- `useToggle` - Boolean state with toggle helper
- `useDisclosure` - Boolean state with open/close/toggle handlers

### Storage
- `useLocalStorage` - Sync state with localStorage
- `useSessionStorage` - Sync state with sessionStorage

### Browser APIs
- `useMediaQuery` - Subscribe to media queries
- `useClickOutside` - Detect clicks outside element
- `useIntersection` - Intersection Observer API
- `useWindowScroll` - Track window scroll position
- `useElementSize` - Track element size with ResizeObserver
- `useClipboard` - Copy to clipboard with feedback

### Utilities
- `useMounted` - Check if component is mounted
- `useInterval` - Declarative setInterval
- `useTimeout` - Declarative setTimeout
- `useId` - Generate unique IDs
- `useMergedRef` - Merge multiple refs
- `useIsomorphicEffect` - SSR-safe useLayoutEffect

## Usage Examples

### useDebounce

```tsx
import { useDebounce } from '@kala-ui/react-hooks';
import { useState } from 'react';

function SearchInput() {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500);

  // Use debouncedValue for API calls
  useEffect(() => {
    if (debouncedValue) {
      searchAPI(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### useLocalStorage

```tsx
import { useLocalStorage } from '@kala-ui/react-hooks';

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

### useMediaQuery

```tsx
import { useMediaQuery } from '@kala-ui/react-hooks';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return <div>{isMobile ? 'Mobile' : 'Desktop'} view</div>;
}
```

## License

MIT
