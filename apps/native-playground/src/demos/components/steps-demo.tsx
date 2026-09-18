import { Button, Text as KText } from "@kala-ui/react-native";
import { Steps } from "@kala-ui/react-native-app";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const CHECKOUT = [
	{ title: "Account", description: "Email + password" },
	{ title: "Profile", description: "Name + avatar" },
	{ title: "Confirm", description: "Review and submit" },
];

export function StepsDemo() {
	const [step, setStep] = useState(2);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-steps">
			<DemoBlock label="Pressable Horizontal">
				<View style={demoStyles.componentRow}>
					<Steps items={CHECKOUT} value={step} onStepChange={setStep} />
				</View>
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setStep((s) => (s % CHECKOUT.length) + 1)}
					>
						Advance Step
					</Button>
					<KText size="sm" color="muted">
						step {step} of {CHECKOUT.length}
					</KText>
				</View>
			</DemoBlock>
			<DemoBlock label="Vertical">
				<Steps items={CHECKOUT} defaultValue={3} orientation="vertical" />
			</DemoBlock>
			<DemoBlock label="No Connector Lines">
				<Steps items={CHECKOUT} defaultValue={1} showLine={false} />
			</DemoBlock>
		</View>
	);
}
