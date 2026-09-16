import {
	Alert,
	Banner,
	Button,
	Combobox,
	CopyButton,
	ErrorBoundary,
	Field,
	InputOtp,
	InputOtpSeparator,
	InputOtpSlot,
	LoadingOverlay,
	MultiSelect,
	NumberInput,
	PasswordStrengthIndicator,
	Select,
	TagInput,
	Textarea,
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
	const [fruit, setFruit] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [crashKey, setCrashKey] = useState(0);
	const [code, setCode] = useState("");
	const [recipients, setRecipients] = useState<string[]>(["ada"]);
	const [toppings, setToppings] = useState<string[]>(["sprinkles"]);
	const [city, setCity] = useState<string | undefined>(undefined);
	return (
		<>
			<DemoBlock label="alerts">
				<Alert color="success" dismissable onDismiss={() => setToastOpen(true)}>
					<Alert.Title>deployed</Alert.Title>
					<Alert.Description>all checks passed</Alert.Description>
				</Alert>
				<Alert variant="outline" color="warning">
					storage almost full
				</Alert>
			</DemoBlock>
			<DemoBlock label="toast">
				<Button
					variant="subtle"
					size="sm"
					onPress={() => setToastOpen(true)}
					accessibilityLabel="show toast"
				>
					show toast
				</Button>
			</DemoBlock>
			<Toast open={toastOpen} onOpenChange={setToastOpen} duration={2500}>
				<Toast.Title>saved</Toast.Title>
				<Toast.Description>changes are live</Toast.Description>
			</Toast>
			<DemoBlock label="banner">
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
			</DemoBlock>
			<DemoBlock label="textarea">
				<View style={demoStyles.componentRow} testID="k-demo-textarea">
					<Textarea placeholder="order notes" rows={3} />
				</View>
			</DemoBlock>
			<DemoBlock label="select">
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
			</DemoBlock>
			<DemoBlock label="loading overlay">
				<View style={demoStyles.componentRow} testID="k-demo-loading-overlay">
					<Button size="sm" onPress={() => setLoading(true)}>
						simulate fetch
					</Button>
					<LoadingOverlay visible={loading}>
						<Text onPress={() => setLoading(false)}>cancel</Text>
					</LoadingOverlay>
				</View>
			</DemoBlock>
			<DemoBlock label="number input">
				<View style={demoStyles.componentRow} testID="k-demo-number-input">
					<NumberInput
						defaultValue={1}
						min={0}
						max={10}
						accessibilityLabel="quantity"
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="input otp">
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
				</View>
			</DemoBlock>
			<DemoBlock label="password strength">
				<View style={demoStyles.componentRow} testID="k-demo-password-strength">
					<PasswordStrengthIndicator password="Aaaaaaaaaaaa1!" />
				</View>
			</DemoBlock>
			<DemoBlock label="tag input">
				<View style={demoStyles.componentRow} testID="k-demo-tag-input">
					<TagInput
						value={recipients}
						onValueChange={setRecipients}
						placeholder="add recipients"
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="multi select">
				<View style={demoStyles.componentRow} testID="k-demo-multi-select">
					<MultiSelect
						options={[
							{ value: "sprinkles", label: "Sprinkles" },
							{ value: "fudge", label: "Fudge", group: "Sauces" },
							{ value: "caramel", label: "Caramel", group: "Sauces" },
						]}
						grouped
						value={toppings}
						onValueChange={setToppings}
						placeholder="pick toppings"
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="combobox">
				<View style={demoStyles.componentRow} testID="k-demo-combobox">
					<Combobox
						options={[
							{ value: "lisbon", label: "Lisbon" },
							{ value: "tokyo", label: "Tokyo" },
							{ value: "perth", label: "Perth" },
						]}
						value={city}
						onValueChange={setCity}
						placeholder="pick a city"
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="copy button">
				<View style={demoStyles.componentRow} testID="k-demo-copy-button">
					<CopyButton value="kala-ui" writeClipboard={async () => undefined} />
				</View>
			</DemoBlock>
			<DemoBlock label="error boundary">
				<View style={demoStyles.componentRow} testID="k-demo-error-boundary">
					<ErrorBoundary resetKeys={[crashKey]}>
						{crashKey % 2 === 1 ? <ThrowOnce /> : <Text>boundary healthy</Text>}
					</ErrorBoundary>
					<Button size="sm" onPress={() => setCrashKey((k) => k + 1)}>
						toggle crash
					</Button>
				</View>
			</DemoBlock>
		</>
	);
}
