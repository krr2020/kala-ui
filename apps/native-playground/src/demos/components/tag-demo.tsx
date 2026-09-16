import { Icon, Tag } from "@kala-ui/react-native";
import { Sun } from "lucide-react-native";
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
] as const;
const SIZES = ["sm", "md", "lg"] as const;

export function TagDemo() {
	const { theme } = useUnistyles();
	return (
		<View testID="k-demo-tag" style={demoStyles.routeContent}>
			<DemoBlock label="variants">
				<View style={demoStyles.componentRow}>
					{VARIANTS.map((variant) => (
						<Tag key={variant} variant={variant}>
							{variant}
						</Tag>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="colors (subtle)">
				<View style={demoStyles.componentRow}>
					{COLORS.map((color) => (
						<Tag key={color} variant="subtle" color={color}>
							{color}
						</Tag>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="sizes">
				<View style={demoStyles.componentRow}>
					{SIZES.map((size) => (
						<Tag key={size} size={size}>
							{size}
						</Tag>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="removable & icon">
				<View style={demoStyles.componentRow}>
					<Tag onRemove={() => undefined}>removable</Tag>
					<Tag
						variant="outline"
						icon={<Icon icon={Sun} size="xs" color={theme.foreground} />}
						onRemove={() => undefined}
					>
						icon + remove
					</Tag>
				</View>
			</DemoBlock>
			<DemoBlock label="slot overrides">
				<View style={demoStyles.componentRow}>
					<Tag>default</Tag>
					<Tag
						style={{ marginRight: 8 }}
						slotStyles={{
							root: {
								borderWidth: 2,
								borderColor: theme.destructive,
								backgroundColor: theme.background,
							},
						}}
					>
						slotStyles
					</Tag>
				</View>
			</DemoBlock>
		</View>
	);
}
