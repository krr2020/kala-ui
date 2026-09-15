// Entry point for @kala-ui/react-native-app — mobile app chrome
// composites built on @kala-ui/react-native primitives.

export type { AppShellProps } from "./components/app-shell";
export { AppShell } from "./components/app-shell";
export type {
	HeaderAction,
	HeaderProps,
	HeaderSkeletonProps,
} from "./components/header";
export { Header, HeaderSkeleton } from "./components/header";
export type {
	TabBarItemData,
	TabBarProps,
	TabBarSkeletonProps,
} from "./components/tab-bar";
export { TabBar, TabBarSkeleton } from "./components/tab-bar";
export { isActivePath } from "./lib/active-path";
