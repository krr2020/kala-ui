import type { ReactNode } from "react";

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface BreadcrumbsProps {
	items: BreadcrumbItem[];
	className?: string;
	separator?: ReactNode;
	variant?: "default" | "style1" | "style2" | "style3";
}
