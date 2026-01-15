import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "../separator/separator";
import { ScrollArea, ScrollBar } from "./scroll-area";

const meta = {
	title: "Layout/ScrollArea",
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 50 }).map(
	(_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

/**
 * Basic scroll area with vertical scrolling.
 * The scroll bar appears when content overflows.
 */
export const Default: Story = {
	args: {},
	render: () => (
		<ScrollArea className="h-72 w-48 rounded-md border">
			<div className="p-4">
				<h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
				{tags.map((tag) => (
					<div key={tag}>
						<div className="text-sm">{tag}</div>
						<Separator className="my-2" />
					</div>
				))}
			</div>
		</ScrollArea>
	),
};

/**
 * Horizontal scrolling with images.
 * Use orientation="horizontal" on ScrollBar for horizontal scrolling.
 */
export const Horizontal: Story = {
	args: {},
	render: () => {
		const artworks = [
			{ artist: "Ornella Binni", color: "#3b82f6" },
			{ artist: "Tom Byrom", color: "#8b5cf6" },
			{ artist: "Vladimir Malyavko", color: "#10b981" },
			{ artist: "Anna Martinez", color: "#f59e0b" },
			{ artist: "Sophie Chen", color: "#ef4444" },
		];

		return (
			<ScrollArea className="w-96 whitespace-nowrap rounded-md border">
				<div className="flex w-max space-x-4 p-4">
					{artworks.map((artwork) => (
						<figure key={artwork.artist} className="shrink-0">
							<div className="overflow-hidden rounded-md">
								<div
									className="aspect-3/4 h-fit w-[300px]"
									style={{ backgroundColor: artwork.color }}
								/>
							</div>
							<figcaption className="text-muted-foreground pt-2 text-xs">
								Photo by{" "}
								<span className="text-foreground font-semibold">
									{artwork.artist}
								</span>
							</figcaption>
						</figure>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		);
	},
};

/**
 * Scroll area with long text content.
 * Demonstrates natural text wrapping with vertical scrolling.
 */
export const LongText: Story = {
	args: {},
	render: () => (
		<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
			<p className="text-sm">
				Jokester began sneaking into the castle in the middle of the night and
				leaving jokes all over the place: under the king&apos;s pillow, in his
				soup, even in the royal toilet. The king was furious, but he
				couldn&apos;t seem to stop Jokester. And then, one day, the people of
				the kingdom discovered that the jokes left by Jokester were so funny
				that they couldn&apos;t help but laugh. And once they started laughing,
				they couldn&apos;t stop.
			</p>
			<p className="mt-4 text-sm">
				The king realized that he had made a mistake in trying to suppress
				Jokester and that laughter was the best medicine. He invited Jokester to
				become the court jester, and from that day on, the kingdom was filled
				with laughter and joy.
			</p>
			<p className="mt-4 text-sm">
				This story teaches us the importance of finding humor in difficult
				situations and not taking ourselves too seriously. It reminds us that
				sometimes, the best way to deal with challenges is to laugh at them.
			</p>
		</ScrollArea>
	),
};

/**
 * Scroll area with both vertical and horizontal scrolling.
 * Shows how to enable scrolling in both directions.
 */
export const BothDirections: Story = {
	args: {},
	render: () => (
		<ScrollArea className="h-[300px] w-[400px] rounded-md border">
			<div className="p-4" style={{ width: "800px" }}>
				<h4 className="mb-4 text-sm font-medium leading-none">Wide Content</h4>
				{Array.from({ length: 30 }).map((_, i) => (
					<div key={`both-${i}`} className="mb-2 text-sm">
						This is a very long line of text that extends beyond the viewport
						width to demonstrate horizontal scrolling. Line #{i + 1}
					</div>
				))}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	),
};

/**
 * Compact scroll area with small content.
 * Useful for sidebars or small widgets.
 */
export const Compact: Story = {
	args: {},
	render: () => (
		<ScrollArea className="h-32 w-32 rounded-md border">
			<div className="p-2">
				{Array.from({ length: 20 }).map((_, i) => (
					<div key={`compact-${i}`} className="text-xs">
						Item {i + 1}
					</div>
				))}
			</div>
		</ScrollArea>
	),
};

/**
 * Scroll area with different scroll types.
 * The type prop controls when scrollbars are visible.
 */
export const ScrollTypes: Story = {
	args: {},
	render: () => (
		<div className="space-y-4">
			<div>
				<h3 className="mb-2 text-sm font-semibold">Type: hover (default)</h3>
				<p className="text-muted-foreground mb-2 text-xs">
					Scrollbar appears on hover
				</p>
				<ScrollArea type="hover" className="h-32 w-48 rounded-md border">
					<div className="p-4">
						{Array.from({ length: 10 }).map((_, i) => (
							<div key={`hover-${i}`} className="text-sm">
								Item {i + 1}
							</div>
						))}
					</div>
				</ScrollArea>
			</div>

			<div>
				<h3 className="mb-2 text-sm font-semibold">Type: always</h3>
				<p className="text-muted-foreground mb-2 text-xs">
					Scrollbar always visible
				</p>
				<ScrollArea type="always" className="h-32 w-48 rounded-md border">
					<div className="p-4">
						{Array.from({ length: 10 }).map((_, i) => (
							<div key={`always-${i}`} className="text-sm">
								Item {i + 1}
							</div>
						))}
					</div>
				</ScrollArea>
			</div>

			<div>
				<h3 className="mb-2 text-sm font-semibold">Type: scroll</h3>
				<p className="text-muted-foreground mb-2 text-xs">
					Scrollbar appears when scrolling
				</p>
				<ScrollArea type="scroll" className="h-32 w-48 rounded-md border">
					<div className="p-4">
						{Array.from({ length: 10 }).map((_, i) => (
							<div key={`scroll-${i}`} className="text-sm">
								Item {i + 1}
							</div>
						))}
					</div>
				</ScrollArea>
			</div>

			<div>
				<h3 className="mb-2 text-sm font-semibold">Type: auto</h3>
				<p className="text-muted-foreground mb-2 text-xs">
					Scrollbar appears when content overflows
				</p>
				<ScrollArea type="auto" className="h-32 w-48 rounded-md border">
					<div className="p-4">
						{Array.from({ length: 10 }).map((_, i) => (
							<div key={`auto-${i}`} className="text-sm">
								Item {i + 1}
							</div>
						))}
					</div>
				</ScrollArea>
			</div>
		</div>
	),
};

/**
 * Styled scroll area with custom appearance.
 * Shows how to customize the scrollbar appearance.
 */
export const Styled: Story = {
	args: {},
	render: () => (
		<ScrollArea className="h-72 w-48 rounded-lg border-2 border-primary">
			<div className="bg-linear-to-b from-primary/10 to-transparent p-4">
				<h4 className="mb-4 text-sm font-bold text-primary">Styled Tags</h4>
				{tags.slice(0, 20).map((tag, i) => (
					<div key={tag}>
						<div className="flex items-center gap-2 text-sm">
							<span className="text-primary">{i + 1}.</span>
							<span>{tag}</span>
						</div>
						<Separator className="my-2" />
					</div>
				))}
			</div>
		</ScrollArea>
	),
};

/**
 * Code block with scroll area.
 * Perfect for displaying long code snippets.
 */
export const CodeBlock: Story = {
	args: {},
	render: () => (
		<ScrollArea className="h-[300px] w-[500px] rounded-md border">
			<div className="bg-muted/50 p-4">
				<pre className="text-sm">
					<code>
						{`import { ScrollArea } from '@repo/ui/scroll-area';

export function Example() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4>Title</h4>
        {/* Your scrollable content */}
      </div>
    </ScrollArea>
  );
}

// Advanced usage with horizontal scrolling
export function HorizontalExample() {
  return (
    <ScrollArea className="w-96 whitespace-nowrap">
      <div className="flex w-max space-x-4 p-4">
        {items.map((item) => (
          <div key={item.id}>{item.content}</div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}`}
					</code>
				</pre>
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	),
};

/**
 * Data table with scroll area.
 * Demonstrates using scroll area with tabular data.
 */
export const DataTable: Story = {
	args: {},
	render: () => {
		const data = Array.from({ length: 20 }).map((_, i) => ({
			id: i + 1,
			name: `User ${i + 1}`,
			email: `user${i + 1}@example.com`,
			role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
		}));

		return (
			<ScrollArea className="h-[300px] w-[500px] rounded-md border">
				<table className="w-full">
					<thead className="bg-muted/50 sticky top-0">
						<tr className="border-b">
							<th className="p-2 text-left text-sm font-semibold">ID</th>
							<th className="p-2 text-left text-sm font-semibold">Name</th>
							<th className="p-2 text-left text-sm font-semibold">Email</th>
							<th className="p-2 text-left text-sm font-semibold">Role</th>
						</tr>
					</thead>
					<tbody>
						{data.map((row) => (
							<tr key={row.id} className="border-b hover:bg-muted/30">
								<td className="p-2 text-sm">{row.id}</td>
								<td className="p-2 text-sm">{row.name}</td>
								<td className="text-muted-foreground p-2 text-sm">
									{row.email}
								</td>
								<td className="p-2 text-sm">
									<span
										className={`inline-block rounded-full px-2 py-0.5 text-xs ${
											row.role === "Admin"
												? "bg-destructive/10 text-destructive"
												: row.role === "Editor"
													? "bg-primary/10 text-primary"
													: "bg-success/10 text-success"
										}`}
									>
										{row.role}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</ScrollArea>
		);
	},
};

/**
 * Chat messages with scroll area.
 * Useful for chat interfaces or message lists.
 */
export const ChatMessages: Story = {
	args: {},
	render: () => {
		const messages = Array.from({ length: 15 }).map((_, i) => ({
			id: i + 1,
			user: i % 2 === 0 ? "Alice" : "Bob",
			message: `This is message #${i + 1}. Lorem ipsum dolor sit amet.`,
			time: `${10 + i}:${String(i % 60).padStart(2, "0")}`,
		}));

		return (
			<ScrollArea className="h-[400px] w-[350px] rounded-md border">
				<div className="space-y-3 p-4">
					{messages.map((msg) => (
						<div
							key={msg.id}
							className={`flex ${msg.user === "Alice" ? "justify-start" : "justify-end"}`}
						>
							<div
								className={`max-w-[70%] rounded-lg p-3 ${
									msg.user === "Alice"
										? "bg-muted"
										: "bg-primary text-primary-foreground"
								}`}
							>
								<div className="mb-1 text-xs font-semibold">{msg.user}</div>
								<div className="text-sm">{msg.message}</div>
								<div className="text-muted-foreground mt-1 text-right text-xs opacity-70">
									{msg.time}
								</div>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>
		);
	},
};

/**
 * Nested scroll areas.
 * Shows how scroll areas can be nested within each other.
 */
export const Nested: Story = {
	args: {},
	render: () => (
		<ScrollArea className="h-[300px] w-[400px] rounded-md border">
			<div className="p-4 space-y-4">
				<div>
					<h3 className="mb-2 text-sm font-semibold">Section 1</h3>
					<ScrollArea className="h-32 w-full rounded-md border">
						<div className="p-2 space-y-1">
							{Array.from({ length: 10 }).map((_, i) => (
								<div key={`nested1-${i}`} className="text-sm">
									Nested item {i + 1}
								</div>
							))}
						</div>
					</ScrollArea>
				</div>

				<div>
					<h3 className="mb-2 text-sm font-semibold">Section 2</h3>
					<ScrollArea className="h-32 w-full rounded-md border">
						<div className="p-2 space-y-1">
							{Array.from({ length: 10 }).map((_, i) => (
								<div key={`nested2-${i}`} className="text-sm">
									More nested items {i + 1}
								</div>
							))}
						</div>
					</ScrollArea>
				</div>

				{Array.from({ length: 5 }).map((_, i) => (
					<div key={`outer-${i}`} className="text-sm">
						Outer content {i + 1}
					</div>
				))}
			</div>
		</ScrollArea>
	),
};
