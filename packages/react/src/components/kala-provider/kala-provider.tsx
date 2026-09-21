"use client";

/**
 * KalaProvider — context-level configuration for kala-ui components:
 * `defaultSlotStyles` (per-family slot defaults), `tokens` (CSS custom
 * properties applied to a layout-transparent wrapper), and `variants`
 * (user-registered variant classes appended to the root slot).
 *
 * Resolution lives in useSlotStyles: per part, the instance `slotStyles`
 * entry beats the context default; registered variant classes join the
 * root string slot so tailwind-merge lets them win. applySlot/mergeStyle
 * stay pure — the precedence ladder is unchanged. Pure non-component
 * helpers (e.g. buildToastClassNames) cannot read context and are out of
 * scope by construction.
 */

import * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type {
	KalaConfig,
	KalaProviderProps,
	SlotStylesMap,
} from "./kala-provider.types";

const EMPTY_CONFIG: KalaConfig = {};

const KalaConfigContext = React.createContext<KalaConfig>(EMPTY_CONFIG);

function toCustomProperty(key: string): string {
	if (key.startsWith("--")) return key;
	const kebab = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
	return `--${kebab}`;
}

export function tokenStyle(
	tokens: Record<string, string> | undefined,
): React.CSSProperties {
	const style: React.CSSProperties = { display: "contents" };
	for (const [key, value] of Object.entries(tokens ?? {})) {
		(style as Record<string, string>)[toCustomProperty(key)] = value;
	}
	return style;
}

function mergeSlotMaps(
	outer: SlotStylesMap | undefined,
	inner: SlotStylesMap | undefined,
): SlotStylesMap | undefined {
	if (!outer) return inner;
	if (!inner) return outer;
	const families = new Set([...Object.keys(outer), ...Object.keys(inner)]);
	const merged: SlotStylesMap = {};
	for (const family of families) {
		const o = outer[family] as SlotStyles | undefined;
		const i = inner[family] as SlotStyles | undefined;
		if (o || i) merged[family] = { ...(o ?? {}), ...(i ?? {}) };
	}
	return merged;
}

function mergeVariants(
	outer: KalaConfig["variants"],
	inner: KalaConfig["variants"],
): KalaConfig["variants"] {
	if (!outer) return inner;
	if (!inner) return outer;
	const merged: Record<string, Record<string, string>> = {
		...(outer as Record<string, Record<string, string>>),
	};
	const outerVariants = outer as Record<string, Record<string, string>>;
	const innerVariants = inner as Record<string, Record<string, string>>;
	for (const [family, names] of Object.entries(innerVariants)) {
		merged[family] = { ...(outerVariants[family] ?? {}), ...names };
	}
	return merged;
}

export function mergeConfig(outer: KalaConfig, inner: KalaConfig): KalaConfig {
	return {
		defaultSlotStyles: mergeSlotMaps(
			outer.defaultSlotStyles,
			inner.defaultSlotStyles,
		),
		tokens: { ...outer.tokens, ...inner.tokens },
		variants: mergeVariants(outer.variants, inner.variants),
	};
}

export function KalaProvider({
	children,
	defaultSlotStyles,
	tokens,
	variants,
}: KalaProviderProps) {
	const outer = React.useContext(KalaConfigContext);
	const value = React.useMemo(
		() =>
			outer === EMPTY_CONFIG && !defaultSlotStyles && !tokens && !variants
				? EMPTY_CONFIG
				: mergeConfig(outer, { defaultSlotStyles, tokens, variants }),
		[outer, defaultSlotStyles, tokens, variants],
	);
	const style = React.useMemo(() => tokenStyle(value.tokens), [value.tokens]);
	return (
		<KalaConfigContext.Provider value={value}>
			<div data-kala-component="kala-provider" style={style}>
				{children}
			</div>
		</KalaConfigContext.Provider>
	);
}

export function useKalaConfig(): KalaConfig {
	return React.useContext(KalaConfigContext);
}

export function resolveSlotStyles(
	config: KalaConfig,
	family: string,
	instanceSlotStyles?: SlotStyles,
	variant?: string,
): SlotStyles | undefined {
	const defaults = config.defaultSlotStyles?.[family];
	const variantClass = variant
		? config.variants?.[family]?.[variant]
		: undefined;
	if (!defaults && !variantClass) return instanceSlotStyles;
	const merged: SlotStyles = { ...defaults, ...instanceSlotStyles };
	if (variantClass) {
		// Variant classes only join the string channel; an object-channel root
		// stays untouched (the class list would be meaningless there).
		if (typeof merged.root === "string" || merged.root === undefined) {
			merged.root = [merged.root, variantClass].filter(Boolean).join(" ");
		}
	}
	return merged;
}

export function useSlotStyles(
	family: string,
	instanceSlotStyles?: SlotStyles,
	variant?: string,
): SlotStyles | undefined {
	const config = useKalaConfig();
	return resolveSlotStyles(config, family, instanceSlotStyles, variant);
}
