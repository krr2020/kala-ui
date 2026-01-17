// State Management Hooks

export {
	type UseClickOutsideOptions,
	useClickOutside,
} from "./use-click-outside/use-click-outside";
export {
	type UseClipboardOptions,
	type UseClipboardReturnValue,
	useClipboard,
} from "./use-clipboard/use-clipboard";
export { useColorScheme } from "./use-color-scheme/use-color-scheme";
export {
	type UseCounterHandlers,
	type UseCounterOptions,
	useCounter,
} from "./use-counter/use-counter";
export { useDebounce } from "./use-debounce/use-debounce";
export {
	type UseDebouncedValueOptions,
	type UseDebouncedValueReturnValue,
	useDebouncedValue,
} from "./use-debounced-value/use-debounced-value";
export {
	type UseDisclosureHandlers,
	type UseDisclosureReturnValue,
	useDisclosure,
} from "./use-disclosure/use-disclosure";
// Newly Added Hooks
export { useDocumentTitle } from "./use-document-title/use-document-title";
export {
	type ElementSize,
	useElementSize,
} from "./use-element-size/use-element-size";
export { useFocusTrap } from "./use-focus-trap/use-focus-trap";
export { type HotkeyItem, useHotkeys } from "./use-hotkeys/use-hotkeys";
export { useHover } from "./use-hover/use-hover";
export { useId } from "./use-id/use-id";
export { useIdle } from "./use-idle/use-idle";
export {
	type UseIntersectionOptions,
	type UseIntersectionReturnValue,
	useIntersection,
} from "./use-intersection/use-intersection";
export {
	type UseIntervalOptions,
	type UseIntervalReturnValue,
	useInterval,
} from "./use-interval/use-interval";
export { useIsomorphicEffect } from "./use-isomorphic-effect/use-isomorphic-effect";
export {
	type UseListStateHandlers,
	useListState,
} from "./use-list-state/use-list-state";
// Storage Hooks
export {
	type UseStorageOptions,
	type UseStorageReturnValue,
	useLocalStorage,
	useSessionStorage,
} from "./use-local-storage/use-local-storage";
// Browser API Hooks
export {
	type UseMediaQueryOptions,
	useMediaQuery,
} from "./use-media-query/use-media-query";
export {
	assignRef,
	mergeRefs,
	useMergedRef,
} from "./use-merged-ref/use-merged-ref";
// Utility Hooks
export { useMounted } from "./use-mounted/use-mounted";
export { type MousePosition, useMouse } from "./use-mouse/use-mouse";
export { clamp, type UseMovePosition, useMove } from "./use-move/use-move";
export { useNetwork } from "./use-network/use-network";
export { type OS, useOs } from "./use-os/use-os";
export {
	DOTS,
	type UsePaginationSettings,
	usePagination,
} from "./use-pagination/use-pagination";
export { usePrevious } from "./use-previous/use-previous";
export { useReducedMotion } from "./use-reduced-motion/use-reduced-motion";
export { useScrollLock } from "./use-scroll-lock/use-scroll-lock";
export { useTimeout } from "./use-timeout/use-timeout";
export { useToggle } from "./use-toggle/use-toggle";
export { useUncontrolled } from "./use-uncontrolled/use-uncontrolled";
export {
	useViewportSize,
	type ViewportSize,
} from "./use-viewport-size/use-viewport-size";
export { useWindowEvent } from "./use-window-event/use-window-event";
export {
	useWindowScroll,
	type WindowScrollPosition,
} from "./use-window-scroll/use-window-scroll";

// Utils
export { useCallbackRef } from "./utils";
