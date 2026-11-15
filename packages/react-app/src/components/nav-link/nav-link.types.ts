import type * as React from "react";
import type { IconComponent } from "@kala-ui/react/icons";

export interface NavLinkProps
	extends Omit<React.ComponentProps<"button">, "onChange" | "ref"> {
	label: React.ReactNode;
	description?: React.ReactNode;
	icon?: React.ReactNode;
	rightSection?: React.ReactNode;
	/** Collapse chevron — any `{className, size}` icon component; defaults to kala's built-in chevron. */
	chevronIcon?: IconComponent;
	active?: boolean;
	/**
	 * Renders the NavLink as a real anchor (<a href>) instead of a button.
	 * Use for top-level navigation targets: the href keeps middle-click,
	 * clone-tab and keyboard semantics native. A plain left-click is
	 * preventDefaulted so SPA routers can route client-side; modifier clicks
	 * are left to the browser. Nested-collapse behavior (children chevron
	 * toggle) only applies in button mode.
	 */
	href?: string;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
	disableRightSectionRotation?: boolean;
	indent?: boolean;
}
