import { Button, Spinner, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const SIZES = ["sm", "md", "lg", "xl"] as const;
const VARIANTS = ["default", "muted", "ghost"] as const;

export function SpinnerDemo() {
	const { theme } = useUnistyles();
	const [busy, setBusy] = useState(true);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-spinner">
			<DemoBlock label="Sizes">
				<View style={demoStyles.componentRow}>
					{SIZES.map((size) => (
						<Spinner
							key={size}
							size={size}
							accessibilityLabel={`${size} spinner`}
						/>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Variants">
				<View style={demoStyles.componentRow}>
					{VARIANTS.map((variant) => (
						<Spinner
							key={variant}
							variant={variant}
							accessibilityLabel={`${variant} spinner`}
						/>
					))}
					{/* white is on-primary — it needs the themed surface to read */}
					<View
						style={{
							backgroundColor: theme.primary,
							borderRadius: 8,
							padding: 8,
						}}
					>
						<Spinner variant="white" accessibilityLabel="on-primary spinner" />
					</View>
				</View>
			</DemoBlock>
			<DemoBlock label="Labels">
				<Spinner label="Uploading assets" />
				<KText size="sm">Screen readers announce the loading label</KText>
			</DemoBlock>
			<DemoBlock label="Simulate Loading">
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						variant={busy ? "outline" : "solid"}
						onPress={() => setBusy((b) => !b)}
						accessibilityLabel="Toggle loading"
					>
						{busy ? "Stop" : "Start"}
					</Button>
					{busy ? (
						<Spinner label="Fetching reports" />
					) : (
						<KText size="sm">Load complete</KText>
					)}
				</View>
			</DemoBlock>
		</View>
	);
}
