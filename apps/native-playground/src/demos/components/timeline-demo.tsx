import { Timeline } from "@kala-ui/react-native-app";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function TimelineDemo() {
	return (
		<View style={demoStyles.routeContent} testID="k-demo-timeline">
			<DemoBlock label="Delivery Tracking">
				<Timeline
					items={[
						{
							title: "Order placed",
							description: "Cart locked",
							timestamp: "09:00",
						},
						{ title: "Shipped", timestamp: "12:30", status: "success" },
						{
							title: "Delivered",
							description: "Signed at the door",
							status: "warning",
						},
					]}
				/>
			</DemoBlock>
			<DemoBlock label="Status Arms">
				<Timeline
					items={[
						{ title: "Charged", status: "success", timestamp: "mon" },
						{ title: "Refunded", status: "error", timestamp: "tue" },
						{ title: "On hold", status: "warning", timestamp: "wed" },
						{ title: "Queued", status: "pending", timestamp: "thu" },
						{ title: "Reviewed", timestamp: "fri" },
					]}
				/>
			</DemoBlock>
		</View>
	);
}
