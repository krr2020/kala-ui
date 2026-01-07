# Changelog

## [0.1.0] - 2026-01-07

### Added

#### State Management Hooks
- `useDebounce` - Debounces a value
- `useDebouncedValue` - Debounces value changes with cancel support
- `usePrevious` - Returns previous value of state
- `useToggle` - Boolean state with toggle helper
- `useDisclosure` - Boolean state with open/close/toggle handlers

#### Storage Hooks
- `useLocalStorage` - Sync state with localStorage
- `useSessionStorage` - Sync state with sessionStorage

#### Browser API Hooks
- `useMediaQuery` - Subscribe to media queries
- `useClickOutside` - Detect clicks outside element
- `useClipboard` - Copy to clipboard with feedback
- `useIntersection` - Intersection Observer API
- `useWindowScroll` - Track window scroll position
- `useElementSize` - Track element size with ResizeObserver

#### Utility Hooks
- `useMounted` - Check if component is mounted
- `useInterval` - Declarative setInterval
- `useTimeout` - Declarative setTimeout
- `useId` - Generate unique IDs
- `useMergedRef` - Merge multiple refs
- `useIsomorphicEffect` - SSR-safe useLayoutEffect

Initial release with 18 essential React hooks for building modern web applications.
