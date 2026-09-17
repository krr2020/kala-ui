import { Banner, Button, Text as KText } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";
import { humanizeLabel } from "./label";

const COLORS = ["info", "warning", "destructive", "success"] as const;

export function BannerDemo(): ReactElement {
	const [closed, setClosed] = useState(0);
	const [visible, setVisible] = useState(true);

	return (
		<View style={demoStyles.routeContent} testID="k-demo-banner">
			<DemoBlock label="Colors">
				<View style={demoStyles.fieldRow}>
					{COLORS.map((color) => (
						<Banner key={color} color={color} position="static">
							{humanizeLabel(color)}
						</Banner>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Positions">
				<View style={demoStyles.fieldRow}>
					<Banner position="static">Static banner</Banner>
					{/* fixed maps to absolute top-0 — mount it in a relative box
						so the preview shows both arms in place */}
					<View style={{ position: "relative", height: 120 }}>
						<Banner position="fixed">Fixed banner</Banner>
					</View>
				</View>
			</DemoBlock>
			<DemoBlock label="Close">
				<View style={demoStyles.fieldRow}>
					{visible ? (
						<Banner
							position="static"
							onClose={() => {
								setVisible(false);
								setClosed((n) => n + 1);
							}}
						>
							Sync pauses at midnight
						</Banner>
					) : (
						<View style={demoStyles.componentRow}>
							<KText size="sm">Closed {closed} Times</KText>
							<Button size="sm" onPress={() => setVisible(true)}>
								Show Banner Again
							</Button>
						</View>
					)}
				</View>
			</DemoBlock>
			<DemoBlock label="Loading">
				<View style={demoStyles.fieldRow}>
					<Banner position="static" isLoading>
						Loading
					</Banner>
					<Banner
						position="static"
						isLoading
						skeletonConfig={{ showIcon: false, showCloseButton: false }}
					>
						Loading
					</Banner>
					<Banner
						position="static"
						isLoading
						skeleton={<Text>Custom skeleton</Text>}
					>
						Loading
					</Banner>
				</View>
			</DemoBlock>
			<DemoBlock label="Alert Role">
				<View style={demoStyles.fieldRow}>
					<Banner position="static" color="destructive" role="alert">
						Service outage in progress
					</Banner>
				</View>
			</DemoBlock>
		</View>
	);
}
