import {
	Calendar,
	DateRangePicker,
	DatePicker,
	TimePicker,
	type TimeValue,
} from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "./demo-block";
import { demoStyles } from "./stylesheet";

// Group overview: the sheet-backed pickers that anchor overlay flows —
// dialogs, menus and sheets each have a dedicated screen in ./components.
export function OverlaysDemo() {
	const [stayDate, setStayDate] = useState<Date | undefined>(
		new Date(2026, 1, 10),
	);
	const [remindAt, setRemindAt] = useState<TimeValue>({
		hours: 9,
		minutes: 30,
	});
	return (
		<>
			<DemoBlock label="Calendar">
				<View style={demoStyles.componentRow} testID="k-demo-calendar">
					<Calendar />
					<DateRangePicker placeholder="pick a range" />
				</View>
			</DemoBlock>
			<DemoBlock label="Date Picker">
				<View style={demoStyles.componentRow} testID="k-demo-date-picker">
					<DatePicker
						value={stayDate}
						onValueChange={setStayDate}
						placeholder="pick a stay date"
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="Time Picker">
				<View style={demoStyles.componentRow} testID="k-demo-time-picker">
					<TimePicker
						value={remindAt}
						onValueChange={setRemindAt}
						hourCycle={12}
					/>
				</View>
			</DemoBlock>
		</>
	);
}
