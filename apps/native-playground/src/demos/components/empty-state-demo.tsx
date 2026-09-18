import { Button } from "@kala-ui/react-native";
import { EmptyState } from "@kala-ui/react-native-app";
import { Inbox } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function EmptyStateDemo() {
	const [loading, setLoading] = useState(false);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-empty-state">
			<DemoBlock label="Default">
				<EmptyState
					icon={Inbox}
					title="No messages yet"
					description="When teammates reply, conversations land here."
					action={{ label: "Start a thread", onPress: () => undefined }}
				/>
			</DemoBlock>
			<DemoBlock label="Destructive">
				<EmptyState
					color="destructive"
					title="Could not load reports"
					description="The server closed the connection mid-fetch."
					action={{ label: "Retry", onPress: () => undefined }}
				/>
			</DemoBlock>
			<DemoBlock label="Loading Skeleton">
				<Button size="sm" onPress={() => setLoading((l) => !l)}>
					Toggle Skeleton
				</Button>
				<EmptyState
					title="No projects yet"
					description="Create your first project to get started."
					isLoading={loading}
				/>
			</DemoBlock>
		</View>
	);
}
