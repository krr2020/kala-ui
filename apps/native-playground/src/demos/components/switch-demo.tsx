import { Field, Switch } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function SwitchDemo() {
	const [sync, setSync] = useState(false);
	const [battery, setBattery] = useState(true);
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
			<DemoBlock label="Labels">
				<Switch label="Background sync" value={sync} onValueChange={setSync} />
				<Switch
					label="Battery saver"
					value={battery}
					onValueChange={setBattery}
				/>
				<Switch
					label="Enable automatic seat reconciliation across every workspace"
					onValueChange={() => undefined}
				/>
				<Switch label="Locked label" disabled onValueChange={() => undefined} />
			</DemoBlock>
			<DemoBlock label="Long Field Copy">
				<Field
					label="Enable automatic seat reconciliation across every workspace"
					description="Prorated adjustments for mid-cycle additions; reconciliations run twice a day"
				>
					<Switch
						accessibilityLabel="seat reconciliation"
						value={sync}
						onValueChange={setSync}
					/>
				</Field>
			</DemoBlock>
		</View>
	);
}
