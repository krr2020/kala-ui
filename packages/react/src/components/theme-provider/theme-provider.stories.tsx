import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/button";
import { Text } from "../text/text";
import { ThemeProvider, useTheme } from "./theme-provider";

const meta: Meta<typeof ThemeProvider> = {
	title: "Theming/ThemeProvider",
	component: ThemeProvider,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		defaultTheme: {
			control: "select",
			options: ["light", "dark", "system"],
		},
		attribute: {
			control: "select",
			options: ["class", "data-theme"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

function ThemeSwitcher() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	return (
		<div className="flex flex-col items-center gap-3">
			<Text>
				theme: <code>{theme}</code> · resolved: <code>{resolvedTheme}</code>
			</Text>
			<div className="flex gap-2">
				{(["light", "dark", "system"] as const).map((t) => (
					<Button
						key={t}
						variant={theme === t ? "solid" : "outline"}
						onClick={() => setTheme(t)}
					>
						{t}
					</Button>
				))}
			</div>
		</div>
	);
}

export const Default: Story = {
	render: () => (
		<ThemeProvider defaultTheme="system" storageKey="kala-story-theme">
			<ThemeSwitcher />
		</ThemeProvider>
	),
};

export const DataThemeAttribute: Story = {
	render: () => (
		<ThemeProvider
			defaultTheme="dark"
			attribute="data-theme"
			storageKey="kala-story-theme-attr"
		>
			<ThemeSwitcher />
		</ThemeProvider>
	),
};
