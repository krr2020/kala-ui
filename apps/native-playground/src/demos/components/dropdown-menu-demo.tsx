import { DropdownMenu } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function DropdownMenuDemo() {
	const [autoSync, setAutoSync] = useState(true);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-dropdown-menu">
			<DemoBlock label="Row Actions">
				<View style={demoStyles.componentRow}>
					<DropdownMenu
						triggerLabel="actions"
						items={[
							{ type: "label", key: "l", label: "Row actions" },
							{
								type: "checkbox",
								key: "sync",
								label: "Auto-sync",
								checked: autoSync,
								onCheckedChange: setAutoSync,
							},
							{ key: "archive", label: "Archive" },
							{ key: "delete", label: "Delete", destructive: true },
						]}
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="With Separators">
				<View style={demoStyles.componentRow}>
					<DropdownMenu
						triggerLabel="sort by"
						items={[
							{ key: "recent", label: "Most recent" },
							{ key: "oldest", label: "Oldest first" },
							{ type: "separator", key: "sep" },
							{ key: "custom", label: "Custom order" },
						]}
					/>
				</View>
			</DemoBlock>
		</View>
	);
}
