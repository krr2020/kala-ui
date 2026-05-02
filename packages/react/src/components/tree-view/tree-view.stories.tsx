import type { Meta, StoryObj } from "@storybook/react";
import { FileText, Folder, FolderOpen, Image } from "lucide-react";
import { TreeView } from "./tree-view";
import type { TreeItem } from "./tree-view";

const fileTree: TreeItem[] = [
	{
		id: "src",
		label: "src",
		icon: <Folder className="text-yellow-500" />,
		children: [
			{
				id: "components",
				label: "components",
				icon: <FolderOpen className="text-yellow-500" />,
				children: [
					{
						id: "button",
						label: "Button.tsx",
						icon: <FileText className="text-blue-500" />,
					},
					{
						id: "input",
						label: "Input.tsx",
						icon: <FileText className="text-blue-500" />,
					},
				],
			},
			{
				id: "index",
				label: "index.ts",
				icon: <FileText className="text-blue-500" />,
			},
		],
	},
	{
		id: "public",
		label: "public",
		icon: <Folder className="text-yellow-500" />,
		children: [
			{
				id: "logo",
				label: "logo.png",
				icon: <Image className="text-green-500" />,
			},
		],
	},
	{
		id: "readme",
		label: "README.md",
		icon: <FileText className="text-gray-500" />,
	},
];

const meta: Meta<typeof TreeView> = {
	title: "Display/TreeView",
	component: TreeView,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		multiSelect: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof TreeView>;

export const Default: Story = {
	args: {
		data: fileTree,
		defaultExpanded: ["src"],
		className: "w-[260px]",
	},
};

export const Flat: Story = {
	args: {
		data: [
			{ id: "1", label: "Option A" },
			{ id: "2", label: "Option B" },
			{ id: "3", label: "Option C", disabled: true },
		],
		className: "w-[200px]",
	},
};

export const WithPreselected: Story = {
	args: {
		data: fileTree,
		defaultExpanded: ["src", "components"],
		selected: "button",
		className: "w-[260px]",
	},
};
