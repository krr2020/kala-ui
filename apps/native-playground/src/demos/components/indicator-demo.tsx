import { Avatar, Icon, Indicator, Text as KText } from "@kala-ui/react-native";
import { Bell, Mail, MessageCircle } from "lucide-react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const POSITIONS = [
	["top-left", 0],
	["top-right", 0],
	["bottom-right", 4],
	["middle-left", 0],
] as const;

export function IndicatorDemo() {
	return (
		<View style={demoStyles.routeContent} testID="k-demo-indicator">
			<DemoBlock label="On Avatar">
				<View style={demoStyles.componentRow}>
					<Indicator
						color="success"
						size={12}
						offset={8}
						position="bottom-right"
						withBorder
					>
						<Avatar name="Grace Hopper" size="lg" />
					</Indicator>
					<Indicator
						color="destructive"
						processing
						size={12}
						offset={8}
						position="bottom-right"
						withBorder
					>
						<Avatar name="Alan Turing" size="lg" />
					</Indicator>
					<Indicator
						label={3}
						size={16}
						offset={10}
						position="top-right"
						withBorder
					>
						<Avatar name="Ada Lovelace" size="lg" />
					</Indicator>
					<Indicator
						disabled
						size={12}
						offset={8}
						position="bottom-right"
						withBorder
					>
						<Avatar name="Katherine Johnson" size="lg" />
					</Indicator>
				</View>
			</DemoBlock>
			<DemoBlock label="On Icons">
				<View style={demoStyles.componentRow}>
					<Indicator label={9} size={16} withBorder>
						<Icon icon={Bell} size="lg" />
					</Indicator>
					<Indicator label="99+" size={16} color="warning" withBorder>
						<Icon icon={Mail} size="lg" />
					</Indicator>
					<Indicator label={1} size={16} color="destructive" withBorder>
						<Icon icon={MessageCircle} size="lg" />
					</Indicator>
					<Indicator disabled label={0}>
						<Icon icon={Bell} size="lg" />
					</Indicator>
				</View>
			</DemoBlock>
			<DemoBlock label="Positions">
				<View style={demoStyles.componentRow}>
					{POSITIONS.map(([position, offset]) => (
						<View key={position} style={demoStyles.indicatorFigure}>
							<Indicator position={position} offset={offset} color="info">
								<View style={demoStyles.indicatorTarget} />
							</Indicator>
							<KText size="xs">{position}</KText>
						</View>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Bordered And Hidden">
				<View style={demoStyles.componentRow}>
					<View style={demoStyles.indicatorFigure}>
						<Indicator disabled label="0">
							<View style={demoStyles.indicatorTarget} />
						</Indicator>
						<KText size="xs">disabled</KText>
					</View>
					<View style={demoStyles.indicatorFigure}>
						<Indicator withBorder color="destructive" label="!" size={16}>
							<View style={demoStyles.indicatorTarget} />
						</Indicator>
						<KText size="xs">bordered</KText>
					</View>
				</View>
			</DemoBlock>
			<DemoBlock label="Inline">
				<View style={demoStyles.componentRow}>
					<Indicator
						inline
						color="success"
						size={8}
						position="middle-right"
						offset={4}
					>
						<KText size="sm">New messages</KText>
					</Indicator>
				</View>
			</DemoBlock>
		</View>
	);
}
