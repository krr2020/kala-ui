import { AlertDialog, Button, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function AlertDialogDemo() {
	const [destructive, setDestructive] = useState(false);
	const [info, setInfo] = useState(false);
	const [swipe, setSwipe] = useState(false);
	const [long, setLong] = useState(false);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-alert-dialog">
			<DemoBlock label="Confirmations">
				<View style={demoStyles.componentRow}>
					<Button
						variant="outline"
						color="destructive"
						onPress={() => setDestructive(true)}
						accessibilityLabel="Open destructive alert"
					>
						Delete account
					</Button>
					<Button
						variant="outline"
						onPress={() => setInfo(true)}
						accessibilityLabel="Open informational alert"
					>
						Session expired
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="Dismissal">
				<View style={demoStyles.componentRow}>
					<Button
						variant="outline"
						onPress={() => setSwipe(true)}
						accessibilityLabel="Open dismissable alert"
					>
						Dismissible
					</Button>
					<Button
						variant="outline"
						onPress={() => setLong(true)}
						accessibilityLabel="Open long content alert"
					>
						Long content
					</Button>
				</View>
			</DemoBlock>
			<AlertDialog open={destructive} onOpenChange={setDestructive}>
				<AlertDialog.Header>
					<AlertDialog.Title>Delete account?</AlertDialog.Title>
					<AlertDialog.Description>
						This permanently removes your data and cannot be undone.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel onPress={() => undefined}>
						Cancel
					</AlertDialog.Cancel>
					<AlertDialog.Action color="destructive" onPress={() => undefined}>
						Delete
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog>
			<AlertDialog open={info} onOpenChange={setInfo}>
				<AlertDialog.Header>
					<AlertDialog.Title>Session expired</AlertDialog.Title>
					<AlertDialog.Description>
						Your session timed out after 30 minutes of inactivity.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Action onPress={() => undefined}>
						Sign in again
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog>
			<AlertDialog open={swipe} onOpenChange={setSwipe} dismissable>
				<AlertDialog.Header>
					<AlertDialog.Title>Draft saved</AlertDialog.Title>
					<AlertDialog.Description>
						Drag the card down or press the overlay to dismiss this one.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Action onPress={() => undefined}>
						Got it
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog>
			<AlertDialog open={long} onOpenChange={setLong}>
				<AlertDialog.Header>
					<AlertDialog.Title>Release notes</AlertDialog.Title>
					<AlertDialog.Description>
						The body scrolls under fixed header and footer chrome.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Body>
					<View style={{ gap: 12 }}>
						{Array.from({ length: 10 }, (_, i) => (
							<KText key={`note-${String(i + 1)}`} size="sm" color="muted">
								Entry {i + 1}: alerts interrupt, so the action row stays pinned
								while this list scrolls.
							</KText>
						))}
					</View>
				</AlertDialog.Body>
				<AlertDialog.Footer>
					<AlertDialog.Cancel onPress={() => undefined}>
						Close
					</AlertDialog.Cancel>
				</AlertDialog.Footer>
			</AlertDialog>
		</View>
	);
}
