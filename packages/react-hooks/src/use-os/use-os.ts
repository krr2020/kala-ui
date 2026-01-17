import { useState } from "react";
import { useIsomorphicEffect } from "../use-isomorphic-effect/use-isomorphic-effect";

export type OS =
	| "undetermined"
	| "macos"
	| "ios"
	| "windows"
	| "android"
	| "linux";

function getOS(): OS {
	if (typeof window === "undefined") {
		return "undetermined";
	}

	const { userAgent } = window.navigator;
	const { platform } = window.navigator;
	const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
	const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
	const iosPlatforms = ["iPhone", "iPad", "iPod"];

	if (macosPlatforms.indexOf(platform) !== -1) {
		return "macos";
	}
	if (iosPlatforms.indexOf(platform) !== -1) {
		return "ios";
	}
	if (windowsPlatforms.indexOf(platform) !== -1) {
		return "windows";
	}
	if (/Android/.test(userAgent)) {
		return "android";
	}
	if (/Linux/.test(platform)) {
		return "linux";
	}

	return "undetermined";
}

/**
 * Detects user operating system
 *
 * @example
 * ```tsx
 * const os = useOs(); // 'macos', 'ios', 'windows', 'android', 'linux' or 'undetermined'
 * ```
 */
export function useOs(): OS {
	const [os, setOs] = useState<OS>("undetermined");

	useIsomorphicEffect(() => {
		setOs(getOS());
	}, []);

	return os;
}
