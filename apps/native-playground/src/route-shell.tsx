import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import { AppChromeDemo } from "./demos/app-chrome-demo";
import { BasicsDemo } from "./demos/basics-demo";
import { ChartsDemo } from "./demos/charts-demo";
import { DataTableDemo } from "./demos/data-table-demo";
import { componentDemos } from "./demos/components/registry";
import { FeedbackDemo } from "./demos/feedback-demo";
import { NavigationDemo } from "./demos/navigation-demo";
import { OverlaysDemo } from "./demos/overlays-demo";
import { demoStyles } from "./demos/stylesheet";
import { TokensDemo } from "./demos/tokens-demo";

const GROUP_ROUTES = [
	{ name: "tokens", title: "Tokens & Theming", render: () => <TokensDemo /> },
	{
		name: "app chrome",
		title: "App Chrome",
		render: () => <AppChromeDemo />,
	},
	{ name: "charts", title: "Charts & Metrics", render: () => <ChartsDemo /> },
	{
		name: "data table",
		title: "Data Table",
		render: () => <DataTableDemo />,
	},
	{ name: "basics", title: "Basics", render: () => <BasicsDemo /> },
	{
		name: "feedback",
		title: "Forms & Feedback",
		render: () => <FeedbackDemo />,
	},
	{
		name: "navigation",
		title: "Navigation & Controls",
		render: () => <NavigationDemo />,
	},
	{
		name: "overlays",
		title: "Overlays & Menus",
		render: () => <OverlaysDemo />,
	},
] as const;

const ROUTES = [
	...GROUP_ROUTES,
	...componentDemos.map(({ name, title, render }) => ({
		name,
		title,
		render,
	})),
] as const;

// Route state lives here (not App.tsx) so the app shell stays stateless
// while each demo screen renders in isolation — one concern per screen.
export function RouteShell() {
	useUnistyles();
	const [route, setRoute] = useState<(typeof ROUTES)[number]["name"]>(
		ROUTES[0].name,
	);
	const active = ROUTES.find((r) => r.name === route) ?? ROUTES[0];
	return (
		<SafeAreaView style={{ flex: 1 }} edges={["top"]}>
			<View style={{ flex: 1 }}>
				<ScrollView
					horizontal
					style={demoStyles.routeBar}
					contentContainerStyle={demoStyles.picker}
					showsHorizontalScrollIndicator={false}
				>
					{ROUTES.map(({ name }) => {
						const on = name === route;
						return (
							<Pressable
								key={name}
								accessibilityRole="button"
								accessibilityLabel={`open ${name} demo`}
								onPress={() => setRoute(name)}
								style={[demoStyles.chip, on && demoStyles.chipActive]}
							>
								<Text
									style={[demoStyles.chipText, on && demoStyles.chipTextActive]}
								>
									{name}
								</Text>
							</Pressable>
						);
					})}
				</ScrollView>
				<ScrollView
					style={demoStyles.screen}
					contentContainerStyle={demoStyles.routeContent}
				>
					<Text style={demoStyles.current}>
						kala-ui · native — theme: {UnistylesRuntime.themeName}
					</Text>
					<Text style={demoStyles.sectionTitle}>{active.title}</Text>
					{active.render()}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}
