import {
	Rating,
	Slider,
	Tag,
	Text as KText,
	Toggle,
	ToggleGroup,
	ToggleGroupItem,
} from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "./demo-block";
import { demoStyles } from "./stylesheet";

// Group overview: the controls that ride along navigation surfaces —
// dedicated per-component screens live in ./components.
export function NavigationDemo() {
	const [rating, setRating] = useState(3);
	const [volume, setVolume] = useState(70);
	const [bold, setBold] = useState(false);
	const [align, setAlign] = useState("");
	const [formats, setFormats] = useState<string[]>(["italic"]);
	return (
		<>
			<DemoBlock label="Tags">
				<View style={demoStyles.componentRow} testID="k-demo-tags">
					<Tag>beta</Tag>
					<Tag variant="solid" color="primary">
						v2.0
					</Tag>
					<Tag variant="outline" color="success" onRemove={() => undefined}>
						clearance
					</Tag>
				</View>
			</DemoBlock>
			<DemoBlock label="Rating">
				<View style={demoStyles.componentRow} testID="k-demo-rating">
					<Rating value={rating} onValueChange={setRating} />
					<Rating value={3.5} allowHalf readOnly />
				</View>
			</DemoBlock>
			<DemoBlock label="Slider">
				<View testID="k-demo-slider">
					<Slider
						value={[volume]}
						onValueChange={(v) => setVolume(v[0])}
						accessibilityLabel="volume"
					/>
					<KText size="sm">volume {volume}</KText>
				</View>
			</DemoBlock>
			<DemoBlock label="Toggles">
				<View style={demoStyles.componentRow} testID="k-demo-toggles">
					<Toggle
						pressed={bold}
						onPressedChange={setBold}
						accessibilityLabel="bold"
					>
						<KText size="sm">B</KText>
					</Toggle>
					<ToggleGroup
						type="single"
						value={align}
						onValueChange={(v) => setAlign(String(v))}
						variant="outline"
					>
						<ToggleGroupItem value="left">Left</ToggleGroupItem>
						<ToggleGroupItem value="center">Center</ToggleGroupItem>
						<ToggleGroupItem value="right">Right</ToggleGroupItem>
					</ToggleGroup>
					<ToggleGroup
						type="multiple"
						value={formats}
						onValueChange={(v) => setFormats(v as string[])}
					>
						<ToggleGroupItem value="bold">bold</ToggleGroupItem>
						<ToggleGroupItem value="italic">italic</ToggleGroupItem>
					</ToggleGroup>
				</View>
			</DemoBlock>
		</>
	);
}
