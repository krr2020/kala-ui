import { Field, RadioGroup } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function RadioGroupDemo() {
	const [tier, setTier] = useState("team");
	return (
		<View testID="k-demo-radio-group" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<RadioGroup defaultValue="solo">
					<RadioGroup.Item value="solo" label="Solo" />
					<RadioGroup.Item value="team" label="Team" />
					<RadioGroup.Item value="scale" label="Scale" />
				</RadioGroup>
			</DemoBlock>
			<DemoBlock label="Inline">
				<RadioGroup defaultValue="team" orientation="horizontal">
					<RadioGroup.Item value="solo" label="Solo" />
					<RadioGroup.Item value="team" label="Team" />
					<RadioGroup.Item value="scale" label="Scale" />
				</RadioGroup>
			</DemoBlock>
			<DemoBlock label="With Descriptions">
				<Field label="Billing Tier" description="change any time">
					<RadioGroup value={tier} onValueChange={setTier}>
						<RadioGroup.Item value="solo" label="Solo" description="1 seat" />
						<RadioGroup.Item value="team" label="Team" description="10 seats" />
					</RadioGroup>
				</Field>
				<Text style={demoStyles.current}>Tier: {tier}</Text>
			</DemoBlock>
			<DemoBlock label="States">
				<RadioGroup value="a">
					<RadioGroup.Item value="a" label="Picked" />
					<RadioGroup.Item value="b" label="Unavailable" disabled />
				</RadioGroup>
			</DemoBlock>
			<DemoBlock label="Error">
				<RadioGroup value="valid">
					<RadioGroup.Item value="valid" label="Valid choice" />
					<RadioGroup.Item value="invalid" label="Invalid choice" hasError />
				</RadioGroup>
			</DemoBlock>
			<DemoBlock label="Group Disabled">
				<RadioGroup value="a" disabled>
					<RadioGroup.Item value="a" label="Locked in" />
					<RadioGroup.Item value="b" label="Locked out" />
				</RadioGroup>
			</DemoBlock>
			<DemoBlock label="Standalone">
				<RadioGroup defaultValue="only">
					<RadioGroup.Item value="only" accessibilityLabel="anonymous radio" />
				</RadioGroup>
			</DemoBlock>
		</View>
	);
}
