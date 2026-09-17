import { Field, Slider } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function SliderDemo() {
	const [volume, setVolume] = useState<number[]>([40]);
	const [range, setRange] = useState<number[]>([20, 80]);
	return (
		<View testID="k-demo-slider" style={demoStyles.routeContent}>
			<DemoBlock label="Single Thumb">
				<Field label="Volume" description="0 to 100">
					<Slider
						accessibilityLabel="volume"
						defaultValue={[40]}
						onValueChange={setVolume}
					/>
				</Field>
				<Text style={demoStyles.current}>Volume: {volume[0]}</Text>
			</DemoBlock>
			<DemoBlock label="Range">
				<Slider
					accessibilityLabel="price range"
					defaultValue={[20, 80]}
					onValueChange={setRange}
				/>
				<Text style={demoStyles.current}>
					Price: {range[0]} – {range[1]}
				</Text>
			</DemoBlock>
			<DemoBlock label="Stepped">
				<Slider
					accessibilityLabel="stepped slider"
					defaultValue={[2]}
					min={0}
					max={10}
					step={2}
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<Slider
					accessibilityLabel="locked slider"
					defaultValue={[50]}
					disabled
				/>
			</DemoBlock>
			<DemoBlock label="Boundaries">
				<Slider accessibilityLabel="slider at min" defaultValue={[0]} />
				<Slider accessibilityLabel="slider at max" defaultValue={[100]} />
				<Slider accessibilityLabel="collapsed range" defaultValue={[40, 40]} />
			</DemoBlock>
		</View>
	);
}
