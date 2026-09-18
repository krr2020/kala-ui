import { Collapsible, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function CollapsibleDemo() {
	const [showAdvanced, setShowAdvanced] = useState(false);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-collapsible">
			<DemoBlock label="Controlled">
				<View style={demoStyles.componentRow}>
					<Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
						<Collapsible.Trigger>advanced filters</Collapsible.Trigger>
						<Collapsible.Content>
							<KText size="sm" color="muted">
								only show verified sellers
							</KText>
						</Collapsible.Content>
					</Collapsible>
				</View>
			</DemoBlock>
			<DemoBlock label="Uncontrolled">
				<Collapsible defaultOpen>
					<Collapsible.Trigger>session details</Collapsible.Trigger>
					<Collapsible.Content>
						<KText size="sm" color="muted">
							starts unmounted-open; the trigger toggles it without state
						</KText>
					</Collapsible.Content>
				</Collapsible>
			</DemoBlock>
		</View>
	);
}
