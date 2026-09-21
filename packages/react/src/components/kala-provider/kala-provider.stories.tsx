import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../badge";
import { Button } from "../button";
import { KalaProvider } from "./kala-provider";

const meta: Meta<typeof KalaProvider> = {
	title: "Components/KalaProvider",
	component: KalaProvider,
};

export default meta;
type Story = StoryObj<typeof KalaProvider>;

export const Configured: Story = {
	name: "Configured provider",
	render() {
		return (
			<KalaProvider
				defaultSlotStyles={{ badge: { root: "rounded-none tracking-wide" } }}
				tokens={{
					"--primary": "oklch(0.55 0.22 264)",
					kalaRadiusControl: "9999px",
				}}
				variants={{ button: { brand: "bg-primary text-primary-foreground" } }}
			>
				<div className="flex items-center gap-3">
					<Badge>Beta</Badge>
					<Button variant="solid">Solid button</Button>
				</div>
			</KalaProvider>
		);
	},
};
