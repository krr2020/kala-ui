import {
	Button,
	Text as KText,
	Sheet,
	Switch,
	TextInput,
} from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

type Snap = "auto" | "peek" | "half" | "full";

const SHARE_ACTIONS = [
	"Copy link",
	"Message",
	"Email",
	"Save to files",
] as const;

export function SheetDemo() {
	const [snap, setSnap] = useState<Snap>("peek");
	const [snapOpen, setSnapOpen] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [termsOpen, setTermsOpen] = useState(false);
	const [formOpen, setFormOpen] = useState(false);
	const [longFormOpen, setLongFormOpen] = useState(false);
	const [locked, setLocked] = useState(false);
	const [inStock, setInStock] = useState(true);
	const [onSale, setOnSale] = useState(false);
	const [freeShipping, setFreeShipping] = useState(false);
	const [query, setQuery] = useState("");
	const [taskTitle, setTaskTitle] = useState("");
	const [taskNotes, setTaskNotes] = useState("");
	const [eventFields, setEventFields] = useState(() =>
		Array.from({ length: 8 }, () => ""),
	);

	const openAt = (s: Snap) => {
		setSnap(s);
		setSnapOpen(true);
	};

	return (
		<View style={demoStyles.routeContent} testID="k-demo-sheet">
			<DemoBlock label="Snap points">
				<View style={demoStyles.componentRow}>
					{(["auto", "peek", "half", "full"] as const).map((s) => (
						<Button
							key={s}
							size="sm"
							variant="outline"
							onPress={() => openAt(s)}
							accessibilityLabel={`Open ${s} sheet`}
						>
							{s}
						</Button>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Use cases">
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setFilterOpen(true)}
						accessibilityLabel="Open filter sheet"
					>
						Filter
					</Button>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setShareOpen(true)}
						accessibilityLabel="Open share sheet"
					>
						Share
					</Button>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setSearchOpen(true)}
						accessibilityLabel="Open search sheet"
					>
						Keyboard input
					</Button>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setFormOpen(true)}
						accessibilityLabel="Open form sheet"
					>
						Form
					</Button>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setLongFormOpen(true)}
						accessibilityLabel="Open long form stress sheet"
					>
						Long form
					</Button>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setTermsOpen(true)}
						accessibilityLabel="Open long content sheet"
					>
						Long content
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="Variations">
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setLocked(true)}
						accessibilityLabel="Open non-dismissable sheet"
					>
						Non-dismissable
					</Button>
				</View>
			</DemoBlock>

			{/* snap tour: one sheet re-opened at each snap height */}
			<Sheet
				open={snapOpen}
				onClose={() => setSnapOpen(false)}
				snap={snap}
				title="Snap points"
			>
				<Sheet.Body>
					<KText size="sm" color="muted">
						Snap {snap} — drag the handle or press the overlay to dismiss.
					</KText>
				</Sheet.Body>
			</Sheet>

			{/* filters: auto-sized toggle list — close icon or overlay ends the session */}
			<Sheet
				open={filterOpen}
				onClose={() => setFilterOpen(false)}
				snap="auto"
				title="Filter results"
			>
				<Sheet.Body>
					<Switch
						label="In stock only"
						value={inStock}
						onValueChange={setInStock}
					/>
					<Switch label="On sale" value={onSale} onValueChange={setOnSale} />
					<Switch
						label="Free shipping"
						value={freeShipping}
						onValueChange={setFreeShipping}
					/>
				</Sheet.Body>
			</Sheet>

			{/* share: compact action list riding the auto snap */}
			<Sheet
				open={shareOpen}
				onClose={() => setShareOpen(false)}
				snap="auto"
				title="Share"
			>
				<Sheet.Body>
					{SHARE_ACTIONS.map((action) => (
						<Button
							key={action}
							fullWidth
							variant="ghost"
							onPress={() => setShareOpen(false)}
							accessibilityLabel={action}
						>
							{action}
						</Button>
					))}
				</Sheet.Body>
			</Sheet>

			{/* search: keyboard-aware auto sheet — avoidKeyboard lifts the
			 * input above the software keyboard on both platforms */}
			<Sheet
				open={searchOpen}
				onClose={() => setSearchOpen(false)}
				snap="auto"
				title="Search"
				avoidKeyboard
			>
				<Sheet.Body>
					<TextInput
						placeholder="Search products"
						value={query}
						onChangeText={setQuery}
						accessibilityLabel="Search products"
					/>
					<Button
						fullWidth
						onPress={() => setSearchOpen(false)}
						accessibilityLabel="Apply search"
					>
						Apply
					</Button>
				</Sheet.Body>
			</Sheet>

			{/* terms: body scrolls while the sheet holds half height; Accept
					stays pinned in the footer */}
			<Sheet
				open={termsOpen}
				onClose={() => setTermsOpen(false)}
				snap="half"
				title="Terms of service"
				scrollable
				footer={
					<Button
						fullWidth
						onPress={() => setTermsOpen(false)}
						accessibilityLabel="Accept terms"
					>
						Accept
					</Button>
				}
			>
				<Sheet.Body>
					<View style={{ gap: 12 }}>
						{Array.from({ length: 16 }, (_, i) => (
							<KText key={`clause-${String(i + 1)}`} size="sm" color="muted">
								Clause {i + 1}: the body scrolls while the sheet stays at half
								height and the footer stays pinned.
							</KText>
						))}
					</View>
				</Sheet.Body>
			</Sheet>

			{/* form: header and actions are fixed tiers; only the body scrolls.
			 * Inputs sit at the end so reaching them exercises the scroll while
			 * Cancel/Create and the title never move */}
			<Sheet
				open={formOpen}
				onClose={() => setFormOpen(false)}
				snap="half"
				title="Create task"
				scrollable
				avoidKeyboard
				footer={
					<View style={demoStyles.componentRow}>
						<Button
							variant="ghost"
							style={{ flex: 1 }}
							onPress={() => setFormOpen(false)}
							accessibilityLabel="Discard form"
						>
							Cancel
						</Button>
						<Button
							style={{ flex: 1 }}
							onPress={() => setFormOpen(false)}
							accessibilityLabel="Save task"
						>
							Create
						</Button>
					</View>
				}
			>
				<Sheet.Body>
					<View style={{ gap: 12 }}>
						<KText size="sm" color="muted">
							Scroll to the fields at the bottom — the header and the actions
							stay pinned.
						</KText>
						{Array.from({ length: 3 }, (_, i) => (
							<KText key={`ctx-${String(i + 1)}`} size="sm" color="muted">
								Context row {i + 1} pushing the form fields below the fold.
							</KText>
						))}
						<TextInput
							placeholder="Task title"
							value={taskTitle}
							onChangeText={setTaskTitle}
							accessibilityLabel="Task title"
						/>
						<TextInput
							placeholder="Notes"
							value={taskNotes}
							onChangeText={setTaskNotes}
							accessibilityLabel="Task notes"
						/>
					</View>
				</Sheet.Body>
			</Sheet>

			{/* long-form stress: full-height sheet crammed with fields. Only the
			 * body scrolls; header and actions stay pinned. Try it with the
			 * keyboard up on the lowest field to check the sheet stays below the
			 * status bar and the footer stays reachable */}
			<Sheet
				open={longFormOpen}
				onClose={() => setLongFormOpen(false)}
				snap="full"
				title="Event details"
				scrollable
				avoidKeyboard
				footer={
					<View style={demoStyles.componentRow}>
						<Button
							variant="ghost"
							style={{ flex: 1 }}
							onPress={() => setLongFormOpen(false)}
							accessibilityLabel="Discard event"
						>
							Cancel
						</Button>
						<Button
							style={{ flex: 1 }}
							onPress={() => setLongFormOpen(false)}
							accessibilityLabel="Save event"
						>
							Save
						</Button>
					</View>
				}
			>
				<Sheet.Body>
					<View style={{ gap: 12 }}>
						<KText size="sm" color="muted">
							Full snap: the sheet fills 90% of the window. Scroll the fields
							and open the keyboard on the last one — the header never rides
							into the status bar and the actions stay pinned.
						</KText>
						{eventFields.map((value, index) => (
							<TextInput
								key={`event-field-${String(index)}`}
								placeholder={`Field ${index + 1} of ${eventFields.length}`}
								value={value}
								onChangeText={(next) =>
									setEventFields((fields) =>
										fields.map((f, i) => (i === index ? next : f)),
									)
								}
								accessibilityLabel={`Event field ${index + 1}`}
							/>
						))}
					</View>
				</Sheet.Body>
			</Sheet>

			{/* locked sheet: no overlay/drag dismissal, no close icon — the
			 * explicit action is the only way out */}
			<Sheet
				open={locked}
				onClose={() => setLocked(false)}
				dismissable={false}
				snap="auto"
			>
				<Sheet.Body>
					<KText size="sm" color="muted">
						The overlay and drag are locked; only Done closes this sheet.
					</KText>
					<Button fullWidth onPress={() => setLocked(false)}>
						Done
					</Button>
				</Sheet.Body>
			</Sheet>
		</View>
	);
}
