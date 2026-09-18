import { Button, RingProgress, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const TONES = [
	"primary",
	"secondary",
	"destructive",
	"success",
	"warning",
	"info",
] as const;

export function RingProgressDemo() {
	const [ring, setRing] = useState(0);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-ring-progress">
			<DemoBlock label="Basic">
				<RingProgress value={64} label="64%" accessibilityLabel="basic ring" />
			</DemoBlock>
			<DemoBlock label="Tones">
				<View style={demoStyles.componentRow}>
					{TONES.map((tone) => (
						<RingProgress
							key={tone}
							value={55}
							size={56}
							thickness={7}
							color={tone}
							accessibilityLabel={`${tone} ring`}
						/>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Sizes">
				<View style={demoStyles.componentRow}>
					<RingProgress
						size={64}
						thickness={7}
						value={40}
						accessibilityLabel="small ring"
					/>
					<RingProgress
						size={96}
						thickness={10}
						value={60}
						accessibilityLabel="medium ring"
					/>
					<RingProgress
						size={120}
						thickness={12}
						value={80}
						accessibilityLabel="large ring"
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="Track And Caps">
				<View style={demoStyles.componentRow}>
					<RingProgress
						value={70}
						size={72}
						thickness={8}
						emptyColor="secondary"
						accessibilityLabel="secondary track ring"
					/>
					<RingProgress
						value={70}
						size={72}
						thickness={8}
						roundCaps={false}
						accessibilityLabel="butt cap ring"
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="Sections">
				<RingProgress
					size={96}
					thickness={10}
					sections={[
						{ value: 30, color: "success" },
						{ value: 20, color: "warning" },
						{ value: 15, color: "destructive" },
					]}
					label="Stacked"
					accessibilityLabel="stacked sections ring"
				/>
			</DemoBlock>
			<DemoBlock label="Boundaries">
				<View style={demoStyles.componentRow}>
					<RingProgress
						value={0}
						size={64}
						thickness={7}
						accessibilityLabel="empty ring"
					/>
					<RingProgress
						value={100}
						size={64}
						thickness={7}
						accessibilityLabel="full ring"
					/>
					<RingProgress
						value={140}
						size={64}
						thickness={7}
						accessibilityLabel="over-clamped ring"
					/>
				</View>
				<KText size="sm">140 clamps to 100% and 0 hides the arc</KText>
			</DemoBlock>
			<DemoBlock label="Simulate Sync">
				<View style={demoStyles.componentRow}>
					<Button
						size="sm"
						onPress={() => setRing((r) => Math.min(100, r + 25))}
						accessibilityLabel="Advance ring"
					>
						Advance
					</Button>
					<Button
						size="sm"
						variant="outline"
						onPress={() => setRing(0)}
						accessibilityLabel="Reset ring"
					>
						Reset
					</Button>
				</View>
				<RingProgress
					value={ring}
					label={`${ring}%`}
					size={72}
					thickness={8}
					accessibilityLabel="sync ring"
				/>
				<KText size="sm">Value: {ring}%</KText>
			</DemoBlock>
		</View>
	);
}
