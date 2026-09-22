/**
 * Header: the mobile app-bar. Title centered between an optional leading
 * back affordance and trailing actions; every arm carries a label so the
 * bar reads cleanly under TalkBack/VoiceOver. Skeleton keeps the marker.
 */
import { ChevronLeft } from "lucide-react-native";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import {
	actionLabelStyle,
	actionsRowStyle,
	barStyle,
	ICON,
	titleStyle,
	touchTargetStyle,
} from "./header.styles";
import type { HeaderProps } from "./header.types";
import { HeaderSkeleton } from "./header-skeleton";

export function Header({
	title,
	onBack,
	backLabel = "Go back",
	actions,
	isLoading = false,
	style,
	styles,
	testID = "k-header",
}: HeaderProps): ReactElement {
	const { theme } = useUnistyles();

	if (isLoading) {
		return <HeaderSkeleton style={style} styles={styles} testID={testID} />;
	}

	return (
		<View testID={testID} style={[barStyle(theme), style, styles?.root]}>
			{onBack ? (
				<Pressable
					testID="k-header-back"
					accessibilityRole="button"
					accessibilityLabel={backLabel}
					onPress={onBack}
					hitSlop={8}
					style={touchTargetStyle}
				>
					<ChevronLeft size={ICON} color={theme.foreground} />
				</Pressable>
			) : null}

			<Text
				numberOfLines={1}
				accessibilityRole="header"
				accessibilityLabel={title}
				style={titleStyle(theme)}
			>
				{title}
			</Text>

			{actions && actions.length > 0 ? (
				<View style={actionsRowStyle}>
					{actions.map((action, i) => (
						<Pressable
							key={action.label}
							testID={`k-header-action-${i}`}
							accessibilityRole="button"
							accessibilityLabel={action.label}
							accessibilityState={{ disabled: action.disabled || undefined }}
							disabled={action.disabled}
							onPress={action.onPress}
							hitSlop={8}
							style={touchTargetStyle}
						>
							{action.icon ?? (
								<Text style={actionLabelStyle(theme)}>{action.label}</Text>
							)}
						</Pressable>
					))}
				</View>
			) : null}
		</View>
	);
}
