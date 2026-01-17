import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Box } from "../box";
import { Text } from "../text";

const stepsVariants = cva("flex w-full", {
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

export interface StepItem {
	title: string;
	description?: string;
	icon?: React.ReactNode;
}

export interface StepsProps
	extends React.HTMLAttributes<HTMLDivElement>,
	VariantProps<typeof stepsVariants> {
	currentStep: number;
	items: StepItem[];
	onStepClick?: (step: number) => void;
	/**
	 * Show connecting lines between steps
	 * @default true
	 */
	showLine?: boolean;
}

const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
	(
		{
			className,
			orientation,
			currentStep,
			items,
			onStepClick,
			showLine = true,
			...props
		},
		ref,
	) => {
		return (
			<Box
				ref={ref}
				className={cn(stepsVariants({ orientation }), className)}
				{...props}
			>
				{items.map((step, index) => {
					const stepNumber = index + 1;
					const isCompleted = stepNumber < currentStep;
					const isActive = stepNumber === currentStep;
					const isLast = index === items.length - 1;
					const isClickable = !!onStepClick;

					return (
						<Box
							key={step.title}
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
										isActive
											? "border-primary bg-primary text-primary-foreground scale-110"
											: isCompleted
												? "border-primary bg-primary text-primary-foreground"
												: "border-border bg-background text-muted-foreground group-hover:border-primary/50",
										isClickable && !isActive ? "cursor-pointer" : "",
									)}
									disabled={!isClickable}
									onClick={() => onStepClick?.(stepNumber)}
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
										orientation === "vertical"
											? "ml-4"
											: "mt-2 text-center px-2",
									)}
								>
									<Text
										size="sm"
										weight="medium"
										className={cn(
											isActive ? "text-primary" : "text-foreground",
										)}
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
			</Box>
		);
	},
);
Steps.displayName = "Steps";

export { Steps };
