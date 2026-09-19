import { DropdownMenu, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function DropdownMenuDemo() {
	const [autoSync, setAutoSync] = useState(true);
	const [sortBy, setSortBy] = useState("recent");
	const [lastAction, setLastAction] = useState("none");
	return (
		<View style={demoStyles.routeContent} testID="k-demo-dropdown-menu">
			<DemoBlock label="Actions — labels, separators, destructive">
				<View style={demoStyles.componentRow}>
					<DropdownMenu
						triggerLabel="actions"
						items={[
							{ type: "label", key: "l", label: "Row actions" },
							{
								key: "pin",
								label: "Pin to top",
								onSelect: () => setLastAction("pin"),
							},
							{ type: "separator", key: "sep1" },
							{
								key: "archive",
								label: "Archive",
								onSelect: () => setLastAction("archive"),
							},
							{
								key: "delete",
								label: "Delete",
								destructive: true,
								onSelect: () => setLastAction("delete"),
							},
						]}
					/>
				</View>
				<KText size="sm" color="muted">
					last action: {lastAction}
				</KText>
			</DemoBlock>
			<DemoBlock label="Checkbox + radio state">
				<View style={demoStyles.componentRow}>
					<DropdownMenu
						triggerLabel="view options"
						items={[
							{
								type: "checkbox",
								key: "sync",
								label: "Auto-sync",
								checked: autoSync,
								onCheckedChange: setAutoSync,
							},
							{ type: "separator", key: "sep" },
							{
								type: "radio",
								key: "r-recent",
								label: "Most recent",
								checked: sortBy === "recent",
								onCheckedChange: () => setSortBy("recent"),
							},
							{
								type: "radio",
								key: "r-oldest",
								label: "Oldest first",
								checked: sortBy === "oldest",
								onCheckedChange: () => setSortBy("oldest"),
							},
						]}
					/>
				</View>
				<KText size="sm" color="muted">
					auto-sync {autoSync ? "on" : "off"} · sort {sortBy}
				</KText>
			</DemoBlock>
			<DemoBlock label="Disabled rows">
				<View style={demoStyles.componentRow}>
					<DropdownMenu
						triggerLabel="sort by"
						items={[
							{ key: "recent", label: "Most recent" },
							{ key: "oldest", label: "Oldest first", disabled: true },
							{ type: "separator", key: "sep" },
							{ key: "custom", label: "Custom order" },
						]}
					/>
				</View>
			</DemoBlock>
		</View>
	);
}
