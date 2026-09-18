import { Button, Sheet, Text as KText, TextInput } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

type Snap = "auto" | "peek" | "half" | "full";

export function SheetDemo() {
	const [snap, setSnap] = useState<Snap>("peek");
	const [open, setOpen] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [search, setSearch] = useState(false);
	const [long, setLong] = useState(false);
	const [query, setQuery] = useState("");

	const openAt = (s: Snap) => {
		setSnap(s);
		setOpen(true);
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
			<DemoBlock label="Variations">
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setPinned(true)}
						accessibilityLabel="Open non-dismissable sheet"
					>
						Non-dismissable
					</Button>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setSearch(true)}
						accessibilityLabel="Open search sheet"
					>
						Keyboard input
					</Button>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setLong(true)}
						accessibilityLabel="Open long content sheet"
					>
						Long content
					</Button>
				</View>
			</DemoBlock>
			<Sheet open={open} onClose={() => setOpen(false)} snap={snap}>
				<Sheet.Body>
					<KText size="sm" color="muted">
						Snap {snap} — press the overlay or drag down to dismiss.
					</KText>
				</Sheet.Body>
			</Sheet>
			<Sheet open={pinned} onClose={() => setPinned(false)} dismissable={false}>
				<Sheet.Body>
					<KText size="sm" color="muted">
						The overlay and drag are locked; only Done closes this sheet.
					</KText>
					<Button fullWidth onPress={() => setPinned(false)}>
						Done
					</Button>
				</Sheet.Body>
			</Sheet>
			<Sheet
				open={search}
				onClose={() => setSearch(false)}
				snap="auto"
				avoidKeyboard
			>
				<Sheet.Body>
					<TextInput
						placeholder="Search"
						value={query}
						onChangeText={setQuery}
						accessibilityLabel="Search"
					/>
					<Button
						fullWidth
						onPress={() => setSearch(false)}
						accessibilityLabel="Apply search"
					>
						Apply
					</Button>
				</Sheet.Body>
			</Sheet>
			<Sheet open={long} onClose={() => setLong(false)} snap="half">
				<Sheet.Body>
					<View style={{ gap: 12 }}>
						{Array.from({ length: 16 }, (_, i) => (
							<KText key={`row-${String(i + 1)}`} size="sm" color="muted">
								Row {i + 1}: the body scrolls while the sheet stays at half
								height.
							</KText>
						))}
					</View>
				</Sheet.Body>
			</Sheet>
		</View>
	);
}
