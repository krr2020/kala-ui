import {
	Banner,
	Button,
	CopyButton,
	ErrorBoundary,
	LoadingOverlay,
	PasswordStrengthIndicator,
	Toast,
} from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "./demo-block";
import { demoStyles } from "./stylesheet";

function ThrowOnce(): never {
	throw new Error("demo crash");
}

export function FeedbackDemo() {
	const [toastOpen, setToastOpen] = useState(false);
	const [bannerOn, setBannerOn] = useState(true);
	const [loading, setLoading] = useState(false);
	const [crashKey, setCrashKey] = useState(0);
	return (
		<>
			<DemoBlock label="Toast">
				<Button
					variant="subtle"
					size="sm"
					onPress={() => setToastOpen(true)}
					accessibilityLabel="Show Toast"
				>
					Show Toast
				</Button>
			</DemoBlock>
			<Toast open={toastOpen} onOpenChange={setToastOpen} duration={2500}>
				<Toast.Title>Saved</Toast.Title>
				<Toast.Description>Changes are live</Toast.Description>
			</Toast>
			<DemoBlock label="Banner">
				<View style={demoStyles.componentRow} testID="k-demo-banner">
					{bannerOn ? (
						<Banner position="static" onClose={() => setBannerOn(false)}>
							Sync pauses at midnight
						</Banner>
					) : (
						<Button size="sm" onPress={() => setBannerOn(true)}>
							Show Banner
						</Button>
					)}
				</View>
			</DemoBlock>
			<DemoBlock label="Loading Overlay">
				<View style={demoStyles.componentRow} testID="k-demo-loading-overlay">
					<Button size="sm" onPress={() => setLoading(true)}>
						Simulate Fetch
					</Button>
					<LoadingOverlay visible={loading}>
						<Text onPress={() => setLoading(false)}>Cancel</Text>
					</LoadingOverlay>
				</View>
			</DemoBlock>
			<DemoBlock label="Password Strength">
				<View style={demoStyles.componentRow} testID="k-demo-password-strength">
					<PasswordStrengthIndicator password="Aaaaaaaaaaaa1!" />
				</View>
			</DemoBlock>
			<DemoBlock label="Copy Button">
				<View style={demoStyles.componentRow} testID="k-demo-copy-button">
					<CopyButton value="kala-ui" writeClipboard={async () => undefined} />
				</View>
			</DemoBlock>
			<DemoBlock label="Error Boundary">
				<View style={demoStyles.componentRow} testID="k-demo-error-boundary">
					<ErrorBoundary resetKeys={[crashKey]}>
						{crashKey % 2 === 1 ? <ThrowOnce /> : <Text>Boundary healthy</Text>}
					</ErrorBoundary>
					<Button size="sm" onPress={() => setCrashKey((k) => k + 1)}>
						Toggle Crash
					</Button>
				</View>
			</DemoBlock>
		</>
	);
}
