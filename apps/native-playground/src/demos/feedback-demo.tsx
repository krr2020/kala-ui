import {
	Alert,
	Banner,
	Button,
	ErrorBoundary,
	Field,
	InputOtp,
	InputOtpSeparator,
	InputOtpSlot,
	LoadingOverlay,
	PasswordStrengthIndicator,
	Select,
	Textarea,
	Toast,
} from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { demoStyles } from "./stylesheet";

function ThrowOnce(): never {
	throw new Error("demo crash");
}

export function FeedbackDemo() {
	const [toastOpen, setToastOpen] = useState(false);
	const [bannerOn, setBannerOn] = useState(true);
	const [fruit, setFruit] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [crashKey, setCrashKey] = useState(0);
	const [code, setCode] = useState("");
	return (
		<>
			<Alert color="success" dismissable onDismiss={() => setToastOpen(true)}>
				<Alert.Title>deployed</Alert.Title>
				<Alert.Description>all checks passed</Alert.Description>
			</Alert>
			<Alert variant="outline" color="warning">
				storage almost full
			</Alert>
			<Button
				variant="subtle"
				size="sm"
				onPress={() => setToastOpen(true)}
				accessibilityLabel="show toast"
			>
				show toast
			</Button>
			<Toast open={toastOpen} onOpenChange={setToastOpen} duration={2500}>
				<Toast.Title>saved</Toast.Title>
				<Toast.Description>changes are live</Toast.Description>
			</Toast>
			<View style={demoStyles.componentRow} testID="k-demo-banner">
				{bannerOn ? (
					<Banner position="static" onClose={() => setBannerOn(false)}>
						sync pauses at midnight
					</Banner>
				) : (
					<Button size="sm" onPress={() => setBannerOn(true)}>
						show banner
					</Button>
				)}
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-textarea">
				<Textarea placeholder="order notes" rows={3} />
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-select">
				<Field label="Fruit" description="one per basket" required>
					<Select
						value={fruit}
						onValueChange={setFruit}
						placeholder="pick a fruit"
						options={[
							{ value: "apple", label: "Apple" },
							{ value: "banana", label: "Banana" },
							{ value: "cherry", label: "Cherry", disabled: true },
						]}
					/>
				</Field>
				<Text>chosen: {fruit ?? "none"}</Text>
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-loading-overlay">
				<Button size="sm" onPress={() => setLoading(true)}>
					simulate fetch
				</Button>
				<LoadingOverlay visible={loading}>
					<Text onPress={() => setLoading(false)}>cancel</Text>
				</LoadingOverlay>
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-input-otp">
				<InputOtp maxLength={6} value={code} onChange={setCode}>
					<InputOtpSlot index={0} />
					<InputOtpSlot index={1} />
					<InputOtpSlot index={2} />
					<InputOtpSeparator />
					<InputOtpSlot index={3} />
					<InputOtpSlot index={4} />
					<InputOtpSlot index={5} />
				</InputOtp>
				<PasswordStrengthIndicator password={code} />
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-password-strength">
				<PasswordStrengthIndicator password="Aaaaaaaaaaaa1!" />
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-error-boundary">
				<ErrorBoundary resetKeys={[crashKey]}>
					{crashKey % 2 === 1 ? <ThrowOnce /> : <Text>boundary healthy</Text>}
				</ErrorBoundary>
				<Button size="sm" onPress={() => setCrashKey((k) => k + 1)}>
					toggle crash
				</Button>
			</View>
		</>
	);
}
