import { Text as KText } from "@kala-ui/react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
const WEIGHTS = [
	"thin",
	"light",
	"normal",
	"medium",
	"semibold",
	"bold",
	"extrabold",
] as const;
const COLORS = [
	"primary",
	"secondary",
	"destructive",
	"success",
	"warning",
	"info",
	"muted",
] as const;

export function TextDemo() {
	return (
		<View testID="k-demo-text" style={demoStyles.routeContent}>
			<DemoBlock label="sizes">
				<View style={demoStyles.block}>
					{SIZES.map((size) => (
						<KText key={size} size={size}>
							size {size}
						</KText>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="weights">
				<View style={demoStyles.block}>
					{WEIGHTS.map((weight) => (
						<KText key={weight} weight={weight}>
							weight {weight}
						</KText>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="colors">
				<View style={demoStyles.componentRow}>
					{COLORS.map((color) => (
						<KText key={color} color={color} size="sm">
							{color}
						</KText>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="align & truncate">
				<View style={demoStyles.block}>
					<KText align="left" color="muted">
						align left
					</KText>
					<KText align="center" color="muted">
						align center
					</KText>
					<KText align="right" color="muted">
						align right
					</KText>
					<KText truncate>
						truncated line that clamps with a tail ellipsis
					</KText>
				</View>
			</DemoBlock>
		</View>
	);
}
