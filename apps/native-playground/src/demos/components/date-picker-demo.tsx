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
				<Field label="Check-In" description="Any date from today">
					<DatePicker
						value={stay}
						onValueChange={setStay}
						placeholder="Pick a date"
						accessibilityLabel="check-in"
					/>
				</Field>
				<Text style={demoStyles.current}>
					Stay: {stay ? stay.toDateString() : "none"}
				</Text>
			</DemoBlock>
			<DemoBlock label="Date Range">
				<Field label="Report Window" description="First day to last day">
					<DateRangePicker
						placeholder="Pick a window"
						accessibilityLabel="report window"
					/>
				</Field>
			</DemoBlock>
			<DemoBlock label="Sizes">
				<DatePicker
					size="sm"
					placeholder="Small"
					accessibilityLabel="small date"
				/>
				<DatePicker
					size="md"
					placeholder="Medium"
					accessibilityLabel="medium date"
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<DatePicker
					placeholder="Required"
					accessibilityLabel="error date"
					hasError
				/>
				<DatePicker
					placeholder="Locked"
					accessibilityLabel="locked date"
					buttonDisabled
				/>
			</DemoBlock>
			<DemoBlock label="Bounded">
				<DatePicker
					placeholder="This week only"
					accessibilityLabel="bounded date"
					min={new Date(2026, 8, 21)}
					max={new Date(2026, 8, 27)}
				/>
			</DemoBlock>
			<DemoBlock label="Prefilled">
				<DatePicker
					defaultValue={new Date(2026, 0, 15)}
					placeholder="Prefilled"
					accessibilityLabel="prefilled date"
				/>
			</DemoBlock>
		</View>
	);
}
