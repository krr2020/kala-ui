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
				<TextInput placeholder="Search projects" accessibilityLabel="search" />
			</DemoBlock>
			<DemoBlock label="In a Field">
				<Field
					label="Display Name"
					description="Visible on your profile"
					error={invalid ? "Must be at least 3 characters" : undefined}
				>
					<TextInput
						placeholder="Ada Lovelace"
						value={bio}
						onChangeText={setBio}
						hasError={invalid}
					/>
				</Field>
			</DemoBlock>
			<DemoBlock label="Sections">
				<TextInput
					placeholder="Email"
					accessibilityLabel="email with icon"
					leftSection={<Mail size={16} color={theme.mutedForeground} />}
					rightSection=".com"
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<Field error="Unknown account">
					<TextInput
						placeholder="Unknown account"
						accessibilityLabel="error input"
						hasError
					/>
				</Field>
				<Field>
					<TextInput
						value="ada@studio.com"
						accessibilityLabel="valid input"
						hasSuccess
					/>
				</Field>
				<TextInput
					placeholder="Disabled"
					accessibilityLabel="disabled input"
					disabled
				/>
			</DemoBlock>
		</View>
	);
}
