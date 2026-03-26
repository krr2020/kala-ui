import type { Meta, StoryObj } from "@storybook/react";
import { ClipboardIcon, ClipboardCheckIcon } from "lucide-react";
import { CopyButton } from "./copy-button";

const meta = {
	title: "Forms/CopyButton",
	component: CopyButton,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { value: "npm install kala-ui" },
	render: () => (
		<div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 font-mono text-sm">
			<span>npm install kala-ui</span>
			<CopyButton
				value="npm install kala-ui"
				aria-label="Copy install command"
			/>
		</div>
	),
};

export const WithCustomIcons: Story = {
	args: { value: "pnpm add kala-ui" },
	render: () => (
		<div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 font-mono text-sm">
			<span>pnpm add kala-ui</span>
			<CopyButton
				value="pnpm add kala-ui"
				aria-label="Copy install command"
				copyIcon={<ClipboardIcon className="h-4 w-4" />}
				checkIcon={<ClipboardCheckIcon className="h-4 w-4" />}
			/>
		</div>
	),
};

export const DifferentSizes: Story = {
	args: { value: "copy" },
	render: () => (
		<div className="flex items-center gap-4">
			<CopyButton value="small" size="sm" aria-label="Copy small" />
			<CopyButton value="default" aria-label="Copy default" />
			<CopyButton value="large" size="lg" aria-label="Copy large" />
		</div>
	),
};
