import {
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
							<ListItemText>first programmer</ListItemText>
						</ListItemContent>
					</ListItem>
					<ListItem>
						<ListItemContent>
							<ListItemTitle>Alan Turing</ListItemTitle>
							<ListItemText truncate>
								machine intelligence and the imitation game, clamped to one line
								with a tail ellipsis
							</ListItemText>
						</ListItemContent>
					</ListItem>
				</List>
			</DemoBlock>
			<DemoBlock label="icons & badges">
				<List>
					<ListItem>
						<ListItemIcon size="sm">✉</ListItemIcon>
						<ListItemContent>
							<ListItemTitle>inbox</ListItemTitle>
						</ListItemContent>
						<ListItemBadge color="primary">12</ListItemBadge>
					</ListItem>
					<ListItem>
						<ListItemIcon size="md">⚑</ListItemIcon>
						<ListItemContent>
							<ListItemTitle>flagged</ListItemTitle>
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
							<ListItemText lines={1}>analytical engine</ListItemText>
						</ListItemContent>
					</ListItem>
					<ListItem>
						<ListItemAvatar name="Grace Hopper" size="sm" />
						<ListItemContent>
							<ListItemTitle>Grace Hopper</ListItemTitle>
							<ListItemText lines={1}>compiler pioneer</ListItemText>
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
							<ListItemTitle>{pressed ? "tapped!" : "tap me"}</ListItemTitle>
						</ListItemContent>
					</ListItem>
					<ListItem active>
						<ListItemContent>
							<ListItemTitle>active row</ListItemTitle>
						</ListItemContent>
					</ListItem>
					<ListItem disabled>
						<ListItemContent>
							<ListItemTitle>disabled row</ListItemTitle>
						</ListItemContent>
					</ListItem>
					<ListItem dense>
						<ListItemContent>
							<ListItemTitle>dense row</ListItemTitle>
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
