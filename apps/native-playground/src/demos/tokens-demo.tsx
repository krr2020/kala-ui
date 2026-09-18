import { Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { DemoBlock } from "./demo-block";
import { demoStyles, SWATCH_TOKENS } from "./stylesheet";

// Palette only — the theme picker lives in the shell header so every
// preview can switch themes without returning to this route.
export function TokensDemo() {
	const { theme } = useUnistyles();
	return (
		<>
			<View testID="k-demo-theming">
				<DemoBlock label="Palette">
					<View style={demoStyles.grid}>
						{SWATCH_TOKENS.map((token) => (
							<View
								key={token}
								testID={`k-swatch-${token}`}
								style={[
									demoStyles.swatch,
									// dynamic token lookup — the parity tests pin that every
									// swatch token resolves to a hex in all themes
									{
										backgroundColor: String(theme[token]),
									},
								]}
							>
								<Text style={demoStyles.swatchLabel}>{token}</Text>
							</View>
						))}
					</View>
				</DemoBlock>
			</View>
		</>
	);
}
