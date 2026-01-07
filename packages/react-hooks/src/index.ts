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
export {
	type ElementSize,
	useElementSize,
} from "./use-element-size/use-element-size";
export { useId } from "./use-id/use-id";
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
export { usePrevious } from "./use-previous/use-previous";
export { useTimeout } from "./use-timeout/use-timeout";
export { useToggle } from "./use-toggle/use-toggle";
export {
	useWindowScroll,
	type WindowScrollPosition,
} from "./use-window-scroll/use-window-scroll";

// Utils
export { useCallbackRef } from "./utils";
