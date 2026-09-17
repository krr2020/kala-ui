import {
	Checkbox,
	Field,
	Label,
	Select,
	TextInput,
} from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function FieldDemo() {
	const [email, setEmail] = useState("");
	return (
		<View testID="k-demo-field" style={demoStyles.routeContent}>
			<DemoBlock label="Label + Description">
				<Field label="Email" description="we never share it" required>
					<TextInput
						value={email}
						onChangeText={setEmail}
						placeholder="you@studio.com"
					/>
				</Field>
			</DemoBlock>
			<DemoBlock label="Error Copy">
				<Field
					label="Workspace Slug"
					error={["lowercase only", "already taken"]}
				>
					<TextInput defaultValue="Kala UI" />
				</Field>
			</DemoBlock>
			<DemoBlock label="Error Live Region">
				<Field label="Invite Code" error="expired yesterday">
					<TextInput defaultValue="KALA-2024" />
				</Field>
			</DemoBlock>
			<DemoBlock label="Any Control">
				<Field label="Region" description="closest data center">
					<Select
						placeholder="pick a region"
						options={[
							{ value: "eu", label: "Europe" },
							{ value: "us", label: "United States" },
						]}
					/>
				</Field>
				<Field label="Newsletter">
					<Checkbox label="Weekly digest" />
				</Field>
			</DemoBlock>
			<DemoBlock label="Bare Label">
				<Label required>Card Number</Label>
				<Label>Holder Name</Label>
			</DemoBlock>
		</View>
	);
}
