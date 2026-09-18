import { TextInput } from "@kala-ui/react-native";
import { PasswordStrengthIndicator } from "@kala-ui/react-native-app";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function PasswordStrengthDemo() {
	const [password, setPassword] = useState("Correct Horse Battery 9!");
	return (
		<View style={demoStyles.routeContent} testID="k-demo-password-strength">
			<DemoBlock label="Live Scoring">
				<TextInput
					value={password}
					onChangeText={setPassword}
					accessibilityLabel="account password"
					placeholder="Type a password"
				/>
				<PasswordStrengthIndicator password={password} />
			</DemoBlock>
			<DemoBlock label="Strength Ladder">
				<PasswordStrengthIndicator password="a" />
				<PasswordStrengthIndicator password="alpha" />
				<PasswordStrengthIndicator password="Alpha1!" />
				<PasswordStrengthIndicator password="Correct Horse Battery 9!" />
			</DemoBlock>
		</View>
	);
}
