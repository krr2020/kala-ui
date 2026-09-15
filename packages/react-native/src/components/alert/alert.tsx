/**
 * Alert: the web look() vocabulary (variant × color) with per-color
 * lucide status icons. Dismissing hides this instance only until its
 * CONTENT changes — one Alert reused per new message must not stay
 * invisible after the first dismiss (the web trap, fixed the same way:
 * compare children identity and reopen).
 */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	Info,
	X,
} from "lucide-react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type {
	AlertColor,
	AlertDescriptionProps,
	AlertProps,
	AlertTitleProps,
	AlertVariant,
} from "./alert.types";

interface KalaThemeShape {
	[key: string]: string | number;
}

const ICONS: Record<AlertColor, typeof Info> = {
	primary: Info,
	secondary: Info,
	destructive: AlertCircle,
	success: CheckCircle2,
	warning: AlertTriangle,
	info: Info,
	muted: Info,
};

/** Same mapping the web config uses — 'muted' borrows accent/mutedForeground. */
function look(
	variant: AlertVariant,
	color: AlertColor,
	theme: KalaThemeShape,
): { bg: string; fg: string; border: string } {
	const hex = (key: string) => String(theme[key]);
	if (variant === "outline") {
		const tint =
			color === "muted" ? hex("mutedForeground") : hex(color);
		return { bg: "transparent", fg: tint, border: tint };
	}
	if (variant === "subtle") {
		if (color === "muted") {
			return {
				bg: hex("muted"),
				fg: hex("mutedForeground"),
				border: "transparent",
			};
		}
		const tint = hex(color);
		return { bg: `${tint}1A`, fg: tint, border: "transparent" };
	}
	// solid
	const base = color === "muted" ? "accent" : color;
	return {
		bg: hex(base),
		fg: hex(`${base}Foreground`),
		border: "transparent",
	};
}

/** Title/Description inherit the resolved foreground of their Alert. */
const AlertColorContext = createContext<string | null>(null);

export function Alert({
	children,
	variant = "subtle",
	color = "primary",
	showIcon = true,
	dismissable = false,
	onDismiss,
	accessibilityLabel,
	style,
	testID = "k-alert",
}: AlertProps): ReactElement | null {
	const { theme } = useUnistyles();
	const { bg, fg, border } = look(variant, color, theme as KalaThemeShape);
	const [hidden, setHidden] = useState(false);
	const prevChildren = useRef(children);

	useEffect(() => {
		if (prevChildren.current !== children) {
			prevChildren.current = children;
			setHidden(false);
		}
	});

	if (hidden) return null;

	const Icon = ICONS[color];

	return (
		<View
			testID={testID}
			// accessible: surface the container as ONE a11y element — without
			// it TLB (and VoiceOver) sees only the leaf text, never role=alert
			accessible={true}
			accessibilityRole="alert"
			accessibilityLabel={accessibilityLabel}
			style={[
				{
					flexDirection: "row",
					alignItems: "flex-start",
					gap: 10,
					padding: 12,
					borderRadius: 8,
					backgroundColor: bg,
					borderColor: border,
					borderWidth: variant === "outline" ? 1 : 0,
				},
				style,
			]}
		>
			{showIcon ? <Icon size={18} color={fg} /> : null}
			<View style={{ flex: 1, gap: 2 }}>
				{typeof children === "string" || typeof children === "number" ? (
					<RNText style={{ color: fg, fontSize: 14 }}>{children}</RNText>
				) : (
					<AlertColorContext.Provider value={fg}>
						{children}
					</AlertColorContext.Provider>
				)}
			</View>
			{dismissable ? (
				<Pressable
					testID="k-alert-dismiss"
					accessibilityRole="button"
					accessibilityLabel="Dismiss alert"
					hitSlop={8}
					onPress={() => {
						setHidden(true);
						onDismiss?.();
					}}
					style={{ padding: 2, opacity: 0.8 }}
				>
					<X size={16} color={fg} />
				</Pressable>
			) : null}
		</View>
	);
}

function AlertTitle({
	children,
	style,
	testID = "k-alert-title",
}: AlertTitleProps): ReactElement {
	const { theme } = useUnistyles();
	const fg = useContext(AlertColorContext) ?? theme.foreground;
	return (
		<RNText
			testID={testID}
			style={[{ color: fg, fontSize: 15, fontWeight: "600" }, style]}
		>
			{children}
		</RNText>
	);
}

function AlertDescription({
	children,
	style,
	testID = "k-alert-description",
}: AlertDescriptionProps): ReactElement {
	const { theme } = useUnistyles();
	const fg = useContext(AlertColorContext) ?? theme.foreground;
	return (
		<RNText
			testID={testID}
			style={[{ color: fg, fontSize: 14, fontWeight: "400" }, style]}
		>
			{children}
		</RNText>
	);
}

Alert.Title = AlertTitle;
Alert.Description = AlertDescription;
