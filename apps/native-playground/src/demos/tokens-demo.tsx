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
			<DemoBlock label="palette">
				<View style={demoStyles.grid}>
					{SWATCH_TOKENS.map((token) => (
						<View
							key={token}
							testID={`k-swatch-${token}`}
							style={[
								demoStyles.swatch,
								// dynamic token lookup needs a string-keyed view of the theme
								// object — the parity tests pin that every swatch token
								// resolves to a hex in all themes
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
