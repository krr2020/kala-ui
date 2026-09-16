import { Avatar } from "@kala-ui/react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
const SHAPES = ["circle", "rounded", "square"] as const;
const STATUSES = ["none", "online", "offline"] as const;

export function AvatarDemo() {
	return (
		<View testID="k-demo-avatars" style={demoStyles.routeContent}>
			<DemoBlock label="sizes (initials fallback)">
				<View style={demoStyles.componentRow}>
					{SIZES.map((size) => (
						<Avatar key={size} name="Ada Lovelace" size={size} />
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="shapes (lg)">
				<View style={demoStyles.componentRow}>
					{SHAPES.map((shape) => (
						<Avatar key={shape} name="Grace Hopper" size="lg" shape={shape} />
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="status (lg)">
				<View style={demoStyles.componentRow}>
					{STATUSES.map((status) => (
						<Avatar key={status} name="Alan Turing" size="lg" status={status} />
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="image with fallback">
				<View style={demoStyles.componentRow}>
					<Avatar
						name="Katherine Johnson"
						size="lg"
						source={{ uri: "https://invalid.example/avatar.png" }}
					/>
				</View>
			</DemoBlock>
		</View>
	);
}
