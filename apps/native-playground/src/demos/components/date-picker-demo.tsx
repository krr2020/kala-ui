import { DatePicker, DateRangePicker, Field } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function DatePickerDemo() {
	const [stay, setStay] = useState<Date | undefined>(undefined);
	return (
		<View testID="k-demo-date-picker" style={demoStyles.routeContent}>
			<DemoBlock label="Single Date">
				<Field label="Check-In" description="any date from today">
					<DatePicker
						value={stay}
						onValueChange={setStay}
						placeholder="pick a date"
						accessibilityLabel="check-in"
					/>
				</Field>
				<Text style={demoStyles.current}>
					Stay: {stay ? stay.toDateString() : "none"}
				</Text>
			</DemoBlock>
			<DemoBlock label="Date Range">
				<DateRangePicker
					placeholder="pick a window"
					accessibilityLabel="report window"
				/>
			</DemoBlock>
			<DemoBlock label="Sizes">
				<DatePicker
					size="sm"
					placeholder="small"
					accessibilityLabel="small date"
				/>
				<DatePicker
					size="md"
					placeholder="medium"
					accessibilityLabel="medium date"
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<DatePicker
					placeholder="required"
					accessibilityLabel="error date"
					hasError
				/>
				<DatePicker
					placeholder="locked"
					accessibilityLabel="locked date"
					buttonDisabled
				/>
			</DemoBlock>
		</View>
	);
}
