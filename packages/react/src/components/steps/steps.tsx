import { useUncontrolled } from "@kala-ui/react-hooks";
import { cva } from "class-variance-authority";
import { Check } from "lucide-react";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Box } from "../box";
import { useSlotStyles } from "../kala-provider";
import { Text } from "../text";
import type { StepsProps } from "./steps.types";

export const stepsVariants = cva("flex w-full", {
	variants: {
		orientation: {
			horizontal: "flex-row items-start",
			vertical: "flex-col",
		},
	},
	defaultVariants: {
		orientation: "horizontal",
	},
});

function Steps({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	orientation,
	value: valueProp,
	defaultValue,
	items,
	onValueChange,
	showLine = true,
	...props
}: StepsProps) {
	const slotStyles = useSlotStyles("steps", slotStylesRaw);
	const [currentStep, setCurrentStep] = useUncontrolled<number>({
		value: valueProp,
		defaultValue,
		onChange: onValueChange,
	});

	return (
		<ol
			data-kala-component="steps"
			ref={ref}
			className={
				applySlot(
					cn(stepsVariants({ orientation }), className),
					slotStyles?.root,
				).className
			}
			style={mergeStyle(style, applySlot("", slotStyles?.root).style)}
			{...props}
		>
			{items.map((step, index) => {
				const stepNumber = index + 1;
				const isCompleted = stepNumber < currentStep;
				const isActive = stepNumber === currentStep;
				const isLast = index === items.length - 1;
				const isClickable = !!onValueChange;

				return (
					<Box
						as="li"
						key={step.title}
						aria-current={isActive ? "step" : undefined}
						className={cn(
							"group relative flex",
							orientation === "vertical"
								? "flex-col pb-8 last:pb-0"
								: "flex-1 flex-col items-center",
						)}
					>
						{/* Connecting Lines */}
						{!isLast && showLine && (
							<>
								{orientation === "horizontal" && (
									<Box className="absolute top-4 left-1/2 w-full h-[2px] -translate-y-1/2 bg-separator">
										<Box
											className={cn(
												"h-full bg-primary transition-all duration-500 ease-in-out",
												isCompleted ? "w-full" : "w-0",
											)}
										/>
									</Box>
								)}
								{orientation === "vertical" && (
									<Box className="absolute top-8 left-4 h-[calc(100%-32px)] w-[2px] -translate-x-1/2 bg-separator">
										<Box
											className={cn(
												"w-full bg-primary transition-all duration-500 ease-in-out",
												isCompleted ? "h-full" : "h-0",
											)}
										/>
									</Box>
								)}
							</>
						)}

						<Box
							className={cn(
								"flex items-center",
								orientation === "vertical" ? "flex-row" : "flex-col w-full",
							)}
						>
							{/* Circle Indicator */}
							<Box
								as="button"
								type="button"
								className={cn(
									"relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
									isActive
										? "border-primary bg-primary text-primary-foreground scale-110"
										: isCompleted
											? "border-primary bg-primary text-primary-foreground"
											: "border-border bg-background text-muted-foreground group-hover:border-primary/50",
									isClickable && !isActive ? "cursor-pointer" : "",
								)}
								aria-label={`Step ${stepNumber} of ${items.length}: ${step.title}${
									isCompleted
										? " (completed)"
										: isActive
											? " (current step)"
											: ""
								}`}
								disabled={!isClickable}
								onClick={() => setCurrentStep(stepNumber)}
							>
								{isCompleted ? (
									<Check className="h-4 w-4" />
								) : (
									step.icon || stepNumber
								)}
							</Box>

							{/* Content */}
							<Box
								className={cn(
									orientation === "vertical" ? "ml-4" : "mt-2 text-center px-2",
								)}
							>
								<Text
									size="sm"
									weight="medium"
									className={cn(isActive ? "text-primary" : "text-foreground")}
								>
									{step.title}
								</Text>
								{step.description && (
									<Text size="xs" className="text-muted-foreground mt-0.5">
										{step.description}
									</Text>
								)}
							</Box>
						</Box>
					</Box>
				);
			})}
		</ol>
	);
}

export { Steps };
