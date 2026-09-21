import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export type SlotStylesMap = Record<string, SlotStyles>;

export interface KalaConfig {
	/** Per-family slot defaults; instance slotStyles entries win per part. */
	defaultSlotStyles?: SlotStylesMap;
	/** CSS custom properties on the provider wrapper (bare/camel keys converted). */
	tokens?: Record<string, string>;
	/** Per-family user-registered variant classes appended to the root slot. */
	variants?: Record<string, Record<string, string>>;
}

export interface KalaProviderProps extends KalaConfig {
	children: React.ReactNode;
}
