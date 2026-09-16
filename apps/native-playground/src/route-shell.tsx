import { themeNames } from "@kala-ui/react-native/themes";
import { useRef, useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import type { ComponentGroup } from "./demos/components/registry";
import { componentGroups, humanizeLabel } from "./demos/components/registry";
import { demoStyles } from "./demos/stylesheet";

// themes whose backgrounds are dark → light status-bar icons
const DARK_THEMES = new Set(["dark", "high-contrast-dark"]);

// Two-row filter navigation: row 1 picks a group, row 2 picks a
// component inside it. Selecting a group auto-selects its first
// component and rewinds the component row so the active chip is
// visible. App.tsx stays stateless per the seam contract.
export function RouteShell() {
	useUnistyles();
	const [groupIndex, setGroupIndex] = useState(0);
	const [componentIndex, setComponentIndex] = useState(0);
	const componentRow = useRef<ScrollView>(null);

	const group = componentGroups[groupIndex] ?? componentGroups[0];
	const component = group.components[componentIndex] ?? group.components[0];
	const preview = component.render ?? group.overview;
	const { theme } = useUnistyles();

	// group row is segregated by backing package — standard library
	// components first, @kala-ui/react-native-app composites after a
	// second header; indexes stay positional into componentGroups.
	const groupEntries = (source: "library" | "app") =>
		componentGroups
			.map((entry, index) => ({ entry, index }))
			.filter(({ entry }) => entry.source === source);

	const renderGroupChip = ({
		entry,
		index,
	}: {
		entry: ComponentGroup;
		index: number;
	}): React.JSX.Element => {
		const on = index === groupIndex;
		const app = entry.source === "app";
		const { name, label } = entry;
		return (
			<Pressable
				key={name}
				accessibilityRole="button"
				accessibilityLabel={`select ${name} group`}
				onPress={() => selectGroup(index)}
				style={[
					demoStyles.chip,
					demoStyles.groupChip,
					app && demoStyles.appChip,
					on && demoStyles.chipActive,
				]}
			>
				<Text
					style={[
						demoStyles.chipText,
						demoStyles.groupChipText,
						app && demoStyles.appChipText,
						on && demoStyles.chipTextActive,
					]}
				>
					{label}
				</Text>
			</Pressable>
		);
	};

	const selectGroup = (index: number): void => {
		setGroupIndex(index);
		setComponentIndex(0);
		componentRow.current?.scrollTo({ x: 0, animated: false });
	};

	const selectComponent = (index: number): void => {
		setComponentIndex(index);
	};

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
			{/* persistent theme switcher — first pinned header tier, above
			the navigation rows; every preview can restyle without scrolling.
			Stateless via the unistyles runtime; App.tsx's subscription
			re-renders the whole tree */}
			<View style={demoStyles.themeRow}>
				<Text style={[demoStyles.sectionHeader, demoStyles.sectionHeaderText]}>
					Theme
				</Text>
				<ScrollView
					horizontal
					style={demoStyles.routeBar}
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
			{/* only the theme row is pinned; the group/component rows scroll
			away with the preview so long demos get the full screen */}
			<ScrollView
				style={demoStyles.screen}
				contentContainerStyle={demoStyles.routeContent}
			>
				<View style={demoStyles.chipRows}>
					<ScrollView
						horizontal
						style={demoStyles.routeBar}
						contentContainerStyle={[
							demoStyles.picker,
							demoStyles.chipRowContent,
						]}
						showsHorizontalScrollIndicator={false}
					>
						{groupEntries("library").length > 0 && (
							<View style={demoStyles.segment}>
								<Text
									style={[
										demoStyles.sectionHeader,
										demoStyles.sectionHeaderText,
									]}
									accessibilityRole="header"
									accessibilityLabel="library components section"
								>
									Components
								</Text>
								{groupEntries("library").map(renderGroupChip)}
							</View>
						)}
						{groupEntries("app").length > 0 && (
							<View style={demoStyles.segment}>
								<Text
									style={[
										demoStyles.sectionHeader,
										demoStyles.sectionHeaderText,
									]}
									accessibilityRole="header"
									accessibilityLabel="app components section"
								>
									App Components
								</Text>
								{groupEntries("app").map(renderGroupChip)}
							</View>
						)}
					</ScrollView>
					<View style={demoStyles.rowDivider} />
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
				<Text style={demoStyles.current}>Kala UI · Native</Text>
				<Text style={demoStyles.sectionTitle}>
					{group.title} · {component.label}
				</Text>
				{preview()}
			</ScrollView>
		</SafeAreaView>
	);
}
