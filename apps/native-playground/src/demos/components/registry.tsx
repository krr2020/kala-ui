import type { ReactElement } from "react";
import { AppChromeDemo } from "../app-chrome-demo";
import { BasicsDemo } from "../basics-demo";
import { ChartsDemo } from "../charts-demo";
import { DataTableDemo } from "../data-table-demo";
import { FeedbackDemo } from "../feedback-demo";
import { NavigationDemo } from "../navigation-demo";
import { OverlaysDemo } from "../overlays-demo";
import { TokensDemo } from "../tokens-demo";
import { AvatarDemo } from "./avatar-demo";
import { BadgeDemo } from "./badge-demo";
import { ButtonDemo } from "./button-demo";
import { CardDemo } from "./card-demo";
import { HeadingDemo } from "./heading-demo";
import { humanizeLabel } from "./label";
import { IconDemo } from "./icon-demo";
import { SeparatorDemo } from "./separator-demo";
import { TagDemo } from "./tag-demo";
import { TextDemo } from "./text-demo";

export { humanizeLabel } from "./label";

// Two-row filter navigation: row 1 selects a group, row 2 selects a
// component inside it. Components without a dedicated screen fall back
// to their group overview until their dedicated demo lands — one
// component per change, chips dim until then.
export interface ComponentEntry {
	name: string;
	label: string;
	render?: () => ReactElement;
}

export interface ComponentGroup {
	name: string;
	label: string;
	title: string;
	// which package the group's demos are backed by — drives the landing
	// page segregation between standard (@kala-ui/react-native) and app
	// (@kala-ui/react-native-app) component segments.
	source: "library" | "app";
	overview: () => ReactElement;
	components: ComponentEntry[];
}

export const componentGroups: ComponentGroup[] = [
	{
		name: "tokens",
		label: humanizeLabel("tokens"),
		title: "Tokens & Theming",
		source: "library",
		overview: () => <TokensDemo />,
		components: [
			{
				label: humanizeLabel("theming"),
				name: "theming",
				render: () => <TokensDemo />,
			},
		],
	},
	{
		name: "basics",
		label: humanizeLabel("basics"),
		title: "Basics",
		source: "library",
		overview: () => <BasicsDemo />,
		components: [
			{
				label: humanizeLabel("button"),
				name: "button",
				render: () => <ButtonDemo />,
			},
			{
				label: humanizeLabel("icon"),
				name: "icon",
				render: () => <IconDemo />,
			},
			{
				label: humanizeLabel("text"),
				name: "text",
				render: () => <TextDemo />,
			},
			{
				label: humanizeLabel("heading"),
				name: "heading",
				render: () => <HeadingDemo />,
			},
			{ label: humanizeLabel("list"), name: "list" },
			{
				label: humanizeLabel("avatar"),
				name: "avatar",
				render: () => <AvatarDemo />,
			},
			{ label: humanizeLabel("avatar-group"), name: "avatar-group" },
			{
				label: humanizeLabel("badge"),
				name: "badge",
				render: () => <BadgeDemo />,
			},
			{ label: humanizeLabel("tag"), name: "tag", render: () => <TagDemo /> },
			{ label: humanizeLabel("tag-input"), name: "tag-input" },
			{
				label: humanizeLabel("card"),
				name: "card",
				render: () => <CardDemo />,
			},
			{
				label: humanizeLabel("separator"),
				name: "separator",
				render: () => <SeparatorDemo />,
			},
		],
	},
	{
		name: "forms",
		label: humanizeLabel("forms"),
		title: "Forms & Inputs",
		source: "library",
		overview: () => <FeedbackDemo />,
		components: [
			{ label: humanizeLabel("text-input"), name: "text-input" },
			{ label: humanizeLabel("textarea"), name: "textarea" },
			{ label: humanizeLabel("number-input"), name: "number-input" },
			{ label: humanizeLabel("select"), name: "select" },
			{ label: humanizeLabel("combobox"), name: "combobox" },
			{ label: humanizeLabel("multi-select"), name: "multi-select" },
			{ label: humanizeLabel("checkbox"), name: "checkbox" },
			{ label: humanizeLabel("radio-group"), name: "radio-group" },
			{ label: humanizeLabel("switch"), name: "switch" },
			{ label: humanizeLabel("toggle"), name: "toggle" },
			{ label: humanizeLabel("slider"), name: "slider" },
			{ label: humanizeLabel("rating"), name: "rating" },
			{ label: humanizeLabel("field"), name: "field" },
			{ label: humanizeLabel("label"), name: "label" },
			{ label: humanizeLabel("input-otp"), name: "input-otp" },
			{ label: humanizeLabel("calendar"), name: "calendar" },
			{ label: humanizeLabel("date-picker"), name: "date-picker" },
			{ label: humanizeLabel("time-picker"), name: "time-picker" },
		],
	},
	{
		name: "feedback",
		label: humanizeLabel("feedback"),
		title: "Feedback & Status",
		source: "library",
		overview: () => <FeedbackDemo />,
		components: [
			{ label: humanizeLabel("alert"), name: "alert" },
			{ label: humanizeLabel("banner"), name: "banner" },
			{ label: humanizeLabel("toast"), name: "toast" },
			{ label: humanizeLabel("progress"), name: "progress" },
			{ label: humanizeLabel("ring-progress"), name: "ring-progress" },
			{ label: humanizeLabel("spinner"), name: "spinner" },
			{ label: humanizeLabel("skeleton"), name: "skeleton" },
			{ label: humanizeLabel("loading-overlay"), name: "loading-overlay" },
			{ label: humanizeLabel("error-boundary"), name: "error-boundary" },
			{ label: humanizeLabel("empty-state"), name: "empty-state" },
			{ label: humanizeLabel("indicator"), name: "indicator" },
			{ label: humanizeLabel("copy-button"), name: "copy-button" },
			{ label: humanizeLabel("password-strength"), name: "password-strength" },
		],
	},
	{
		name: "navigation",
		label: humanizeLabel("navigation"),
		title: "Navigation & Controls",
		source: "library",
		overview: () => <NavigationDemo />,
		components: [
			{ label: humanizeLabel("tabs"), name: "tabs" },
			{ label: humanizeLabel("steps"), name: "steps" },
			{ label: humanizeLabel("segmented-control"), name: "segmented-control" },
			{ label: humanizeLabel("toggle-group"), name: "toggle-group" },
			{ label: humanizeLabel("timeline"), name: "timeline" },
			{ label: humanizeLabel("accordion"), name: "accordion" },
			{ label: humanizeLabel("collapsible"), name: "collapsible" },
			{ label: humanizeLabel("dropdown-menu"), name: "dropdown-menu" },
			{ label: humanizeLabel("context-menu"), name: "context-menu" },
		],
	},
	{
		name: "overlays",
		label: humanizeLabel("overlays"),
		title: "Overlays & Menus",
		source: "library",
		overview: () => <OverlaysDemo />,
		components: [
			{ label: humanizeLabel("dialog"), name: "dialog" },
			{ label: humanizeLabel("alert-dialog"), name: "alert-dialog" },
			{ label: humanizeLabel("sheet"), name: "sheet" },
		],
	},
	{
		name: "data",
		label: humanizeLabel("data"),
		title: "Data Display",
		source: "app",
		overview: () => <DataTableDemo />,
		components: [{ label: humanizeLabel("data-table"), name: "data-table" }],
	},
	{
		name: "charts",
		label: humanizeLabel("charts"),
		title: "Charts & Metrics",
		source: "app",
		overview: () => <ChartsDemo />,
		components: [
			{ label: humanizeLabel("metric-card"), name: "metric-card" },
			{ label: humanizeLabel("bar-chart"), name: "bar-chart" },
			{ label: humanizeLabel("donut-chart"), name: "donut-chart" },
			{ label: humanizeLabel("sparkline"), name: "sparkline" },
		],
	},
	{
		name: "app chrome",
		label: humanizeLabel("app chrome"),
		title: "App Chrome",
		source: "app",
		overview: () => <AppChromeDemo />,
		components: [{ label: humanizeLabel("app-shell"), name: "app-shell" }],
	},
];
