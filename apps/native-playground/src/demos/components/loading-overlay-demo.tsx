import { Button, Text as KText } from "@kala-ui/react-native";
import { LoadingOverlay } from "@kala-ui/react-native-app";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function LoadingOverlayDemo() {
	const [busy, setBusy] = useState(false);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-loading-overlay">
			<DemoBlock label="Default Loader">
				<View style={[demoStyles.componentRow, { minHeight: 96 }]}>
					<Button size="sm" onPress={() => setBusy(true)}>
						Simulate Fetch
					</Button>
					<KText size="sm" color="muted">
						tap once — the scrim swallows touches until cancel
					</KText>
					<LoadingOverlay visible={busy} accessibilityLabel="Fetching orders">
						<Text onPress={() => setBusy(false)}>Cancel</Text>
					</LoadingOverlay>
				</View>
			</DemoBlock>
			<DemoBlock label="Loader Props">
				<View style={[demoStyles.componentRow, { minHeight: 96 }]}>
					<LoadingOverlay
						visible
						loaderProps={{ label: "Syncing", size: "sm" }}
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="Custom Content">
				<View style={[demoStyles.componentRow, { minHeight: 96 }]}>
					<LoadingOverlay visible accessibilityLabel="Archiving project">
						<Text onPress={() => undefined}>Archiving…</Text>
					</LoadingOverlay>
				</View>
			</DemoBlock>
		</View>
	);
}
