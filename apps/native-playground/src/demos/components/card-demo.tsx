import {
	Button,
	Card,
	Heading,
	Text as KText,
	Separator,
} from "@kala-ui/react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function CardDemo() {
	return (
		<View testID="k-demo-card" style={demoStyles.routeContent}>
			<DemoBlock label="basic">
				<Card>
					<Heading size="h6">card</Heading>
					<KText color="muted" size="sm">
						Themed surface with card tokens.
					</KText>
				</Card>
			</DemoBlock>
			<DemoBlock label="composed content">
				<Card>
					<Heading size="h5">notifications</Heading>
					<KText color="muted" size="sm">
						Get a digest of activity once a day.
					</KText>
					<Separator />
					<View style={demoStyles.componentRow}>
						<Button size="sm">enable</Button>
						<Button size="sm" variant="ghost">
							not now
						</Button>
					</View>
				</Card>
			</DemoBlock>
			<DemoBlock label="custom style">
				<Card style={{ padding: 24 }}>
					<KText size="sm" color="muted">
						relaxed padding via style prop
					</KText>
				</Card>
			</DemoBlock>
		</View>
	);
}
