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
					placeholder="order notes"
					accessibilityLabel="order notes"
					rows={3}
				/>
				<Textarea
					placeholder="feedback"
					accessibilityLabel="feedback"
					rows={5}
				/>
			</DemoBlock>
			<DemoBlock label="In A Field">
				<Field
					label="Delivery Notes"
					description="optional, 500 characters"
					error={invalid ? "tell us a little more" : undefined}
				>
					<Textarea value={notes} onChangeText={setNotes} hasError={invalid} />
				</Field>
			</DemoBlock>
			<DemoBlock label="States">
				<Textarea
					placeholder="too long"
					accessibilityLabel="error textarea"
					hasError
					rows={2}
				/>
				<Textarea
					placeholder="locked"
					accessibilityLabel="locked textarea"
					disabled
					rows={2}
				/>
			</DemoBlock>
		</View>
	);
}
