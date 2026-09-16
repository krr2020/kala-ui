import { Text as KText, Separator } from "@kala-ui/react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function SeparatorDemo() {
	return (
		<View testID="k-demo-separator" style={demoStyles.routeContent}>
			<DemoBlock label="horizontal">
				<View style={demoStyles.block}>
					<KText size="sm" color="muted">
						above
					</KText>
					<Separator />
					<KText size="sm" color="muted">
						below
					</KText>
				</View>
			</DemoBlock>
			<DemoBlock label="vertical">
				<View style={demoStyles.componentRow}>
					<KText size="sm" color="muted">
						left
					</KText>
					<Separator orientation="vertical" style={{ height: 32 }} />
					<KText size="sm" color="muted">
						right
					</KText>
				</View>
			</DemoBlock>
			<DemoBlock label="labelled (decorative=false)">
				<Separator decorative={false} accessibilityLabel="section break" />
			</DemoBlock>
		</View>
	);
}
