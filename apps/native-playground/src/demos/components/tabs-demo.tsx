import { Tabs, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function TabsDemo() {
	const [tab, setTab] = useState("one");
	return (
		<View style={demoStyles.routeContent} testID="k-demo-tabs">
			<DemoBlock label="Controlled">
				<Tabs
					items={[
						{ value: "one", label: "One" },
						{ value: "two", label: "Two" },
						{ value: "three", label: "Three" },
					]}
					value={tab}
					onValueChange={setTab}
				>
					<KText size="sm">
						{tab === "one"
							? "first tab panel"
							: tab === "two"
								? "second tab panel"
								: "third tab panel"}
					</KText>
				</Tabs>
			</DemoBlock>
			<DemoBlock label="Uncontrolled">
				<Tabs
					items={[
						{ value: "a", label: "Overview" },
						{ value: "b", label: "Activity" },
					]}
					defaultValue="a"
				>
					<KText size="sm" color="muted">
						defaultValue opens the first panel without local state
					</KText>
				</Tabs>
			</DemoBlock>
		</View>
	);
}
