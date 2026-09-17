import { Toggle } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const SIZES = ["sm", "md", "lg"] as const;

export function ToggleDemo() {
	const [pinned, setPinned] = useState(true);
	return (
		<View testID="k-demo-toggle" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<Toggle
					accessibilityLabel="pin"
					pressed={pinned}
					onPressedChange={setPinned}
				>
					Pin
				</Toggle>
				<Text style={demoStyles.current}>Pinned: {pinned ? "yes" : "no"}</Text>
			</DemoBlock>
			<DemoBlock label="Variants">
				<View style={demoStyles.componentRow}>
					<Toggle accessibilityLabel="default toggle" defaultPressed>
						Default
					</Toggle>
					<Toggle accessibilityLabel="outline toggle" variant="outline">
						Outline
					</Toggle>
				</View>
			</DemoBlock>
			<DemoBlock label="Sizes">
				<View style={demoStyles.componentRow}>
					{SIZES.map((size) => (
						<Toggle
							key={size}
							accessibilityLabel={`${size} toggle`}
							size={size}
						>
							{size.toUpperCase()}
						</Toggle>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="States">
				<Toggle accessibilityLabel="locked toggle" disabled>
					Locked
				</Toggle>
			</DemoBlock>
			<DemoBlock label="Long Text">
				<Toggle accessibilityLabel="long toggle" defaultPressed>
					Uninterrupted power supply status
				</Toggle>
			</DemoBlock>
		</View>
	);
}
