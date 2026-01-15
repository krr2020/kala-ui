import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { Button } from "../button";
import { Toast } from "./toast";

const meta: Meta<typeof Toast> = {
	title: "Feedback/Toast",
	component: Toast,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
	render: () => (
		<div className="flex flex-col gap-4 items-center">
			<Toast />
			<Button
				variant="outline"
				onClick={() =>
					toast("Event has been created", {
						description: "Sunday, December 03, 2023 at 9:00 AM",
						action: {
							label: "Undo",
							onClick: () => console.log("Undo"),
						},
					})
				}
			>
				Show Toast
			</Button>
		</div>
	),
};

export const Success: Story = {
	render: () => (
		<div className="flex flex-col gap-4 items-center">
			<Toast />
			<Button
				variant="outline"
				onClick={() =>
					toast.success("Event has been created", {
						description: "Sunday, December 03, 2023 at 9:00 AM",
					})
				}
			>
				Show Success Toast
			</Button>
		</div>
	),
};

export const ErrorToast: Story = {
	render: () => (
		<div className="flex flex-col gap-4 items-center">
			<Toast />
			<Button
				variant="outline"
				onClick={() =>
					toast.error("Event has not been created", {
						description: "Sunday, December 03, 2023 at 9:00 AM",
					})
				}
			>
				Show Error Toast
			</Button>
		</div>
	),
};

export const VariantsWithActions: Story = {
	render: () => (
		<div className="flex flex-col gap-4 items-center">
			<Toast />
			<div className="flex gap-4">
				<Button
					variant="outline"
					onClick={() =>
						toast.success("Project updated successfully", {
							description: "The changes have been saved to the server.",
							action: {
								label: "View Changes",
								onClick: () => console.log("View Changes"),
							},
						})
					}
				>
					Success with Action
				</Button>
				<Button
					variant="outline"
					onClick={() =>
						toast.error("Failed to upload file", {
							description: "The file size exceeds the limit of 10MB.",
							action: {
								label: "Retry",
								onClick: () => console.log("Retry"),
							},
						})
					}
				>
					Error with Action
				</Button>
				<Button
					variant="outline"
					onClick={() =>
						toast.warning("Storage almost full", {
							description: "You have used 90% of your available storage.",
							action: {
								label: "Upgrade",
								onClick: () => console.log("Upgrade"),
							},
						})
					}
				>
					Warning with Action
				</Button>
				<Button
					variant="outline"
					onClick={() =>
						toast.info("New update available", {
							description: "Version 2.0 is now available for download.",
							action: {
								label: "Install",
								onClick: () => console.log("Install"),
							},
						})
					}
				>
					Info with Action
				</Button>
			</div>
		</div>
	),
};
