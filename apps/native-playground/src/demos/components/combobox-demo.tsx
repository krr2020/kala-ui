import { Combobox } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const CITIES = [
	{ value: "lisbon", label: "Lisbon" },
	{ value: "tokyo", label: "Tokyo" },
	{ value: "perth", label: "Perth" },
];

export function ComboboxDemo() {
	const [city, setCity] = useState<string | undefined>(undefined);
	return (
		<View testID="k-demo-combobox" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<Combobox
					placeholder="pick a city"
					accessibilityLabel="city"
					options={CITIES}
				/>
			</DemoBlock>
			<DemoBlock label="Controlled">
				<Combobox
					value={city}
					onValueChange={setCity}
					placeholder="search cities"
					accessibilityLabel="home city"
					options={CITIES}
				/>
				<Text style={demoStyles.current}>City: {city ?? "none"}</Text>
			</DemoBlock>
			<DemoBlock label="Orphan Value">
				{/* value outside the options list still displays instead of blanking */}
				<Combobox
					value="ghent"
					onValueChange={() => undefined}
					accessibilityLabel="orphan city"
					options={CITIES}
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<Combobox
					placeholder="required"
					accessibilityLabel="error combobox"
					hasError
					options={CITIES}
				/>
			</DemoBlock>
		</View>
	);
}
