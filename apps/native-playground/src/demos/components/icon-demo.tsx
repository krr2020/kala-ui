import { Icon } from "@kala-ui/react-native";
import { Bell, Check, Moon, Settings, Sun } from "lucide-react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
const COLORS = [
	"primary",
	"secondary",
	"destructive",
	"success",
	"warning",
	"info",
] as const;

export function IconDemo() {
	return (
		<View testID="k-demo-icons" style={demoStyles.routeContent}>
			<DemoBlock label="sizes">
				<View style={demoStyles.componentRow}>
					{SIZES.map((size) => (
						<Icon key={size} icon={Sun} size={size} />
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="colors">
				<View style={demoStyles.componentRow}>
					{COLORS.map((color) => (
						<Icon key={color} icon={Check} color={color} size="lg" />
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="any lucide icon">
				<View style={demoStyles.componentRow}>
					<Icon icon={Bell} size="lg" label="notifications" />
					<Icon icon={Moon} size="lg" />
					<Icon icon={Settings} size="lg" />
				</View>
			</DemoBlock>
		</View>
	);
}
