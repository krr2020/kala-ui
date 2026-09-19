import { SegmentedControl, Text as KText } from "@kala-ui/react-native";
import type { SegmentedControlSize } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import type { ReactElement } from "react";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

function SizeRow({ size }: { size: SegmentedControlSize }): ReactElement {
	const [pick, setPick] = useState("day");
	return (
		<View style={demoStyles.componentRow}>
			<SegmentedControl
				data={["day", "week", "month"]}
				size={size}
				value={pick}
				onValueChange={setPick}
				accessibilityLabel={`size ${size}`}
			/>
			<KText size="sm" color="muted">
				{size}: {pick}
			</KText>
		</View>
	);
}

export function SegmentedControlDemo() {
	const [range, setRange] = useState("week");
	const [density, setDensity] = useState("comfortable");
	const [unit, setUnit] = useState("metric");
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
			<DemoBlock label="Sizes — tap to compare">
				{(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
					<SizeRow key={size} size={size} />
				))}
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
				<View style={demoStyles.componentRow}>
					<SegmentedControl
						data={["on", "hold", "off"]}
						value="hold"
						disabled
						accessibilityLabel="state all"
					/>
				</View>
				<SegmentedControl
					data={[
						{ value: "metric", label: "Metric" },
						{ value: "imperial", label: "Imperial", disabled: true },
					]}
					value={unit}
					onValueChange={setUnit}
					accessibilityLabel="unit"
				/>
			</DemoBlock>
		</View>
	);
}
