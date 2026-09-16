import { useRef, useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import { componentGroups } from "./demos/components/registry";
import { demoStyles } from "./demos/stylesheet";

// themes whose backgrounds are dark → light status-bar icons
const DARK_THEMES = new Set(["dark", "dark-accent", "high-contrast-dark"]);

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
			edges={["top"]}
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
			<View style={demoStyles.chipRows}>
				<ScrollView
					horizontal
					style={demoStyles.routeBar}
					contentContainerStyle={demoStyles.picker}
					showsHorizontalScrollIndicator={false}
				>
					{componentGroups.map(({ name }, index) => {
						const on = index === groupIndex;
						return (
							<Pressable
								key={name}
								accessibilityRole="button"
								accessibilityLabel={`select ${name} group`}
								onPress={() => selectGroup(index)}
								style={[
									demoStyles.chip,
									demoStyles.groupChip,
									on && demoStyles.chipActive,
								]}
							>
								<Text
									style={[
										demoStyles.chipText,
										demoStyles.groupChipText,
										on && demoStyles.chipTextActive,
									]}
								>
									{name}
								</Text>
							</Pressable>
						);
					})}
				</ScrollView>
				<ScrollView
					ref={componentRow}
					horizontal
					style={demoStyles.routeBar}
					contentContainerStyle={demoStyles.picker}
					showsHorizontalScrollIndicator={false}
				>
					{group.components.map(({ name }, index) => {
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
									style={[demoStyles.chipText, on && demoStyles.chipTextActive]}
								>
									{name}
								</Text>
							</Pressable>
						);
					})}
				</ScrollView>
			</View>
			<ScrollView
				style={demoStyles.screen}
				contentContainerStyle={demoStyles.routeContent}
			>
				<Text style={demoStyles.current}>
					kala-ui · native — theme: {UnistylesRuntime.themeName}
				</Text>
				<Text style={demoStyles.sectionTitle}>
					{group.title} · {component.name}
				</Text>
				{preview()}
			</ScrollView>
		</SafeAreaView>
	);
}
