import {
	Avatar,
	Badge,
	Button,
	Card,
	Checkbox,
	Heading,
	Icon,
	Text as KText,
	Label,
	Progress,
	RadioGroup,
	Separator,
	Skeleton,
	Spinner,
	Switch,
	TextInput,
} from "@kala-ui/react-native";
import { Sun } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { demoStyles } from "./stylesheet";

export function BasicsDemo() {
	const [agree, setAgree] = useState(false);
	const [sync, setSync] = useState(true);
	const [plan, setPlan] = useState("pro");
	return (
		<>
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
			<View style={demoStyles.componentRow} testID="k-demo-icons">
				{(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
					<Icon key={size} icon={Sun} size={size} />
				))}
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-text">
				<Heading size="h3">typography</Heading>
				{(["xs", "sm", "md", "lg"] as const).map((size) => (
					<KText key={size} size={size} color="muted">
						size {size}
					</KText>
				))}
				<KText truncate>truncated line that clamps with a tail ellipsis</KText>
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-input">
				<TextInput placeholder="email" accessibilityLabel="email field" />
				<TextInput
					placeholder="error"
					accessibilityLabel="error field"
					hasError
				/>
			</View>
			<Card testID="k-demo-card">
				<Heading size="h6">card</Heading>
				<KText color="muted" size="sm">
					Themed surface with card tokens.
				</KText>
			</Card>
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
			<View style={demoStyles.componentRow} testID="k-demo-avatars">
				{(["xs", "sm", "md", "lg"] as const).map((size) => (
					<Avatar key={size} name="Ada Lovelace" size={size} />
				))}
				<Avatar name="Grace Hopper" size="lg" status="online" />
				<Avatar name="Alan Turing" size="lg" status="offline" />
			</View>
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
			<View style={demoStyles.componentRow} testID="k-demo-labels">
				<Label required>email</Label>
				<Label>notes</Label>
			</View>
			<Separator />
			<View style={demoStyles.componentRow} testID="k-demo-spinners">
				<Spinner size="sm" />
				<Spinner />
				<Spinner size="lg" variant="muted" />
				<Spinner size="xl" variant="ghost" />
			</View>
			<View testID="k-demo-progress">
				<Progress value={30} />
				<Progress value={70} color="success" showValue />
				<Progress value={50} color="info" label="uploading" />
			</View>
			<View style={demoStyles.componentRow} testID="k-demo-skeletons">
				<Skeleton style={{ width: 96, height: 12 }} />
				<Skeleton variant="circle" style={{ width: 32, height: 32 }} />
				<Skeleton style={{ width: 64, height: 12 }} variant="rect" />
			</View>
			<View testID="k-demo-radios">
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
		</>
	);
}
