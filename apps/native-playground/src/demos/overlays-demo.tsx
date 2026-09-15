import {
	Accordion,
	AlertDialog,
	Button,
	Collapsible,
	ContextMenu,
	Dialog,
	DropdownMenu,
	Icon,
	Text as KText,
	Sheet,
} from "@kala-ui/react-native";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { demoStyles } from "./stylesheet";

export function OverlaysDemo() {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [faqOpen, setFaqOpen] = useState<string[]>(["shipping"]);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [autoSync, setAutoSync] = useState(true);
	const [lastAction, setLastAction] = useState("none");
	return (
		<>
			<View testID="k-demo-accordion">
				<Accordion
					type="multiple"
					value={faqOpen}
					onValueChange={setFaqOpen}
					variant="bordered"
				>
					<Accordion.Item value="shipping">
						<Accordion.Trigger>shipping</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								free over $50, arrives in 3-5 days
							</KText>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="returns">
						<Accordion.Trigger>returns</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								30-day window, no questions asked
							</KText>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-collapsible">
				<Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
					<Collapsible.Trigger>advanced filters</Collapsible.Trigger>
					<Collapsible.Content>
						<KText size="sm" color="muted">
							only show verified sellers
						</KText>
					</Collapsible.Content>
				</Collapsible>
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-dialog">
				<Button
					onPress={() => setDialogOpen(true)}
					accessibilityLabel="open demo dialog"
				>
					open dialog
				</Button>
				<Button
					variant="outline"
					color="destructive"
					onPress={() => setConfirmOpen(true)}
					accessibilityLabel="open confirm dialog"
				>
					delete account
				</Button>
				<Button
					onPress={() => setSheetOpen(true)}
					accessibilityLabel="open demo sheet"
				>
					<Icon icon={Check} size="xs" color="primaryForeground" />
					open sheet
				</Button>
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-dropdown-menu">
				<DropdownMenu
					triggerLabel="actions"
					items={[
						{ type: "label", key: "l", label: "Row actions" },
						{
							type: "checkbox",
							key: "sync",
							label: "Auto-sync",
							checked: autoSync,
							onCheckedChange: setAutoSync,
						},
						{ key: "archive", label: "Archive" },
						{ key: "delete", label: "Delete", destructive: true },
					]}
				/>
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-context-menu">
				<ContextMenu
					items={[
						{
							key: "copy",
							label: "Copy",
							onSelect: () => setLastAction("copy"),
						},
						{
							key: "remove",
							label: "Remove",
							destructive: true,
							onSelect: () => setLastAction("remove"),
						},
					]}
				>
					<KText size="sm" color="muted">
						long-press me — last action: {lastAction}
					</KText>
				</ContextMenu>
			</View>
			<Sheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
				<Sheet.Body>
					<KText size="sm" color="muted">
						Bottom sheet — press the overlay or drag to dismiss.
					</KText>
					<Button fullWidth onPress={() => setSheetOpen(false)}>
						done
					</Button>
				</Sheet.Body>
			</Sheet>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<Dialog.Header>
					<Dialog.Title>session settings</Dialog.Title>
					<Dialog.Description>
						Adjust preferences for this device.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<KText size="sm" color="muted">
						Press the overlay or the close button to dismiss.
					</KText>
				</Dialog.Body>
				<Dialog.Footer>
					<Button
						variant="ghost"
						size="sm"
						onPress={() => setDialogOpen(false)}
					>
						cancel
					</Button>
					<Button size="sm" onPress={() => setDialogOpen(false)}>
						save
					</Button>
				</Dialog.Footer>
			</Dialog>
			<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<AlertDialog.Header>
					<AlertDialog.Title>delete account?</AlertDialog.Title>
					<AlertDialog.Description>
						This permanently removes your data and cannot be undone.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel onPress={() => undefined}>
						cancel
					</AlertDialog.Cancel>
					<AlertDialog.Action color="destructive" onPress={() => undefined}>
						delete
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog>
		</>
	);
}
