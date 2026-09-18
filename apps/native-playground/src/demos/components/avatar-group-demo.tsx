import { AvatarGroup } from "@kala-ui/react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const TEAM = [
	{ name: "Ada Lovelace" },
	{ name: "Grace Hopper" },
	{ name: "Alan Turing" },
	{ name: "Katherine Johnson" },
	{ name: "Margaret Hamilton" },
	{ name: "Edsger Dijkstra" },
];

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export function AvatarGroupDemo() {
	return (
		<View testID="k-demo-avatar-group" style={demoStyles.routeContent}>
			<DemoBlock label="Sizes">
				<View style={demoStyles.componentRow}>
					{SIZES.map((size) => (
						<AvatarGroup key={size} avatars={TEAM.slice(0, 3)} size={size} />
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Overflow (+N)">
				<View style={demoStyles.componentRow}>
					<AvatarGroup avatars={TEAM} max={3} />
				</View>
			</DemoBlock>
			<DemoBlock label="Max above count">
				<View style={demoStyles.componentRow}>
					<AvatarGroup avatars={TEAM} max={10} />
				</View>
			</DemoBlock>
			<DemoBlock label="Max=0 (chip only)">
				<View style={demoStyles.componentRow}>
					<AvatarGroup avatars={TEAM} max={0} />
				</View>
			</DemoBlock>
			<DemoBlock label="Default max (4)">
				<View style={demoStyles.componentRow}>
					<AvatarGroup avatars={TEAM} />
				</View>
			</DemoBlock>
			<DemoBlock label="Duplicate names">
				<View style={demoStyles.componentRow}>
					<AvatarGroup
						avatars={[
							{ name: "Ada Lovelace" },
							{ name: "Ada Lovelace" },
							{ name: "Grace Hopper" },
							{ name: "Grace Hopper" },
						]}
					/>
				</View>
			</DemoBlock>
		</View>
	);
}
