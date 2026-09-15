import type { ReactNode } from "react";

export type TagColor =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info"
	| "muted";

export type TagVariant = "solid" | "outline" | "subtle";
export type TagSize = "sm" | "md" | "lg";

export interface TagProps {
	variant?: TagVariant;
	color?: TagColor;
	size?: TagSize;
	/** Show the remove affordance; each press calls this exactly once. */
	onRemove?: () => void;
	/** Icon rendered before the label. */
	icon?: ReactNode;
	children?: ReactNode;
	testID?: string;
}
