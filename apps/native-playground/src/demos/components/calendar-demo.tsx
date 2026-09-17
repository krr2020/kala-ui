import { Calendar } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function CalendarDemo() {
	const [picked, setPicked] = useState<Date | undefined>(undefined);
	return (
		<View testID="k-demo-calendar" style={demoStyles.routeContent}>
			<DemoBlock label="Single">
				<Calendar
					accessibilityLabel="stay dates"
					onValueChange={(v) => setPicked(v as Date)}
				/>
				<Text style={demoStyles.current}>
					Picked: {picked ? picked.toDateString() : "none"}
				</Text>
			</DemoBlock>
			<DemoBlock label="Range">
				<Calendar mode="range" accessibilityLabel="trip window" />
			</DemoBlock>
			<DemoBlock label="Bounded">
				{/* past dates are disabled — booking starts today */}
				<Calendar
					accessibilityLabel="next week only"
					min={new Date(2026, 8, 17)}
					max={new Date(2026, 8, 24)}
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<Calendar isLoading accessibilityLabel="loading calendar" />
			</DemoBlock>
		</View>
	);
}
