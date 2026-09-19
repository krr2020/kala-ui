/**
 * App components overview: composed story over the composite widgets
 * that live in @kala-ui/react-native-app — list, loading overlay,
 * steps, timeline. Individual components keep their dedicated screens.
 */
import {
	List,
	ListItem,
	ListItemText,
	ListItemTitle,
	LoadingOverlay,
	Steps,
	Timeline,
} from "@kala-ui/react-native-app";
import { Button, Text as KText } from "@kala-ui/react-native";
import { Pressable, View } from "react-native";
import { useState } from "react";
import { DemoBlock } from "./demo-block";
import { demoStyles } from "./stylesheet";

export function AppComponentsDemo() {
	const [step, setStep] = useState(2);
	const [loading, setLoading] = useState(false);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-app-components">
			<DemoBlock label="List">
				<List accessibilityLabel="Recent orders">
					<ListItem>
						<ListItemTitle>Order #1042</ListItemTitle>
						<ListItemText>Shipped yesterday</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemTitle>Order #1041</ListItemTitle>
						<ListItemText>Delivered Monday</ListItemText>
					</ListItem>
				</List>
			</DemoBlock>
			<DemoBlock label="Steps">
				<Steps
					value={step}
					items={[{ title: "Cart" }, { title: "Payment" }, { title: "Review" }]}
				/>
				<Pressable
					accessibilityLabel="Advance step"
					onPress={() => setStep((s) => (s % 3) + 1)}
				>
					<KText size="sm" color="muted">
						Advance step
					</KText>
				</Pressable>
			</DemoBlock>
			<DemoBlock label="Timeline">
				<Timeline
					items={[
						{ timestamp: "09:00", title: "Checked in" },
						{ timestamp: "10:30", title: "Session started" },
						{ timestamp: "12:00", title: "Break" },
					]}
				/>
			</DemoBlock>
			<DemoBlock label="Loading overlay">
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						variant="outline"
						onPress={() => {
							setLoading(true);
							setTimeout(() => setLoading(false), 1500);
						}}
						accessibilityLabel="Show loading overlay"
					>
						Show overlay
					</Button>
				</View>
				<LoadingOverlay visible={loading} accessibilityLabel="Saving changes" />
			</DemoBlock>
		</View>
	);
}
