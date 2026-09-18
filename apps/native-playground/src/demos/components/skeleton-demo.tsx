import { Skeleton, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const VARIANTS = ["rect", "circle"] as const;

export function SkeletonDemo() {
	const [fetching, setFetching] = useState(true);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-skeleton">
			<DemoBlock label="Variants">
				<View style={demoStyles.componentRow}>
					{VARIANTS.map((variant) =>
						variant === "circle" ? (
							<Skeleton
								key={variant}
								variant="circle"
								style={{ width: 48, aspectRatio: 1 }}
								accessibilityLabel={`${variant} skeleton`}
							/>
						) : (
							<Skeleton
								key={variant}
								variant="rect"
								style={{ width: 96, height: 12 }}
								accessibilityLabel={`${variant} skeleton`}
							/>
						),
					)}
				</View>
			</DemoBlock>
			<DemoBlock label="Width Ladder">
				<View style={demoStyles.componentRow}>
					<Skeleton style={{ width: 96, height: 12 }} />
					<Skeleton style={{ width: 64, height: 12 }} />
					<Skeleton style={{ width: 120, height: 12 }} />
				</View>
			</DemoBlock>
			<DemoBlock label="Static">
				<Skeleton animated={false} style={{ width: 120, height: 12 }} />
				<KText size="sm">Static block without the pulse loop</KText>
			</DemoBlock>
			<DemoBlock label="Announced">
				<Skeleton
					style={{ width: 160, height: 12 }}
					accessibilityLabel="Loading profile"
				/>
				<KText size="sm">Screen readers announce the loading label</KText>
			</DemoBlock>
			<DemoBlock label="Card Composition">
				<View style={{ flexDirection: "row", gap: 12 }}>
					<Skeleton variant="circle" style={{ width: 40, aspectRatio: 1 }} />
					<View style={{ gap: 8, flex: 1 }}>
						<Skeleton style={{ width: 120, height: 12 }} />
						<Skeleton style={{ width: 200, height: 12 }} />
						<Skeleton style={{ width: 160, height: 12 }} />
					</View>
				</View>
			</DemoBlock>
			<DemoBlock label="Simulate Fetch">
				<View style={demoStyles.componentRow}>
					{fetching ? (
						<View style={{ gap: 8, flex: 1 }}>
							<Skeleton style={{ width: 200, height: 12 }} />
							<Skeleton style={{ width: 160, height: 12 }} />
						</View>
					) : (
						<KText size="sm">Content loaded</KText>
					)}
				</View>
				<View style={demoStyles.componentRow}>
					<KText>{fetching ? "Reset" : "Simulate Fetch"}</KText>
				</View>
			</DemoBlock>
		</View>
	);
}
