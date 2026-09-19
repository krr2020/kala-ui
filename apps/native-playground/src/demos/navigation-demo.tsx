import {
	Accordion,
	Collapsible,
	SegmentedControl,
	Tabs,
	Text as KText,
	ToggleGroup,
	ToggleGroupItem,
} from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "./demo-block";
import { demoStyles } from "./stylesheet";

// Group overview: the navigation & controls family side by side — dedicated
// per-component screens live in ./components.
export function NavigationDemo() {
	const [tab, setTab] = useState("one");
	const [range, setRange] = useState("week");
	const [align, setAlign] = useState("left");
	return (
		<>
			<DemoBlock label="Tabs — divider + active fill">
				<Tabs
					items={[
						{ value: "one", label: "One" },
						{ value: "two", label: "Two", badge: 5 },
						{ value: "three", label: "Three", indicator: true },
					]}
					value={tab}
					onValueChange={setTab}
				>
					<KText size="sm" color="muted">
						{tab === "one"
							? "first tab panel"
							: tab === "two"
								? "second tab panel"
								: "third tab panel"}
					</KText>
				</Tabs>
			</DemoBlock>
			<DemoBlock label="SegmentedControl — filled track">
				<View style={demoStyles.componentRow}>
					<SegmentedControl
						data={["day", "week", "month"]}
						value={range}
						onValueChange={setRange}
						accessibilityLabel="range"
					/>
				</View>
				<KText size="sm" color="muted">
					range filter over the {range} window
				</KText>
			</DemoBlock>
			<DemoBlock label="ToggleGroup">
				<View style={demoStyles.componentRow}>
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
				</View>
			</DemoBlock>
			<DemoBlock label="Accordion">
				<Accordion type="single" defaultValue="shipping" variant="bordered">
					<Accordion.Item value="shipping">
						<Accordion.Trigger>shipping</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								free over $50, arrives in 3-5 days
							</KText>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>
			</DemoBlock>
			<DemoBlock label="Collapsible">
				<Collapsible>
					<Collapsible.Trigger>more filters</Collapsible.Trigger>
					<Collapsible.Content>
						<KText size="sm" color="muted">
							expand inline details without leaving the screen
						</KText>
					</Collapsible.Content>
				</Collapsible>
			</DemoBlock>
		</>
	);
}
