import { themes } from "@kala-ui/react-native/themes";
import { StyleSheet } from "react-native-unistyles";

// Must run before any component renders. Unistyles 3.3 registers themes via
// StyleSheet.configure (UnistylesRegistry is no longer exported in 3.3).
// initialTheme instead of adaptiveThemes: this app's purpose is switching
// among ALL seven kala themes at runtime, and adaptiveThemes locks switching
// to the OS color scheme pair.
StyleSheet.configure({
	themes,
	settings: {
		initialTheme: "light",
	},
});
