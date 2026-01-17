import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "../button";
import { Label } from "../label";
import { Skeleton } from "../skeleton";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
	title: "Forms/RadioGroup",
	component: RadioGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "cards", "buttons"],
			description: "Visual style variant",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "Size of radio buttons",
		},
		disabled: {
			control: "boolean",
			description: "Disable all radio items",
		},
	},
	args: {
		variant: "default",
		size: "md",
	},
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic radio group with default styling
 */
export const Default: Story = {
	render: (args) => (
		<RadioGroup {...args} defaultValue="option-one">
			<div className="flex items-center gap-2">
				<RadioGroupItem value="option-one" id="option-one" />
				<Label htmlFor="option-one">Option One</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="option-two" id="option-two" />
				<Label htmlFor="option-two">Option Two</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="option-three" id="option-three" />
				<Label htmlFor="option-three">Option Three</Label>
			</div>
		</RadioGroup>
	),
};

/**
 * Radio group with labels and descriptions
 */
export const WithLabelsAndDescriptions: Story = {
	render: () => (
		<RadioGroup defaultValue="comfortable" className="w-96">
			<RadioGroupItem
				value="default"
				id="r1"
				label="Default"
				description="This is the default option with standard spacing"
			/>
			<RadioGroupItem
				value="comfortable"
				id="r2"
				label="Comfortable"
				description="Increased padding for better readability"
			/>
			<RadioGroupItem
				value="compact"
				id="r3"
				label="Compact"
				description="Reduced spacing to fit more content"
			/>
		</RadioGroup>
	),
};

/**
 * Different size variants
 */
export const Sizes: Story = {
	render: () => (
		<div className="space-y-8">
			<div>
				<div className="text-sm font-medium mb-3">Small</div>
				<RadioGroup size="sm" defaultValue="sm-1" className="w-80">
					<RadioGroupItem value="sm-1" id="sm-1" label="Small option 1" />
					<RadioGroupItem value="sm-2" id="sm-2" label="Small option 2" />
				</RadioGroup>
			</div>
			<div>
				<div className="text-sm font-medium mb-3">Medium (Default)</div>
				<RadioGroup size="md" defaultValue="md-1" className="w-80">
					<RadioGroupItem value="md-1" id="md-1" label="Medium option 1" />
					<RadioGroupItem value="md-2" id="md-2" label="Medium option 2" />
				</RadioGroup>
			</div>
			<div>
				<div className="text-sm font-medium mb-3">Large</div>
				<RadioGroup size="lg" defaultValue="lg-1" className="w-80">
					<RadioGroupItem value="lg-1" id="lg-1" label="Large option 1" />
					<RadioGroupItem value="lg-2" id="lg-2" label="Large option 2" />
				</RadioGroup>
			</div>
		</div>
	),
};

/**
 * Cards variant for more prominent options
 */
export const CardsVariant: Story = {
	render: () => (
		<RadioGroup variant="cards" defaultValue="starter" className="w-96">
			<RadioGroupItem
				value="starter"
				id="starter"
				label="Starter Plan"
				description="Perfect for individuals and small projects"
			/>
			<RadioGroupItem
				value="pro"
				id="pro"
				label="Pro Plan"
				description="Best for growing teams and businesses"
			/>
			<RadioGroupItem
				value="enterprise"
				id="enterprise"
				label="Enterprise Plan"
				description="Advanced features for large organizations"
			/>
		</RadioGroup>
	),
};

/**
 * Buttons variant for compact horizontal layout
 */
export const ButtonsVariant: Story = {
	render: () => (
		<div className="space-y-6">
			<div>
				<div className="text-sm font-medium mb-3">Select Size</div>
				<RadioGroup variant="buttons" defaultValue="medium">
					<RadioGroupItem value="small" id="size-sm" label="S" />
					<RadioGroupItem value="medium" id="size-md" label="M" />
					<RadioGroupItem value="large" id="size-lg" label="L" />
					<RadioGroupItem value="xlarge" id="size-xl" label="XL" />
				</RadioGroup>
			</div>
			<div>
				<div className="text-sm font-medium mb-3">Choose Color</div>
				<RadioGroup variant="buttons" defaultValue="blue">
					<RadioGroupItem value="blue" id="color-blue" label="Blue" />
					<RadioGroupItem value="red" id="color-red" label="Red" />
					<RadioGroupItem value="green" id="color-green" label="Green" />
					<RadioGroupItem value="yellow" id="color-yellow" label="Yellow" />
					<RadioGroupItem value="purple" id="color-purple" label="Purple" />
				</RadioGroup>
			</div>
		</div>
	),
};

/**
 * Radio group with disabled state
 */
export const WithDisabled: Story = {
	render: () => (
		<RadioGroup defaultValue="option-one" className="w-80">
			<RadioGroupItem
				value="option-one"
				id="d1"
				label="Available"
				description="This option is available"
			/>
			<RadioGroupItem
				value="option-two"
				id="d2"
				label="Disabled"
				description="This option is disabled"
				disabled
			/>
			<RadioGroupItem
				value="option-three"
				id="d3"
				label="Also Available"
				description="This option is also available"
			/>
		</RadioGroup>
	),
};

/**
 * Radio group with error state
 */
export const WithError: Story = {
	render: () => (
		<div className="w-96 space-y-3">
			<RadioGroup defaultValue="">
				<RadioGroupItem
					value="option-one"
					id="e1"
					label="Option One"
					description="First option"
					error
				/>
				<RadioGroupItem
					value="option-two"
					id="e2"
					label="Option Two"
					description="Second option"
					error
				/>
			</RadioGroup>
			<p className="text-sm text-destructive">
				Please select an option to continue
			</p>
		</div>
	),
};

/**
 * Form example with notification preferences
 */
export const FormExample: Story = {
	render: () => (
		<form className="w-96 space-y-6">
			<div className="space-y-3">
				<div>
					<h3 className="text-base font-semibold">Email Notifications</h3>
					<p className="text-sm text-muted-foreground">
						Choose when to receive email updates
					</p>
				</div>
				<RadioGroup defaultValue="all">
					<RadioGroupItem
						value="all"
						id="notify-all"
						label="All new messages"
						description="Receive an email for every new message"
					/>
					<RadioGroupItem
						value="mentions"
						id="notify-mentions"
						label="Direct messages and mentions"
						description="Only get notified when someone mentions you"
					/>
					<RadioGroupItem
						value="none"
						id="notify-none"
						label="Nothing"
						description="Don't send any email notifications"
					/>
				</RadioGroup>
			</div>

			<div className="space-y-3">
				<div>
					<h3 className="text-base font-semibold">Privacy Settings</h3>
					<p className="text-sm text-muted-foreground">
						Control who can see your profile
					</p>
				</div>
				<RadioGroup defaultValue="everyone" variant="cards">
					<RadioGroupItem
						value="everyone"
						id="privacy-public"
						label="Public"
						description="Anyone can view your profile"
					/>
					<RadioGroupItem
						value="friends"
						id="privacy-friends"
						label="Friends Only"
						description="Only your friends can see your profile"
					/>
					<RadioGroupItem
						value="private"
						id="privacy-private"
						label="Private"
						description="Only you can view your profile"
					/>
				</RadioGroup>
			</div>
		</form>
	),
};

/**
 * Interactive controlled example
 */
export const Interactive: Story = {
	render: () => {
		const [value, setValue] = React.useState("comfortable");

		return (
			<div className="w-96 space-y-4">
				<RadioGroup value={value} onValueChange={setValue}>
					<RadioGroupItem
						value="default"
						id="int-1"
						label="Default"
						description="Standard spacing and padding"
					/>
					<RadioGroupItem
						value="comfortable"
						id="int-2"
						label="Comfortable"
						description="Extra padding for readability"
					/>
					<RadioGroupItem
						value="compact"
						id="int-3"
						label="Compact"
						description="Minimal spacing to save space"
					/>
				</RadioGroup>

				<div className="p-4 bg-muted rounded-lg">
					<div className="text-sm font-medium">Selected value:</div>
					<div className="text-sm text-muted-foreground mt-1">{value}</div>
				</div>

				<Button
					type="button"
					onClick={() => setValue("default")}
					className="w-full"
				>
					Reset to Default
				</Button>
			</div>
		);
	},
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<Skeleton className="h-4 w-4 rounded-full" />
				<Skeleton className="h-4 w-32" />
			</div>
			<div className="flex items-center gap-2">
				<Skeleton className="h-4 w-4 rounded-full" />
				<Skeleton className="h-4 w-40" />
			</div>
			<div className="flex items-center gap-2">
				<Skeleton className="h-4 w-4 rounded-full" />
				<Skeleton className="h-4 w-36" />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholders for radio group options while loading.",
			},
		},
	},
};
