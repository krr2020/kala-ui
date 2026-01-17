import { useDisclosure } from "@kala-ui/react-hooks";
import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "../box";
import { Burger } from "../burger";
import { Button } from "../button";
import { Flex } from "../flex";
import { Heading } from "../heading";
import { Stack } from "../stack";
import { Text } from "../text";
import { AppShell } from "./app-shell";

const meta: Meta<typeof AppShell> = {
	title: "Components/AppShell",
	component: AppShell,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Basic: Story = {
	render: () => (
		<AppShell
			header={{ height: 60 }}
			navbar={{ width: 300, breakpoint: "sm" }}
			padding="md"
		>
			<AppShell.Header>
				<Box className="p-4">
					<Heading size="h4">My App</Heading>
				</Box>
			</AppShell.Header>

			<AppShell.Navbar>
				<Box className="p-4">
					<Text>Navbar content</Text>
				</Box>
			</AppShell.Navbar>

			<AppShell.Main>
				<Box className="h-[200vh] bg-muted/20 p-4 border border-dashed">
					<Text>Main content (scrollable)</Text>
				</Box>
			</AppShell.Main>
		</AppShell>
	),
};

export const WithToggle: Story = {
	render: () => {
		const [opened, { toggle }] = useDisclosure(false);

		return (
			<AppShell
				header={{ height: 60 }}
				navbar={{
					width: 300,
					breakpoint: "sm",
					collapsed: { mobile: !opened },
				}}
				padding="md"
			>
				<AppShell.Header>
					<Flex align="center" gap={4} className="h-full px-4">
						<Burger
							opened={opened}
							onClick={toggle}
							className="lg:hidden"
						/>
						<Heading size="h4">My App</Heading>
					</Flex>
				</AppShell.Header>

				<AppShell.Navbar>
					<Stack gap={2} className="p-4">
						<Button variant="ghost" className="justify-start">
							Home
						</Button>
						<Button variant="ghost" className="justify-start">
							Profile
						</Button>
						<Button variant="ghost" className="justify-start">
							Settings
						</Button>
					</Stack>
				</AppShell.Navbar>

				<AppShell.Main>
					<Box className="p-4">
						<Heading size="h2" className="mb-4">
							Dashboard
						</Heading>
						<Text>Resize window to see mobile collapse behavior.</Text>
					</Box>
				</AppShell.Main>
			</AppShell>
		);
	},
};

export const FullLayout: Story = {
	render: () => (
		<AppShell
			header={{ height: 60 }}
			footer={{ height: 60 }}
			navbar={{ width: 250, breakpoint: "sm" }}
			aside={{ width: 250, breakpoint: "md" }}
			padding="md"
		>
			<AppShell.Header>
				<Box className="font-bold px-4 py-2">Header</Box>
			</AppShell.Header>

			<AppShell.Navbar>
				<Box className="p-4">Navbar</Box>
			</AppShell.Navbar>

			<AppShell.Main>
				<Box className="p-4 border border-dashed h-full">Main Content</Box>
			</AppShell.Main>

			<AppShell.Aside>
				<Box className="p-4">Aside</Box>
			</AppShell.Aside>

			<AppShell.Footer>
				<Box className="font-bold px-4 py-2">Footer</Box>
			</AppShell.Footer>
		</AppShell>
	),
};
