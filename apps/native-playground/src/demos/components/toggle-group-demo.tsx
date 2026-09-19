import {
	Text as KText,
	ToggleGroup,
	ToggleGroupItem,
} from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function ToggleGroupDemo() {
	const [align, setAlign] = useState("left");
	const [formats, setFormats] = useState<string[]>(["italic"]);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-toggle-group">
			<DemoBlock label="Single — outline">
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
				<KText size="sm" color="muted">
					alignment: {align || "none — single deselects"}
				</KText>
			</DemoBlock>
			<DemoBlock label="Multiple — default variant">
				<View style={demoStyles.componentRow}>
					<ToggleGroup
						type="multiple"
						value={formats}
						onValueChange={(v) => setFormats(v as string[])}
					>
						<ToggleGroupItem value="bold">bold</ToggleGroupItem>
						<ToggleGroupItem value="italic">italic</ToggleGroupItem>
						<ToggleGroupItem value="underline">underline</ToggleGroupItem>
						<ToggleGroupItem value="code" disabled>
							code
						</ToggleGroupItem>
					</ToggleGroup>
				</View>
				<KText size="sm" color="muted">
					active: {formats.join(", ") || "none"}
				</KText>
			</DemoBlock>
			<DemoBlock label="Whole group disabled">
				<ToggleGroup type="single" defaultValue="a" disabled>
					<ToggleGroupItem value="a">A</ToggleGroupItem>
					<ToggleGroupItem value="b">B</ToggleGroupItem>
				</ToggleGroup>
			</DemoBlock>
		</View>
	);
}
