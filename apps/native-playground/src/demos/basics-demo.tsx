import {
	AvatarGroup,
	Checkbox,
	Text as KText,
	Label,
	Progress,
	RadioGroup,
	RingProgress,
	Skeleton,
	Spinner,
	Steps,
	Switch,
	TextInput,
	Timeline,
} from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "./demo-block";
import { demoStyles } from "./stylesheet";

export function BasicsDemo() {
	const [agree, setAgree] = useState(false);
	const [sync, setSync] = useState(true);
	const [plan, setPlan] = useState("pro");
	return (
		<>
			<DemoBlock label="Text Input">
				<View style={demoStyles.componentRow} testID="k-demo-input">
					<TextInput placeholder="Email" accessibilityLabel="email field" />
					<TextInput
						placeholder="Error"
						accessibilityLabel="error field"
						hasError
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="Controls">
				<View style={demoStyles.componentRow} testID="k-demo-controls">
					<Checkbox
						accessibilityLabel="agree to terms"
						value={agree}
						onValueChange={setAgree}
					/>
					<KText size="sm">Agree</KText>
					<Switch
						accessibilityLabel="auto sync"
						value={sync}
						onValueChange={setSync}
					/>
					<KText size="sm">Sync</KText>
				</View>
			</DemoBlock>
			<DemoBlock label="Labels">
				<View style={demoStyles.componentRow} testID="k-demo-labels">
					<Label required>Email</Label>
					<Label>Notes</Label>
				</View>
			</DemoBlock>
			<DemoBlock label="Spinners">
				<View style={demoStyles.componentRow} testID="k-demo-spinners">
					<Spinner size="sm" />
					<Spinner />
					<Spinner size="lg" variant="muted" />
					<Spinner size="xl" variant="ghost" />
				</View>
			</DemoBlock>
			<DemoBlock label="Progress">
				<View testID="k-demo-progress">
					<Progress value={30} />
					<Progress value={70} color="success" showValue />
					<Progress value={50} color="info" label="Upload Progress" />
				</View>
			</DemoBlock>
			<DemoBlock label="Skeletons">
				<View style={demoStyles.componentRow} testID="k-demo-skeletons">
					<Skeleton style={{ width: 96, height: 12 }} />
					<Skeleton variant="circle" style={{ width: 32, height: 32 }} />
					<Skeleton style={{ width: 64, height: 12 }} variant="rect" />
				</View>
			</DemoBlock>
			<DemoBlock label="Radio Group">
				<View style={demoStyles.componentRow} testID="k-demo-radios">
					<RadioGroup
						value={plan}
						onValueChange={setPlan}
						accessibilityLabel="plan"
					>
						<RadioGroup.Item
							value="basic"
							label="Basic"
							description="One project"
						/>
						<RadioGroup.Item
							value="pro"
							label="Pro"
							description="Unlimited projects"
						/>
					</RadioGroup>
				</View>
			</DemoBlock>
			<DemoBlock label="Avatar Group">
				<View
					style={demoStyles.componentRow}
					testID="k-demo-avatar-group-inline"
				>
					<AvatarGroup
						avatars={[
							{ name: "Ada Lovelace" },
							{ name: "Grace Hopper" },
							{ name: "Alan Turing" },
							{ name: "Katherine Johnson" },
							{ name: "Margaret Hamilton" },
						]}
						max={3}
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="Ring Progress">
				<View style={demoStyles.componentRow} testID="k-demo-ring-progress">
					<RingProgress
						value={72}
						size={64}
						thickness={8}
						accessibilityLabel="sync"
					/>
					<RingProgress
						size={64}
						thickness={8}
						sections={[
							{ value: 30, color: "success" },
							{ value: 20, color: "warning" },
						]}
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="Steps">
				<View style={demoStyles.componentRow} testID="k-demo-steps">
					<Steps
						items={[
							{ title: "Account", description: "Email + password" },
							{ title: "Profile", description: "Name + avatar" },
							{ title: "Confirm" },
						]}
						defaultValue={2}
						onStepChange={() => undefined}
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="Timeline">
				<View style={demoStyles.componentRow} testID="k-demo-timeline">
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
				</View>
			</DemoBlock>
		</>
	);
}
