import { Rating } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function RatingDemo() {
	const [score, setScore] = useState(3);
	return (
		<View testID="k-demo-rating" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<Rating
					accessibilityLabel="Movie"
					value={score}
					onValueChange={setScore}
				/>
				<Text style={demoStyles.current}>Rated: {score} of 5</Text>
			</DemoBlock>
			<DemoBlock label="Half Stars">
				<Rating accessibilityLabel="dinner" defaultValue={2.5} allowHalf />
			</DemoBlock>
			<DemoBlock label="Read Only">
				<Rating accessibilityLabel="service" value={4} readOnly />
			</DemoBlock>
			<DemoBlock label="States">
				<Rating accessibilityLabel="locked rating" value={2} disabled />
			</DemoBlock>
		</View>
	);
}
