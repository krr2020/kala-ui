import {
	Button,
	Checkbox,
	Dialog,
	Text as KText,
	Select,
	Switch,
	TextInput,
} from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

type DialogSize = "sm" | "md" | "lg" | "full";

const ROLES = [
	{ value: "admin", label: "Admin" },
	{ value: "editor", label: "Editor" },
	{ value: "viewer", label: "Viewer" },
];

export function DialogDemo() {
	const [open, setOpen] = useState(false);
	const [size, setSize] = useState<DialogSize>("md");
	const [pinned, setPinned] = useState(false);
	const [bare, setBare] = useState(false);
	const [form, setForm] = useState(false);
	const [long, setLong] = useState(false);
	const [terms, setTerms] = useState(false);
	const [role, setRole] = useState("");
	const [notify, setNotify] = useState(true);

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
						accessibilityLabel="Open non-dismissable dialog"
					>
						Non-dismissable
					</Button>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setBare(true)}
						accessibilityLabel="Open dialog without close button"
					>
						No close button
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="Form inputs">
				<View style={demoStyles.componentRow}>
					<KText size="sm" color="muted">
						The card lifts above the keyboard and taps still land while it is
						open.
					</KText>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setForm(true)}
						accessibilityLabel="Open form dialog"
					>
						Open form
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="Long content">
				<View style={demoStyles.componentRow}>
					<KText size="sm" color="muted">
						The body scrolls inside the capped card instead of clipping.
					</KText>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setLong(true)}
						accessibilityLabel="Open long content dialog"
					>
						Open long content
					</Button>
				</View>
			</DemoBlock>
			<Dialog open={open} onOpenChange={setOpen} size={size}>
				<Dialog.Header>
					<Dialog.Title>Session settings</Dialog.Title>
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
						Cancel
					</Button>
					<Button size="sm" onPress={() => setOpen(false)}>
						Save
					</Button>
				</Dialog.Footer>
			</Dialog>
			<Dialog open={pinned} onOpenChange={setPinned} dismissable={false}>
				<Dialog.Header>
					<Dialog.Title>Confirm deletion</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<KText size="sm" color="muted">
						The overlay and drag gestures are locked — only an explicit choice
						dismisses this dialog.
					</KText>
				</Dialog.Body>
				<Dialog.Footer>
					<Button variant="ghost" size="sm" onPress={() => setPinned(false)}>
						Keep
					</Button>
					<Button
						color="destructive"
						size="sm"
						onPress={() => setPinned(false)}
					>
						Delete
					</Button>
				</Dialog.Footer>
			</Dialog>
			<Dialog
				open={bare}
				onOpenChange={setBare}
				showCloseButton={false}
				accessibilityLabel="Silent sync"
			>
				<Dialog.Header>
					<Dialog.Title>Syncing</Dialog.Title>
					<Dialog.Description>
						This dialog hides the close affordance; the action below is the only
						way out.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Button size="sm" onPress={() => setBare(false)}>
						Done
					</Button>
				</Dialog.Footer>
			</Dialog>
			<Dialog
				open={form}
				onOpenChange={setForm}
				accessibilityLabel="Invite teammates"
			>
				<Dialog.Header>
					<Dialog.Title>Invite teammates</Dialog.Title>
					<Dialog.Description>
						The card stays above the keyboard; taps still land while typing.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<View style={{ gap: 12 }}>
						<TextInput placeholder="Full name" accessibilityLabel="Full name" />
						<TextInput
							placeholder="Email"
							keyboardType="email-address"
							accessibilityLabel="Email"
						/>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
						>
							<Checkbox
								value={terms}
								onValueChange={setTerms}
								label="Accept terms"
							/>
						</View>
						<Select
							value={role}
							onValueChange={setRole}
							options={ROLES}
							placeholder="Role"
							accessibilityLabel="Role"
						/>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
						>
							<Switch
								value={notify}
								onValueChange={setNotify}
								label="Send notifications"
							/>
						</View>
					</View>
				</Dialog.Body>
				<Dialog.Footer>
					<Button variant="ghost" size="sm" onPress={() => setForm(false)}>
						Cancel
					</Button>
					<Button size="sm" onPress={() => setForm(false)}>
						Send invite
					</Button>
				</Dialog.Footer>
			</Dialog>
			<Dialog open={long} onOpenChange={setLong} size="lg">
				<Dialog.Header>
					<Dialog.Title>Release notes</Dialog.Title>
					<Dialog.Description>
						Scrolls inside the capped card.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<View style={{ gap: 12 }}>
						{Array.from({ length: 16 }, (_, i) => (
							<KText key={`section-${String(i + 1)}`} size="sm" color="muted">
								Section {i + 1}: dialogs lift above the keyboard, bodies scroll
								instead of clipping, and every size tier stays reachable.
							</KText>
						))}
					</View>
				</Dialog.Body>
				<Dialog.Footer>
					<Button size="sm" onPress={() => setLong(false)}>
						Close
					</Button>
				</Dialog.Footer>
			</Dialog>
		</View>
	);
}
