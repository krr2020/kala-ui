import { ScrollView, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import { AppChromeDemo } from "./demos/app-chrome-demo";
import { BasicsDemo } from "./demos/basics-demo";
import { ChartsDemo } from "./demos/charts-demo";
import { DataTableDemo } from "./demos/data-table-demo";
import { FeedbackDemo } from "./demos/feedback-demo";
import { NavigationDemo } from "./demos/navigation-demo";
import { OverlaysDemo } from "./demos/overlays-demo";
import { demoStyles } from "./demos/stylesheet";
import { TokensDemo } from "./demos/tokens-demo";

// Shell only: sections live in ./demos, each owning its own state.
// Subscribing to the unistyles theme here re-renders the whole tree on
// a theme switch, so every demo row restyles with the shared stylesheet.
export default function App() {
	useUnistyles();
	const current = UnistylesRuntime.themeName;
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ScrollView style={demoStyles.screen} contentContainerStyle={{ gap: 16 }}>
				<Text style={demoStyles.title}>kala-ui · native tokens</Text>
				<Text style={demoStyles.current}>theme: {current}</Text>
				<Text style={demoStyles.sectionTitle}>components</Text>
				<TokensDemo />
				<AppChromeDemo />
				<ChartsDemo />
				<DataTableDemo />
				<BasicsDemo />
				<FeedbackDemo />
				<NavigationDemo />
				<OverlaysDemo />
			</ScrollView>
		</GestureHandlerRootView>
	);
}
