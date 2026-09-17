import type { ReactElement } from "react";
import { Children, cloneElement, isValidElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import * as fieldStyle from "./field.styles";
import type { FieldProps } from "./field.types";

/**
 * Field: label + control + description + error composition. Web Field
 * wires aria-describedby/aria-invalid through context; RN has no such
 * attributes, so the contract moves to what RN can express — the
 * control's accessibilityLabel is merged with label + description + an
 * "invalid" flag (a control that brings its own label always wins), the
 * error renders as a polite live region so late-appearing validation
 * copy is announced.
 */
export function Field({
	label,
	description,
	error,
	required = false,
	hasError = false,
	children,
	style,
	slotStyles,
	testID = "k-field",
}: FieldProps): ReactElement {
	const { theme } = useUnistyles();

	const errorList = error == null ? [] : Array.isArray(error) ? error : [error];
	const uniqueErrors = [...new Set(errorList.filter(Boolean))];
	const errorText = uniqueErrors.join(", ");
	const invalid = hasError || uniqueErrors.length > 0;

	// Children.toArray flattens single-element arrays ({[<Input/>]}) that
	// Children.count + isValidElement miss.
	const [first, ...rest] = Children.toArray(children);
	const onlyChild =
		rest.length === 0 && isValidElement(first)
			? (first as ReactElement<Record<string, unknown>>)
			: null;
		const control =
			onlyChild === null
				? children
				: cloneElement(onlyChild, {
						// the control's own label always wins; otherwise merge the
						// field's copy (real error text — never a synthetic word)
						accessibilityLabel:
							(onlyChild.props.accessibilityLabel as string | undefined) ??
							[label, description, errorText || null]
								.filter(Boolean)
								.join(", "),
						// invalid state tints the control when it understands hasError;
						// an explicit control-side value is never overridden
						hasError:
							(onlyChild.props.hasError as boolean | undefined) ?? invalid,
					});

	return (
		<View
			testID={testID}
			style={[{ gap: 8 }, applySlot(applySlot({}, style), slotStyles?.root)]}
		>
			{label ? (
				<RNText
					testID="k-field-label"
					style={[
						fieldStyle.label(theme),
						applySlot({}, slotStyles?.label),
					]}
				>
					{label}
					{required ? (
						<RNText style={fieldStyle.required(theme)}> *</RNText>
					) : null}
				</RNText>
			) : null}
			<View testID="k-field-control" style={applySlot({}, slotStyles?.control)}>
				{control}
			</View>
			{description ? (
				<RNText
					testID="k-field-description"
					style={[
						fieldStyle.description(theme),
						applySlot({}, slotStyles?.description),
					]}
				>
					{description}
				</RNText>
			) : null}
			{uniqueErrors.length > 0 ? (
				<RNText
					testID="k-field-error"
					accessibilityRole="alert"
					accessibilityLiveRegion="polite"
					style={[fieldStyle.error(theme), applySlot({}, slotStyles?.error)]}
				>
					{errorText}
				</RNText>
			) : null}
		</View>
	);
}
