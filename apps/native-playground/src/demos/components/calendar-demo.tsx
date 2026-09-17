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
			<DemoBlock label="Month Picker">
				{/* tap the month title to jump months or years; the window here is
					three months so the picker also shows disabled months */}
				<Calendar
					accessibilityLabel="month jumper"
					defaultValue={new Date(2026, 0, 15)}
					min={new Date(2025, 11, 1)}
					max={new Date(2026, 2, 31)}
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<Calendar isLoading accessibilityLabel="loading calendar" />
			</DemoBlock>
			<DemoBlock label="Preselected">
				<Calendar
					accessibilityLabel="preselected stay"
					defaultValue={new Date(2026, 0, 15)}
				/>
			</DemoBlock>
		</View>
	);
}
