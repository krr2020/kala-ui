import { DonutChart } from "@kala-ui/react-native-app";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const SOURCES = [
	{ label: "direct", value: 1000 },
	{ label: "organic", value: 500 },
	{ label: "referral", value: 250 },
];

export function DonutChartDemo() {
	return (
		<View style={demoStyles.routeContent} testID="k-demo-donut-chart">
			<DemoBlock label="Traffic Sources">
				<DonutChart data={SOURCES} />
			</DemoBlock>
			<DemoBlock label="Segment Tones">
				<DonutChart
					data={[
						{ label: "paid", value: 300, tone: "primary" },
						{ label: "earned", value: 450, tone: "secondary" },
						{ label: "lost", value: 120, tone: "destructive" },
					]}
					size={140}
					thickness={14}
				/>
			</DemoBlock>
			<DemoBlock label="Empty">
				<DonutChart data={[]} emptyMessage="no traffic yet" />
			</DemoBlock>
		</View>
	);
}
