import { Button, Icon } from "@kala-ui/react-native";
import { MetricCard } from "@kala-ui/react-native-app";
import { Activity, DollarSign, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function MetricCardDemo() {
	const [loading, setLoading] = useState(false);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-metric-card">
			<DemoBlock label="Tones">
				<MetricCard
						title="weekly active"
						value={12345}
						change={5}
						tone="primary"
						icon={<Icon icon={Activity} size="sm" />}
					/>
					<MetricCard
						title="churn"
						value="2.1%"
						change={-3}
						changeLabel="vs last month"
						tone="destructive"
					/>
					<MetricCard
						title="net score"
						value={87}
						subtitle="of 100 target"
						tone="muted"
						icon={<Icon icon={TrendingUp} size="sm" />}
				/>
			</DemoBlock>
			<DemoBlock label="Skeleton State">
				<Button size="sm" onPress={() => setLoading((l) => !l)}>
					Toggle Skeleton
				</Button>
				<MetricCard
					title="revenue"
					value="$48.2k"
					change={12}
					tone="success"
					isLoading={loading}
					icon={<Icon icon={DollarSign} size="sm" />}
				/>
			</DemoBlock>
			<DemoBlock label="Empty State">
				<MetricCard title="signups" value={0} emptyMessage="no signups yet" />
			</DemoBlock>
		</View>
	);
}
