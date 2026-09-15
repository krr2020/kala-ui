import { AppShell, Header, TabBar } from "@kala-ui/react-native-app";
import { Home, Search, User } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { demoStyles } from "./stylesheet";

const TABS = [
	{ value: "home", label: "Home", icon: Home },
	{ value: "search", label: "Search", icon: Search },
	{ value: "profile", label: "Profile", icon: User },
];

export function AppChromeDemo() {
	const [tab, setTab] = useState("home");

	return (
		<View style={demoStyles.componentRow} testID="k-demo-app-shell">
			<AppShell
				header={
					<Header
						title="app chrome"
						onBack={() => undefined}
						backLabel="go back"
						actions={[{ label: "search", onPress: () => undefined }]}
					/>
				}
				tabBar={<TabBar items={TABS} value={tab} onChange={setTab} />}
			>
				<Text style={demoStyles.current}>tab: {tab}</Text>
			</AppShell>
		</View>
	);
}
