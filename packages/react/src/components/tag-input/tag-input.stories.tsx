import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TagInput } from "./tag-input";

const meta = {
	title: "Forms/TagInput",
	component: TagInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [tags, setTags] = useState<string[]>([]);
		return (
			<div className="w-[500px]">
				<TagInput
					value={tags}
					onChange={setTags}
					placeholder="Type and press comma or enter..."
				/>
			</div>
		);
	},
};

export const WithInitialTags: Story = {
	render: () => {
		const [tags, setTags] = useState<string[]>([
			"/admin/users",
			"/admin/users/create",
			"/admin/users/:id/edit",
		]);
		return (
			<div className="w-[500px]">
				<TagInput value={tags} onChange={setTags} />
			</div>
		);
	},
};

export const WithMaxTags: Story = {
	render: () => {
		const [tags, setTags] = useState<string[]>(["tag1", "tag2"]);
		return (
			<div className="w-[500px]">
				<TagInput
					value={tags}
					onChange={setTags}
					maxTags={3}
					placeholder="Maximum 3 tags allowed"
				/>
				<p className="text-xs text-muted-foreground mt-2">
					Try adding more than 3 tags
				</p>
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => {
		const [tags] = useState<string[]>(["tag1", "tag2", "tag3"]);
		return (
			<div className="w-[500px]">
				<TagInput value={tags} disabled placeholder="Disabled input" />
			</div>
		);
	},
};

export const WithError: Story = {
	render: () => {
		const [tags, setTags] = useState<string[]>(["invalid-tag"]);
		return (
			<div className="w-[500px]">
				<TagInput
					value={tags}
					onChange={setTags}
					hasError
					placeholder="This field has an error"
				/>
				<p className="text-xs text-error-500 mt-1">Tags must be valid routes</p>
			</div>
		);
	},
};

export const CustomSeparators: Story = {
	render: () => {
		const [tags, setTags] = useState<string[]>([]);
		return (
			<div className="w-[500px]">
				<TagInput
					value={tags}
					onChange={setTags}
					separators={[";", "Enter"]}
					placeholder="Type and press semicolon or enter..."
				/>
				<p className="text-xs text-muted-foreground mt-2">
					Uses semicolon instead of comma
				</p>
			</div>
		);
	},
};

export const WithValidation: Story = {
	render: () => {
		const [tags, setTags] = useState<string[]>([]);
		return (
			<div className="w-[500px]">
				<TagInput
					value={tags}
					onChange={setTags}
					validateTag={(tag) => tag.startsWith("/")}
					placeholder="Only routes starting with / are allowed"
				/>
				<p className="text-xs text-muted-foreground mt-2">
					Try adding tags with and without leading slash
				</p>
			</div>
		);
	},
};

export const AllowDuplicates: Story = {
	render: () => {
		const [tags, setTags] = useState<string[]>(["tag1"]);
		return (
			<div className="w-[500px]">
				<TagInput
					value={tags}
					onChange={setTags}
					allowDuplicates
					placeholder="Duplicates allowed"
				/>
				<p className="text-xs text-muted-foreground mt-2">
					Try adding 'tag1' again
				</p>
			</div>
		);
	},
};
