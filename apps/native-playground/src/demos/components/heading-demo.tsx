import { Heading } from "@kala-ui/react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const SIZES = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
const WEIGHTS = ["default", "medium", "semibold", "extrabold"] as const;

export function HeadingDemo() {
	return (
		<View testID="k-demo-heading" style={demoStyles.routeContent}>
			<DemoBlock label="sizes">
				<View style={demoStyles.block}>
					{SIZES.map((size) => (
						<Heading key={size} size={size}>
							{size} heading
						</Heading>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="weights (h4)">
				<View style={demoStyles.block}>
					{WEIGHTS.map((weight) => (
						<Heading key={weight} size="h4" weight={weight}>
							weight {weight}
						</Heading>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="align">
				<View style={demoStyles.block}>
					<Heading size="h5" align="left">
						align left
					</Heading>
					<Heading size="h5" align="center">
						align center
					</Heading>
					<Heading size="h5" align="right">
						align right
					</Heading>
				</View>
			</DemoBlock>
		</View>
	);
}
