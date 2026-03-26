import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from "./kbd";

const meta = {
	title: "Display/Kbd",
	component: Kbd,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Kbd keys="cmd" />,
};

export const SingleKeys: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Kbd keys="cmd" />
			<Kbd keys="shift" />
			<Kbd keys="ctrl" />
			<Kbd keys="alt" />
			<Kbd keys="enter" />
			<Kbd keys="escape" />
			<Kbd keys="tab" />
			<Kbd keys="backspace" />
			<Kbd keys="delete" />
			<Kbd keys="space" />
		</div>
	),
};

export const ArrowKeys: Story = {
	render: () => (
		<div className="flex items-center gap-2">
			<Kbd keys="up" />
			<Kbd keys="down" />
			<Kbd keys="left" />
			<Kbd keys="right" />
		</div>
	),
};

export const KeyChords: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<Kbd keys={["cmd", "c"]} />
				<span className="text-sm text-muted-foreground">Copy</span>
			</div>
			<div className="flex items-center gap-2">
				<Kbd keys={["cmd", "v"]} />
				<span className="text-sm text-muted-foreground">Paste</span>
			</div>
			<div className="flex items-center gap-2">
				<Kbd keys={["cmd", "z"]} />
				<span className="text-sm text-muted-foreground">Undo</span>
			</div>
			<div className="flex items-center gap-2">
				<Kbd keys={["cmd", "shift", "z"]} />
				<span className="text-sm text-muted-foreground">Redo</span>
			</div>
			<div className="flex items-center gap-2">
				<Kbd keys={["ctrl", "alt", "delete"]} />
				<span className="text-sm text-muted-foreground">Force quit</span>
			</div>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-1">
				<Kbd size="sm" keys={["cmd", "k"]} />
				<span className="text-xs text-muted-foreground">Small</span>
			</div>
			<div className="flex items-center gap-1">
				<Kbd size="default" keys={["cmd", "k"]} />
				<span className="text-sm text-muted-foreground">Default</span>
			</div>
		</div>
	),
};

export const WithChildren: Story = {
	render: () => (
		<div className="flex items-center gap-2">
			<Kbd>A</Kbd>
			<Kbd>B</Kbd>
			<Kbd>F1</Kbd>
			<Kbd>PgUp</Kbd>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Custom key labels passed as children when the key is not in the known keys list.",
			},
		},
	},
};

export const InContext: Story = {
	render: () => (
		<div className="flex flex-col gap-3 text-sm">
			<p>
				Press <Kbd keys={["cmd", "k"]} /> to open the command palette.
			</p>
			<p>
				Use <Kbd keys="escape" /> to close any dialog.
			</p>
			<p>
				Hit <Kbd keys="enter" /> to confirm your selection.
			</p>
			<p>
				Navigate with <Kbd keys="up" /> and <Kbd keys="down" /> arrow keys.
			</p>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Kbd components used inline within text to describe keyboard shortcuts.",
			},
		},
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<span className="text-sm font-medium text-muted-foreground">
					Single Keys
				</span>
				<div className="flex flex-wrap items-center gap-2">
					{[
						"cmd",
						"shift",
						"ctrl",
						"alt",
						"enter",
						"escape",
						"tab",
						"backspace",
						"delete",
						"space",
						"up",
						"down",
						"left",
						"right",
					].map((key) => (
						<Kbd key={key} keys={key} />
					))}
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<span className="text-sm font-medium text-muted-foreground">
					Key Chords
				</span>
				<div className="flex flex-wrap items-center gap-3">
					<Kbd keys={["cmd", "k"]} />
					<Kbd keys={["cmd", "shift", "p"]} />
					<Kbd keys={["ctrl", "alt", "t"]} />
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<span className="text-sm font-medium text-muted-foreground">Sizes</span>
				<div className="flex items-center gap-3">
					<Kbd size="sm" keys={["cmd", "s"]} />
					<Kbd size="default" keys={["cmd", "s"]} />
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"All key types, chord combinations, and size variants of the Kbd component.",
			},
		},
	},
};
