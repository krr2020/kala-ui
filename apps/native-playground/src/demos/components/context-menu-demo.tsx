import { ContextMenu, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function ContextMenuDemo() {
	const [lastAction, setLastAction] = useState("none");
	return (
		<View style={demoStyles.routeContent} testID="k-demo-context-menu">
			<DemoBlock label="Long Press Target">
				<View style={demoStyles.componentRow}>
					<ContextMenu
						items={[
							{
								key: "copy",
								label: "Copy",
								onSelect: () => setLastAction("copy"),
							},
							{
								key: "remove",
								label: "Remove",
								destructive: true,
								onSelect: () => setLastAction("remove"),
							},
						]}
					>
						<KText size="sm" color="muted">
							long-press me — last action: {lastAction}
						</KText>
					</ContextMenu>
				</View>
			</DemoBlock>
		</View>
	);
}
