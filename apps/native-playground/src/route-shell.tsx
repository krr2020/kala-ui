import { themeNames } from "@kala-ui/react-native/themes";
import { ScreenStack } from "@kala-ui/react-native-app";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import type { ComponentGroup } from "./demos/components/registry";
import { componentGroups, humanizeLabel } from "./demos/components/registry";
import { demoStyles } from "./demos/stylesheet";

// themes whose backgrounds are dark → light status-bar icons
const DARK_THEMES = new Set(["dark", "high-contrast-dark"]);

type Screen = "landing" | "list" | "group";
type Source = "library" | "app";

const ROUTE_TITLES: Record<Source, string> = {
	library: "Native Components",
	app: "Native App Components",
};

const groupsOf = (source: Source): ComponentGroup[] =>
	componentGroups.filter(({ source: entrySource }) => entrySource === source);

// Three-screen stack: landing (package routes) → group list (one source) →
// group screen (pinned theme switcher + that group's component chips +
// preview). ScreenStack animates every push/pop and handles Android
// hardware back (one level per press; at landing it falls through to the
// OS). App.tsx stays stateless per the seam contract.
export function RouteShell() {
	useUnistyles();
	const [screen, setScreen] = useState<Screen>("landing");
	const [routeSource, setRouteSource] = useState<Source>("library");
	const [groupIndex, setGroupIndex] = useState(0);
	const [componentIndex, setComponentIndex] = useState(0);
	const componentRow = useRef<ScrollView>(null);
	const { theme } = useUnistyles();

	const group = componentGroups[groupIndex] ?? componentGroups[0];
	const component = group.components[componentIndex] ?? group.components[0];
	const preview = component.render ?? group.overview;

	// opening a group always lands on its first component — a componentIndex
	// carried over from a previously visited group would render an
	// out-of-group preview under the new heading
	const openGroup = (index: number): void => {
		setGroupIndex(index);
		setComponentIndex(0);
		componentRow.current?.scrollTo({ x: 0, animated: false });
		setScreen("group");
	};

	const selectComponent = (index: number): void => {
		setComponentIndex(index);
	};

	const goBack = (): void => {
		setScreen(screen === "group" ? "list" : "landing");
	};

	const renderCardHead = (caption: string): React.JSX.Element => (
		<View style={demoStyles.landingCardHead}>
			<Text style={[demoStyles.sectionHeader, demoStyles.sectionHeaderText]}>
				{caption}
			</Text>
			<ChevronRight size={18} color={theme.mutedForeground} />
		</View>
	);

	const renderCardMeta = (groups: ComponentGroup[]): string =>
		`${groups.length} groups · ${groups.reduce(
			(n, g) => n + g.components.length,
			0,
		)} components`;

	const renderLanding = (): React.JSX.Element => (
		<ScrollView
			style={demoStyles.screen}
			contentContainerStyle={demoStyles.routeContent}
		>
			<View testID="k-landing-root" style={demoStyles.landingHero}>
				<Text style={demoStyles.title}>Kala UI</Text>
				<Text style={demoStyles.current}>
					Native playground · themes, tokens and components
				</Text>
			</View>
			<Pressable
				testID="k-landing-library"
				accessibilityRole="button"
				accessibilityLabel="open native components"
				onPress={() => {
					setRouteSource("library");
					setScreen("list");
				}}
				style={demoStyles.landingCard}
			>
				{renderCardHead("Components")}
				<Text style={demoStyles.landingCardTitle}>{ROUTE_TITLES.library}</Text>
				<Text style={demoStyles.landingCardMeta}>
					{renderCardMeta(groupsOf("library"))}
				</Text>
			</Pressable>
			<Pressable
				testID="k-landing-app"
				accessibilityRole="button"
				accessibilityLabel="open native app components"
				onPress={() => {
					setRouteSource("app");
					setScreen("list");
				}}
				style={[demoStyles.landingCard, demoStyles.appChip]}
			>
				{renderCardHead("App Components")}
				<Text style={[demoStyles.landingCardTitle, demoStyles.appChipText]}>
					{ROUTE_TITLES.app}
				</Text>
				<Text style={demoStyles.landingCardMeta}>
					{renderCardMeta(groupsOf("app"))}
				</Text>
			</Pressable>
		</ScrollView>
	);

	const renderBackButton = (
		marker: "k-back-home" | "k-back-groups",
	): React.JSX.Element => {
		const home = marker === "k-back-home";
		return (
			<Pressable
				testID={home ? "k-back-home" : "k-back-groups"}
				accessibilityRole="button"
				accessibilityLabel={home ? "back to home" : "back to groups"}
				onPress={goBack}
				style={home ? demoStyles.backButton : demoStyles.pinnedBackRow}
			>
				<ChevronLeft size={18} color={theme.foreground} />
				<Text style={demoStyles.backLabel}>
					{home ? "Back To Home" : "Back To Groups"}
				</Text>
			</Pressable>
		);
	};
	const renderGroupList = (): React.JSX.Element => {
		const entries = componentGroups
			.map((entry, index) => ({ entry, index }))
			.filter(({ entry: { source } }) => source === routeSource);
		return (
			<ScrollView
				style={demoStyles.screen}
				contentContainerStyle={demoStyles.routeContent}
			>
				<View testID="k-group-list-root" style={demoStyles.listColumn}>
					{renderBackButton("k-back-home")}
					<Text style={demoStyles.sectionTitle}>
						{ROUTE_TITLES[routeSource]}
					</Text>
					{entries.map(({ entry, index }) => (
						<Pressable
							key={entry.name}
							testID={`k-group-row-${entry.name}`}
							accessibilityRole="button"
							accessibilityLabel={`open ${entry.name} group`}
							onPress={() => openGroup(index)}
							style={[
								demoStyles.landingCard,
								entry.source === "app" && demoStyles.appChip,
							]}
						>
							<View style={demoStyles.landingCardHead}>
								<Text style={demoStyles.listRowTitle}>{entry.title}</Text>
								<ChevronRight size={18} color={theme.mutedForeground} />
							</View>
							<Text style={demoStyles.landingCardMeta}>
								{entry.components.length} components
							</Text>
						</Pressable>
					))}
				</View>
			</ScrollView>
		);
	};

	const renderGroup = (): React.JSX.Element => (
		<>
			{/* fixed header tiers — back navigation and the theme switcher
			never scroll away; every preview can restyle without scrolling.
			Stateless via the unistyles runtime; App.tsx's subscription
			re-renders the whole tree */}
			{renderBackButton("k-back-groups")}
			<View style={demoStyles.rowDivider} />
			<View style={demoStyles.themeRow}>
				<Text style={[demoStyles.sectionHeader, demoStyles.sectionHeaderText]}>
					Theme
				</Text>
				<ScrollView
					horizontal
					style={demoStyles.themeScroll}
					contentContainerStyle={[demoStyles.picker, demoStyles.chipRowContent]}
					showsHorizontalScrollIndicator={false}
				>
					{themeNames.map((name) => {
						const active = name === UnistylesRuntime.themeName;
						return (
							<Pressable
								key={name}
								testID={`k-theme-${name}`}
								accessibilityRole="button"
								accessibilityLabel={`activate ${name} theme`}
								onPress={() => UnistylesRuntime.setTheme(name)}
								style={[
									demoStyles.chip,
									demoStyles.filterChip,
									active && demoStyles.chipActive,
								]}
							>
								<Text
									style={[
										demoStyles.chipText,
										active && demoStyles.chipTextActive,
									]}
								>
									{humanizeLabel(name)}
								</Text>
							</Pressable>
						);
					})}
				</ScrollView>
			</View>
			<View style={demoStyles.rowDivider} />
			{/* the component chips lead the scroll content — the header owns
			the fixed tiers, so the chips sit flush under it and long demos
			get the full screen */}
			<ScrollView
				testID="k-group-root"
				style={demoStyles.screen}
				contentContainerStyle={demoStyles.previewContent}
			>
				<View style={demoStyles.chipRows}>
					<ScrollView
						ref={componentRow}
						horizontal
						style={demoStyles.routeBar}
						contentContainerStyle={[
							demoStyles.picker,
							demoStyles.chipRowContent,
						]}
						showsHorizontalScrollIndicator={false}
					>
						{group.components.map(({ name, label }, index) => {
							const on = index === componentIndex;
							return (
								<Pressable
									key={`${group.name}-${name}`}
									accessibilityRole="button"
									accessibilityLabel={`show ${name} preview`}
									onPress={() => selectComponent(index)}
									style={[
										demoStyles.chip,
										demoStyles.filterChip,
										on && demoStyles.chipActive,
									]}
								>
									<Text
										style={[
											demoStyles.chipText,
											on && demoStyles.chipTextActive,
										]}
									>
										{label}
									</Text>
								</Pressable>
							);
						})}
					</ScrollView>
				</View>
				<Text style={demoStyles.sectionTitle}>
					{group.title} · {component.label}
				</Text>
				{preview()}
			</ScrollView>
		</>
	);

	// stack shape mirrors the screen state so ScreenStack diffs pushes/pops;
	// covered screens stay mounted, so each group's scroll and chip selection
	// survive the round trip
	const stackEntries = [
		{ key: "landing", children: renderLanding() },
		...(screen === "list" || screen === "group"
			? [{ key: "list", children: renderGroupList() }]
			: []),
		...(screen === "group" ? [{ key: "group", children: renderGroup() }] : []),
	];

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: theme.background }}
			edges={["top", "bottom"]}
		>
			<StatusBar
				translucent
				backgroundColor="transparent"
				barStyle={
					DARK_THEMES.has(UnistylesRuntime.themeName ?? "")
						? "light-content"
						: "dark-content"
				}
			/>
			<ScreenStack entries={stackEntries} onRequestPop={goBack} />
		</SafeAreaView>
	);
}
