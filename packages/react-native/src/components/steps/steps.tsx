import { Check } from "lucide-react-native";
import type { ReactElement } from "react";
import { useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { StepItem, StepsOrientation, StepsProps } from "./steps.types";

const CIRCLE = 32;

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
				{
					flexDirection: orientation === "vertical" ? "column" : "row",
					alignItems: orientation === "vertical" ? "flex-start" : "flex-start",
				},
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
							{
								flex: orientation === "vertical" ? undefined : 1,
								flexDirection: "column",
								alignItems:
									orientation === "vertical" ? "flex-start" : "center",
								paddingBottom: orientation === "vertical" && !isLast ? 32 : 0,
							},
							applySlot({}, slotStyles?.step),
						]}
					>
						{!isLast && showLine ? (
							orientation === "horizontal" ? (
								<View
									testID="k-step-line"
									style={{
										position: "absolute",
										top: CIRCLE / 2 - 1,
										left: "50%",
										right: 0,
										height: 2,
										backgroundColor: theme.separator,
									}}
								/>
							) : (
								<View
									testID="k-step-line"
									style={{
										position: "absolute",
										top: CIRCLE + 8,
										bottom: 0,
										left: CIRCLE / 2 - 1,
										width: 2,
										backgroundColor: theme.separator,
									}}
								/>
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
								{
									width: CIRCLE,
									height: CIRCLE,
									borderRadius: CIRCLE / 2,
									borderWidth: 2,
									alignItems: "center",
									justifyContent: "center",
									zIndex: 1,
									transform: [{ scale: isActive ? 1.1 : 1 }],
									borderColor:
										isActive || isCompleted ? theme.primary : theme.border,
									backgroundColor:
										isActive || isCompleted ? theme.primary : theme.background,
								},
								applySlot({}, slotStyles?.indicator),
							]}
						>
							{isCompleted ? (
								<Check size={16} color={theme.primaryForeground} />
							) : (
								(step.icon ?? (
									<RNText
										style={{
											fontSize: 14,
											fontWeight: "600",
											color:
												isActive || isCompleted
													? theme.primaryForeground
													: theme.mutedForeground,
										}}
									>
										{stepNumber}
									</RNText>
								))
							)}
						</Pressable>

						<View
							style={{
								marginTop: orientation === "vertical" ? 0 : 8,
								marginLeft: orientation === "vertical" ? 12 : 0,
								alignItems:
									orientation === "vertical" ? "flex-start" : "center",
								flex: orientation === "vertical" ? 1 : undefined,
							}}
						>
							<RNText
								numberOfLines={1}
								style={{
									fontSize: 14,
									fontWeight: "500",
									color: isActive ? theme.primary : theme.foreground,
								}}
							>
								{step.title}
							</RNText>
							{step.description ? (
								<RNText
									numberOfLines={2}
									style={{
										fontSize: 12,
										marginTop: 2,
										color: theme.mutedForeground,
									}}
								>
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
