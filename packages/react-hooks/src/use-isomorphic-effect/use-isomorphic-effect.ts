import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect that does not show warning when server-side rendering
 * Use it when you need to use useLayoutEffect but also support SSR
 */
export const useIsomorphicEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect;
