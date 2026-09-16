import {
	Icon,
	List,
	ListItem,
	ListItemAction,
	ListItemAvatar,
	ListItemBadge,
	ListItemContent,
	ListItemIcon,
	ListItemText,
	ListItemTitle,
	Spinner,
} from "@kala-ui/react-native";
import { Flag, Inbox } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function ListDemo() {
	const [pressed, setPressed] = useState(false);
	return (
		<View testID="k-demo-list" style={demoStyles.routeContent}>
			<DemoBlock label="simple rows">
				<List>
					<ListItem>
						<ListItemContent>
							<ListItemTitle>Ada Lovelace</ListItemTitle>
							<ListItemText>First programmer</ListItemText>
						</ListItemContent>
					</ListItem>
					<ListItem>
						<ListItemContent>
							<ListItemTitle>Alan Turing</ListItemTitle>
							<ListItemText truncate>
								Machine intelligence and the imitation game, clamped to one line
								with a tail ellipsis
							</ListItemText>
						</ListItemContent>
					</ListItem>
				</List>
			</DemoBlock>
			<DemoBlock label="icons & badges">
				<List>
					<ListItem>
						<ListItemIcon size="sm">
							<Icon icon={Inbox} size="sm" />
						</ListItemIcon>
						<ListItemContent>
							<ListItemTitle>Inbox</ListItemTitle>
						</ListItemContent>
						<ListItemBadge color="primary">12</ListItemBadge>
					</ListItem>
					<ListItem>
						<ListItemIcon size="md">
							<Icon icon={Flag} size="md" />
						</ListItemIcon>
						<ListItemContent>
							<ListItemTitle>Flagged</ListItemTitle>
						</ListItemContent>
						<ListItemBadge color="success">active</ListItemBadge>
					</ListItem>
				</List>
			</DemoBlock>
			<DemoBlock label="avatars & secondary text">
				<List>
					<ListItem>
						<ListItemAvatar name="Ada Lovelace" size="sm" />
						<ListItemContent>
							<ListItemTitle>Ada Lovelace</ListItemTitle>
							<ListItemText lines={1}>Analytical engine</ListItemText>
						</ListItemContent>
					</ListItem>
					<ListItem>
						<ListItemAvatar name="Grace Hopper" size="sm" />
						<ListItemContent>
							<ListItemTitle>Grace Hopper</ListItemTitle>
							<ListItemText lines={1}>Compiler pioneer</ListItemText>
						</ListItemContent>
					</ListItem>
				</List>
			</DemoBlock>
			<DemoBlock label="interactive & states">
				<List>
					<ListItem
						interactive
						onPress={() => setPressed(true)}
						accessibilityLabel="tap me row"
					>
						<ListItemContent>
							<ListItemTitle>{pressed ? "Tapped!" : "Tap me"}</ListItemTitle>
						</ListItemContent>
					</ListItem>
					<ListItem active>
						<ListItemContent>
							<ListItemTitle>Active row</ListItemTitle>
						</ListItemContent>
					</ListItem>
					<ListItem disabled>
						<ListItemContent>
							<ListItemTitle>Disabled row</ListItemTitle>
						</ListItemContent>
					</ListItem>
					<ListItem dense>
						<ListItemContent>
							<ListItemTitle>Dense row</ListItemTitle>
						</ListItemContent>
						<ListItemAction>
							<Spinner size="sm" />
						</ListItemAction>
					</ListItem>
				</List>
			</DemoBlock>
			<DemoBlock label="loading skeleton">
				<List
					isLoading
					accessibilityLabel="loading list"
					skeletonConfig={{ variant: "withAvatar", itemCount: 3 }}
				/>
			</DemoBlock>
		</View>
	);
}
