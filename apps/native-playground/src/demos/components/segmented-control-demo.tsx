import { SegmentedControl, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function SegmentedControlDemo() {
	const [range, setRange] = useState("week");
	const [density, setDensity] = useState("comfortable");
	return (
		<View style={demoStyles.routeContent} testID="k-demo-segmented-control">
			<DemoBlock label="Range Filter — controlled">
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
			<DemoBlock label="Sizes">
				<SegmentedControl
					data={["sm", "md", "lg"]}
					size="sm"
					value="sm"
					onValueChange={() => undefined}
					accessibilityLabel="small"
				/>
				<SegmentedControl
					data={["sm", "md", "lg"]}
					size="md"
					value="md"
					onValueChange={() => undefined}
					accessibilityLabel="medium"
				/>
				<SegmentedControl
					data={["sm", "md", "lg"]}
					size="lg"
					value="lg"
					onValueChange={() => undefined}
					accessibilityLabel="large"
				/>
			</DemoBlock>
			<DemoBlock label="Pill Radius + Full Width">
				<SegmentedControl
					data={["compact", "cozy", "roomy"]}
					radius="full"
					fullWidth
					value={density}
					onValueChange={setDensity}
					accessibilityLabel="density"
				/>
				<KText size="sm" color="muted">
					density: {density}
				</KText>
			</DemoBlock>
			<DemoBlock label="Disabled">
				<SegmentedControl
					data={[
						{ value: "on", label: "On" },
						{ value: "hold", label: "Hold", disabled: true },
						{ value: "off", label: "Off" },
					]}
					defaultValue="on"
					accessibilityLabel="state"
				/>
			</DemoBlock>
		</View>
	);
}
