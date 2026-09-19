import {
	Text as KText,
	ToggleGroup,
	ToggleGroupItem,
} from "@kala-ui/react-native";
import { Bold, Italic, Underline } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const FORMATS = ["bold", "italic", "underline"] as const;

export function ToggleGroupDemo() {
	const [align, setAlign] = useState("left");
	const [formats, setFormats] = useState<string[]>(["italic"]);
	const [formatSizes, setFormatSizes] = useState<string[]>(["bold"]);
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
			<DemoBlock label="Multiple — icons, uncontrolled">
				<View style={demoStyles.componentRow}>
					<ToggleGroup
						type="multiple"
						defaultValue={["italic"]}
						onValueChange={(v) => setFormats(v as string[])}
						variant="outline"
					>
						{FORMATS.map((f) => (
							<ToggleGroupItem key={f} value={f} accessibilityLabel={f}>
								{f === "bold" ? (
									<Bold size={16} />
								) : f === "italic" ? (
									<Italic size={16} />
								) : (
									<Underline size={16} />
								)}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</View>
				<KText size="sm" color="muted">
					active: {formats.join(", ") || "none"}
				</KText>
			</DemoBlock>
			<DemoBlock label="Multiple — with disabled item">
				<View style={demoStyles.componentRow}>
					<ToggleGroup
						type="multiple"
						variant="outline"
						value={formatSizes}
						onValueChange={(v) => setFormatSizes(v as string[])}
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
					active: {formatSizes.join(", ") || "none"}
				</KText>
			</DemoBlock>
			{(["sm", "md", "lg"] as const).map((size) => (
				<DemoBlock key={size} label={`Group size — ${size}`}>
					<View style={demoStyles.componentRow}>
						<ToggleGroup
							type="single"
							size={size}
							variant="outline"
							defaultValue="a"
						>
							<ToggleGroupItem value="a">A</ToggleGroupItem>
							<ToggleGroupItem value="b">B</ToggleGroupItem>
							<ToggleGroupItem value="c">C</ToggleGroupItem>
						</ToggleGroup>
					</View>
				</DemoBlock>
			))}
			<DemoBlock label="Whole group disabled">
				<View style={demoStyles.componentRow}>
					<ToggleGroup
						type="single"
						variant="outline"
						defaultValue="a"
						disabled
					>
						<ToggleGroupItem value="a">A</ToggleGroupItem>
						<ToggleGroupItem value="b">B</ToggleGroupItem>
					</ToggleGroup>
				</View>
			</DemoBlock>
		</View>
	);
}
