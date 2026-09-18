import { ToggleGroup, ToggleGroupItem } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function ToggleGroupDemo() {
	const [align, setAlign] = useState("");
	const [formats, setFormats] = useState<string[]>(["italic"]);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-toggle-group">
			<DemoBlock label="Single Select">
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
			<DemoBlock label="Multiple Select">
				<View style={demoStyles.componentRow}>
					<ToggleGroup
						type="multiple"
						value={formats}
						onValueChange={(v) => setFormats(v as string[])}
					>
						<ToggleGroupItem value="bold">bold</ToggleGroupItem>
						<ToggleGroupItem value="italic">italic</ToggleGroupItem>
						<ToggleGroupItem value="underline">underline</ToggleGroupItem>
					</ToggleGroup>
				</View>
			</DemoBlock>
		</View>
	);
}
