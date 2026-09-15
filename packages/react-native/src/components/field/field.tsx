import type { ReactElement } from "react";
import { Children, cloneElement, isValidElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { FieldProps } from "./field.types";

/**
 * Field: label + control + description + error composition. Web Field
 * wires aria-describedby/aria-invalid through context; RN has no such
 * attributes, so the contract moves to what RN can express — the
 * control's accessibilityLabel is merged with label + error (a control
 * that brings its own label always wins), and description/error render
 * as real, screen-reader-reachable text nodes.
 */
export function Field({
	label,
	description,
	error,
	required = false,
	hasError = false,
	children,
	style,
	styles,
	testID = "k-field",
}: FieldProps): ReactElement {
	const { theme } = useUnistyles();

	const errorList = error == null ? [] : Array.isArray(error) ? error : [error];
	const uniqueErrors = [...new Set(errorList.filter(Boolean))];
	const errorText = uniqueErrors.join(", ");
	const invalid = hasError || uniqueErrors.length > 0;

	const onlyChild =
		Children.count(children) === 1 && isValidElement(children)
			? (children as ReactElement<Record<string, unknown>>)
			: null;
	const control =
		onlyChild === null
			? children
			: cloneElement(onlyChild, {
					accessibilityLabel:
						(onlyChild.props.accessibilityLabel as string | undefined) ??
						[label, invalid && errorText ? errorText : null]
							.filter(Boolean)
							.join(", "),
				});

	return (
		<View
			testID={testID}
			style={[{ gap: 8 }, applySlot(applySlot({}, style), styles?.root)]}
		>
			{label ? (
				<RNText
					testID="k-field-label"
					style={[
						{ fontSize: 14, fontWeight: "500", color: theme.foreground },
						applySlot({}, styles?.label),
					]}
				>
					{label}
					{required ? (
						<RNText style={{ color: theme.destructive }}> *</RNText>
					) : null}
				</RNText>
			) : null}
			<View testID="k-field-control" style={applySlot({}, styles?.control)}>
				{control}
			</View>
			{description ? (
				<RNText
					testID="k-field-description"
					style={[
						{ fontSize: 12, color: theme.mutedForeground },
						applySlot({}, styles?.description),
					]}
				>
					{description}
				</RNText>
			) : null}
			{uniqueErrors.length > 0 ? (
				<RNText
					testID="k-field-error"
					accessibilityRole="alert"
					style={[
						{ fontSize: 12, color: theme.destructive },
						applySlot({}, styles?.error),
					]}
				>
					{errorText}
				</RNText>
			) : null}
		</View>
	);
}
