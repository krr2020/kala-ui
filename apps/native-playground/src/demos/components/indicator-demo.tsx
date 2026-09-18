import { Icon, Indicator, Text as KText } from "@kala-ui/react-native";
import { Sun } from "lucide-react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const COLORS = ["primary", "success", "destructive"] as const;

export function IndicatorDemo() {
	return (
		<View style={demoStyles.routeContent} testID="k-demo-indicator">
			<DemoBlock label="Badge Dots">
				<View style={demoStyles.componentRow}>
					<Indicator size={12} label="3">
						<Icon icon={Sun} size="md" />
					</Indicator>
					<Indicator color="success">
						<KText size="sm">online</KText>
					</Indicator>
					<Indicator color="destructive" processing size={12}>
						<KText size="sm">live</KText>
					</Indicator>
				</View>
			</DemoBlock>
			<DemoBlock label="Colors">
				<View style={demoStyles.componentRow}>
					{COLORS.map((color) => (
						<Indicator
							key={color}
							color={color}
							label={color === "primary" ? 7 : undefined}
						>
							<KText size="sm">{color}</KText>
						</Indicator>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Hidden And Bordered">
				<View style={demoStyles.componentRow}>
					<Indicator disabled label="0">
						<KText size="sm">disabled</KText>
					</Indicator>
					<Indicator withBorder color="destructive" label="!">
						<KText size="sm">bordered</KText>
					</Indicator>
				</View>
			</DemoBlock>
		</View>
	);
}
