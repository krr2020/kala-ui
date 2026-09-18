import { useDisclosure } from "@kala-ui/react-hooks";
import { cva } from "class-variance-authority";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	Info,
	X,
} from "lucide-react";
import * as React from "react";

import { alertStyles } from "../../config/alert";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Box } from "../box";
import type { AlertProps } from "./alert.types";
import { AlertSkeleton } from "./alert-skeleton";

const alertVariants = cva(alertStyles.base, {
	variants: alertStyles.variants,
	compoundVariants: alertStyles.compoundVariants as never,
	defaultVariants: alertStyles.defaultVariants,
});

const colorIcons = {
	primary: Info,
	secondary: Info,
	destructive: AlertCircle,
	success: CheckCircle2,
	warning: AlertTriangle,
	info: Info,
	muted: Info,
};

function Alert({
	className,
	style,
	slotStyles,
	variant = "subtle",
	color = "primary",
	dismissable = false,
	onDismiss,
	showIcon = true,
	children,
	isLoading = false,
	skeletonConfig,
	skeleton,
	...props
}: AlertProps) {
	const [isVisible, { close, open }] = useDisclosure(true);

	// Dismissing hides this instance only until its CONTENT changes — the
	// classic trap was reusing one Alert component for each new message and
	// having it stay invisible after the first dismiss.
	const previousChildrenRef = React.useRef(children);
	React.useEffect(() => {
		if (previousChildrenRef.current !== children) {
			previousChildrenRef.current = children;
			open();
		}
	});

	if (isLoading) {
		const skeletonRoot = applySlot(className, slotStyles?.root);
		if (skeleton) {
			return (
				<Box
					data-kala-component="alert"
					data-slot="alert"
					className={skeletonRoot.className}
					style={mergeStyle(style, skeletonRoot.style)}
					{...props}
				>
					{skeleton}
				</Box>
			);
		}
		return (
			<AlertSkeleton
				data-kala-component="alert"
				variant={variant ?? "subtle"}
				color={color ?? "primary"}
				showIcon={showIcon}
				className={skeletonRoot.className}
				style={mergeStyle(style, skeletonRoot.style)}
				{...props}
			/>
		);
	}

	const handleDismiss = () => {
		close();
		onDismiss?.();
	};

	if (!isVisible) return null;

	const Icon = colorIcons[color ?? "primary"] ?? Info;
	const icon = applySlot(alertStyles.icon, slotStyles?.icon);
	const dismiss = applySlot(alertStyles.dismiss, slotStyles?.dismiss);
	const root = applySlot(
		cn(alertVariants({ variant, color }), dismissable && "pr-10", className),
		slotStyles?.root,
	);
	const hasCustomIcon = React.Children.toArray(children).some((child) => {
		if (!React.isValidElement(child)) return false;
		const type = child.type;
		if (typeof type === "string") return type === "svg";

		// Check for Lucide icons or other icon components
		const componentType = type as { displayName?: string; name?: string };
		const name = componentType.displayName || componentType.name || "";
		const props = child.props as { className?: string };

		return (
			name.includes("Icon") ||
			name.includes("Alert") ||
			name.includes("Check") ||
			name.includes("Info") ||
			name.includes("X") ||
			props.className?.includes("lucide")
		);
	});

	return (
		<Box
			data-kala-component="alert"
			data-slot="alert"
			role="alert"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			{showIcon && !hasCustomIcon && (
				<Icon
					className={icon.className}
					style={icon.style}
					aria-hidden="true"
				/>
			)}
			{children}
			{dismissable && (
				<Box
					as="button"
					type="button"
					onClick={handleDismiss}
					className={dismiss.className}
					style={dismiss.style}
					aria-label="Dismiss alert"
				>
					<X className="h-4 w-4" />
				</Box>
			)}
		</Box>
	);
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<Box
			data-kala-component="alert-title"
			data-slot="alert-title"
			className={cn(
				"col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<Box
			data-kala-component="alert-description"
			data-slot="alert-description"
			className={cn("col-start-2 text-sm [&_p]:leading-relaxed", className)}
			{...props}
		/>
	);
}

export { Alert, AlertDescription, AlertTitle, alertVariants };
