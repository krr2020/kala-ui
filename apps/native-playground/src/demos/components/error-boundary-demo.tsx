import { Button } from "@kala-ui/react-native";
import { ErrorBoundary, ErrorFallback } from "@kala-ui/react-native-app";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

function ThrowOnce(): never {
	throw new Error("demo crash");
}

export function ErrorBoundaryDemo() {
	const [crashKey, setCrashKey] = useState(0);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-error-boundary">
			<DemoBlock label="Boundary Reset">
				<View style={demoStyles.componentRow}>
					<ErrorBoundary resetKeys={[crashKey]}>
						{crashKey % 2 === 1 ? <ThrowOnce /> : <Text>Boundary healthy</Text>}
					</ErrorBoundary>
					<Button size="sm" onPress={() => setCrashKey((k) => k + 1)}>
						Toggle Crash
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="Section Fallback">
				<ErrorFallback
					variant="section"
					error={new Error("upload failed")}
					reset={() => undefined}
				/>
			</DemoBlock>
		</View>
	);
}
