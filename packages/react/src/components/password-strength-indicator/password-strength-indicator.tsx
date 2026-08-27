import type * as React from "react";
import { cn } from "../../lib/utils";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_STRONG_LENGTH = 12;
const PASSWORD_MAX_STRENGTH = 4;

const STRENGTH_LABELS = [
	"Very Weak",
	"Weak",
	"Fair",
	"Good",
	"Strong",
] as const;

export interface PasswordStrengthIndicatorProps
	extends React.ComponentProps<"div"> {
	password: string;
}

function calculatePasswordStrength(pwd: string): number {
	if (!pwd) {
		return 0;
	}

	let strength = 0;

	if (pwd.length >= PASSWORD_MIN_LENGTH) {
		strength++;
	}

	if (pwd.length >= PASSWORD_STRONG_LENGTH) {
		strength++;
	}

	if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) {
		strength++;
	}

	if (/\d/.test(pwd)) {
		strength++;
	}

	if (/[@$!%*?&]/.test(pwd)) {
		strength++;
	}

	return Math.min(strength, PASSWORD_MAX_STRENGTH);
}

export function PasswordStrengthIndicator({
	password,
	className,
	ref,
	...props
}: PasswordStrengthIndicatorProps): React.ReactNode | null {
	if (!password) {
		return null;
	}

	const strength = calculatePasswordStrength(password);

	return (
		<div
			data-comp="password-strength-indicator"
			ref={ref}
			className={cn("mt-3", className)}
			aria-live="polite"
			{...props}
		>
			<div className="mb-2 flex items-center justify-between">
				<span className="text-xs font-medium text-muted-foreground">
					Password Strength
				</span>
				<span className="text-xs font-medium text-muted-foreground">
					{STRENGTH_LABELS[strength]}
				</span>
			</div>
			{/* biome-ignore lint/a11y/useSemanticElements: native <meter> cannot be styled into the segmented bar design */}
			<div
				className="flex gap-2"
				role="meter"
				aria-label="Password strength"
				aria-valuenow={strength}
				aria-valuemin={0}
				aria-valuemax={PASSWORD_MAX_STRENGTH}
			>
				{[0, 1, 2, 3, 4].map((level) => {
					const isActive = level <= strength;
					return (
						<div
							key={`strength-${level}`}
							className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
								isActive
									? strength === 0
										? "bg-destructive"
										: strength === 1
											? "bg-destructive/70"
											: strength === 2
												? "bg-warning"
												: strength === 3
													? "bg-success/70"
													: "bg-success"
									: "bg-muted"
							}`}
						/>
					);
				})}
			</div>
			<p className="mt-2 text-xs text-muted-foreground">
				Use {PASSWORD_MIN_LENGTH}+ characters with uppercase, lowercase,
				numbers, and symbols
			</p>
		</div>
	);
}
