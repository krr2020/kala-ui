import { Tabs, Text as KText } from "@kala-ui/react-native";
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
						variant="pill" fills the active trigger primary; the badge flips to
						a card chip so it stays visible
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
