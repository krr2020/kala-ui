import type * as React from "react";

export interface ComponentMetadata {
	name: string;
	description: string;
	docPath: string;
	preview?: React.ReactNode;
	tags?: string[];
}

export interface CategoryMetadata {
	name: string;
	description: string;
	components: ComponentMetadata[];
}

export const designSystemComponents: ComponentMetadata[] = [
	{
		name: "Button",
		description: "Primary action component with multiple variants and sizes",
		docPath: "/docs/buttons-button--docs",
	},
	{
		name: "Input",
		description: "Text input field with validation states",
		docPath: "/docs/forms-input--docs",
	},
	{
		name: "Textarea",
		description: "Multi-line text input area",
		docPath: "/docs/forms-textarea--docs",
	},
	{
		name: "Checkbox",
		description: "Checkbox for binary selections",
		docPath: "/docs/forms-checkbox--docs",
	},
	{
		name: "Switch",
		description: "Toggle switch for on/off states",
		docPath: "/docs/buttons-switch--docs",
	},
	{
		name: "Radio Group",
		description: "Radio buttons for mutually exclusive selections",
		docPath: "/docs/forms-radio-group--docs",
	},
	{
		name: "Select",
		description: "Dropdown selection component",
		docPath: "/docs/forms-select--docs",
	},
	{
		name: "Alert",
		description: "Inline alerts for important messages",
		docPath: "/docs/feedback-alert--docs",
	},
	{
		name: "Spinner",
		description: "Loading spinner indicator",
		docPath: "/docs/feedback-spinner--docs",
	},
	{
		name: "Skeleton",
		description: "Skeleton loading placeholder",
		docPath: "/docs/feedback-skeleton--docs",
	},
	{
		name: "Card",
		description: "Content card with multiple variants",
		docPath: "/docs/data-display-card--docs",
	},
	{
		name: "Badge",
		description: "Status and label badges",
		docPath: "/docs/data-display-badge--docs",
	},
	{
		name: "Avatar",
		description: "User avatar component",
		docPath: "/docs/data-display-avatar--docs",
	},
	{
		name: "Table",
		description: "Basic table component",
		docPath: "/docs/data-display-table--docs",
	},
	{
		name: "Breadcrumbs",
		description: "Navigation breadcrumb trail",
		docPath: "/docs/data-display-breadcrumbs--docs",
	},
	{
		name: "Tabs",
		description: "Tabbed content switcher",
		docPath: "/docs/layout-tabs--docs",
	},
	{
		name: "Accordion",
		description: "Collapsible content sections",
		docPath: "/docs/layout-accordion--docs",
	},
	{
		name: "Progress",
		description: "Progress bar component",
		docPath: "/docs/feedback-progress--docs",
	},
	{
		name: "Slider",
		description: "Range slider input",
		docPath: "/docs/forms-slider--docs",
	},
	{
		name: "Toggle",
		description: "Toggle button component",
		docPath: "/docs/buttons-toggle--docs",
	},
];
