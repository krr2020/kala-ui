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
				<Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
					<Collapsible.Trigger accessibilityLabel="Advanced Filters">
						Advanced Filters
					</Collapsible.Trigger>
					<Collapsible.Content>
						<KText size="sm" color="muted">
							only show verified sellers · min rating 4 · ships in 2 days
						</KText>
					</Collapsible.Content>
				</Collapsible>
				<KText size="sm" color="muted">
					state: {showAdvanced ? "open" : "closed"}
				</KText>
			</DemoBlock>
			<DemoBlock label="Uncontrolled — starts open">
				<Collapsible defaultOpen>
					<Collapsible.Trigger accessibilityLabel="Session details">
						Session details
					</Collapsible.Trigger>
					<Collapsible.Content>
						<KText size="sm" color="muted">
							starts open without local state; the trigger toggles it
						</KText>
					</Collapsible.Content>
				</Collapsible>
			</DemoBlock>
			<DemoBlock label="Inside a card-like row">
				<Collapsible>
					<Collapsible.Trigger accessibilityLabel="Show more">
						Show more
					</Collapsible.Trigger>
					<Collapsible.Content>
						<KText size="sm" color="muted">
							a bare collapsible defaults to closed and manages itself
						</KText>
					</Collapsible.Content>
				</Collapsible>
			</DemoBlock>
			<DemoBlock label="Disabled">
				<Collapsible disabled>
					<Collapsible.Trigger accessibilityLabel="Locked section">
						Locked section
					</Collapsible.Trigger>
					<Collapsible.Content>
						<KText size="sm" color="muted">
							never reachable while disabled
						</KText>
					</Collapsible.Content>
				</Collapsible>
			</DemoBlock>
		</View>
	);
}
