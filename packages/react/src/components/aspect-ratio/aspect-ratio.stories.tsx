import type { Meta, StoryObj } from "@storybook/react";
import { AspectRatio } from "./aspect-ratio";

const meta = {
	title: "Data Display/AspectRatio",
	component: AspectRatio,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

// Different Ratios
export const Ratios: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-full max-w-2xl">
			<AspectRatio ratio={16 / 9}>
				<img
					src="https://picsum.photos/600/400?random=1"
					alt="16:9 - Landscape"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={4 / 3}>
				<img
					src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=450&fit=crop"
					alt="4:3 - Standard"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={1 / 1}>
				<img
					src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop"
					alt="1:1 - Square"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={9 / 16}>
				<img
					src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop"
					alt="9:16 - Portrait"
					className="size-full object-cover"
				/>
			</AspectRatio>
		</div>
	),
};

// Rounded Variants
export const Rounded: Story = {
	render: () => (
		<div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
			<AspectRatio ratio={16 / 9} rounded="none">
				<img
					src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
					alt="None"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={16 / 9} rounded="sm">
				<img
					src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
					alt="Small"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={16 / 9} rounded="md">
				<img
					src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
					alt="Medium"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={16 / 9} rounded="lg">
				<img
					src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
					alt="Large"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={16 / 9} rounded="xl">
				<img
					src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
					alt="Extra Large"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={16 / 9} rounded="full">
				<img
					src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
					alt="Full"
					className="size-full object-cover"
				/>
			</AspectRatio>
		</div>
	),
};

// Bordered Variant
export const Bordered: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-full max-w-2xl">
			<AspectRatio ratio={16 / 9} bordered>
				<img
					src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=600&h=400&fit=crop"
					alt="With Border"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={4 / 3} bordered rounded="lg">
				<img
					src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=450&fit=crop"
					alt="With Border and Rounded"
					className="size-full object-cover"
				/>
			</AspectRatio>
		</div>
	),
};

// Content Types
export const ContentTypes: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-full max-w-2xl">
			{/* Image Content */}
			<AspectRatio ratio={16 / 9} rounded="lg">
				<img
					src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=600&h=400&fit=crop"
					alt="Nature landscape with mountains"
					className="size-full object-cover"
				/>
			</AspectRatio>

			{/* Video Content */}
			<AspectRatio ratio={16 / 9} rounded="lg" className="bg-black">
				<video
					className="size-full"
					autoPlay
					loop
					muted
					playsInline
					poster="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=600&h=400&fit=crop"
				>
					<source
						src="https://www.w3schools.com/html/mov_bbb.mp4"
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>
			</AspectRatio>

			{/* Card Content */}
			<AspectRatio ratio={16 / 9} rounded="lg" className="bg-muted">
				<div className="flex h-full flex-col items-center justify-center p-6">
					<h3 className="text-lg font-semibold">Card Content</h3>
					<p className="text-sm text-muted-foreground">
						Aspect ratio wrapper can contain any content type
					</p>
				</div>
			</AspectRatio>

			{/* IFrame Content */}
			<AspectRatio ratio={16 / 9} rounded="lg" className="bg-background">
				<iframe
					className="size-full"
					src="https://www.youtube.com/embed/dQw4w9WgXcQ"
					title="YouTube video"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
			</AspectRatio>
		</div>
	),
};

// Image Grid
export const ImageGrid: Story = {
	render: () => (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
			<AspectRatio ratio={16 / 9} rounded="lg" bordered>
				<img
					src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=600&h=400&fit=crop"
					alt="Misty mountains landscape"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={16 / 9} rounded="lg" bordered>
				<img
					src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop"
					alt="Forest path with autumn leaves"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={16 / 9} rounded="lg" bordered>
				<img
					src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop"
					alt="Mountain peak at sunrise"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={16 / 9} rounded="lg" bordered>
				<img
					src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
					alt="Snowy mountain range"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={16 / 9} rounded="lg" bordered>
				<img
					src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=400&fit=crop"
					alt="Tropical rainforest canopy"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<AspectRatio ratio={16 / 9} rounded="lg" bordered>
				<img
					src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop"
					alt="Desert sand dunes"
					className="size-full object-cover"
				/>
			</AspectRatio>
		</div>
	),
};

// Social Media Aspect Ratios
export const SocialMedia: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-full max-w-2xl min-w-[400px]">
			<div className="flex items-center gap-4 min-h-0">
				<span className="text-sm font-semibold w-20 shrink-0">YouTube:</span>
				<AspectRatio ratio={16 / 9} className="flex-1 min-h-0" rounded="md">
					<img
						src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=600&h=400&fit=crop"
						alt="16:9"
						className="size-full object-cover"
					/>
				</AspectRatio>
			</div>

			<div className="flex items-center gap-4 min-h-0">
				<span className="text-sm font-semibold w-20 shrink-0">Instagram:</span>
				<AspectRatio ratio={1 / 1} className="flex-1 min-h-0" rounded="md">
					<img
						src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop"
						alt="1:1"
						className="size-full object-cover"
					/>
				</AspectRatio>
			</div>

			<div className="flex items-center gap-4 min-h-0">
				<span className="text-sm font-semibold w-20 shrink-0">Story:</span>
				<AspectRatio ratio={9 / 16} className="flex-1 min-h-0" rounded="md">
					<img
						src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop"
						alt="9:16"
						className="size-full object-cover"
					/>
				</AspectRatio>
			</div>

			<div className="flex items-center gap-4 min-h-0">
				<span className="text-sm font-semibold w-20 shrink-0">Twitter:</span>
				<AspectRatio ratio={1.91 / 1} className="flex-1 min-h-0" rounded="md">
					<img
						src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=320&fit=crop"
						alt="1.91:1"
						className="size-full object-cover"
					/>
				</AspectRatio>
			</div>
		</div>
	),
};

// Product Gallery
export const ProductGallery: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-full max-w-2xl">
			<AspectRatio ratio={16 / 9} rounded="lg" bordered>
				<img
					src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=450&fit=crop"
					alt="Red Nike running shoe on white background"
					className="size-full object-cover"
				/>
			</AspectRatio>

			<div className="grid grid-cols-4 gap-4 min-w-0">
				<AspectRatio ratio={1 / 1} rounded="md" bordered>
					<img
						src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop"
						alt="Thumbnail 1"
						className="size-full object-cover"
					/>
				</AspectRatio>

				<AspectRatio ratio={1 / 1} rounded="md" bordered>
					<img
						src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop"
						alt="Thumbnail 2"
						className="size-full object-cover"
					/>
				</AspectRatio>

				<AspectRatio ratio={1 / 1} rounded="md" bordered>
					<img
						src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop"
						alt="Thumbnail 3"
						className="size-full object-cover"
					/>
				</AspectRatio>

				<AspectRatio ratio={1 / 1} rounded="md" bordered>
					<img
						src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop"
						alt="Thumbnail 4"
						className="size-full object-cover"
					/>
				</AspectRatio>
			</div>
		</div>
	),
};

// With Custom Content
export const CustomContent: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-full max-w-2xl">
			<AspectRatio
				ratio={16 / 9}
				rounded="lg"
				className="bg-linear-to-br from-primary/20 to-primary/5"
			>
				<div className="flex h-full flex-col items-center justify-center p-6">
					<h3 className="text-2xl font-bold text-primary">Custom Content</h3>
					<p className="text-muted-foreground">
						Aspect ratio wrapper with custom background and content
					</p>
				</div>
			</AspectRatio>

			<AspectRatio ratio={4 / 3} rounded="lg" className="bg-muted">
				<div className="flex h-full items-center justify-center">
					<div className="text-center">
						<p className="text-lg font-semibold">Text Content</p>
						<p className="text-sm text-muted-foreground">
							Can contain any React component
						</p>
					</div>
				</div>
			</AspectRatio>
		</div>
	),
};

// Background Patterns
export const BackgroundPatterns: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-full max-w-2xl">
			<AspectRatio ratio={16 / 9} rounded="lg" className="bg-grid-pattern">
				<div className="flex h-full items-center justify-center">
					<span className="bg-background px-4 py-2 rounded font-semibold">
						Grid Pattern
					</span>
				</div>
			</AspectRatio>

			<AspectRatio
				ratio={16 / 9}
				rounded="lg"
				className="bg-linear-to-r from-primary via-secondary to-primary"
			>
				<div className="flex h-full items-center justify-center">
					<span className="bg-background/90 px-4 py-2 rounded font-semibold backdrop-blur-sm">
						Gradient Background
					</span>
				</div>
			</AspectRatio>

			<AspectRatio ratio={16 / 9} rounded="lg" className="bg-muted">
				<div className="flex h-full items-center justify-center">
					<span className="text-muted-foreground">Solid Background</span>
				</div>
			</AspectRatio>
		</div>
	),
};
