import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { FileUpload } from "./file-upload";

const meta: Meta<typeof FileUpload> = {
	title: "Forms/FileUpload",
	component: FileUpload,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	args: {
		onFileSelect: fn(),
		onClear: fn(),
		onError: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {};

export const WithValue: Story = {
	args: {
		value: new File(["dummy content"], "example.pdf", {
			type: "application/pdf",
		}),
	},
};

export const WithError: Story = {
	args: {
		error: "File size exceeds 5MB",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

export const WithProgress: Story = {
	args: {
		value: new File(["dummy content"], "uploading.pdf", {
			type: "application/pdf",
		}),
		progress: 45,
	},
};

export const WithAccept: Story = {
	args: {
		accept: "image/*",
	},
};
