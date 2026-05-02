import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const meta: Meta<typeof HoverCard> = {
	title: "Overlays/HoverCard",
	component: HoverCard,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
	render: () => (
		<HoverCard>
			<HoverCardTrigger asChild>
				<button
					type="button"
					className="text-sm font-medium underline underline-offset-4 cursor-pointer"
				>
					@kalaui
				</button>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="flex justify-between space-x-4">
					<Avatar>
						<AvatarImage src="https://github.com/kalaui.png" />
						<AvatarFallback>KU</AvatarFallback>
					</Avatar>
					<div className="space-y-1">
						<h4 className="text-sm font-semibold">@kalaui</h4>
						<p className="text-sm">
							Accessible React component library built with Radix UI and
							Tailwind.
						</p>
						<div className="flex items-center pt-2">
							<span className="text-xs text-muted-foreground">
								Joined March 2024
							</span>
						</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	),
};

export const SimpleText: Story = {
	render: () => (
		<HoverCard>
			<HoverCardTrigger asChild>
				<span className="cursor-help underline underline-offset-2 decoration-dotted text-sm">
					API rate limit
				</span>
			</HoverCardTrigger>
			<HoverCardContent>
				<p className="text-sm text-muted-foreground">
					The maximum number of requests allowed per minute. Exceeding this
					limit will result in a 429 error response.
				</p>
			</HoverCardContent>
		</HoverCard>
	),
};
