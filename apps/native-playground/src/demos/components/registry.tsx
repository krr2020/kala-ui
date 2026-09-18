import type { ReactElement } from "react";
import { AppChromeDemo } from "../app-chrome-demo";
import { BasicsDemo } from "../basics-demo";
import { ChartsDemo } from "../charts-demo";
import { DataTableDemo } from "../data-table-demo";
import { FeedbackDemo } from "../feedback-demo";
import { FormsDemo } from "../forms-demo";
import { NavigationDemo } from "../navigation-demo";
import { OverlaysDemo } from "../overlays-demo";
import { TokensDemo } from "../tokens-demo";
import { AccordionDemo } from "./accordion-demo";
import { AlertDemo } from "./alert-demo";
import { AlertDialogDemo } from "./alert-dialog-demo";
import { AvatarDemo } from "./avatar-demo";
import { AvatarGroupDemo } from "./avatar-group-demo";
import { BadgeDemo } from "./badge-demo";
import { BannerDemo } from "./banner-demo";
import { BarChartDemo } from "./bar-chart-demo";
import { ButtonDemo } from "./button-demo";
import { CalendarDemo } from "./calendar-demo";
import { CardDemo } from "./card-demo";
import { CheckboxDemo } from "./checkbox-demo";
import { CollapsibleDemo } from "./collapsible-demo";
import { ComboboxDemo } from "./combobox-demo";
import { ContextMenuDemo } from "./context-menu-demo";
import { CopyButtonDemo } from "./copy-button-demo";
import { DatePickerDemo } from "./date-picker-demo";
import { DialogDemo } from "./dialog-demo";
import { DonutChartDemo } from "./donut-chart-demo";
import { DropdownMenuDemo } from "./dropdown-menu-demo";
import { EmptyStateDemo } from "./empty-state-demo";
import { ErrorBoundaryDemo } from "./error-boundary-demo";
import { FieldDemo } from "./field-demo";
import { HeadingDemo } from "./heading-demo";
import { IconDemo } from "./icon-demo";
import { IndicatorDemo } from "./indicator-demo";
import { InputOtpDemo } from "./input-otp-demo";
import { humanizeLabel } from "./label";
import { LabelDemo } from "./label-demo";
import { ListDemo } from "./list-demo";
import { LoadingOverlayDemo } from "./loading-overlay-demo";
import { MetricCardDemo } from "./metric-card-demo";
import { MultiSelectDemo } from "./multi-select-demo";
import { NumberInputDemo } from "./number-input-demo";
import { PasswordStrengthDemo } from "./password-strength-demo";
import { ProgressDemo } from "./progress-demo";
import { RadioGroupDemo } from "./radio-group-demo";
import { RingProgressDemo } from "./ring-progress-demo";
import { RatingDemo } from "./rating-demo";
import { SelectDemo } from "./select-demo";
import { SegmentedControlDemo } from "./segmented-control-demo";
import { SeparatorDemo } from "./separator-demo";
import { SheetDemo } from "./sheet-demo";
import { SkeletonDemo } from "./skeleton-demo";
import { SliderDemo } from "./slider-demo";
import { SparklineDemo } from "./sparkline-demo";
import { SpinnerDemo } from "./spinner-demo";
import { StepsDemo } from "./steps-demo";
import { SwitchDemo } from "./switch-demo";
import { TabsDemo } from "./tabs-demo";
import { TagDemo } from "./tag-demo";
import { TextDemo } from "./text-demo";
import { TextInputDemo } from "./text-input-demo";
import { TextareaDemo } from "./textarea-demo";
import { TimePickerDemo } from "./time-picker-demo";
import { TimelineDemo } from "./timeline-demo";
import { ToastDemo } from "./toast-demo";
import { ToggleDemo } from "./toggle-demo";
import { ToggleGroupDemo } from "./toggle-group-demo";

export { humanizeLabel } from "./label";

// Two-row filter navigation: row 1 selects a group, row 2 selects a
// component inside it. Every component has a dedicated screen; each
// group's overview is a composed story over the same family.
export interface ComponentEntry {
	name: string;
	label: string;
	// overrides the group's source for entries whose component lives in the
	// other package (composite widgets that moved to @kala-ui/react-native-app)
	source?: "library" | "app";
	render: () => ReactElement;
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
			{
				label: humanizeLabel("list"),
				name: "list",
				render: () => <ListDemo />,
			},
			{
				label: humanizeLabel("avatar"),
				name: "avatar",
				render: () => <AvatarDemo />,
			},
			{
				label: humanizeLabel("avatar-group"),
				name: "avatar-group",
				render: () => <AvatarGroupDemo />,
			},
			{
				label: humanizeLabel("badge"),
				name: "badge",
				render: () => <BadgeDemo />,
			},
			{
				label: humanizeLabel("tag"),
				name: "tag",
				render: () => <TagDemo />,
			},
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
		overview: () => <FormsDemo />,
		components: [
			{
				label: humanizeLabel("text-input"),
				name: "text-input",
				render: () => <TextInputDemo />,
			},
			{
				label: humanizeLabel("textarea"),
				name: "textarea",
				render: () => <TextareaDemo />,
			},
			{
				label: humanizeLabel("number-input"),
				name: "number-input",
				render: () => <NumberInputDemo />,
			},
			{
				label: humanizeLabel("select"),
				name: "select",
				render: () => <SelectDemo />,
			},
			{
				label: humanizeLabel("combobox"),
				name: "combobox",
				render: () => <ComboboxDemo />,
			},
			{
				label: humanizeLabel("multi-select"),
				name: "multi-select",
				render: () => <MultiSelectDemo />,
			},
			{
				label: humanizeLabel("checkbox"),
				name: "checkbox",
				render: () => <CheckboxDemo />,
			},
			{
				label: humanizeLabel("radio-group"),
				name: "radio-group",
				render: () => <RadioGroupDemo />,
			},
			{
				label: humanizeLabel("switch"),
				name: "switch",
				render: () => <SwitchDemo />,
			},
			{
				label: humanizeLabel("toggle"),
				name: "toggle",
				render: () => <ToggleDemo />,
			},
			{
				label: humanizeLabel("slider"),
				name: "slider",
				render: () => <SliderDemo />,
			},
			{
				label: humanizeLabel("rating"),
				name: "rating",
				render: () => <RatingDemo />,
			},
			{
				label: humanizeLabel("field"),
				name: "field",
				render: () => <FieldDemo />,
			},
			{
				label: humanizeLabel("label"),
				name: "label",
				render: () => <LabelDemo />,
			},
			{
				label: humanizeLabel("input-otp"),
				name: "input-otp",
				render: () => <InputOtpDemo />,
			},
			{
				label: humanizeLabel("calendar"),
				name: "calendar",
				render: () => <CalendarDemo />,
			},
			{
				label: humanizeLabel("date-picker"),
				name: "date-picker",
				render: () => <DatePickerDemo />,
			},
			{
				label: humanizeLabel("time-picker"),
				name: "time-picker",
				render: () => <TimePickerDemo />,
			},
		],
	},
	{
		name: "feedback",
		label: humanizeLabel("feedback"),
		title: "Feedback & Status",
		source: "library",
		overview: () => <FeedbackDemo />,
		components: [
			{
				label: humanizeLabel("alert"),
				name: "alert",
				render: () => <AlertDemo />,
			},
			{
				label: humanizeLabel("banner"),
				name: "banner",
				render: () => <BannerDemo />,
			},
			{
				label: humanizeLabel("toast"),
				name: "toast",
				render: () => <ToastDemo />,
			},
			{
				label: humanizeLabel("progress"),
				name: "progress",
				render: () => <ProgressDemo />,
			},
			{
				label: humanizeLabel("ring-progress"),
				name: "ring-progress",
				render: () => <RingProgressDemo />,
			},
			{
				label: humanizeLabel("spinner"),
				name: "spinner",
				render: () => <SpinnerDemo />,
			},
			{
				label: humanizeLabel("skeleton"),
				name: "skeleton",
				render: () => <SkeletonDemo />,
			},
			{
				label: humanizeLabel("loading-overlay"),
				name: "loading-overlay",
				render: () => <LoadingOverlayDemo />,
			},
			{
				label: humanizeLabel("error-boundary"),
				name: "error-boundary",
				source: "app",
				render: () => <ErrorBoundaryDemo />,
			},
			{
				label: humanizeLabel("empty-state"),
				name: "empty-state",
				source: "app",
				render: () => <EmptyStateDemo />,
			},
			{
				label: humanizeLabel("indicator"),
				name: "indicator",
				render: () => <IndicatorDemo />,
			},
			{
				label: humanizeLabel("copy-button"),
				name: "copy-button",
				source: "app",
				render: () => <CopyButtonDemo />,
			},
			{
				label: humanizeLabel("password-strength"),
				name: "password-strength",
				source: "app",
				render: () => <PasswordStrengthDemo />,
			},
		],
	},
	{
		name: "navigation",
		label: humanizeLabel("navigation"),
		title: "Navigation & Controls",
		source: "library",
		overview: () => <NavigationDemo />,
		components: [
			{
				label: humanizeLabel("tabs"),
				name: "tabs",
				render: () => <TabsDemo />,
			},
			{
				label: humanizeLabel("steps"),
				name: "steps",
				source: "app",
				render: () => <StepsDemo />,
			},
			{
				label: humanizeLabel("segmented-control"),
				name: "segmented-control",
				render: () => <SegmentedControlDemo />,
			},
			{
				label: humanizeLabel("toggle-group"),
				name: "toggle-group",
				render: () => <ToggleGroupDemo />,
			},
			{
				label: humanizeLabel("timeline"),
				name: "timeline",
				source: "app",
				render: () => <TimelineDemo />,
			},
			{
				label: humanizeLabel("accordion"),
				name: "accordion",
				render: () => <AccordionDemo />,
			},
			{
				label: humanizeLabel("collapsible"),
				name: "collapsible",
				render: () => <CollapsibleDemo />,
			},
			{
				label: humanizeLabel("dropdown-menu"),
				name: "dropdown-menu",
				render: () => <DropdownMenuDemo />,
			},
			{
				label: humanizeLabel("context-menu"),
				name: "context-menu",
				render: () => <ContextMenuDemo />,
			},
		],
	},
	{
		name: "overlays",
		label: humanizeLabel("overlays"),
		title: "Overlays & Menus",
		source: "library",
		overview: () => <OverlaysDemo />,
		components: [
			{
				label: humanizeLabel("dialog"),
				name: "dialog",
				render: () => <DialogDemo />,
			},
			{
				label: humanizeLabel("alert-dialog"),
				name: "alert-dialog",
				render: () => <AlertDialogDemo />,
			},
			{
				label: humanizeLabel("sheet"),
				name: "sheet",
				render: () => <SheetDemo />,
			},
		],
	},
	{
		name: "data",
		label: humanizeLabel("data"),
		title: "Data Display",
		source: "app",
		overview: () => <DataTableDemo />,
		components: [
			{
				label: humanizeLabel("data-table"),
				name: "data-table",
				render: () => <DataTableDemo />,
			},
		],
	},
	{
		name: "charts",
		label: humanizeLabel("charts"),
		title: "Charts & Metrics",
		source: "app",
		overview: () => <ChartsDemo />,
		components: [
			{
				label: humanizeLabel("metric-card"),
				name: "metric-card",
				render: () => <MetricCardDemo />,
			},
			{
				label: humanizeLabel("bar-chart"),
				name: "bar-chart",
				render: () => <BarChartDemo />,
			},
			{
				label: humanizeLabel("donut-chart"),
				name: "donut-chart",
				render: () => <DonutChartDemo />,
			},
			{
				label: humanizeLabel("sparkline"),
				name: "sparkline",
				render: () => <SparklineDemo />,
			},
		],
	},
	{
		name: "app chrome",
		label: humanizeLabel("app chrome"),
		title: "App Chrome",
		source: "app",
		overview: () => <AppChromeDemo />,
		components: [
			{
				label: humanizeLabel("app-shell"),
				name: "app-shell",
				render: () => <AppChromeDemo />,
			},
		],
	},
];
