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
			<DemoBlock label="text input">
				<View style={demoStyles.componentRow} testID="k-demo-input">
					<TextInput placeholder="email" accessibilityLabel="email field" />
					<TextInput
						placeholder="error"
						accessibilityLabel="error field"
						hasError
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="controls">
				<View style={demoStyles.componentRow} testID="k-demo-controls">
					<Checkbox
						accessibilityLabel="agree to terms"
						value={agree}
						onValueChange={setAgree}
					/>
					<KText size="sm">agree</KText>
					<Switch
						accessibilityLabel="auto sync"
						value={sync}
						onValueChange={setSync}
					/>
					<KText size="sm">sync</KText>
				</View>
			</DemoBlock>
			<DemoBlock label="labels">
				<View style={demoStyles.componentRow} testID="k-demo-labels">
					<Label required>email</Label>
					<Label>notes</Label>
				</View>
			</DemoBlock>
			<DemoBlock label="spinners">
				<View style={demoStyles.componentRow} testID="k-demo-spinners">
					<Spinner size="sm" />
					<Spinner />
					<Spinner size="lg" variant="muted" />
					<Spinner size="xl" variant="ghost" />
				</View>
			</DemoBlock>
			<DemoBlock label="progress">
				<View testID="k-demo-progress">
					<Progress value={30} />
					<Progress value={70} color="success" showValue />
					<Progress value={50} color="info" label="uploading" />
				</View>
			</DemoBlock>
			<DemoBlock label="skeletons">
				<View style={demoStyles.componentRow} testID="k-demo-skeletons">
					<Skeleton style={{ width: 96, height: 12 }} />
					<Skeleton variant="circle" style={{ width: 32, height: 32 }} />
					<Skeleton style={{ width: 64, height: 12 }} variant="rect" />
				</View>
			</DemoBlock>
			<DemoBlock label="radio group">
				<View style={demoStyles.componentRow} testID="k-demo-radios">
					<RadioGroup
						value={plan}
						onValueChange={setPlan}
						accessibilityLabel="plan"
					>
						<RadioGroup.Item
							value="basic"
							label="Basic"
							description="one project"
						/>
						<RadioGroup.Item
							value="pro"
							label="Pro"
							description="unlimited projects"
						/>
					</RadioGroup>
				</View>
			</DemoBlock>
			<DemoBlock label="avatar group">
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
			<DemoBlock label="ring progress">
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
			<DemoBlock label="steps">
				<View style={demoStyles.componentRow} testID="k-demo-steps">
					<Steps
						items={[
							{ title: "account", description: "email + password" },
							{ title: "profile", description: "name + avatar" },
							{ title: "confirm" },
						]}
						defaultValue={2}
						onStepChange={() => undefined}
					/>
				</View>
			</DemoBlock>
			<DemoBlock label="timeline">
				<View style={demoStyles.componentRow} testID="k-demo-timeline">
					<Timeline
						items={[
							{
								title: "order placed",
								description: "cart locked",
								timestamp: "09:00",
							},
							{ title: "shipped", timestamp: "12:30", status: "success" },
							{
								title: "delivered",
								description: "signed at the door",
								status: "warning",
							},
						]}
					/>
				</View>
			</DemoBlock>
		</>
	);
}
