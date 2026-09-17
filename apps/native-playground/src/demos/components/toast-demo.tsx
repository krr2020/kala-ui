import { Button, Text as KText, Toast } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function ToastDemo(): ReactElement {
	const { theme } = useUnistyles();
	const [basicOpen, setBasicOpen] = useState(false);
	const [position, setPosition] = useState<"top" | "bottom">("bottom");
	const [positionOpen, setPositionOpen] = useState(false);
	const [autoClosed, setAutoClosed] = useState(0);
	const [autoOpen, setAutoOpen] = useState(false);
	const [manualOpen, setManualOpen] = useState(false);
	const [longOpen, setLongOpen] = useState(false);

	return (
		<View style={demoStyles.routeContent} testID="k-demo-toast">
			<DemoBlock label="Basic">
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						onPress={() => setBasicOpen(true)}
						accessibilityLabel="Show Toast"
					>
						Show Toast
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="Position">
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						onPress={() => {
							setPosition("top");
							setPositionOpen(true);
						}}
					>
						Top
					</Button>
					<Button
						size="sm"
						onPress={() => {
							setPosition("bottom");
							setPositionOpen(true);
						}}
					>
						Bottom
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="Auto Dismiss">
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						onPress={() => setAutoOpen(true)}
						accessibilityLabel="Show Auto Toast"
					>
						Show Auto Toast
					</Button>
					<KText size="sm">Auto-Closed {autoClosed} Times</KText>
				</View>
			</DemoBlock>
			<DemoBlock label="Manual Only">
				<View style={demoStyles.componentRow}>
					<Button size="sm" onPress={() => setManualOpen(true)}>
						Show Manual Toast
					</Button>
					{manualOpen ? (
						<Button
							size="sm"
							variant="outline"
							onPress={() => setManualOpen(false)}
						>
							Close Toast
						</Button>
					) : null}
				</View>
			</DemoBlock>
			<DemoBlock label="Long Copy">
				<View style={demoStyles.componentRow}>
					<Button size="sm" onPress={() => setLongOpen(true)}>
						Show Long Copy
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="Toast Stage">
				{/* the viewport is absolute-fill — anchor it to a real box so
					every toast previews in place with its message visible */}
				<View
					style={{
						position: "relative",
						minHeight: 220,
						borderWidth: 1,
						borderColor: theme.border,
						borderRadius: 12,
						overflow: "hidden",
					}}
				>
					<Toast open={basicOpen} onOpenChange={setBasicOpen} duration={2500}>
						<Toast.Title>Saved</Toast.Title>
						<Toast.Description>Changes are live</Toast.Description>
					</Toast>
					<Toast
						open={positionOpen}
						onOpenChange={setPositionOpen}
						position={position}
						duration={6000}
					>
						<Toast.Title>Pinned {position}</Toast.Title>
					</Toast>
					<Toast
						open={autoOpen}
						onOpenChange={(next) => {
							setAutoOpen(next);
							if (!next) setAutoClosed((n) => n + 1);
						}}
						duration={1500}
					>
						<Toast.Title>Uploading</Toast.Title>
						<Toast.Description>
							Closes itself after 1.5 seconds
						</Toast.Description>
					</Toast>
					<Toast open={manualOpen} onOpenChange={setManualOpen}>
						<Toast.Title>Manual toast stays open</Toast.Title>
						<Toast.Description>
							No duration — close it with the button above
						</Toast.Description>
					</Toast>
					<Toast open={longOpen} onOpenChange={setLongOpen} duration={4000}>
						<Toast.Title>Report exported successfully</Toast.Title>
						<Toast.Description>
							We emailed the summary to every teammate on the distribution list
						</Toast.Description>
					</Toast>
				</View>
			</DemoBlock>
		</View>
	);
}
