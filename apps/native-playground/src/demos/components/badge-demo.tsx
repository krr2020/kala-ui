import { Badge } from "@kala-ui/react-native";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
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
	const { theme } = useUnistyles();
	return (
		<View testID="k-demo-badges" style={demoStyles.routeContent}>
			<DemoBlock label="Variants">
				<View style={demoStyles.componentRow}>
					{VARIANTS.map((variant) => (
						<Badge key={variant} variant={variant}>
							{variant}
						</Badge>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Colors (subtle)">
				<View style={demoStyles.componentRow}>
					{COLORS.map((color) => (
						<Badge key={color} variant="subtle" color={color}>
							{color}
						</Badge>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Shapes (outline)">
				<View style={demoStyles.componentRow}>
					{SHAPES.map((shape) => (
						<Badge key={shape} variant="outline" color="info" shape={shape}>
							{shape}
						</Badge>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Counts">
				<View style={demoStyles.componentRow}>
					<Badge color="destructive">1</Badge>
					<Badge color="destructive">12</Badge>
					<Badge color="destructive">99+</Badge>
				</View>
			</DemoBlock>
			<DemoBlock label="Slot overrides">
				<View style={demoStyles.componentRow}>
					<Badge variant="outline">default</Badge>
					<Badge
						variant="outline"
						style={{ marginRight: 8 }}
						slotStyles={{
							root: {
								borderWidth: 2,
								borderColor: theme.destructive,
								borderRadius: 999,
							},
						}}
					>
						slotStyles
					</Badge>
				</View>
			</DemoBlock>
		</View>
	);
}
