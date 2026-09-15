import {
	EmptyState,
	Icon,
	Indicator,
	Text as KText,
	Rating,
	SegmentedControl,
	Slider,
	Tabs,
	Tag,
	Toggle,
	ToggleGroup,
	ToggleGroupItem,
} from "@kala-ui/react-native";
import { Sun } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { demoStyles } from "./stylesheet";

export function NavigationDemo() {
	const [range, setRange] = useState("week");
	const [tab, setTab] = useState("one");
	const [rating, setRating] = useState(3);
	const [volume, setVolume] = useState(70);
	const [bold, setBold] = useState(false);
	const [align, setAlign] = useState("");
	const [formats, setFormats] = useState<string[]>(["italic"]);
	return (
		<>
			<View testID="k-demo-tabs">
				<Tabs
					items={[
						{ value: "one", label: "One" },
						{ value: "two", label: "Two" },
					]}
					value={tab}
					onValueChange={setTab}
				>
					<KText size="sm">
						{tab === "one" ? "first tab panel" : "second tab panel"}
					</KText>
				</Tabs>
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-segmented">
				<SegmentedControl
					data={["day", "week", "month"]}
					value={range}
					onValueChange={setRange}
					accessibilityLabel="range"
				/>
			</View>
			<EmptyState
				title="No projects yet"
				description="Create your first project to get started."
				action={{ label: "New project", onPress: () => undefined }}
			/>
			<View style={demoStyles.componentRow} testID="k-demo-tags">
				<Tag>beta</Tag>
				<Tag variant="solid" color="primary">
					v2.0
				</Tag>
				<Tag variant="outline" color="success" onRemove={() => undefined}>
					clearance
				</Tag>
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-rating">
				<Rating value={rating} onValueChange={setRating} />
				<Rating value={3.5} allowHalf readOnly />
			</View>
			<View testID="k-demo-slider">
				<Slider
					value={[volume]}
					onValueChange={(v) => setVolume(v[0])}
					accessibilityLabel="volume"
				/>
				<KText size="sm">volume {volume}</KText>
			</View>
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
			<View style={demoStyles.componentRow} testID="k-demo-indicator">
				<Indicator size={12} label="3">
					<Icon icon={Sun} size="md" />
				</Indicator>
				<Indicator color="success">
					<KText size="sm">online</KText>
				</Indicator>
				<Indicator color="destructive" processing size={12}>
					<KText size="sm">live</KText>
				</Indicator>
			</View>
		</>
	);
}
