import { Avatar, Icon, Indicator, Text as KText } from "@kala-ui/react-native";
import { Bell, Mail, MessageCircle } from "lucide-react-native";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const CORNERS = [
	{ vertical: "top", horizontal: "left", label: "top-left" },
	{ vertical: "top", horizontal: "right", label: "top-right" },
	{ vertical: "bottom", horizontal: "left", label: "bottom-left" },
	{ vertical: "bottom", horizontal: "right", label: "bottom-right" },
] as const;

export function IndicatorDemo() {
	return (
		<View style={demoStyles.routeContent} testID="k-demo-indicator">
			<DemoBlock label="On Avatar">
				<View style={demoStyles.componentRow}>
					<Indicator
						dot
						color="success"
						size={12}
						overlap="circular"
						anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
						withBorder
					>
						<Avatar name="Grace Hopper" size="lg" />
					</Indicator>
					<Indicator
						dot
						color="destructive"
						processing
						size={12}
						overlap="circular"
						anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
						withBorder
					>
						<Avatar name="Alan Turing" size="lg" />
					</Indicator>
					<Indicator
						badgeContent={3}
						overlap="circular"
						anchorOrigin={{ vertical: "top", horizontal: "right" }}
						withBorder
					>
						<Avatar name="Ada Lovelace" size="lg" />
					</Indicator>
					<Indicator dot invisible>
						<Avatar name="Katherine Johnson" size="lg" />
					</Indicator>
				</View>
			</DemoBlock>
			<DemoBlock label="On Icons">
				<View style={demoStyles.componentRow}>
					<Indicator badgeContent={9} withBorder>
						<View style={demoStyles.iconTarget}>
							<Icon icon={Bell} size="lg" />
						</View>
					</Indicator>
					<Indicator badgeContent={120} color="warning" withBorder>
						<View style={demoStyles.iconTarget}>
							<Icon icon={Mail} size="lg" />
						</View>
					</Indicator>
					<Indicator badgeContent={1} color="destructive" withBorder>
						<View style={demoStyles.iconTarget}>
							<Icon icon={MessageCircle} size="lg" />
						</View>
					</Indicator>
					{/* zero hides by default — a cleared inbox reads as no badge */}
					<Indicator badgeContent={0} color="info">
						<View style={demoStyles.iconTarget}>
							<Icon icon={Bell} size="lg" />
						</View>
					</Indicator>
					<Indicator dot>
						<View style={demoStyles.iconTarget}>
							<Icon icon={Bell} size="lg" />
						</View>
					</Indicator>
				</View>
			</DemoBlock>
			<DemoBlock label="Anchor Corners">
				<View style={demoStyles.componentRow}>
					{CORNERS.map(({ label, ...anchorOrigin }) => (
						<View key={label} style={demoStyles.indicatorFigure}>
							<Indicator dot size={12} anchorOrigin={anchorOrigin} withBorder>
								<View style={demoStyles.indicatorTarget} />
							</Indicator>
							<KText size="xs">{label}</KText>
						</View>
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="Counts And Pulse">
				<View style={demoStyles.componentRow}>
					<Indicator dot color="success" processing size={12} withBorder>
						<View style={demoStyles.indicatorTarget} />
					</Indicator>
					<Indicator badgeContent={0} showZero withBorder>
						<View style={demoStyles.indicatorTarget} />
					</Indicator>
					<Indicator badgeContent="!" color="warning" withBorder>
						<View style={demoStyles.indicatorTarget} />
					</Indicator>
					<Indicator dot invisible size={12}>
						<View style={demoStyles.indicatorTarget} />
					</Indicator>
				</View>
			</DemoBlock>
			<DemoBlock label="Inline">
				<View style={demoStyles.componentRow}>
					<Indicator inline dot color="success">
						<KText>New messages</KText>
					</Indicator>
				</View>
			</DemoBlock>
		</View>
	);
}
