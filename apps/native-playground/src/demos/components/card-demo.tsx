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
		<DemoBlock label="variants">
			<Card>
				<KText size="sm">flat — hairline border</KText>
			</Card>
			<Card variant="elevated">
				<KText size="sm">elevated — themed shadow</KText>
			</Card>
			<Card variant="outlined">
				<KText size="sm">outlined — strong border</KText>
			</Card>
		</DemoBlock>
	);
}

function CompoundBlock() {
	return (
		<DemoBlock label="compound anatomy">
			<Card padding="none" variant="elevated">
				<CardImage
					source={{ uri: "https://picsum.photos/seed/kala-cabin/640/360" }}
					alt="A cabin above the lake"
				/>
				<CardHeader>
					<CardTitle>lakeside cabin</CardTitle>
					<CardSubtitle>from $142 / night</CardSubtitle>
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
					<Button size="sm">book</Button>
					<CardAction>
						<Button size="sm" variant="ghost">
							save
						</Button>
					</CardAction>
				</CardFooter>
			</Card>
		</DemoBlock>
	);
}

function MarkerBlock() {
	return (
		<DemoBlock label="markers">
			<Card variant="outlined">
				<CardMarker color="primary" position="top-right">
					new
				</CardMarker>
				<CardHeader>
					<CardTitle>releases</CardTitle>
					<CardDescription>positioned corner chips</CardDescription>
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
					<CardTitle>trail closed</CardTitle>
					<CardDescription>
						Overlay pins content to the media edge.
					</CardDescription>
				</CardImageOverlay>
			</Card>
		</DemoBlock>
	);
}

function LoadingBlock() {
	const [loading, setLoading] = useState(true);
	return (
		<DemoBlock label="loading">
			<Card isLoading={loading}>
				<CardHeader>
					<CardTitle>daily digest</CardTitle>
					<CardDescription>summary of activity</CardDescription>
				</CardHeader>
			</Card>
			<Button size="sm" variant="outline" onPress={() => setLoading((v) => !v)}>
				{loading ? "show content" : "show skeleton"}
			</Button>
			{!loading && (
				<Card>
					<CardTitle>daily digest</CardTitle>
					<CardDescription>
						11 mentions, 3 follows, and one spike from Product Hunt.
					</CardDescription>
				</Card>
			)}
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
			<MarkerBlock />
			<LoadingBlock />
		</ScrollView>
	);
}
