import { Alert, Button, Text as KText } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";
import { humanizeLabel } from "./label";

const VARIANTS = ["solid", "outline", "subtle"] as const;
const COLORS = [
	"primary",
	"secondary",
	"destructive",
	"success",
	"warning",
	"info",
	"muted",
] as const;

export function AlertDemo(): ReactElement {
	const [dismissed, setDismissed] = useState(0);
	const [visible, setVisible] = useState(true);

	return (
		<View style={demoStyles.routeContent} testID="k-demo-alert">
			<DemoBlock label="Variants">
				<View style={demoStyles.fieldRow}>
					{VARIANTS.map((variant) => (
						<Alert key={variant} variant={variant}>
							{humanizeLabel(variant)}
						</Alert>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Colors (Subtle)">
				<View style={demoStyles.fieldRow}>
					{COLORS.map((color) => (
						<Alert key={color} color={color}>
							{humanizeLabel(color)}
						</Alert>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Title + Description">
				<View style={demoStyles.fieldRow}>
					<Alert color="success">
						<Alert.Title>Deployed</Alert.Title>
						<Alert.Description>All checks passed</Alert.Description>
					</Alert>
					<Alert variant="outline" color="warning">
						Storage almost full
					</Alert>
					<Alert color="info">Heads up: quotas reset Monday</Alert>
				</View>
			</DemoBlock>
			<DemoBlock label="Dismiss">
				<View style={demoStyles.fieldRow}>
					{visible ? (
						<Alert
							color="destructive"
							dismissable
							onDismiss={() => {
								setVisible(false);
								setDismissed((n) => n + 1);
							}}
						>
							<Alert.Title>Payment failed</Alert.Title>
							<Alert.Description>Retry the charge in the app</Alert.Description>
						</Alert>
					) : (
						<View style={demoStyles.componentRow}>
							<KText size="sm">Dismissed {dismissed} Times</KText>
							<Button size="sm" onPress={() => setVisible(true)}>
								Show Alert Again
							</Button>
						</View>
					)}
					<Alert color="primary" showIcon={false}>
						<Alert.Title>Silent arm, no icon</Alert.Title>
						<Alert.Description>
							Icon off still reads correctly
						</Alert.Description>
					</Alert>
				</View>
			</DemoBlock>
		</View>
	);
}
