/**
 * Input Component - Simple primitive input with optional password toggle
 *
 * A flexible input component that maintains simplicity while supporting common patterns:
 * - Password visibility toggle
 * - Prefix/suffix icons
 * - Error and success states
 *
 * For specialized inputs with validation logic (like username checking),
 * create separate composed components.
 */

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { inputStyles } from "../../config/input";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { InputProps } from "./input.types";

export function Input({
	ref,
	className,
	style,
	slotStyles,
	type: typeProp = "text",
	showPasswordToggle = false,
	prefixIcon,
	suffixIcon,
	hasError = false,
	hasSuccess = false,
	unstyled = false,
	isLoading = false,
	...props
}: InputProps) {
	const [showPassword, setShowPassword] = React.useState(false);
	const [internalType, setInternalType] = React.useState(typeProp);

	// Handle password toggle
	React.useEffect(() => {
		if (typeProp === "password" && showPasswordToggle) {
			setInternalType(showPassword ? "text" : "password");
		} else {
			setInternalType(typeProp);
		}
	}, [typeProp, showPassword, showPasswordToggle]);

	const hasPrefix = !!prefixIcon;
	const hasSuffix =
		!!suffixIcon || (typeProp === "password" && showPasswordToggle);

	const root = applySlot(
		cn(
			inputStyles.base,
			inputStyles.file,
			hasError && inputStyles.error,
			hasSuccess && inputStyles.success,
			className,
		),
		slotStyles?.root,
	);
	const rootStyle = mergeStyle(style, root.style);
	const wrapper = applySlot(inputStyles.wrapper, slotStyles?.wrapper);
	const prefix = applySlot(inputStyles.prefix, slotStyles?.prefix);
	const suffix = applySlot(inputStyles.suffix, slotStyles?.suffix);
	const toggle = applySlot(inputStyles.toggle, slotStyles?.toggle);

	// Show loading skeleton
	if (isLoading) {
		return (
			<Skeleton
				data-kala-component="input"
				style={rootStyle}
				className={cn("h-10 w-full rounded-md", root.className)}
			/>
		);
	}

	// Simple input without wrapper (for InputGroup compatibility)
	if (unstyled || (!hasPrefix && !hasSuffix)) {
		return (
			<input
				data-kala-component="input"
				type={internalType}
				className={root.className}
				style={rootStyle}
				ref={ref}
				{...props}
			/>
		);
	}

	// Input with wrapper for icons and password toggle
	return (
		<div
			data-kala-component="input"
			className={wrapper.className}
			style={wrapper.style}
		>
			{hasPrefix && (
				<div className={prefix.className} style={prefix.style}>
					{prefixIcon}
				</div>
			)}

			<input
				type={internalType}
				className={cn(
					root.className,
					hasPrefix && "pl-10",
					hasSuffix && "pr-10",
				)}
				style={rootStyle}
				ref={ref}
				{...props}
			/>

			{hasSuffix && (
				<div className={suffix.className} style={suffix.style}>
					{/* Password visibility toggle */}
					{typeProp === "password" && showPasswordToggle && (
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className={toggle.className}
							style={toggle.style}
							aria-label={showPassword ? "Hide password" : "Show password"}
						>
							{showPassword ? (
								<EyeOff className="h-5 w-5" />
							) : (
								<Eye className="h-5 w-5" />
							)}
						</button>
					)}

					{/* Custom suffix icon — never blocks input clicks */}
					{suffixIcon && (
						<span className="pointer-events-none text-muted-foreground">
							{suffixIcon}
						</span>
					)}
				</div>
			)}
		</div>
	);
}
