import { Button } from "@kala-ui/react-native";
import { humanizeLabel } from "./registry";
import { Sun } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const VARIANTS = ["solid", "outline", "ghost", "subtle"] as const;
const COLORS = ["primary", "secondary", "destructive", "muted"] as const;
const SIZES = ["xs", "sm", "md", "lg"] as const;

export function ButtonDemo() {
	const { theme } = useUnistyles();
	const [count, setCount] = useState(0);
	return (
		<View testID="k-demo-button" style={demoStyles.routeContent}>
			<DemoBlock label="Variants">
				<View style={demoStyles.componentRow}>
					{VARIANTS.map((variant) => (
						<Button key={variant} variant={variant}>
							{humanizeLabel(variant)}
						</Button>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Colors (Solid)">
				<View style={demoStyles.componentRow}>
					{COLORS.map((color) => (
						<Button key={color} color={color}>
							{humanizeLabel(color)}
						</Button>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Sizes">
				<View style={demoStyles.componentRow}>
					{SIZES.map((size) => (
						<Button key={size} size={size}>
							{humanizeLabel(size)}
						</Button>
					))}
					<Button size="icon" accessibilityLabel="sun button">
						<Sun size={18} color={theme.primaryForeground} />
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="Width & Shape">
				<Button fullWidth>Full Width</Button>
				<Button rounded>Rounded</Button>
			</DemoBlock>
			<DemoBlock label="States">
				<View style={demoStyles.componentRow}>
					<Button isLoading>Loading</Button>
					<Button disabled>Disabled</Button>
					<Button variant="outline" disabled>
						Disabled Outline
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="Press Feedback">
				<Button
					accessibilityLabel="press me"
					onPress={() => setCount((n) => n + 1)}
				>
					Press Me
				</Button>
				<Text style={demoStyles.current}>Pressed {count} Times</Text>
				<Button disabled onPress={() => setCount((n) => n + 1)}>
					Disabled — No Count
				</Button>
			</DemoBlock>
		</View>
	);
}
