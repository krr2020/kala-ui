import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Check, Sun } from "lucide-react-native";
import {
	StyleSheet,
	UnistylesRuntime,
	useUnistyles,
} from "react-native-unistyles";
import {
	Alert,
	Avatar,
	Badge,
	Button,
	Card,
	Checkbox,
	EmptyState,
	Heading,
	Icon,
	Label,
	Pagination,
	Progress,
	RadioGroup,
	Rating,
	SegmentedControl,
	Separator,
	Sheet,
	Skeleton,
	Spinner,
	Switch,
	Tabs,
	Tag,
	Text as KText,
	TextInput,
	Toast,
	Slider,
} from "@kala-ui/react-native";
import { themeNames } from "@kala-ui/react-native/themes";

const SWATCH_TOKENS = [
	"background",
	"foreground",
	"card",
	"primary",
	"secondary",
	"muted",
	"accent",
	"destructive",
	"success",
	"warning",
	"error",
	"info",
] as const;

// Direct `stylesheet.x` access works because the unistyles babel plugin
// rewrites it to register dependencies (no explicit theme pass needed).
const stylesheet = StyleSheet.create((theme) => ({
	screen: {
		flex: 1,
		backgroundColor: theme.background,
		paddingTop: 64,
		paddingBottom: 32,
		paddingHorizontal: 16,
		gap: 16,
	},
	title: {
		color: theme.foreground,
		fontSize: 24,
		fontWeight: "700",
	},
	current: {
		color: theme.mutedForeground,
		fontSize: 14,
	},
	picker: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	chip: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: theme.border,
		backgroundColor: theme.card,
	},
	chipText: {
		color: theme.foreground,
		fontSize: 13,
	},
	chipActive: {
		backgroundColor: theme.primary,
		borderColor: theme.primary,
	},
	chipTextActive: {
		color: theme.primaryForeground,
		fontWeight: "600",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	swatch: {
		width: "30%",
		aspectRatio: "1.6",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: theme.border,
		justifyContent: "flex-end",
	},
	swatchLabel: {
		color: theme.foreground,
		fontSize: 11,
		textAlign: "center",
		paddingBottom: 6,
	},
	sectionTitle: {
		color: theme.foreground,
		fontSize: 18,
		fontWeight: "600",
	},
	componentRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		gap: 8,
	},
}));

export default function App() {
	const { theme } = useUnistyles();
	const current = UnistylesRuntime.themeName;
	const [sheetOpen, setSheetOpen] = useState(false);
	const [agree, setAgree] = useState(false);
	const [sync, setSync] = useState(true);
	const [plan, setPlan] = useState("pro");
	const [toastOpen, setToastOpen] = useState(false);
	const [range, setRange] = useState("week");
	const [tab, setTab] = useState("one");
	const [rating, setRating] = useState(3);
	const [pageNumber, setPageNumber] = useState(2);
	const [volume, setVolume] = useState(70);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ScrollView style={stylesheet.screen} contentContainerStyle={{ gap: 16 }}>
				<Text style={stylesheet.title}>kala-ui · native tokens</Text>
				<Text style={stylesheet.current}>theme: {current}</Text>
				<View style={stylesheet.picker}>
					{themeNames.map((name) => {
						const active = name === current;
						return (
							<Pressable
								key={name}
								testID={`k-theme-${name}`}
								accessibilityRole="button"
								accessibilityLabel={`activate ${name} theme`}
								onPress={() => UnistylesRuntime.setTheme(name)}
								style={[stylesheet.chip, active && stylesheet.chipActive]}
							>
								<Text
									style={[
										stylesheet.chipText,
										active && stylesheet.chipTextActive,
									]}
								>
									{name}
								</Text>
							</Pressable>
						);
					})}
				</View>
				<View style={stylesheet.grid}>
					{SWATCH_TOKENS.map((token) => (
						<View
							key={token}
							testID={`k-swatch-${token}`}
							style={[
								stylesheet.swatch,
								// themes carry different key subsets (dark has no success), so
								// dynamic swatch lookup goes through a string-cast map view
								{
									backgroundColor: String(
										(theme as Record<string, string | number>)[token],
									),
								},
							]}
						>
							<Text style={stylesheet.swatchLabel}>{token}</Text>
						</View>
					))}
				</View>
				<Text style={stylesheet.sectionTitle}>components</Text>
				<View style={stylesheet.componentRow} testID="k-demo-buttons">
					<Button
						onPress={() => setSheetOpen(true)}
						accessibilityLabel="open demo sheet"
					>
						<Icon icon={Check} size="xs" color="primaryForeground" />
						open sheet
					</Button>
					<Button variant="outline" color="secondary">
						outline
					</Button>
					<Button variant="ghost" color="destructive">
						ghost
					</Button>
					<Button variant="subtle" color="muted" size="sm">
						subtle
					</Button>
					<Button variant="link" size="sm">
						link
					</Button>
					<Button size="icon" accessibilityLabel="sun">
						<Icon icon={Sun} size="sm" />
					</Button>
				</View>
				<View style={stylesheet.componentRow} testID="k-demo-icons">
					{(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
						<Icon key={size} icon={Sun} size={size} />
					))}
				</View>
				<View style={stylesheet.componentRow} testID="k-demo-text">
					<Heading size="h3">typography</Heading>
					{(["xs", "sm", "md", "lg"] as const).map((size) => (
						<KText key={size} size={size} color="muted">
							size {size}
						</KText>
					))}
					<KText truncate>
						truncated line that clamps with a tail ellipsis
					</KText>
				</View>
				<View style={stylesheet.componentRow} testID="k-demo-input">
					<TextInput placeholder="email" accessibilityLabel="email field" />
					<TextInput
						placeholder="error"
						accessibilityLabel="error field"
						hasError
					/>
				</View>
				<Card testID="k-demo-card">
					<Heading size="h6">card</Heading>
					<KText color="muted" size="sm">
						Themed surface with card tokens.
					</KText>
				</Card>
				<View style={stylesheet.componentRow} testID="k-demo-badges">
					<Badge>solid</Badge>
					<Badge variant="outline" color="success">
						outline
					</Badge>
					<Badge variant="subtle" color="info">
						subtle
					</Badge>
					<Badge variant="subtle" color="destructive" shape="pill">
						pill
					</Badge>
				</View>
				<View style={stylesheet.componentRow} testID="k-demo-avatars">
					{(["xs", "sm", "md", "lg"] as const).map((size) => (
						<Avatar key={size} name="Ada Lovelace" size={size} />
					))}
					<Avatar name="Grace Hopper" size="lg" status="online" />
					<Avatar name="Alan Turing" size="lg" status="offline" />
				</View>
				<View style={stylesheet.componentRow} testID="k-demo-controls">
					<Checkbox
						accessibilityLabel="agree to terms"
						value={agree}
						onValueChange={setAgree}
					/>
					<KText size="sm">agree</KText>
					<Switch
						accessibilityLabel="auto sync"
						value={sync}
						onValueChange={setSync}
					/>
					<KText size="sm">sync</KText>
				</View>
				<View style={stylesheet.componentRow} testID="k-demo-labels">
					<Label required>email</Label>
					<Label>notes</Label>
				</View>
				<Separator />
				<View style={stylesheet.componentRow} testID="k-demo-spinners">
					<Spinner size="sm" />
					<Spinner />
					<Spinner size="lg" variant="muted" />
					<Spinner size="xl" variant="ghost" />
				</View>
				<View testID="k-demo-progress">
					<Progress value={30} />
					<Progress value={70} color="success" showValue />
					<Progress value={50} color="info" label="uploading" />
				</View>
				<View style={stylesheet.componentRow} testID="k-demo-skeletons">
					<Skeleton style={{ width: 96, height: 12 }} />
					<Skeleton variant="circle" style={{ width: 32, height: 32 }} />
					<Skeleton style={{ width: 64, height: 12 }} variant="rect" />
				</View>
				<View testID="k-demo-radios">
					<RadioGroup
						value={plan}
						onValueChange={setPlan}
						accessibilityLabel="plan"
					>
						<RadioGroup.Item
							value="basic"
							label="Basic"
							description="one project"
						/>
						<RadioGroup.Item
							value="pro"
							label="Pro"
							description="unlimited projects"
						/>
					</RadioGroup>
				</View>
				<Alert color="success" dismissable onDismiss={() => setToastOpen(true)}>
					<Alert.Title>deployed</Alert.Title>
					<Alert.Description>all checks passed</Alert.Description>
				</Alert>
				<Alert variant="outline" color="warning">
					storage almost full
				</Alert>
				<Button
					variant="subtle"
					size="sm"
					onPress={() => setToastOpen(true)}
					accessibilityLabel="show toast"
				>
					show toast
				</Button>
				<Toast open={toastOpen} onOpenChange={setToastOpen} duration={2500}>
					<Toast.Title>saved</Toast.Title>
					<Toast.Description>changes are live</Toast.Description>
				</Toast>
				<View testID="k-demo-tabs">
					<Tabs
						items={[
							{ value: "one", label: "One" },
							{ value: "two", label: "Two" },
						]}
						value={tab}
						onValueChange={setTab}
					>
						<KText size="sm">
							{tab === "one" ? "first tab panel" : "second tab panel"}
						</KText>
					</Tabs>
				</View>
				<View style={stylesheet.componentRow} testID="k-demo-segmented">
					<SegmentedControl
						data={["day", "week", "month"]}
						value={range}
						onValueChange={setRange}
						accessibilityLabel="range"
					/>
				</View>
				<EmptyState
					title="No projects yet"
					description="Create your first project to get started."
					action={{ label: "New project", onPress: () => undefined }}
				/>
				<View style={stylesheet.componentRow} testID="k-demo-tags">
					<Tag>beta</Tag>
					<Tag variant="solid" color="primary">
						v2.0
					</Tag>
					<Tag variant="outline" color="success" onRemove={() => undefined}>
						clearance
					</Tag>
				</View>
				<View style={stylesheet.componentRow} testID="k-demo-rating">
					<Rating value={rating} onValueChange={setRating} />
					<Rating value={3.5} allowHalf readOnly />
				</View>
				<View style={stylesheet.componentRow} testID="k-demo-pagination">
					<Pagination
						total={9}
						page={pageNumber}
						onPageChange={setPageNumber}
					/>
				</View>
				<View testID="k-demo-slider">
					<Slider
						value={[volume]}
						onValueChange={(v) => setVolume(v[0])}
						accessibilityLabel="volume"
					/>
					<KText size="sm">volume {volume}</KText>
				</View>
				<Sheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
					<Sheet.Body>
						<Text style={stylesheet.current}>
							Bottom sheet — press the overlay or drag to dismiss.
						</Text>
						<Button fullWidth onPress={() => setSheetOpen(false)}>
							done
						</Button>
					</Sheet.Body>
				</Sheet>
			</ScrollView>
		</GestureHandlerRootView>
	);
}
