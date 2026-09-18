import { Button, LoadingOverlay } from "@kala-ui/react-native";
import {
	CopyButton,
	PasswordStrengthIndicator,
} from "@kala-ui/react-native-app";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "./demo-block";
import { demoStyles } from "./stylesheet";

// Group overview: one composed status story over the feedback family —
// per-component screens live in ./components.
export function FeedbackDemo() {
	const [loading, setLoading] = useState(false);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-feedback">
			<DemoBlock label="Order Status">
				<View style={[demoStyles.componentRow, { minHeight: 96 }]}>
					<Button size="sm" onPress={() => setLoading(true)}>
						Simulate Fetch
					</Button>
					<LoadingOverlay visible={loading}>
						<Text onPress={() => setLoading(false)}>Cancel</Text>
					</LoadingOverlay>
				</View>
			</DemoBlock>
			<DemoBlock label="Clipboard">
				<CopyButton value="kala-ui" writeClipboard={async () => undefined} />
			</DemoBlock>
			<DemoBlock label="Password">
				<PasswordStrengthIndicator password="Correct Horse Battery 9!" />
			</DemoBlock>
		</View>
	);
}
