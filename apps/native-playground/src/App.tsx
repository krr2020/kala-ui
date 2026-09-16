import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useUnistyles } from "react-native-unistyles";
import { RouteShell } from "./route-shell";

// Shell only: routes and section state live in ./route-shell, demos in
// ./demos. Subscribing to the unistyles theme here re-renders the whole
// tree on a theme switch, so every route restyles with the shared sheet.
export default function App() {
	useUnistyles();
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<RouteShell />
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}
