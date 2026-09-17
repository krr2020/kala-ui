import { Field, TextInput } from "@kala-ui/react-native";
import { Mail } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function TextInputDemo() {
	const { theme } = useUnistyles();
	const [bio, setBio] = useState("");
	const invalid = bio.length > 0 && bio.length < 3;
	return (
		<View testID="k-demo-text-input" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<TextInput placeholder="you@studio.com" accessibilityLabel="email" />
				<TextInput placeholder="search projects" accessibilityLabel="search" />
			</DemoBlock>
			<DemoBlock label="In A Field">
				<Field label="Display Name" description="visible on your profile">
					<TextInput value={bio} onChangeText={setBio} hasError={invalid} />
				</Field>
			</DemoBlock>
			<DemoBlock label="Sections">
				<TextInput
					placeholder="email"
					accessibilityLabel="email with icon"
					leftSection={<Mail size={16} color={theme.mutedForeground} />}
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<TextInput
					placeholder="unknown account"
					accessibilityLabel="error input"
					hasError
				/>
				<TextInput
					placeholder="locked"
					accessibilityLabel="locked input"
					disabled
				/>
			</DemoBlock>
		</View>
	);
}
