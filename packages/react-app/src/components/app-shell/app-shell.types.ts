import type { SlotStyles } from "@kala-ui/react/lib/slot-styles";
import type * as React from "react";

export interface AppShellProps extends React.ComponentProps<"div"> {
	header?: { height: number | string };
	/**
	 * Navbar configuration. The navbar sits off-canvas below `breakpoint`
	 * and reserves Main's left padding from it upward.
	 */
	navbar?: {
		width: number | string;
		breakpoint?: "sm" | "md" | "lg" | "xl";
	};
	/** Aside configuration. Mirrors the navbar on the right edge. */
	aside?: {
		width: number | string;
		breakpoint?: "sm" | "md" | "lg" | "xl";
	};
	footer?: { height: number | string };
	padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
	/** Per-part overrides: root, header, navbar, aside, main, footer. */
	slotStyles?: SlotStyles;
}

export interface AppShellHeaderProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	withBorder?: boolean;
	slotStyles?: SlotStyles;
}

export interface AppShellNavbarProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	withBorder?: boolean;
	slotStyles?: SlotStyles;
}

export interface AppShellAsideProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	withBorder?: boolean;
	slotStyles?: SlotStyles;
}

export interface AppShellMainProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	slotStyles?: SlotStyles;
}

export interface AppShellFooterProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	withBorder?: boolean;
	slotStyles?: SlotStyles;
}
