import { themeNames } from "@kala-ui/react-native/themes";
import { Pressable, Text, View } from "react-native";
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import { DemoBlock } from "./demo-block";
import { demoStyles, SWATCH_TOKENS } from "./stylesheet";

export function TokensDemo() {
	const { theme } = useUnistyles();
	const current = UnistylesRuntime.themeName;
	return (
		<>
			<DemoBlock label="theme picker">
				<View style={demoStyles.picker}>
					{themeNames.map((name) => {
						const active = name === current;
						return (
							<Pressable
								key={name}
								testID={`k-theme-${name}`}
								accessibilityRole="button"
								accessibilityLabel={`activate ${name} theme`}
								onPress={() => UnistylesRuntime.setTheme(name)}
								style={[demoStyles.chip, active && demoStyles.chipActive]}
							>
								<Text
									style={[
										demoStyles.chipText,
										active && demoStyles.chipTextActive,
									]}
								>
									{name}
								</Text>
							</Pressable>
						);
					})}
				</View>
			</DemoBlock>
			<DemoBlock label="palette">
				<View style={demoStyles.grid}>
					{SWATCH_TOKENS.map((token) => (
						<View
							key={token}
							testID={`k-swatch-${token}`}
							style={[
								demoStyles.swatch,
								// themes carry different key subsets (dark has no success), so
								// dynamic swatch lookup goes through a string-cast map view
								{
									backgroundColor: String(
										(theme as Record<string, string | number>)[token],
									),
								},
							]}
						>
							<Text style={demoStyles.swatchLabel}>{token}</Text>
						</View>
					))}
				</View>
			</DemoBlock>
		</>
	);
}
