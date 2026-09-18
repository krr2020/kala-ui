import { SegmentedControl, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function SegmentedControlDemo() {
	const [range, setRange] = useState("week");
	return (
		<View style={demoStyles.routeContent} testID="k-demo-segmented-control">
			<DemoBlock label="Range Filter">
				<View style={demoStyles.componentRow}>
					<SegmentedControl
						data={["day", "week", "month"]}
						value={range}
						onValueChange={setRange}
						accessibilityLabel="range"
					/>
				</View>
				<KText size="sm" color="muted">
					showing the {range} window
				</KText>
			</DemoBlock>
			<DemoBlock label="Uncontrolled">
				<View style={demoStyles.componentRow}>
					<SegmentedControl
						data={["compact", "comfortable"]}
						defaultValue="comfortable"
					/>
				</View>
			</DemoBlock>
		</View>
	);
}
