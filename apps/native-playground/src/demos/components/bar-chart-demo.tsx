import { BarChart } from "@kala-ui/react-native-app";
import { useState } from "react";
import { Button } from "@kala-ui/react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const SESSIONS = [
	{ label: "mon", value: 4 },
	{ label: "tue", value: 8 },
	{ label: "wed", value: 6 },
	{ label: "thu", value: 9 },
];

export function BarChartDemo() {
	const [loading, setLoading] = useState(false);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-bar-chart">
			<DemoBlock label="Weekly Sessions">
				<BarChart data={SESSIONS} />
			</DemoBlock>
			<DemoBlock label="Tones">
				<View style={demoStyles.componentRow}>
					<BarChart data={SESSIONS} tone="primary" />
					<BarChart data={SESSIONS} tone="secondary" />
					<BarChart data={SESSIONS} tone="destructive" />
				</View>
			</DemoBlock>
			<DemoBlock label="Skeleton And Empty">
				<Button size="sm" onPress={() => setLoading((l) => !l)}>
					Toggle Skeleton
				</Button>
				<BarChart data={SESSIONS} isLoading={loading} />
				<BarChart data={[]} emptyMessage="no sessions captured yet" />
			</DemoBlock>
		</View>
	);
}
