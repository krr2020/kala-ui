import {
	Alert,
	Banner,
	Button,
	Field,
	Select,
	Textarea,
	Toast,
} from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { demoStyles } from "./stylesheet";

export function FeedbackDemo() {
	const [toastOpen, setToastOpen] = useState(false);
	const [bannerOn, setBannerOn] = useState(true);
	const [fruit, setFruit] = useState<string | undefined>(undefined);
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
		</>
	);
}
