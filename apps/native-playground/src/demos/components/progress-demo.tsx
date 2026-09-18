import { Button, Progress, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const COLORS = [
	"primary",
	"secondary",
	"destructive",
	"success",
	"warning",
	"info",
] as const;

export function ProgressDemo() {
	const [upload, setUpload] = useState(0);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-progress">
			<DemoBlock label="Basic">
				<Progress value={40} accessibilityLabel="basic progress" />
			</DemoBlock>
			<DemoBlock label="Colors">
				{COLORS.map((color) => (
					<Progress
						key={color}
						value={55}
						color={color}
						accessibilityLabel={`${color} progress`}
					/>
				))}
			</DemoBlock>
			<DemoBlock label="Sizes">
				<Progress size="sm" value={40} accessibilityLabel="small progress" />
				<Progress size="md" value={60} accessibilityLabel="medium progress" />
				<Progress
					size="lg"
					value={80}
					showValue
					accessibilityLabel="large progress"
				/>
			</DemoBlock>
			<DemoBlock label="Label And Value">
				<Progress value={50} label="Uploading" />
				<Progress value={70} color="success" showValue />
			</DemoBlock>
			<DemoBlock label="Custom Range">
				<Progress
					value={50}
					min={10}
					max={90}
					showValue
					accessibilityLabel="custom range progress"
				/>
				<KText size="sm">50 of 10 to 90 reads 50%</KText>
			</DemoBlock>
			<DemoBlock label="Boundaries">
				<Progress value={0} accessibilityLabel="empty progress" />
				<Progress value={100} accessibilityLabel="full progress" />
				<Progress
					value={120}
					showValue
					accessibilityLabel="over-clamped progress"
				/>
				<Progress
					value={-20}
					showValue
					accessibilityLabel="under-clamped progress"
				/>
				<KText size="sm">120 clamps to 100% and -20 clamps to 0%</KText>
			</DemoBlock>
			<DemoBlock label="Simulate Upload">
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						onPress={() => setUpload((u) => Math.min(100, u + 20))}
						accessibilityLabel="Advance upload"
					>
						Advance
					</Button>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setUpload(0)}
						accessibilityLabel="Reset upload"
					>
						Reset
					</Button>
				</View>
				<Progress value={upload} showValue accessibilityLabel="upload" />
				<KText size="sm">Value: {upload}%</KText>
			</DemoBlock>
		</View>
	);
}
