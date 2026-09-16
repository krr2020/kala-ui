import { Badge } from "@kala-ui/react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const VARIANTS = ["solid", "outline", "subtle"] as const;
const COLORS = [
	"primary",
	"secondary",
	"destructive",
	"success",
	"warning",
	"info",
	"muted",
] as const;
const SHAPES = ["rounded", "pill"] as const;

export function BadgeDemo() {
	return (
		<View testID="k-demo-badges" style={demoStyles.routeContent}>
			<DemoBlock label="variants">
				<View style={demoStyles.componentRow}>
					{VARIANTS.map((variant) => (
						<Badge key={variant} variant={variant}>
							{variant}
						</Badge>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="colors (subtle)">
				<View style={demoStyles.componentRow}>
					{COLORS.map((color) => (
						<Badge key={color} variant="subtle" color={color}>
							{color}
						</Badge>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="shapes (outline)">
				<View style={demoStyles.componentRow}>
					{SHAPES.map((shape) => (
						<Badge key={shape} variant="outline" color="info" shape={shape}>
							{shape}
						</Badge>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="counts">
				<View style={demoStyles.componentRow}>
					<Badge color="destructive">1</Badge>
					<Badge color="destructive">12</Badge>
					<Badge color="destructive">99+</Badge>
				</View>
			</DemoBlock>
		</View>
	);
}
