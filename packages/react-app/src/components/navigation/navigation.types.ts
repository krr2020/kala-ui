import type * as React from "react";

export interface NavigationLink {
	label: string;
	href: string;
}

export interface NavigationProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	/** Array of navigation links */
	links: NavigationLink[];
	/** Orientation of the navigation. @default 'horizontal' */
	orientation?: "horizontal" | "vertical";
	/** Mobile layout style. @default 'dropdown' */
	mobileLayout?: "dropdown" | "vertical";
	/** Current pathname for active link detection */
	pathname?: string;
}
