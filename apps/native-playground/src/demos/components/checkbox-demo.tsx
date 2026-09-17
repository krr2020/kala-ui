import { Checkbox } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

type TriState = false | true | "indeterminate";

export function CheckboxDemo() {
	const [agree, setAgree] = useState(false);
	const [news, setNews] = useState(true);
	const [bulk, setBulk] = useState<TriState>("indeterminate");
	const cycle = (checked: boolean): void => {
		setBulk((prev) =>
			prev === false ? true : prev === true ? "indeterminate" : checked,
		);
	};
	return (
		<View testID="k-demo-checkbox" style={demoStyles.routeContent}>
			<DemoBlock label="With Labels">
				<Checkbox
					label="Agree to the terms"
					value={agree}
					onValueChange={setAgree}
				/>
				<Checkbox
					label="Product updates"
					value={news}
					onValueChange={setNews}
				/>
				<Text style={demoStyles.current}>
					Terms: {agree ? "yes" : "no"} · Updates: {news ? "yes" : "no"}
				</Text>
			</DemoBlock>
			<DemoBlock label="Tri-State">
				<Checkbox label="Select all rows" value={bulk} onValueChange={cycle} />
				<Text style={demoStyles.current}>
					Taps cycle unchecked → checked → indeterminate
				</Text>
			</DemoBlock>
			<DemoBlock label="States">
				<Checkbox label="Loading preferences" isLoading />
				<Checkbox
					label="Locked choice"
					value={false}
					disabled
					onValueChange={() => undefined}
				/>
			</DemoBlock>
			<DemoBlock label="Standalone">
				<Checkbox accessibilityLabel="anonymous checkbox" value />
			</DemoBlock>
		</View>
	);
}
