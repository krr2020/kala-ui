import {
	Avatar,
	AvatarGroup,
	Badge,
	Button,
	Card,
	Checkbox,
	Heading,
	Icon,
	Text as KText,
	Label,
	List,
	ListItem,
	ListItemAvatar,
	ListItemBadge,
	ListItemContent,
	ListItemTitle,
	Progress,
	RadioGroup,
	RingProgress,
	Separator,
	Skeleton,
	Spinner,
	Steps,
	Switch,
	TextInput,
	Timeline,
} from "@kala-ui/react-native";
import { Sun } from "lucide-react-native";
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
			<DemoBlock label="buttons">
				<View style={demoStyles.componentRow} testID="k-demo-buttons">
					<Button variant="outline" color="secondary">
						outline
					</Button>
					<Button variant="ghost" color="destructive">
						ghost
					</Button>
					<Button variant="subtle" color="muted" size="sm">
						subtle
					</Button>
					<Button variant="link" size="sm">
						link
					</Button>
					<Button size="icon" accessibilityLabel="sun">
						<Icon icon={Sun} size="sm" />
					</Button>
				</View>
			</DemoBlock>
			<DemoBlock label="icons">
				<View style={demoStyles.componentRow} testID="k-demo-icons">
					{(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
						<Icon key={size} icon={Sun} size={size} />
					))}
				</View>
			</DemoBlock>
			<DemoBlock label="list">
				<List testID="k-demo-list">
					<ListItem>
						<ListItemAvatar name="Ada Lovelace" size="sm" />
						<ListItemContent>
							<ListItemTitle>Ada Lovelace</ListItemTitle>
						</ListItemContent>
						<ListItemBadge color="success">active</ListItemBadge>
					</ListItem>
					<ListItem>
						<ListItemAvatar name="Alan Turing" size="sm" />
						<ListItemContent>
							<ListItemTitle>Alan Turing</ListItemTitle>
						</ListItemContent>
					</ListItem>
				</List>
			</DemoBlock>
			<DemoBlock label="typography">
				<View style={demoStyles.componentRow} testID="k-demo-text">
					<Heading size="h3">typography</Heading>
					{(["xs", "sm", "md", "lg"] as const).map((size) => (
						<KText key={size} size={size} color="muted">
							size {size}
						</KText>
					))}
					<KText truncate>
						truncated line that clamps with a tail ellipsis
					</KText>
				</View>
			</DemoBlock>
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
			<DemoBlock label="card">
				<Card testID="k-demo-card">
					<Heading size="h6">card</Heading>
					<KText color="muted" size="sm">
						Themed surface with card tokens.
					</KText>
				</Card>
			</DemoBlock>
			<DemoBlock label="badges">
				<View style={demoStyles.componentRow} testID="k-demo-badges">
					<Badge>solid</Badge>
					<Badge variant="outline" color="success">
						outline
					</Badge>
					<Badge variant="subtle" color="info">
						subtle
					</Badge>
					<Badge variant="subtle" color="destructive" shape="pill">
						pill
					</Badge>
				</View>
			</DemoBlock>
			<DemoBlock label="avatars">
				<View style={demoStyles.componentRow} testID="k-demo-avatars">
					{(["xs", "sm", "md", "lg"] as const).map((size) => (
						<Avatar key={size} name="Ada Lovelace" size={size} />
					))}
					<Avatar name="Grace Hopper" size="lg" status="online" />
					<Avatar name="Alan Turing" size="lg" status="offline" />
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
			<DemoBlock label="separator">
				<Separator />
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
				<View style={demoStyles.componentRow} testID="k-demo-avatar-group">
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
