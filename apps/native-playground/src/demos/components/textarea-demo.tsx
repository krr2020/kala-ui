import { Field, Textarea } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function TextareaDemo() {
	const [notes, setNotes] = useState("");
	const invalid = notes.length > 0 && notes.length < 10;
	return (
		<View testID="k-demo-textarea" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<Textarea
					placeholder="Order notes"
					accessibilityLabel="Order notes"
					rows={3}
				/>
				<Textarea
					placeholder="Feedback"
					accessibilityLabel="Feedback"
					rows={5}
				/>
			</DemoBlock>
			<DemoBlock label="In a Field">
				<Field
					label="Delivery Notes"
					description="Optional, up to 500 characters"
					error={invalid ? "Tell us a little more" : undefined}
				>
					<Textarea value={notes} onChangeText={setNotes} hasError={invalid} />
				</Field>
			</DemoBlock>
			<DemoBlock label="States">
				<Field error="Over the 500-character limit">
					<Textarea
						placeholder="Too long"
						accessibilityLabel="Error textarea"
						hasError
						rows={2}
					/>
				</Field>
				<Field>
					<Textarea
						value="Left at the front desk with the neighbor."
						accessibilityLabel="Valid textarea"
						hasSuccess
						rows={2}
					/>
				</Field>
				<Textarea
					placeholder="Disabled"
					accessibilityLabel="Disabled textarea"
					disabled
					rows={2}
				/>
			</DemoBlock>
			<DemoBlock label="Long Text">
				{/* long values wrap instead of clipping */}
				<Textarea
					defaultValue={"Incident timeline: gateway returned 502s for 11 minutes while the edge cache absorbed load; failover completed without customer impact and the postmortem is scheduled. ".repeat(
						3,
					)}
					accessibilityLabel="long textarea value"
					rows={4}
				/>
			</DemoBlock>
		</View>
	);
}
