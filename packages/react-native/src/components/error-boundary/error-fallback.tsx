import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Button } from "../button";
import { applySlot } from "../slot-styles";
import {
	fallbackDescription,
	fallbackRoot,
	fallbackTitle,
} from "./error-boundary.styles";
import type { ErrorFallbackProps } from "./error-boundary.types";

/**
 * ErrorFallback: the single crash surface — used standalone and as the
 * ErrorBoundary default. Web hides error.message outside dev builds via
 * a details/summary disclosure; native has no such idiom, so the message
 * renders directly as the description.
 */
export function ErrorFallback({
	error,
	reset,
	title = "Something went wrong",
	description,
	variant = "page",
	style,
	slotStyles,
	testID = "k-error-fallback",
}: ErrorFallbackProps): ReactElement {
	const { theme } = useUnistyles();

	return (
		<View
			testID={testID}
			accessibilityRole="alert"
			style={[
				fallbackRoot(variant),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			<RNText
				testID="k-error-fallback-title"
				style={fallbackTitle(theme)}
			>
				{title}
			</RNText>
			<RNText
				testID="k-error-fallback-description"
				style={fallbackDescription(theme)}
			>
				{description ??
					error?.message ??
					"An unexpected error occurred. Please try again."}
			</RNText>
			{reset ? (
				<Button
					testID="k-error-fallback-reset"
					size="sm"
					variant="outline"
					onPress={reset}
				>
					Try again
				</Button>
			) : null}
		</View>
	);
}
