/**
 * Screen-reader focus choreography for overlays: focus moves into the
 * overlay content when it opens and returns to the trigger once the
 * overlay has fully left the screen. `exited` (not `open`) gates the
 * restore because an exit animation can keep the native modal window up
 * after `open` flips false — focusing a node in a background window is
 * a silent no-op on Android.
 */
import type { Component } from "react";
import { useEffect, useRef } from "react";
import { AccessibilityInfo, findNodeHandle } from "react-native";

export type OverlayTriggerRef = { current: unknown };

function schedule(fn: () => void): () => void {
	if (typeof requestAnimationFrame === "function") {
		const id = requestAnimationFrame(fn);
		return () => cancelAnimationFrame(id);
	}
	const id = setTimeout(fn, 0);
	return () => clearTimeout(id);
}

function focusNode(node: unknown): void {
	if (node == null) return;
	let handle: number | null = null;
	try {
		handle = findNodeHandle(node as Component);
	} catch {
		// unmounted or non-host instances have no native handle at all
		return;
	}
	if (handle != null) AccessibilityInfo.setAccessibilityFocus(handle);
}

export function useOverlayFocus(
	overlayRef: { current: unknown },
	open: boolean,
	exited: boolean,
	triggerRef?: OverlayTriggerRef,
): void {
	// latest trigger without re-running the effects on inline refs
	const trigger = useRef(triggerRef);
	trigger.current = triggerRef;
	// whether this generation ever opened (and is still owed a restore)
	const openOnce = useRef(false);

	useEffect(() => {
		if (!open) return;
		openOnce.current = true;
		return schedule(() => focusNode(overlayRef.current));
	}, [open, overlayRef]);

	// restore exactly once, on the exited rising edge
	const prevExited = useRef(true);
	useEffect(() => {
		const wasExited = prevExited.current;
		prevExited.current = exited;
		if (!exited || wasExited || !openOnce.current) return;
		openOnce.current = false;
		focusNode(trigger.current?.current);
	}, [exited]);

	// unmount-while-open still owes the trigger its focus back
	useEffect(
		() => () => {
			if (!openOnce.current) return;
			openOnce.current = false;
			focusNode(trigger.current?.current);
		},
		[],
	);
}
