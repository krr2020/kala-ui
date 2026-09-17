import { Field, NumberInput } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function NumberInputDemo() {
	const [qty, setQty] = useState(1);
	return (
		<View testID="k-demo-number-input" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<NumberInput
					defaultValue={1}
					min={0}
					max={10}
					accessibilityLabel="Quantity"
				/>
				<NumberInput
					defaultValue={-2.5}
					step={0.5}
					accessibilityLabel="Offset with decimals"
				/>
			</DemoBlock>
			<DemoBlock label="In a Field">
				<Field
					label="Tickets"
					description="Max 6 per order"
					error={qty > 6 ? "Over the 6-ticket limit" : undefined}
				>
					<NumberInput
						value={qty}
						onValueChange={(n) => setQty(n ?? 0)}
						min={1}
						max={6}
						accessibilityLabel="Tickets"
					/>
				</Field>
				<Text style={demoStyles.current}>Tickets: {qty}</Text>
			</DemoBlock>
			<DemoBlock label="States">
				<Field error="Quantity must be at least 1">
					<NumberInput
						defaultValue={0}
						min={1}
						hasError
						accessibilityLabel="Error quantity"
					/>
				</Field>
				<Field>
					<NumberInput
						defaultValue={2}
						hasSuccess
						accessibilityLabel="Valid quantity"
					/>
				</Field>
				<NumberInput
					defaultValue={5}
					disabled
					accessibilityLabel="Disabled quantity"
				/>
			</DemoBlock>
			<DemoBlock label="Boundaries">
				<NumberInput
					defaultValue={0}
					min={0}
					max={6}
					accessibilityLabel="clamped at min"
				/>
				<NumberInput
					defaultValue={6}
					min={0}
					max={6}
					accessibilityLabel="clamped at max"
				/>
			</DemoBlock>
		</View>
	);
}
