import { Field, Switch } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function SwitchDemo() {
	const [sync, setSync] = useState(false);
	return (
		<View testID="k-demo-switch" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<Switch accessibilityLabel="sync" />
				<Switch
					accessibilityLabel="sync on"
					value
					onValueChange={() => undefined}
				/>
			</DemoBlock>
			<DemoBlock label="Controlled">
				<Field label="Background Sync" description="twice a day">
					<Switch
						accessibilityLabel="background sync"
						value={sync}
						onValueChange={setSync}
					/>
				</Field>
				<Text style={demoStyles.current}>Sync: {sync ? "on" : "off"}</Text>
			</DemoBlock>
			<DemoBlock label="States">
				<Switch accessibilityLabel="locked sync" disabled />
				<Switch
					accessibilityLabel="locked on"
					disabled
					value
					onValueChange={() => undefined}
				/>
			</DemoBlock>
		</View>
	);
}
