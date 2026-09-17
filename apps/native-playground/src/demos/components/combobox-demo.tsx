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

const LONG_LIST = Array.from({ length: 25 }, (_, i) => ({
	value: `city-${i}`,
	label: `City ${i}`,
}));

const LONG_LABELS = [
	{
		value: "osaka",
		label: "Osaka — Kansai region hub with night market access",
	},
	{
		value: "montreal",
		label: "Montréal — bilingual metro with winter bike network",
	},
];

export function ComboboxDemo() {
	const [city, setCity] = useState<string | undefined>(undefined);
	return (
		<View testID="k-demo-combobox" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<Combobox
					placeholder="Pick a city"
					accessibilityLabel="City"
					options={CITIES}
				/>
			</DemoBlock>
			<DemoBlock label="Controlled">
				<Combobox
					value={city}
					onValueChange={setCity}
					placeholder="Search cities"
					accessibilityLabel="Home city"
					options={CITIES}
				/>
				<Text style={demoStyles.current}>City: {city ?? "none"}</Text>
			</DemoBlock>
			<DemoBlock label="Long List">
				<Combobox
					placeholder="Pick a city"
					accessibilityLabel="Long list city"
					options={LONG_LIST}
				/>
			</DemoBlock>
			<DemoBlock label="Orphan Value">
				{/* value outside the options list still displays instead of blanking */}
				<Combobox
					value="ghent"
					onValueChange={() => undefined}
					accessibilityLabel="Orphan city"
					options={CITIES}
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<Combobox
					placeholder="Required"
					accessibilityLabel="Error combobox"
					hasError
					options={CITIES}
				/>
			</DemoBlock>
			<DemoBlock label="Long Labels">
				<Combobox
					placeholder="Search destinations"
					accessibilityLabel="long destination"
					options={LONG_LABELS}
				/>
			</DemoBlock>
		</View>
	);
}
