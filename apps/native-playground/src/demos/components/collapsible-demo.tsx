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
						<Collapsible.Trigger>
							advanced filters {showAdvanced ? "(open)" : "(closed)"}
						</Collapsible.Trigger>
						<Collapsible.Content>
							<KText size="sm" color="muted">
								only show verified sellers · min rating 4 · ships in 2 days
							</KText>
						</Collapsible.Content>
					</Collapsible>
				</View>
			</DemoBlock>
			<DemoBlock label="Uncontrolled — starts open">
				<Collapsible defaultOpen>
					<Collapsible.Trigger>session details</Collapsible.Trigger>
					<Collapsible.Content>
						<KText size="sm" color="muted">
							starts open without local state; the trigger toggles it
						</KText>
					</Collapsible.Content>
				</Collapsible>
			</DemoBlock>
			<DemoBlock label="Inside a card-like row">
				<View style={demoStyles.componentRow}>
					<Collapsible>
						<Collapsible.Trigger>show more</Collapsible.Trigger>
						<Collapsible.Content>
							<KText size="sm" color="muted">
								a bare collapsible defaults to closed and manages itself
							</KText>
						</Collapsible.Content>
					</Collapsible>
				</View>
			</DemoBlock>
		</View>
	);
}
