import type { ButtonProps } from "@kala-ui/react/button";
import type { SlotStyles } from "@kala-ui/react/lib/slot-styles";

export interface SocialLoginButtonProps extends Omit<ButtonProps, "variant"> {
	/** OAuth provider name (e.g., 'google', 'github') */
	provider: "google" | "github" | "facebook" | "twitter" | "x" | "linkedin";
	/** Loading state during OAuth redirect */
	isLoading?: boolean;
	/** Optional custom label (defaults to provider name, e.g., "Google") */
	label?: string;
	/** Per-part overrides: `root` (button), `icon` (provider glyph). */
	slotStyles?: SlotStyles;
}

export interface SocialLoginButtonsProps {
	/** Callback when any provider button is clicked */
	onProviderClick: (provider: SocialLoginButtonProps["provider"]) => void;
	/** Currently loading provider (if any) */
	loadingProvider?: SocialLoginButtonProps["provider"];
	/** Optional list of providers to display (defaults to all 5) */
	providers?: SocialLoginButtonProps["provider"][];
	/** Optional custom class name for the container */
	className?: string;
	/** Show divider with "Or continue with" text */
	showDivider?: boolean;
	/** Custom text for the divider; defaults to "Or sign in with" */
	dividerText?: string;
	/** Per-part overrides: root, divider, dividerLine, dividerMask, dividerLabel, dividerRule, list. */
	slotStyles?: SlotStyles;
}
