import { themes } from "@kala-ui/react-native/themes";
import { StyleSheet } from "react-native-unistyles";

// Must run before any component renders. Unistyles 3.3 registers themes via
// StyleSheet.configure (UnistylesRegistry is no longer exported in 3.3).
// initialTheme instead of adaptiveThemes: this app's purpose is switching
// among the kala themes at runtime, and adaptiveThemes locks switching
// to the OS color scheme pair.
//
// No stale-theme guard is needed: Unistyles does not persist theme names —
// every launch starts a fresh JS context where initialTheme is
// authoritative. A removed theme (e.g. dark-accent) can therefore never be
// restored into the runtime; verified by updating the app over an install
// that was last left in dark-accent — it launches in light, no crash.
StyleSheet.configure({
	themes,
	settings: {
		initialTheme: "light",
	},
});
