/**
 * List: themed card surface of rows. Web ul/li semantics map to
 * accessibilityRole list/list_item (advisory on RN); `href` opens via
 * Linking since RN has no anchor. Dividers are index-based views, not
 * CSS — full-bleed 1px regardless of dense padding.
 */

import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import { Image, Linking, Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Badge } from "../badge";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import { dividerStyle, surfaceStyle } from "./list.styles";
import type {
	ListItemActionProps,
	ListItemAvatarProps,
	ListItemBadgeProps,
	ListItemContentProps,
	ListItemIconProps,
	ListItemProps,
	ListItemTextProps,
	ListItemTitleProps,
	ListProps,
	ListSkeletonConfig,
} from "./list.types";

const ICON_SIZES = { sm: 16, md: 20, lg: 24 } as const;
const AVATAR_SIZES = { sm: 32, md: 40, lg: 48 } as const;

function initials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.slice(0, 2)
		.join("");
}

function SkeletonRow({
	variant,
	dense,
}: {
	variant: ListSkeletonConfig["variant"];
	dense: boolean;
}) {
	const lineH = dense ? 12 : 16;
	const avatar = (
		<Skeleton variant="circle" style={{ width: 32, height: 32 }} />
	);
	const line = (width: `${number}%` | number): ReactElement => (
		<Skeleton style={{ height: lineH, width }} />
	);
	const body = (children: ReactNode): ReactElement => (
		<View style={{ flex: 1, gap: dense ? 3 : 5 }}>{children}</View>
	);
	const icon = (
		<Skeleton
			variant="circle"
			style={{ width: dense ? 16 : 20, height: dense ? 16 : 20 }}
		/>
	);
	return (
		<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
			{variant === "withAvatar" ? avatar : null}
			{variant === "withIcon" ? icon : null}
			{variant === "multiLine"
				? body(
						<>
							{line("75%" as const)}
							{line("50%" as const)}
						</>,
					)
				: null}
			{variant === "simple" ||
			variant === "withAvatar" ||
			variant === "withIcon"
				? body(line("60%" as const))
				: null}
			{variant === "withBadge" ? body(line("65%" as const)) : null}
			{variant === "withBadge" ? line(48) : null}
		</View>
	);
}

export function List({
	divided = true,
	dense = false,
	isLoading = false,
	skeletonConfig,
	skeleton,
	accessibilityLabel,
	style,
	styles,
	testID = "k-list",
	children,
}: ListProps): ReactElement {
	const { theme } = useUnistyles();

	const surface = [
		surfaceStyle(theme),
		applySlot(applySlot({}, style), styles?.root),
	];

	if (isLoading) {
		const {
			variant = "simple",
			itemCount = 3,
			dense: skDense = false,
			showDividers = true,
		} = skeletonConfig ?? {};
		return (
			<View
				testID={testID}
				accessibilityRole="list"
				accessibilityLabel={accessibilityLabel}
				style={surface}
			>
				{skeleton ??
					Array.from({ length: itemCount }, (_, index) => {
						const slot = `skeleton-row-${index + 1}`;
						return (
							<View key={slot}>
								<View
									style={{
										paddingHorizontal: dense || skDense ? 12 : 16,
										paddingVertical: dense || skDense ? 8 : 12,
									}}
								>
									<SkeletonRow variant={variant} dense={dense || skDense} />
								</View>
								{showDividers && index < itemCount - 1 ? (
									<View testID="k-list-divider" style={dividerStyle(theme)} />
								) : null}
							</View>
						);
					})}
			</View>
		);
	}

	const items = Array.isArray(children) ? children : [children];
	const last = items.length - 1;
	return (
		<View
			testID={testID}
			accessibilityRole="list"
			accessibilityLabel={accessibilityLabel}
			style={surface}
		>
			{items.map((item, index) => {
				const own =
					typeof item === "object" && item !== null && "key" in item
						? (item as { key?: unknown }).key
						: null;
				const rowKey =
					typeof own === "string" || typeof own === "number"
						? own
						: `row-${index}`;
				return (
					<View key={rowKey}>
						{item}
						{divided && index < last ? (
							<View testID="k-list-divider" style={dividerStyle(theme)} />
						) : null}
					</View>
				);
			})}
		</View>
	);
}

export function ListItem({
	interactive = false,
	href,
	active = false,
	disabled = false,
	dense = false,
	onPress,
	accessibilityLabel,
	style,
	styles,
	testID = "k-list-item",
	children,
}: ListItemProps): ReactElement {
	const { theme } = useUnistyles();

	const base = {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		gap: 12,
		width: "100%" as const,
		paddingHorizontal: dense ? 12 : 16,
		paddingVertical: dense ? 8 : 12,
		backgroundColor: active ? `${String(theme.primary)}1A` : undefined,
	};
	const slot = applySlot(applySlot({}, style), styles?.root);
	// raw strings cannot render inside a View — wrap them like Badge does
	const content =
		typeof children === "string" || typeof children === "number" ? (
			<RNText style={{ fontSize: 14, color: String(theme.foreground) }}>
				{children}
			</RNText>
		) : (
			children
		);

	if (href) {
		return (
			<Pressable
				testID={testID}
				accessibilityRole="link"
				accessibilityLabel={accessibilityLabel}
				disabled={disabled}
				accessibilityState={disabled ? { disabled: true } : undefined}
				onPress={() => Linking.openURL(href)}
				style={({ pressed }) => [
					base,
					slot,
					(disabled || pressed) && { opacity: disabled ? 0.5 : 0.7 },
				]}
			>
				{content}
			</Pressable>
		);
	}

	if (interactive) {
		return (
			<Pressable
				testID={testID}
				accessibilityRole="button"
				accessibilityLabel={accessibilityLabel}
				disabled={disabled}
				accessibilityState={disabled ? { disabled: true } : undefined}
				onPress={onPress}
				style={({ pressed }) => [
					base,
					slot,
					(disabled || pressed) && { opacity: disabled ? 0.5 : 0.7 },
				]}
			>
				{content}
			</Pressable>
		);
	}

	return (
		<View
			testID={testID}
			accessibilityRole={undefined}
			accessibilityLabel={accessibilityLabel}
			style={[base, slot, disabled && { opacity: 0.5 }]}
		>
			{content}
		</View>
	);
}

export function ListItemIcon({
	size = "md",
	color,
	children,
	style,
	testID = "k-list-item-icon",
}: ListItemIconProps): ReactElement {
	const { theme } = useUnistyles();
	const dim = ICON_SIZES[size];
	return (
		<View
			testID={testID}
			style={[
				{
					width: dim,
					height: dim,
					alignItems: "center",
					justifyContent: "center",
				},
				style,
			]}
		>
			{typeof children === "string" ? (
				<RNText style={{ color: color ?? String(theme.mutedForeground) }}>
					{children}
				</RNText>
			) : (
				children
			)}
		</View>
	);
}

export function ListItemAvatar({
	source,
	name,
	size = "md",
	style,
	testID = "k-list-item-avatar",
}: ListItemAvatarProps): ReactElement {
	const { theme } = useUnistyles();
	const [imgError, setImgError] = useState(false);
	const dim = AVATAR_SIZES[size];
	return (
		<View
			testID={testID}
			style={[
				{
					width: dim,
					height: dim,
					borderRadius: dim / 2,
					overflow: "hidden" as const,
					backgroundColor: String(theme.muted),
					alignItems: "center",
					justifyContent: "center",
				},
				style,
			]}
		>
			{source && !imgError ? (
				<Image
					testID={`${testID}-image`}
					source={source}
					style={{ width: "100%", height: "100%" }}
					onError={() => setImgError(true)}
				/>
			) : (
				<RNText style={{ color: String(theme.mutedForeground) }}>
					{initials(name ?? "")}
				</RNText>
			)}
		</View>
	);
}

export function ListItemContent({
	style,
	testID = "k-list-item-content",
	children,
}: ListItemContentProps): ReactElement {
	return (
		<View testID={testID} style={[{ flex: 1 }, style]}>
			{children}
		</View>
	);
}

export function ListItemTitle({
	style,
	testID = "k-list-item-title",
	children,
	...rest
}: ListItemTitleProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={[
				{ fontSize: 14, fontWeight: "500", color: String(theme.foreground) },
				style,
			]}
			{...rest}
		>
			{children}
		</RNText>
	);
}

export function ListItemText({
	lines,
	truncate = false,
	style,
	testID = "k-list-item-text",
	children,
	...rest
}: ListItemTextProps): ReactElement {
	const { theme } = useUnistyles();
	const clamp = lines ?? (truncate ? 1 : undefined);
	return (
		<RNText
			testID={testID}
			numberOfLines={clamp}
			style={[{ fontSize: 14, color: String(theme.mutedForeground) }, style]}
			{...rest}
		>
			{children}
		</RNText>
	);
}

export function ListItemAction({
	style,
	testID = "k-list-item-action",
	children,
}: ListItemActionProps): ReactElement {
	return (
		<View
			testID={testID}
			style={[{ flexDirection: "row", alignItems: "center", gap: 8 }, style]}
		>
			{children}
		</View>
	);
}

export function ListItemBadge({
	color = "muted",
	testID = "k-list-item-badge",
	children,
}: ListItemBadgeProps): ReactElement {
	return (
		<Badge testID={testID} variant="subtle" color={color} shape="pill">
			{children}
		</Badge>
	);
}
