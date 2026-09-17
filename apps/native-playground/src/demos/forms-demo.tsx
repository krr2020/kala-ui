import {
	Button,
	Checkbox,
	Field,
	RadioGroup,
	Select,
	TextInput,
} from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "./demo-block";
import { demoStyles } from "./stylesheet";

const PLANS = [
	{ value: "solo", label: "Solo" },
	{ value: "team", label: "Team" },
	{ value: "scale", label: "Scale" },
];

// Group overview: the full field → control → error loop in one place,
// the way the components compose in a real checkout form.
export function FormsDemo() {
	const [email, setEmail] = useState("");
	const [plan, setPlan] = useState<string | undefined>("team");
	const [tier, setTier] = useState("team");
	const [terms, setTerms] = useState(false);
	const invalid = email.length > 0 && !email.includes("@");
	return (
		<View testID="k-demo-forms" style={demoStyles.routeContent}>
			<DemoBlock label="Account">
				<Field
					label="Email"
					description="we never share it"
					error={invalid ? "enter a valid email" : undefined}
					required
				>
					<TextInput
						value={email}
						onChangeText={setEmail}
						placeholder="you@studio.com"
						keyboardType="email-address"
						autoCapitalize="none"
						hasError={invalid}
					/>
				</Field>
				<Field label="Plan">
					<Select
						value={plan}
						onValueChange={setPlan}
						placeholder="pick a plan"
						options={PLANS}
					/>
				</Field>
			</DemoBlock>
			<DemoBlock label="Billing">
				<RadioGroup value={tier} onValueChange={setTier}>
					<RadioGroup.Item value="solo" label="Solo" description="1 seat" />
					<RadioGroup.Item value="team" label="Team" description="10 seats" />
					<RadioGroup.Item
						value="scale"
						label="Scale"
						description="unlimited"
					/>
				</RadioGroup>
			</DemoBlock>
			<DemoBlock label="Confirm">
				<Checkbox
					label="Agree to the terms"
					value={terms}
					onValueChange={setTerms}
				/>
				<Button disabled={!terms || email.length === 0 || invalid}>
					Create Account
				</Button>
				<Text style={demoStyles.current}>
					Plan: {plan ?? "none"} · Tier: {tier} · Terms: {terms ? "yes" : "no"}
				</Text>
			</DemoBlock>
		</View>
	);
}
