import { Tabs, Text as KText } from "@kala-ui/react-native";
import { Calendar, Home, Search, Settings } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const PANELS: Record<string, string> = {
	overview: "everything at a glance — counts, health, recent activity",
	activity: "the audit trail: who changed what, newest first",
	settings: "workspace defaults, members and billing",
};

export function TabsDemo() {
	const [tab, setTab] = useState("overview");
	return (
		<View style={demoStyles.routeContent} testID="k-demo-tabs">
			<DemoBlock label="Line — divider + active fill">
				<Tabs
					items={[
						{ value: "overview", label: "Overview" },
						{ value: "activity", label: "Activity", badge: 3 },
						{ value: "settings", label: "Settings", indicator: true },
					]}
					value={tab}
					onValueChange={setTab}
				>
					<KText size="sm" color="muted">
						{PANELS[tab]}
					</KText>
				</Tabs>
			</DemoBlock>
			<DemoBlock label="Pill — rounded, primary fill">
				<Tabs
					variant="pill"
					defaultValue="grid"
					items={[
						{ value: "grid", label: "Grid" },
						{ value: "list", label: "List", badge: 12 },
						{ value: "lock", label: "Locked", disabled: true },
					]}
				>
					<KText size="sm" color="muted">
						the pill group sits inside a rounded muted wrapper; the active
						trigger fills primary
					</KText>
				</Tabs>
			</DemoBlock>
			<DemoBlock label="Icons — lucide glyphs per tab">
				<Tabs
					defaultValue="home"
					items={[
						{ value: "home", label: "Home", icon: Home },
						{ value: "search", label: "Search", icon: Search },
						{ value: "events", label: "Events", icon: Calendar },
						{ value: "prefs", label: "Prefs", icon: Settings, disabled: true },
					]}
				>
					<KText size="sm" color="muted">
						icons tint with selection: foreground when active, muted when idle
					</KText>
				</Tabs>
			</DemoBlock>
			<DemoBlock label="Long label — bounded to two lines">
				<Tabs
					items={[
						{
							value: "territory",
							label: "Territory management for the western region sales pod",
						},
						{ value: "short", label: "Short" },
					]}
				>
					<KText size="sm" color="muted">
						labels wrap at most two lines and ellipsize, so one long tab never
						stretches the row unboundedly
					</KText>
				</Tabs>
			</DemoBlock>
			<DemoBlock label="Custom slotStyles — override list, tab, indicator">
				<Tabs
					defaultValue="one"
					items={[
						{ value: "one", label: "One" },
						{ value: "two", label: "Two" },
					]}
					slotStyles={{
						list: { borderBottomColor: "#7c3aed", paddingHorizontal: 8 },
						tab: { paddingVertical: 10 },
						indicator: { borderBottomColor: "#7c3aed", borderBottomWidth: 4 },
					}}
				>
					<KText size="sm" color="muted">
						slotStyles land last: a violet divider + 4px underline, roomier tab
						padding
					</KText>
				</Tabs>
			</DemoBlock>
			<DemoBlock label="Vertical — leading rail + dot">
				<Tabs
					orientation="vertical"
					defaultValue="account"
					items={[
						{ value: "account", label: "Account" },
						{ value: "privacy", label: "Privacy", indicator: true },
						{ value: "notifications", label: "Alerts", badge: "99+" },
					]}
				>
					<KText size="sm" color="muted">
						stacked tabs move the selection rail to the leading edge
					</KText>
				</Tabs>
			</DemoBlock>
		</View>
	);
}
