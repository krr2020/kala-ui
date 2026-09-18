import { Sparkline } from "@kala-ui/react-native-app";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function SparklineDemo() {
	return (
		<View style={demoStyles.routeContent} testID="k-demo-sparkline">
			<DemoBlock label="Trend Lines">
				<Sparkline data={[3, 7, 4, 9, 6, 11, 8]} tone="primary" />
				<Sparkline data={[9, 6, 11, 8, 3, 7, 4]} tone="destructive" />
			</DemoBlock>
			<DemoBlock label="Sizes">
				<View style={demoStyles.componentRow}>
					<Sparkline data={[2, 5, 3, 8]} width={96} height={32} />
					<Sparkline data={[2, 5, 3, 8]} width={160} height={48} />
				</View>
			</DemoBlock>
			<DemoBlock label="Empty">
				<Sparkline data={[]} emptyMessage="not enough data points yet" />
			</DemoBlock>
		</View>
	);
}
