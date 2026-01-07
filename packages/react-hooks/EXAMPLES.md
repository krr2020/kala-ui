# Examples

## useDebounce

Debounce search input for API calls:

```tsx
import { useState, useEffect } from 'react';
import { useDebounce } from '@kala-ui/react-hooks';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // Make API call with debounced value
      fetch(`/api/search?q=${debouncedSearch}`)
        .then(res => res.json())
        .then(data => console.log(data));
    }
  }, [debouncedSearch]);

  return (
    <input
      type="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

## useLocalStorage

Persist theme preference:

```tsx
import { useLocalStorage } from '@kala-ui/react-hooks';

function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>({
    key: 'app-theme',
    defaultValue: 'light',
  });

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

## useMediaQuery

Responsive components:

```tsx
import { useMediaQuery } from '@kala-ui/react-hooks';

function ResponsiveNav() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  if (isMobile) return <MobileNav />;
  if (isTablet) return <TabletNav />;
  return <DesktopNav />;
}
```

## useDisclosure

Modal state management:

```tsx
import { useDisclosure } from '@kala-ui/react-hooks';

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

## useClickOutside

Close dropdown on outside click:

```tsx
import { useClickOutside } from '@kala-ui/react-hooks';
import { useState } from 'react';

function Dropdown() {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpened(false));

  return (
    <div ref={ref}>
      <button onClick={() => setOpened(!opened)}>
        Toggle Dropdown
      </button>
      
      {opened && (
        <div className="dropdown-menu">
          <a href="#">Option 1</a>
          <a href="#">Option 2</a>
          <a href="#">Option 3</a>
        </div>
      )}
    </div>
  );
}
```

## useClipboard

Copy to clipboard with feedback:

```tsx
import { useClipboard } from '@kala-ui/react-hooks';

function CopyButton({ text }: { text: string }) {
  const { copy, copied } = useClipboard({ timeout: 2000 });

  return (
    <button onClick={() => copy(text)}>
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  );
}
```

## useIntersection

Lazy load images:

```tsx
import { useIntersection } from '@kala-ui/react-hooks';

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const { ref, entry } = useIntersection({
    threshold: 0.1,
    disconnectOnIntersect: true,
  });

  const isVisible = entry?.isIntersecting;

  return (
    <div ref={ref}>
      {isVisible ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="placeholder" />
      )}
    </div>
  );
}
```

## useInterval

Auto-refresh data:

```tsx
import { useState } from 'react';
import { useInterval } from '@kala-ui/react-hooks';

function AutoRefresh() {
  const [data, setData] = useState<any>(null);
  
  const interval = useInterval(
    () => {
      fetch('/api/data').then(res => res.json()).then(setData);
    },
    5000, // Refresh every 5 seconds
    { autoInvoke: true }
  );

  return (
    <div>
      <button onClick={interval.toggle}>
        {interval.active ? 'Pause' : 'Resume'} Refresh
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

## useElementSize

Track element dimensions:

```tsx
import { useElementSize } from '@kala-ui/react-hooks';

function ResponsiveComponent() {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();

  return (
    <div ref={ref} style={{ resize: 'both', overflow: 'auto', border: '1px solid' }}>
      <p>Width: {Math.round(width)}px</p>
      <p>Height: {Math.round(height)}px</p>
      <p>Resize me!</p>
    </div>
  );
}
```

## usePrevious

Compare with previous value:

```tsx
import { useState } from 'react';
import { usePrevious } from '@kala-ui/react-hooks';

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

## Combined Example: Smart Search with Debounce and Loading

```tsx
import { useState, useEffect } from 'react';
import { useDebounce, useDisclosure } from '@kala-ui/react-hooks';

function SmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, { open: startLoading, close: stopLoading }] = useDisclosure(false);
  
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      startLoading();
      
      fetch(`/api/search?q=${debouncedQuery}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          stopLoading();
        })
        .catch(() => stopLoading());
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      
      {loading && <div>Loading...</div>}
      
      <ul>
        {results.map((result: any) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```
