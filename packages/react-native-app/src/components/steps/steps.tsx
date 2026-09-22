import { applySlot } from "@kala-ui/react-native";
import { Check } from "lucide-react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import {
	hLineStyle,
	indicatorStyle,
	labelBlockStyle,
	numberStyle,
	rootStyle,
	descriptionStyle as stepDescriptionStyle,
	stepStyle,
	titleStyle as stepTitleStyle,
	vLineStyle,
} from "./steps.styles";
import type { StepItem, StepsOrientation, StepsProps } from "./steps.types";

/**
 * Steps: numbered progress rail. `value` is 1-based (the web component
 * compares stepNumber = index + 1 against it directly); controlled value
 * wins over presses, defaultValue-only runs uncontrolled.
 */
export function Steps({
	items,
	value,
	defaultValue,
	onStepChange,
	orientation = "horizontal",
	showLine = true,
	style,
	slotStyles,
	testID = "k-steps",
}: StepsProps): ReactElement {
	const { theme } = useUnistyles();
	const [internal, setInternal] = useState(defaultValue);

	const isControlled = value !== undefined;
	const currentStep = isControlled ? value : (internal ?? 1);
	const clickable = onStepChange !== undefined;

	const commit = (stepNumber: number): void => {
		if (!isControlled) setInternal(stepNumber);
		onStepChange?.(stepNumber);
	};

	return (
		<View
			testID={testID}
			style={[
				rootStyle(orientation),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{items.map((step, index) => {
				const stepNumber = index + 1;
				const isCompleted = stepNumber < currentStep;
				const isActive = stepNumber === currentStep;
				const isLast = index === items.length - 1;
				const label = `Step ${stepNumber} of ${items.length}: ${step.title}${
					isCompleted ? " (completed)" : isActive ? " (current step)" : ""
				}`;

				return (
					<View
						key={step.title}
						testID="k-step"
						style={[
							stepStyle(orientation, isLast),
							applySlot({}, slotStyles?.step),
						]}
					>
						{!isLast && showLine ? (
							orientation === "horizontal" ? (
								<View testID="k-step-line" style={hLineStyle(theme)} />
							) : (
								<View testID="k-step-line" style={vLineStyle(theme)} />
							)
						) : null}

						<Pressable
							testID={`k-step-indicator-${stepNumber}`}
							accessibilityRole="button"
							accessibilityLabel={label}
							accessibilityState={{ disabled: !clickable, selected: isActive }}
							disabled={!clickable}
							onPress={() => commit(stepNumber)}
							style={[
								indicatorStyle(theme, { isActive, isCompleted }),
								applySlot({}, slotStyles?.indicator),
							]}
						>
							{isCompleted ? (
								<Check size={16} color={theme.primaryForeground} />
							) : (
								(step.icon ?? (
									<RNText style={numberStyle(theme, { isActive, isCompleted })}>
										{stepNumber}
									</RNText>
								))
							)}
						</Pressable>

						<View style={labelBlockStyle(orientation)}>
							<RNText numberOfLines={1} style={stepTitleStyle(theme, isActive)}>
								{step.title}
							</RNText>
							{step.description ? (
								<RNText numberOfLines={2} style={stepDescriptionStyle(theme)}>
									{step.description}
								</RNText>
							) : null}
						</View>
					</View>
				);
			})}
		</View>
	);
}

export type { StepItem, StepsOrientation };
