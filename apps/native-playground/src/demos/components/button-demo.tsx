import { Button } from "@kala-ui/react-native";
import { Sun } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const VARIANTS = ["solid", "outline", "ghost", "subtle", "link"] as const;
const COLORS = ["primary", "secondary", "destructive", "muted"] as const;
const SIZES = ["xs", "sm", "md", "lg"] as const;

export function ButtonDemo() {
	const { theme } = useUnistyles();
	const [count, setCount] = useState(0);
	return (
		<View testID="k-demo-button" style={demoStyles.routeContent}>
			<DemoBlock label="variants">
				<View style={demoStyles.componentRow}>
					{VARIANTS.map((variant) => (
						<Button key={variant} variant={variant}>
							{variant}
						</Button>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="colors (solid)">
				<View style={demoStyles.componentRow}>
					{COLORS.map((color) => (
						<Button key={color} color={color}>
							{color}
						</Button>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="sizes">
				<View style={demoStyles.componentRow}>
					{SIZES.map((size) => (
						<Button key={size} size={size}>
							{size}
						</Button>
					))}
					<Button size="icon" accessibilityLabel="sun button">
						<Sun size={18} color={theme.foreground} />
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="width & shape">
				<Button fullWidth>full width</Button>
				<Button rounded>rounded</Button>
			</DemoBlock>
			<DemoBlock label="states">
				<View style={demoStyles.componentRow}>
					<Button isLoading>loading</Button>
					<Button disabled>disabled</Button>
					<Button variant="outline" disabled>
						disabled outline
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="press feedback">
				<Button
					accessibilityLabel="press me"
					onPress={() => setCount((n) => n + 1)}
				>
					press me
				</Button>
				<Text style={demoStyles.current}>pressed {count} times</Text>
				<Button disabled onPress={() => setCount((n) => n + 1)}>
					disabled — no count
				</Button>
			</DemoBlock>
		</View>
	);
}
