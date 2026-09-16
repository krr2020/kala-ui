import { Text, View } from "react-native";
import { demoStyles } from "./stylesheet";

// One titled component group: a plain uppercase label (deliberately no
// testID/accessibilityLabel — the playground census pins marker literals
// exactly, and block titles are visual organization, not controls).
export function DemoBlock({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<View style={demoStyles.block}>
			<Text style={demoStyles.blockLabel}>{label}</Text>
			{children}
		</View>
	);
}
