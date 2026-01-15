import type { Meta, StoryObj } from "@storybook/react";
import { Heart, MessageCircle, Share2, Star, Tag, Zap } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { SkeletonCardContent } from "../skeleton/skeleton-patterns";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardImage,
	CardImageOverlay,
	CardMarker,
	CardSubtitle,
	CardTitle,
} from "./index";

const meta = {
	title: "Data Display/Card",
	component: Card,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Example (Dashforge)
export const BasicExample: Story = {
	render: () => (
		<Card className="w-[350px]">
			<CardImage
				src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
				alt="Mountain landscape"
			/>
			<CardHeader>
				<CardTitle>Card title</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription>
					Some quick example text to build on the card title and make up the
					bulk of the card's content.
				</CardDescription>
			</CardContent>
			<CardFooter>
				<Button variant="primary">Go somewhere</Button>
			</CardFooter>
		</Card>
	),
};

// Body Only (Dashforge)
export const BodyOnly: Story = {
	render: () => (
		<Card className="w-[350px]">
			<CardContent className="py-6">
				This is some text within a card body.
			</CardContent>
		</Card>
	),
};

// Title, Text and Links (Dashforge)
export const TitleTextLinks: Story = {
	render: () => (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Card title</CardTitle>
				<CardSubtitle>Card subtitle</CardSubtitle>
			</CardHeader>
			<CardContent>
				<CardDescription>
					Some quick example text to build on the card title and make up the
					bulk of the card's content.
				</CardDescription>
				<div className="mt-4 flex gap-4">
					<a
						href="https://example.com"
						className="text-sm text-primary hover:underline"
					>
						Card link
					</a>
					<a
						href="https://example.com"
						className="text-sm text-primary hover:underline"
					>
						Another link
					</a>
				</div>
			</CardContent>
		</Card>
	),
};

export const WithHeaderFooter: Story = {
	render: () => (
		<Card className="w-[350px]">
			<div className="border-b border-separator bg-muted/50 px-6 py-3">
				<h6 className="text-sm font-semibold">Featured</h6>
			</div>
			<CardContent className="py-6">
				<CardDescription>
					With supporting text below as a natural lead-in to additional content.
				</CardDescription>
			</CardContent>
			<CardFooter className="gap-2">
				<Button variant="outline" size="sm">
					<Heart className="mr-2 size-4" />
					Like
				</Button>
				<Button variant="outline" size="sm">
					<MessageCircle className="mr-2 size-4" />
					Comment
				</Button>
				<Button variant="outline" size="sm">
					<Share2 className="mr-2 size-4" />
					Share
				</Button>
			</CardFooter>
		</Card>
	),
};

// Image Overlay (Dashforge)
export const ImageOverlay: Story = {
	render: () => (
		<Card className="relative w-[350px] overflow-hidden">
			<CardImage
				src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
				alt="Mountain landscape"
				className="h-[300px]"
			/>
			<CardImageOverlay className="bg-gradient-to-t from-black/70 to-transparent text-white">
				<CardTitle className="text-white">Card title</CardTitle>
				<CardDescription className="text-gray-200">
					This is a wider card with supporting text below as a natural lead-in
					to additional content. This content is a little bit longer.
				</CardDescription>
				<p className="mt-2 text-xs text-gray-300">Last updated 3 mins ago</p>
			</CardImageOverlay>
		</Card>
	),
};

// Background Colors (Dashforge)
export const BackgroundColors: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Card className="w-[350px] border-primary bg-primary text-primary-foreground">
				<div className="border-b border-white/10 bg-black/10 px-6 py-3 rounded-t-md">
					<h6 className="text-sm font-semibold">Primary</h6>
				</div>
				<CardContent className="py-6">
					<CardDescription className="text-primary-foreground/80">
						Some quick example text to build on the card title and make up the
						bulk of the card's content.
					</CardDescription>
				</CardContent>
			</Card>
			<Card className="w-[350px] border-secondary bg-secondary text-secondary-foreground">
				<div className="border-b border-black/5 bg-black/5 px-6 py-3 rounded-t-md">
					<h6 className="text-sm font-semibold">Secondary</h6>
				</div>
				<CardContent className="py-6">
					<CardDescription className="text-secondary-foreground/80">
						Some quick example text to build on the card title and make up the
						bulk of the card's content.
					</CardDescription>
				</CardContent>
			</Card>
			<Card className="w-[350px] border-success bg-success text-success-foreground">
				<div className="border-b border-white/10 bg-black/10 px-6 py-3 rounded-t-md">
					<h6 className="text-sm font-semibold">Success</h6>
				</div>
				<CardContent className="py-6">
					<CardDescription className="text-success-foreground/80">
						Some quick example text to build on the card title and make up the
						bulk of the card's content.
					</CardDescription>
				</CardContent>
			</Card>
			<Card className="w-[350px] border-destructive bg-destructive text-destructive-foreground">
				<div className="border-b border-white/10 bg-black/10 px-6 py-3 rounded-t-md">
					<h6 className="text-sm font-semibold">Danger</h6>
				</div>
				<CardContent className="py-6">
					<CardDescription className="text-destructive-foreground/80">
						Some quick example text to build on the card title and make up the
						bulk of the card's content.
					</CardDescription>
				</CardContent>
			</Card>
			<Card className="w-[350px] border-warning bg-warning text-warning-foreground">
				<div className="border-b border-white/10 bg-black/10 px-6 py-3 rounded-t-md">
					<h6 className="text-sm font-semibold">Warning</h6>
				</div>
				<CardContent className="py-6">
					<CardDescription className="text-warning-foreground/80">
						Some quick example text to build on the card title and make up the
						bulk of the card's content.
					</CardDescription>
				</CardContent>
			</Card>
			<Card className="w-[350px] border-info bg-info text-info-foreground">
				<div className="border-b border-white/10 bg-black/10 px-6 py-3 rounded-t-md">
					<h6 className="text-sm font-semibold">Info</h6>
				</div>
				<CardContent className="py-6">
					<CardDescription className="text-info-foreground/80">
						Some quick example text to build on the card title and make up the
						bulk of the card's content.
					</CardDescription>
				</CardContent>
			</Card>
		</div>
	),
};

export const LoginExample: Story = {
	render: () => (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
				<CardAction>
					<Button variant="link" className="px-0">
						Sign Up
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" placeholder="m@example.com" />
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							<a
								href="/forgot-password"
								className="ml-auto text-sm text-primary hover:underline"
							>
								Forgot your password?
							</a>
						</div>
						<Input id="password" type="password" />
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex-col gap-2 border-0 pt-0">
				<Button type="submit" className="w-full">
					Login
				</Button>
				<Button variant="outline" className="w-full">
					Login with Google
				</Button>
			</CardFooter>
		</Card>
	),
};

// Card Grid (Dashforge)
export const CardGrid: Story = {
	render: () => (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<Card>
				<CardImage
					src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
					alt="Mountain"
				/>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>
						This is a wider card with supporting text below as a natural lead-in
						to additional content. This content is a little bit longer.
					</CardDescription>
					<p className="mt-2 text-xs text-muted-foreground">
						Last updated 3 mins ago
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardImage
					src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop"
					alt="Nature"
				/>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>
						This card has supporting text below as a natural lead-in to
						additional content.
					</CardDescription>
					<p className="mt-2 text-xs text-muted-foreground">
						Last updated 3 mins ago
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardImage
					src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop"
					alt="Forest"
				/>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>
						This is a wider card with supporting text below as a natural lead-in
						to additional content. This card has even longer content than the
						first to show that equal height action.
					</CardDescription>
					<p className="mt-2 text-xs text-muted-foreground">
						Last updated 3 mins ago
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardImage
					src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=200&fit=crop"
					alt="Flower"
				/>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>
						This is a wider card with supporting text below as a natural lead-in
						to additional content.
					</CardDescription>
					<p className="mt-2 text-xs text-muted-foreground">
						Last updated 3 mins ago
					</p>
				</CardContent>
			</Card>
		</div>
	),
};

// Marker Examples - Basic
export const WithBasicMarker: Story = {
	render: () => (
		<Card className="relative w-[350px] overflow-hidden">
			<CardMarker position="top-left" color="danger">
				SALE
			</CardMarker>
			<CardImage
				src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop"
				alt="Product"
			/>
			<CardHeader>
				<CardTitle>Wireless Headphones</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription>
					Premium wireless headphones with noise cancellation and 30-hour
					battery life.
				</CardDescription>
				<div className="mt-4 flex items-center justify-between">
					<span className="text-2xl font-bold">$199</span>
					<span className="text-sm text-muted-foreground line-through">
						$299
					</span>
				</div>
			</CardContent>
		</Card>
	),
};

// Marker Examples - Multiple Positions
export const WithMultipleMarkers: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			<Card className="relative w-[300px] overflow-hidden">
				<CardMarker position="top-left" color="primary">
					NEW
				</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop"
					alt="Product"
				/>
				<CardHeader>
					<CardTitle>Top Left</CardTitle>
				</CardHeader>
			</Card>

			<Card className="relative w-[300px] overflow-hidden">
				<CardMarker position="top-right" color="success">
					50% OFF
				</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=200&fit=crop"
					alt="Product"
				/>
				<CardHeader>
					<CardTitle>Top Right</CardTitle>
				</CardHeader>
			</Card>

			<Card className="relative w-[300px] overflow-hidden">
				<CardMarker position="bottom-left" color="warning">
					LIMITED
				</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=200&fit=crop"
					alt="Product"
				/>
				<CardHeader>
					<CardTitle>Bottom Left</CardTitle>
				</CardHeader>
			</Card>

			<Card className="relative w-[300px] overflow-hidden">
				<CardMarker position="bottom-right" color="info">
					TRENDING
				</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=200&fit=crop"
					alt="Product"
				/>
				<CardHeader>
					<CardTitle>Bottom Right</CardTitle>
				</CardHeader>
			</Card>
		</div>
	),
};

// Marker Examples - Icon Variant
export const WithIconMarker: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			<Card className="relative w-[300px] overflow-hidden">
				<CardMarker position="top-left" variant="icon" color="warning">
					<Zap className="h-5 w-5" />
				</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop"
					alt="Product"
				/>
				<CardHeader>
					<CardTitle>Premium Feature</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>
						Unlock premium features with this product
					</CardDescription>
				</CardContent>
			</Card>

			<Card className="relative w-[300px] overflow-hidden">
				<CardMarker position="top-right" variant="icon" color="success">
					<Star className="h-5 w-5" />
				</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop"
					alt="Product"
				/>
				<CardHeader>
					<CardTitle>Best Seller</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>Our most popular product this month</CardDescription>
				</CardContent>
			</Card>

			<Card className="relative w-[300px] overflow-hidden">
				<CardMarker position="top-right" variant="icon" color="danger">
					<Tag className="h-5 w-5" />
				</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop"
					alt="Product"
				/>
				<CardHeader>
					<CardTitle>Special Offer</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>Limited time discount available</CardDescription>
				</CardContent>
			</Card>
		</div>
	),
};

// Marker Examples - Ribbon Variant
export const WithRibbonMarker: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			<Card className="relative w-[300px] overflow-hidden">
				<CardMarker position="top-left" variant="ribbon" color="danger">
					SALE
				</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop"
					alt="Product"
				/>
				<CardHeader>
					<CardTitle>Sneakers</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>
						Limited edition sneakers now on sale
					</CardDescription>
				</CardContent>
			</Card>

			<Card className="relative w-[300px] overflow-hidden">
				<CardMarker position="top-right" variant="ribbon" color="success">
					NEW
				</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400&h=200&fit=crop"
					alt="Product"
				/>
				<CardHeader>
					<CardTitle>Smart Watch</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>Just arrived in our store</CardDescription>
				</CardContent>
			</Card>

			<Card className="relative w-[300px] overflow-hidden">
				<CardMarker position="top-left" variant="ribbon" color="primary">
					FEATURED
				</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=200&fit=crop"
					alt="Product"
				/>
				<CardHeader>
					<CardTitle>Smart Device</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>Featured product of the week</CardDescription>
				</CardContent>
			</Card>
		</div>
	),
};

// Marker Examples - All Colors
export const MarkerColors: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			<Card className="relative w-[250px] overflow-hidden">
				<CardMarker color="default">Default</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=150&fit=crop"
					alt="Product"
					className="h-32"
				/>
				<CardHeader>
					<CardTitle className="text-sm">Default Gray</CardTitle>
				</CardHeader>
			</Card>

			<Card className="relative w-[250px] overflow-hidden">
				<CardMarker color="primary">Primary</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=150&fit=crop"
					alt="Product"
					className="h-32"
				/>
				<CardHeader>
					<CardTitle className="text-sm">Blue Primary</CardTitle>
				</CardHeader>
			</Card>

			<Card className="relative w-[250px] overflow-hidden">
				<CardMarker color="success">Success</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=150&fit=crop"
					alt="Product"
					className="h-32"
				/>
				<CardHeader>
					<CardTitle className="text-sm">Green Success</CardTitle>
				</CardHeader>
			</Card>

			<Card className="relative w-[250px] overflow-hidden">
				<CardMarker color="warning">Warning</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=150&fit=crop"
					alt="Product"
					className="h-32"
				/>
				<CardHeader>
					<CardTitle className="text-sm">Yellow Warning</CardTitle>
				</CardHeader>
			</Card>

			<Card className="relative w-[250px] overflow-hidden">
				<CardMarker color="danger">Danger</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=150&fit=crop"
					alt="Product"
					className="h-32"
				/>
				<CardHeader>
					<CardTitle className="text-sm">Red Danger</CardTitle>
				</CardHeader>
			</Card>

			<Card className="relative w-[250px] overflow-hidden">
				<CardMarker color="info">Info</CardMarker>
				<CardImage
					src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=150&fit=crop"
					alt="Product"
					className="h-32"
				/>
				<CardHeader>
					<CardTitle className="text-sm">Cyan Info</CardTitle>
				</CardHeader>
			</Card>
		</div>
	),
};

// E-commerce Product Card with Marker
export const EcommerceProduct: Story = {
	render: () => (
		<Card className="relative w-[350px] overflow-hidden">
			<CardMarker position="top-left" color="danger">
				30% OFF
			</CardMarker>
			<CardMarker position="top-right" variant="icon" color="success">
				<Star className="h-5 w-5" />
			</CardMarker>
			<CardImage
				src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop"
				alt="Sneakers"
				className="h-[300px]"
			/>
			<CardHeader>
				<CardTitle>Premium Running Shoes</CardTitle>
				<CardSubtitle>Nike Air Max 2024</CardSubtitle>
			</CardHeader>
			<CardContent>
				<CardDescription>
					Experience ultimate comfort and style with our latest running shoe
					design. Features advanced cushioning technology.
				</CardDescription>
				<div className="mt-4 flex items-center justify-between">
					<div>
						<span className="text-2xl font-bold text-success">$139.99</span>
						<span className="ml-2 text-sm text-muted-foreground line-through">
							$199.99
						</span>
					</div>
					<div className="flex items-center gap-1">
						<Star className="h-4 w-4 fill-warning text-warning" />
						<span className="text-sm font-medium">4.8 (234)</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="gap-2">
				<Button className="flex-1" variant="primary">
					Add to Cart
				</Button>
				<Button variant="outline">
					<Heart className="h-4 w-4" />
				</Button>
			</CardFooter>
		</Card>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full max-w-md">
			<Card>
				<CardContent className="pt-6">
					<SkeletonCardContent showHeader showFooter contentLines={3} />
				</CardContent>
			</Card>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for card content while data is loading.",
			},
		},
	},
};