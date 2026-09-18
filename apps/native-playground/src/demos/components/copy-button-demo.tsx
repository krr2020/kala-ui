import { CopyButton } from "@kala-ui/react-native-app";
import { Check } from "lucide-react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function CopyButtonDemo() {
	return (
		<View style={demoStyles.routeContent} testID="k-demo-copy-button">
			<DemoBlock label="Default">
				<View style={demoStyles.componentRow}>
					<CopyButton value="kala-ui" writeClipboard={async () => undefined} />
				</View>
			</DemoBlock>
			<DemoBlock label="Variants">
				<View style={demoStyles.componentRow}>
					<CopyButton
						value="pnpm dlx kala"
						variant="outline"
						writeClipboard={async () => undefined}
					/>
					<CopyButton
						value="v2.0.1"
						variant="ghost"
						writeClipboard={async () => undefined}
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="Custom Icons">
				<View style={demoStyles.componentRow}>
					<CopyButton
						value="shared secret"
						writeClipboard={async () => undefined}
						checkIcon={<Check size={16} color="green" />}
					/>
					<CopyButton
						value="broken clip"
						writeClipboard={async () => {
							throw new Error("clipboard unavailable");
						}}
					/>
				</View>
			</DemoBlock>
		</View>
	);
}
