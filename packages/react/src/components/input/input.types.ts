import type * as React from "react";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	/** Show password visibility toggle button (only for type="password") */
	showPasswordToggle?: boolean;
	/** Prefix icon element */
	prefixIcon?: React.ReactNode;
	/** Suffix icon element */
	suffixIcon?: React.ReactNode;
	/** Error state styling */
	hasError?: boolean;
	/** Success state styling */
	hasSuccess?: boolean;
	/** Disable wrapper div (use when inside InputGroup) */
	unstyled?: boolean;
	/** Show loading skeleton */
	isLoading?: boolean;
}
