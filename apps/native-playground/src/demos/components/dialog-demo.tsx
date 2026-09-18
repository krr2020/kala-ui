import { Button, Dialog, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

type DialogSize = "sm" | "md" | "lg" | "full";

export function DialogDemo() {
	const [open, setOpen] = useState(false);
	const [size, setSize] = useState<DialogSize>("md");
	const [pinned, setPinned] = useState(false);
	const [bare, setBare] = useState(false);

	return (
		<View style={demoStyles.routeContent} testID="k-demo-dialog">
			<DemoBlock label="Sizes">
				<View style={demoStyles.componentRow}>
					{(["sm", "md", "lg", "full"] as const).map((s) => (
						<Button
							key={s}
							size="sm"
							variant="outline"
							onPress={() => {
								setSize(s);
								setOpen(true);
							}}
						>
							{s}
						</Button>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Dismissal">
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setPinned(true)}
						accessibilityLabel="open non-dismissable dialog"
					>
						non-dismissable
					</Button>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setBare(true)}
						accessibilityLabel="open dialog without close button"
					>
						no close button
					</Button>
				</View>
			</DemoBlock>
			<Dialog open={open} onOpenChange={setOpen} size={size}>
				<Dialog.Header>
					<Dialog.Title>session settings</Dialog.Title>
					<Dialog.Description>
						Adjust preferences for this device.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<KText size="sm" color="muted">
						Press the overlay, drag the card down, or use the close button to
						dismiss.
					</KText>
				</Dialog.Body>
				<Dialog.Footer>
					<Button variant="ghost" size="sm" onPress={() => setOpen(false)}>
						cancel
					</Button>
					<Button size="sm" onPress={() => setOpen(false)}>
						save
					</Button>
				</Dialog.Footer>
			</Dialog>
			<Dialog open={pinned} onOpenChange={setPinned} dismissable={false}>
				<Dialog.Header>
					<Dialog.Title>confirm deletion</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<KText size="sm" color="muted">
						The overlay and drag gestures are locked — only an explicit choice
						dismisses this dialog.
					</KText>
				</Dialog.Body>
				<Dialog.Footer>
					<Button variant="ghost" size="sm" onPress={() => setPinned(false)}>
						keep
					</Button>
					<Button
						color="destructive"
						size="sm"
						onPress={() => setPinned(false)}
					>
						delete
					</Button>
				</Dialog.Footer>
			</Dialog>
			<Dialog
				open={bare}
				onOpenChange={setBare}
				showCloseButton={false}
				accessibilityLabel="silent sync"
			>
				<Dialog.Header>
					<Dialog.Title>syncing</Dialog.Title>
					<Dialog.Description>
						This dialog hides the close affordance; the action below is the only
						way out.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Button size="sm" onPress={() => setBare(false)}>
						done
					</Button>
				</Dialog.Footer>
			</Dialog>
		</View>
	);
}
