import { Label } from "@kala-ui/react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function LabelDemo() {
	return (
		<View testID="k-demo-label" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<Label>Email Address</Label>
				<Label>Card Number</Label>
			</DemoBlock>
			<DemoBlock label="Required">
				<Label required>Workspace Slug</Label>
				<Label>Display Name</Label>
			</DemoBlock>
			<DemoBlock label="Paired With Controls">
				<Label required>Invite Code</Label>
				<Label>Referral</Label>
			</DemoBlock>
			<DemoBlock label="Long Copy">
				<Label required>Automatic seat reconciliation window</Label>
				<Label>
					Quarterly rollover with prorated billing adjustments across workspaces
				</Label>
			</DemoBlock>
		</View>
	);
}
