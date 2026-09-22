// Portable subset for environments without a DOM (React Native, workers).
// Every export here must stay free of window/document/navigator access and
// react-dom imports — src/__tests__/portable.test.ts enforces that fail-closed.

export {
	type UseCounterHandlers,
	type UseCounterOptions,
	useCounter,
} from "./use-counter/use-counter";
export { useDebounce } from "./use-debounce/use-debounce";
export {
	type UseDisclosureHandlers,
	type UseDisclosureReturnValue,
	useDisclosure,
} from "./use-disclosure/use-disclosure";
export {
	type UseListStateHandlers,
	useListState,
} from "./use-list-state/use-list-state";
export {
	assignRef,
	mergeRefs,
	useMergedRef,
} from "./use-merged-ref/use-merged-ref";
export { useMounted } from "./use-mounted/use-mounted";
export {
	DOTS,
	type UsePaginationSettings,
	usePagination,
} from "./use-pagination/use-pagination";
export { usePrevious } from "./use-previous/use-previous";
export { useToggle } from "./use-toggle/use-toggle";
export {
	type UseUncontrolledInput,
	useUncontrolled,
} from "./use-uncontrolled/use-uncontrolled";
export { useCallbackRef } from "./utils";
