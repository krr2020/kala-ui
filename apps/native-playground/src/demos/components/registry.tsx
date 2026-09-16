import type { ReactElement } from "react";
import { AppChromeDemo } from "../app-chrome-demo";
import { BasicsDemo } from "../basics-demo";
import { ChartsDemo } from "../charts-demo";
import { DataTableDemo } from "../data-table-demo";
import { FeedbackDemo } from "../feedback-demo";
import { NavigationDemo } from "../navigation-demo";
import { OverlaysDemo } from "../overlays-demo";
import { TokensDemo } from "../tokens-demo";
import { ButtonDemo } from "./button-demo";

// Two-row filter navigation: row 1 selects a group, row 2 selects a
// component inside it. Components without a dedicated screen fall back
// to their group overview until their dedicated demo lands — one
// component per change, chips dim until then.
export interface ComponentEntry {
	name: string;
	render?: () => ReactElement;
}

export interface ComponentGroup {
	name: string;
	title: string;
	overview: () => ReactElement;
	components: ComponentEntry[];
}

export const componentGroups: ComponentGroup[] = [
	{
		name: "tokens",
		title: "Tokens & Theming",
		overview: () => <TokensDemo />,
		components: [{ name: "theming", render: () => <TokensDemo /> }],
	},
	{
		name: "basics",
		title: "Basics",
		overview: () => <BasicsDemo />,
		components: [
			{ name: "button", render: () => <ButtonDemo /> },
			{ name: "icon" },
			{ name: "text" },
			{ name: "heading" },
			{ name: "list" },
			{ name: "avatar" },
			{ name: "avatar-group" },
			{ name: "badge" },
			{ name: "tag" },
			{ name: "tag-input" },
			{ name: "card" },
			{ name: "separator" },
		],
	},
	{
		name: "forms",
		title: "Forms & Inputs",
		overview: () => <FeedbackDemo />,
		components: [
			{ name: "text-input" },
			{ name: "textarea" },
			{ name: "number-input" },
			{ name: "select" },
			{ name: "combobox" },
			{ name: "multi-select" },
			{ name: "checkbox" },
			{ name: "radio-group" },
			{ name: "switch" },
			{ name: "toggle" },
			{ name: "slider" },
			{ name: "rating" },
			{ name: "field" },
			{ name: "label" },
			{ name: "input-otp" },
			{ name: "calendar" },
			{ name: "date-picker" },
			{ name: "time-picker" },
		],
	},
	{
		name: "feedback",
		title: "Feedback & Status",
		overview: () => <FeedbackDemo />,
		components: [
			{ name: "alert" },
			{ name: "banner" },
			{ name: "toast" },
			{ name: "progress" },
			{ name: "ring-progress" },
			{ name: "spinner" },
			{ name: "skeleton" },
			{ name: "loading-overlay" },
			{ name: "error-boundary" },
			{ name: "empty-state" },
			{ name: "indicator" },
			{ name: "copy-button" },
			{ name: "password-strength" },
		],
	},
	{
		name: "navigation",
		title: "Navigation & Controls",
		overview: () => <NavigationDemo />,
		components: [
			{ name: "tabs" },
			{ name: "steps" },
			{ name: "segmented-control" },
			{ name: "toggle-group" },
			{ name: "timeline" },
			{ name: "accordion" },
			{ name: "collapsible" },
			{ name: "dropdown-menu" },
			{ name: "context-menu" },
		],
	},
	{
		name: "overlays",
		title: "Overlays & Menus",
		overview: () => <OverlaysDemo />,
		components: [
			{ name: "dialog" },
			{ name: "alert-dialog" },
			{ name: "sheet" },
		],
	},
	{
		name: "data",
		title: "Data Display",
		overview: () => <DataTableDemo />,
		components: [{ name: "data-table" }],
	},
	{
		name: "charts",
		title: "Charts & Metrics",
		overview: () => <ChartsDemo />,
		components: [
			{ name: "metric-card" },
			{ name: "bar-chart" },
			{ name: "donut-chart" },
			{ name: "sparkline" },
		],
	},
	{
		name: "app chrome",
		title: "App Chrome",
		overview: () => <AppChromeDemo />,
		components: [{ name: "app-shell" }],
	},
];
