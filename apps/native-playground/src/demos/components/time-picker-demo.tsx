import { Field, TimePicker } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function TimePickerDemo() {
	const [reminder, setReminder] = useState<{ hours: number; minutes: number }>({
		hours: 9,
		minutes: 30,
	});
	return (
		<View testID="k-demo-time-picker" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<Field label="Reminder" description="wheels commit when they stop">
					<TimePicker
						accessibilityLabel="reminder time"
						value={reminder}
						onValueChange={setReminder}
					/>
				</Field>
				<Text style={demoStyles.current}>
					Reminder: {String(reminder.hours).padStart(2, "0")}:
					{String(reminder.minutes).padStart(2, "0")}
				</Text>
			</DemoBlock>
			<DemoBlock label="12 Hour">
				<TimePicker hourCycle={12} accessibilityLabel="appointment" />
			</DemoBlock>
			<DemoBlock label="With Seconds">
				<TimePicker showSeconds accessibilityLabel="timer" />
			</DemoBlock>
			<DemoBlock label="States">
				<TimePicker accessibilityLabel="locked time" disabled />
			</DemoBlock>
			<DemoBlock label="Boundaries">
				<TimePicker
					defaultValue={{ hours: 0, minutes: 0 }}
					accessibilityLabel="midnight"
				/>
				<TimePicker
					showSeconds
					defaultValue={{ hours: 23, minutes: 59, seconds: 59 }}
					accessibilityLabel="end of day"
				/>
			</DemoBlock>
		</View>
	);
}
