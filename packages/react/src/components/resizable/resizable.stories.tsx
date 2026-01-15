import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";
import type {
	ImperativePanelGroupHandle,
	ImperativePanelHandle,
} from "react-resizable-panels";
import { Button } from "../button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./resizable";

const meta = {
	title: "Layout/Resizable",
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic horizontal resizable panel layout with two panels.
 * Click and drag the handle to resize the panels.
 */
export const Horizontal: Story = {
	args: {},
	render: () => (
		<ResizablePanelGroup
			direction="horizontal"
			className="min-h-[300px] rounded-lg border"
		>
			<ResizablePanel defaultSize={50} className="p-6">
				<div className="flex h-full items-center justify-center">
					<span className="font-semibold">Panel One</span>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={50} className="p-6">
				<div className="flex h-full items-center justify-center">
					<span className="font-semibold">Panel Two</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

/**
 * Vertical resizable panel layout.
 * Use direction="vertical" to create top/bottom panels.
 */
export const Vertical: Story = {
	args: {},
	render: () => (
		<ResizablePanelGroup
			direction="vertical"
			className="min-h-[400px] rounded-lg border"
		>
			<ResizablePanel defaultSize={25} className="p-6">
				<div className="flex h-full items-center justify-center">
					<span className="font-semibold">Header</span>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={75} className="p-6">
				<div className="flex h-full items-center justify-center">
					<span className="font-semibold">Content</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

/**
 * Resizable handle with visual grip indicator.
 * Set withHandle={true} to show the drag handle.
 */
export const WithHandle: Story = {
	args: {},
	render: () => (
		<ResizablePanelGroup
			direction="horizontal"
			className="min-h-[300px] rounded-lg border"
		>
			<ResizablePanel defaultSize={30} minSize={20} className="p-6">
				<div className="flex h-full items-center justify-center">
					<span className="font-semibold">Sidebar</span>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={70} className="p-6">
				<div className="flex h-full items-center justify-center">
					<span className="font-semibold">Main Content</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

/**
 * Nested panel groups for complex layouts.
 * Combine horizontal and vertical panels to create sophisticated layouts.
 */
export const NestedPanels: Story = {
	args: {},
	render: () => (
		<ResizablePanelGroup
			direction="horizontal"
			className="min-h-[500px] rounded-lg border"
		>
			<ResizablePanel defaultSize={30} minSize={20} className="p-6">
				<div className="flex h-full items-center justify-center">
					<span className="font-semibold">Sidebar</span>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={70}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={30} className="p-6">
						<div className="flex h-full items-center justify-center">
							<span className="font-semibold">Header</span>
						</div>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={70} className="p-6">
						<div className="flex h-full items-center justify-center">
							<span className="font-semibold">Main Content</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

/**
 * Three-panel layout with multiple handles.
 * Useful for applications with sidebar, content, and details panels.
 */
export const ThreePanels: Story = {
	args: {},
	render: () => (
		<ResizablePanelGroup
			direction="horizontal"
			className="min-h-[300px] rounded-lg border"
		>
			<ResizablePanel defaultSize={20} minSize={15} className="p-6">
				<div className="flex h-full items-center justify-center">
					<span className="font-semibold">Left Sidebar</span>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={50} minSize={30} className="p-6">
				<div className="flex h-full items-center justify-center">
					<span className="font-semibold">Main Content</span>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={30} minSize={15} className="p-6">
				<div className="flex h-full items-center justify-center">
					<span className="font-semibold">Right Sidebar</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

/**
 * Panels with size constraints.
 * Use minSize and maxSize to limit panel dimensions.
 */
export const WithConstraints: Story = {
	args: {},
	render: () => (
		<ResizablePanelGroup
			direction="horizontal"
			className="min-h-[300px] rounded-lg border"
		>
			<ResizablePanel
				defaultSize={30}
				minSize={20}
				maxSize={40}
				className="p-6"
			>
				<div className="flex h-full flex-col items-center justify-center gap-2">
					<span className="font-semibold">Constrained Panel</span>
					<span className="text-muted-foreground text-sm">
						Min: 20% | Max: 40%
					</span>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel className="p-6">
				<div className="flex h-full items-center justify-center">
					<span className="font-semibold">Flexible Panel</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

/**
 * Collapsible panel with imperative controls.
 * Use the collapse() and expand() API to control panels programmatically.
 */
export const CollapsiblePanel: Story = {
	args: {},
	render: () => {
		const [isCollapsed, setIsCollapsed] = useState(false);
		const panelRef = useRef<ImperativePanelHandle>(null);

		const togglePanel = () => {
			const panel = panelRef.current;
			if (!panel) return;

			if (isCollapsed) {
				panel.expand();
			} else {
				panel.collapse();
			}
			setIsCollapsed(!isCollapsed);
		};

		return (
			<div className="space-y-4">
				<Button type="button" onClick={togglePanel}>
					{isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
				</Button>
				<ResizablePanelGroup
					direction="horizontal"
					className="min-h-[300px] rounded-lg border"
				>
					<ResizablePanel
						ref={panelRef}
						defaultSize={30}
						minSize={15}
						collapsible
						className="p-6"
						onCollapse={() => setIsCollapsed(true)}
						onExpand={() => setIsCollapsed(false)}
					>
						<div className="flex h-full items-center justify-center">
							<span className="font-semibold">Collapsible Sidebar</span>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel className="p-6">
						<div className="flex h-full items-center justify-center">
							<span className="font-semibold">Main Content</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		);
	},
};

/**
 * Imperative panel group controls.
 * Use getLayout() and setLayout() to manage panel sizes programmatically.
 */
export const ImperativeControls: Story = {
	args: {},
	render: () => {
		const groupRef = useRef<ImperativePanelGroupHandle>(null);
		const [layout, setLayout] = useState<number[]>([33, 34, 33]);

		const applyLayout = (sizes: number[]) => {
			groupRef.current?.setLayout(sizes);
		};

		const getCurrentLayout = () => {
			const currentLayout = groupRef.current?.getLayout();
			if (currentLayout) {
				setLayout(currentLayout.map((size) => Math.round(size)));
			}
		};

		return (
			<div className="space-y-4">
				<div className="flex flex-wrap gap-2">
					<Button type="button" onClick={() => applyLayout([25, 50, 25])}>
						25-50-25
					</Button>
					<Button type="button" onClick={() => applyLayout([33, 34, 33])}>
						Equal
					</Button>
					<Button type="button" onClick={() => applyLayout([15, 70, 15])}>
						15-70-15
					</Button>
					<Button type="button" variant="outline" onClick={getCurrentLayout}>
						Get Layout
					</Button>
				</div>
				<div className="text-muted-foreground text-sm">
					Current layout: {layout.join("% - ")}%
				</div>
				<ResizablePanelGroup
					ref={groupRef}
					direction="horizontal"
					className="min-h-[300px] rounded-lg border"
					onLayout={(sizes) => setLayout(sizes.map((size) => Math.round(size)))}
				>
					<ResizablePanel defaultSize={33} minSize={15} className="p-6">
						<div className="flex h-full items-center justify-center">
							<span className="font-semibold">Left</span>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={34} minSize={15} className="p-6">
						<div className="flex h-full items-center justify-center">
							<span className="font-semibold">Center</span>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={33} minSize={15} className="p-6">
						<div className="flex h-full items-center justify-center">
							<span className="font-semibold">Right</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		);
	},
};

/**
 * Disabled resize handle.
 * Use the disabled prop to prevent users from resizing panels.
 */
export const DisabledHandle: Story = {
	args: {},
	render: () => {
		const [disabled, setDisabled] = useState(false);

		return (
			<div className="space-y-4">
				<button
					type="button"
					onClick={() => setDisabled(!disabled)}
					className="hover:bg-primary/90 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
				>
					{disabled ? "Enable" : "Disable"} Resizing
				</button>
				<ResizablePanelGroup
					direction="horizontal"
					className="min-h-[300px] rounded-lg border"
				>
					<ResizablePanel defaultSize={50} className="p-6">
						<div className="flex h-full items-center justify-center">
							<span className="font-semibold">Left Panel</span>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle disabled={disabled} />
					<ResizablePanel defaultSize={50} className="p-6">
						<div className="flex h-full items-center justify-center">
							<span className="font-semibold">Right Panel</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		);
	},
};

/**
 * Real-world IDE-like layout.
 * Demonstrates a practical use case for resizable panels.
 */
export const IDELayout: Story = {
	args: {},
	render: () => (
		<ResizablePanelGroup
			direction="horizontal"
			className="min-h-[500px] rounded-lg border"
		>
			{/* File Explorer */}
			<ResizablePanel
				defaultSize={20}
				minSize={15}
				maxSize={30}
				className="border-r"
			>
				<div className="flex h-full flex-col">
					<div className="border-b p-4 font-semibold">Explorer</div>
					<div className="flex-1 p-4">
						<div className="space-y-2">
							<div className="text-sm">📁 src</div>
							<div className="ml-4 space-y-1 text-sm">
								<div>📄 App.tsx</div>
								<div>📄 index.tsx</div>
								<div>📄 styles.css</div>
							</div>
						</div>
					</div>
				</div>
			</ResizablePanel>

			<ResizableHandle />

			{/* Editor and Terminal */}
			<ResizablePanel defaultSize={60}>
				<ResizablePanelGroup direction="vertical">
					{/* Code Editor */}
					<ResizablePanel defaultSize={70} minSize={30}>
						<div className="flex h-full flex-col">
							<div className="border-b p-4 font-semibold">Editor</div>
							<div className="bg-muted/20 flex-1 p-4">
								<pre className="text-sm">
									<code>{`import React from 'react';

function App() {
  return (
    <div>Hello World</div>
  );
}

export default App;`}</code>
								</pre>
							</div>
						</div>
					</ResizablePanel>

					<ResizableHandle withHandle />

					{/* Terminal */}
					<ResizablePanel defaultSize={30} minSize={20}>
						<div className="flex h-full flex-col">
							<div className="border-t p-4 font-semibold">Terminal</div>
							<div className="bg-muted/40 flex-1 p-4">
								<div className="font-mono text-sm">
									<div>$ npm run dev</div>
									<div className="text-muted-foreground mt-2">
										Server running on port 3000...
									</div>
								</div>
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>

			<ResizableHandle />

			{/* Properties Panel */}
			<ResizablePanel
				defaultSize={20}
				minSize={15}
				maxSize={30}
				className="border-l"
			>
				<div className="flex h-full flex-col">
					<div className="border-b p-4 font-semibold">Properties</div>
					<div className="flex-1 space-y-4 p-4">
						<div>
							<div className="text-muted-foreground mb-1 text-xs font-medium">
								File Info
							</div>
							<div className="text-sm">App.tsx</div>
						</div>
						<div>
							<div className="text-muted-foreground mb-1 text-xs font-medium">
								Lines
							</div>
							<div className="text-sm">9</div>
						</div>
						<div>
							<div className="text-muted-foreground mb-1 text-xs font-medium">
								Size
							</div>
							<div className="text-sm">128 bytes</div>
						</div>
					</div>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	),
};

/**
 * Keyboard navigation support.
 * Use arrow keys to resize panels (default: 10% increments).
 * Use keyboardResizeBy prop to customize the increment.
 */
export const KeyboardResize: Story = {
	args: {},
	render: () => (
		<div className="space-y-4">
			<div className="text-muted-foreground rounded-md border p-4 text-sm">
				<p className="mb-2 font-semibold">Keyboard Controls:</p>
				<ul className="space-y-1">
					<li>• Focus the handle (click or Tab key)</li>
					<li>• Use Arrow keys (←/→ or ↑/↓) to resize</li>
					<li>• Each keypress adjusts by 5%</li>
				</ul>
			</div>
			<ResizablePanelGroup
				direction="horizontal"
				className="min-h-[300px] rounded-lg border"
				keyboardResizeBy={5}
			>
				<ResizablePanel defaultSize={50} className="p-6">
					<div className="flex h-full items-center justify-center">
						<span className="font-semibold">Left Panel</span>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={50} className="p-6">
					<div className="flex h-full items-center justify-center">
						<span className="font-semibold">Right Panel</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	),
};

/**
 * Persistent layout with localStorage.
 * Panel sizes are automatically saved and restored across sessions.
 */
export const PersistentLayout: Story = {
	args: {},
	render: () => (
		<div className="space-y-4">
			<div className="text-muted-foreground rounded-md border p-4 text-sm">
				<p className="mb-2 font-semibold">Try it:</p>
				<ul className="space-y-1">
					<li>1. Resize the panels below</li>
					<li>2. Refresh the Storybook page</li>
					<li>3. Your layout will be restored</li>
				</ul>
			</div>
			<ResizablePanelGroup
				direction="horizontal"
				className="min-h-[300px] rounded-lg border"
				autoSaveId="resizable-demo-layout"
			>
				<ResizablePanel defaultSize={30} minSize={20} className="p-6">
					<div className="flex h-full items-center justify-center">
						<span className="font-semibold">Sidebar</span>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={70} className="p-6">
					<div className="flex h-full items-center justify-center">
						<span className="font-semibold">Main Content</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	),
};
