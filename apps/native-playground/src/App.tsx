import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Check, Sun } from "lucide-react-native";
import {
	StyleSheet,
	UnistylesRuntime,
	useUnistyles,
} from "react-native-unistyles";
import { Button, Icon, Sheet } from "@kala-ui/react-native";
import { themeNames } from "@kala-ui/react-native/themes";

const SWATCH_TOKENS = [
	"background",
	"foreground",
	"card",
	"primary",
	"secondary",
	"muted",
	"accent",
	"destructive",
	"success",
	"warning",
	"error",
	"info",
] as const;

// Direct `stylesheet.x` access works because the unistyles babel plugin
// rewrites it to register dependencies (no explicit theme pass needed).
const stylesheet = StyleSheet.create((theme) => ({
	screen: {
		flex: 1,
		backgroundColor: theme.background,
		paddingTop: 64,
		paddingBottom: 32,
		paddingHorizontal: 16,
		gap: 16,
	},
	title: {
		color: theme.foreground,
		fontSize: 24,
		fontWeight: "700",
	},
	current: {
		color: theme.mutedForeground,
		fontSize: 14,
	},
	picker: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	chip: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: theme.border,
		backgroundColor: theme.card,
	},
	chipText: {
		color: theme.foreground,
		fontSize: 13,
	},
	chipActive: {
		backgroundColor: theme.primary,
		borderColor: theme.primary,
	},
	chipTextActive: {
		color: theme.primaryForeground,
		fontWeight: "600",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	swatch: {
		width: "30%",
		aspectRatio: "1.6",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: theme.border,
		justifyContent: "flex-end",
	},
	swatchLabel: {
		color: theme.foreground,
		fontSize: 11,
		textAlign: "center",
		paddingBottom: 6,
	},
	sectionTitle: {
		color: theme.foreground,
		fontSize: 18,
		fontWeight: "600",
	},
	componentRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		gap: 8,
	},
}));

export default function App() {
	const { theme } = useUnistyles();
	const current = UnistylesRuntime.themeName;
	const [sheetOpen, setSheetOpen] = useState(false);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ScrollView style={stylesheet.screen} contentContainerStyle={{ gap: 16 }}>
				<Text style={stylesheet.title}>kala-ui · native tokens</Text>
				<Text style={stylesheet.current}>theme: {current}</Text>
				<View style={stylesheet.picker}>
					{themeNames.map((name) => {
						const active = name === current;
						return (
							<Pressable
								key={name}
								testID={`k-theme-${name}`}
								accessibilityRole="button"
								accessibilityLabel={`activate ${name} theme`}
								onPress={() => UnistylesRuntime.setTheme(name)}
								style={[stylesheet.chip, active && stylesheet.chipActive]}
							>
								<Text
									style={[
										stylesheet.chipText,
										active && stylesheet.chipTextActive,
									]}
								>
									{name}
								</Text>
							</Pressable>
						);
					})}
				</View>
				<View style={stylesheet.grid}>
					{SWATCH_TOKENS.map((token) => (
						<View
							key={token}
							testID={`k-swatch-${token}`}
							style={[
								stylesheet.swatch,
								// themes carry different key subsets (dark has no success), so
								// dynamic swatch lookup goes through a string-cast map view
								{
									backgroundColor: String(
										(theme as Record<string, string | number>)[token],
									),
								},
							]}
						>
							<Text style={stylesheet.swatchLabel}>{token}</Text>
						</View>
					))}
				</View>
				<Text style={stylesheet.sectionTitle}>components</Text>
				<View style={stylesheet.componentRow} testID="k-demo-buttons">
					<Button
						onPress={() => setSheetOpen(true)}
						accessibilityLabel="open demo sheet"
					>
						<Icon icon={Check} size="xs" color="primaryForeground" />
						open sheet
					</Button>
					<Button variant="outline" color="secondary">
						outline
					</Button>
					<Button variant="ghost" color="destructive">
						ghost
					</Button>
					<Button variant="subtle" color="muted" size="sm">
						subtle
					</Button>
					<Button variant="link" size="sm">
						link
					</Button>
					<Button size="icon" accessibilityLabel="sun">
						<Icon icon={Sun} size="sm" />
					</Button>
				</View>
				<View style={stylesheet.componentRow} testID="k-demo-icons">
					{(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
						<Icon key={size} icon={Sun} size={size} />
					))}
				</View>
				<Sheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
					<Sheet.Body>
						<Text style={stylesheet.current}>
							Bottom sheet — press the overlay or drag to dismiss.
						</Text>
						<Button fullWidth onPress={() => setSheetOpen(false)}>
							done
						</Button>
					</Sheet.Body>
				</Sheet>
			</ScrollView>
		</GestureHandlerRootView>
	);
}
