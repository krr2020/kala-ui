import {
	BarChart,
	DonutChart,
	MetricCard,
	Sparkline,
} from "@kala-ui/react-native-app";
import { View } from "react-native";
import { demoStyles } from "./stylesheet";

const SESSIONS = [
	{ label: "mon", value: 4 },
	{ label: "tue", value: 8 },
	{ label: "wed", value: 6 },
];

const SOURCES = [
	{ label: "direct", value: 1000 },
	{ label: "organic", value: 500 },
	{ label: "referral", value: 250 },
];

export function ChartsDemo() {
	return (
		<View style={demoStyles.componentRow} testID="k-demo-charts">
			<MetricCard
				title="weekly active"
				value={12345}
				change={5}
				tone="primary"
			/>
			<MetricCard
				title="churn"
				value="2.1%"
				change={-3}
				changeLabel="vs last month"
				tone="destructive"
			/>
			<MetricCard title="net score" value={87} subtitle="of 100 target" />
			<BarChart data={SESSIONS} />
			<DonutChart data={SOURCES} />
			<Sparkline data={[3, 7, 4, 9, 6, 11]} />
		</View>
	);
}
