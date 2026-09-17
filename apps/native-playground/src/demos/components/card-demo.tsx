import {
	Button,
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
	Text as KText,
} from "@kala-ui/react-native";
import { useState } from "react";
import { ScrollView } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

function CardVariantsBlock() {
	return (
		<DemoBlock label="Variants">
			<Card>
				<KText size="sm">Flat — hairline border</KText>
			</Card>
			<Card variant="elevated">
				<KText size="sm">Elevated — themed shadow</KText>
			</Card>
			<Card variant="outlined">
				<KText size="sm">Outlined — strong border</KText>
			</Card>
		</DemoBlock>
	);
}

function CompoundBlock() {
	return (
		<DemoBlock label="Compound Anatomy">
			<Card padding="none" variant="elevated">
				<CardImage
					flush
					source={{ uri: "https://picsum.photos/seed/kala-cabin/640/360" }}
					alt="A cabin above the lake"
				/>
				<CardHeader>
					<CardTitle>Lakeside Cabin</CardTitle>
					<CardSubtitle>From $142 / night</CardSubtitle>
					<CardDescription>
						Two bedrooms, a wood stove, and a dock that catches the morning
						light.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<KText size="sm" color="muted">
						Content sits flush under the header and keeps its own padding.
					</KText>
				</CardContent>
				<CardFooter>
					<Button size="sm">Book</Button>
					<CardAction>
						<Button size="sm" variant="ghost">
							Save
						</Button>
					</CardAction>
				</CardFooter>
			</Card>
		</DemoBlock>
	);
}

function MarkerBlock() {
	return (
		<DemoBlock label="Markers">
			<Card variant="outlined">
				<CardMarker color="primary" position="top-right">
					New
				</CardMarker>
				<CardHeader>
					<CardTitle>Releases</CardTitle>
					<CardDescription>Positioned corner chips</CardDescription>
				</CardHeader>
			</Card>
			<Card padding="none">
				<CardImage
					source={{ uri: "https://picsum.photos/seed/kala-trail/640/360" }}
					alt="A trail at dusk"
				/>
				<CardImageOverlay>
					<CardMarker variant="icon" color="destructive">
						!
					</CardMarker>
					<CardTitle style={{ color: "#ffffff" }}>Trail Closed</CardTitle>
					<CardDescription style={{ color: "#ffffffcc" }}>
						Overlay pins content to the media edge.
					</CardDescription>
				</CardImageOverlay>
			</Card>
		</DemoBlock>
	);
}

function PressableBlock() {
	const [taps, setTaps] = useState(0);
	return (
		<DemoBlock label="Pressable">
			<Card
				variant="elevated"
				onPress={() => setTaps((n) => n + 1)}
				accessibilityLabel="Open the notifications card"
			>
				<CardHeader>
					<CardTitle>Tap This Card</CardTitle>
					<CardSubtitle>Opened {taps} times</CardSubtitle>
				</CardHeader>
				<CardDescription>
					The whole surface is the target — press feedback stays inside the
					radius.
				</CardDescription>
			</Card>
		</DemoBlock>
	);
}

function LoadingBlock() {
	const [loading, setLoading] = useState(true);
	return (
		<DemoBlock label="Loading">
			<Card isLoading>
				<CardHeader>
					<CardTitle>Daily Digest</CardTitle>
					<CardDescription>Summary of activity</CardDescription>
				</CardHeader>
			</Card>
			{!loading && (
				<Card>
					<CardTitle>Daily Digest</CardTitle>
					<CardDescription>
						11 mentions, 3 follows, and one spike from Product Hunt.
					</CardDescription>
				</Card>
			)}
			<Button size="sm" variant="outline" onPress={() => setLoading((v) => !v)}>
				{loading ? "Show Content" : "Show Skeleton Only"}
			</Button>
		</DemoBlock>
	);
}

export function CardDemo() {
	return (
		<ScrollView
			testID="k-demo-card"
			contentContainerStyle={demoStyles.routeContent}
		>
			<CardVariantsBlock />
			<CompoundBlock />
			<PressableBlock />
			<MarkerBlock />
			<LoadingBlock />
		</ScrollView>
	);
}
