import { Button, type ButtonProps } from "@kala-ui/react/button";
import { useSlotStyles } from "@kala-ui/react/kala-provider";
import { applySlot } from "@kala-ui/react/lib/slot-styles";
import { cn } from "@kala-ui/react/lib/utils";
import { Loader2 } from "lucide-react";
import type { SimpleIcon } from "simple-icons";
import { siFacebook, siGithub, siGoogle, siX } from "simple-icons";
import { socialLoginButtonStyles } from "../../config/social-login-button";
import type { SocialLoginButtonProps } from "./social-login-button.types";

// Custom LinkedIn icon (removed from simple-icons due to Microsoft legal requirements)
// See: https://github.com/simple-icons/simple-icons/issues/11372
const LinkedInIcon = ({ className }: { className?: string }) => (
	<svg
		role="img"
		viewBox="0 0 24 24"
		className={className}
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>LinkedIn</title>
		<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.224 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
	</svg>
);

// Wrapper component to convert SimpleIcon to React component
const SimpleIconWrapper = ({
	icon,
	className,
	label,
}: {
	icon: SimpleIcon;
	className?: string;
	label?: string;
}) => (
	<svg
		role="img"
		viewBox="0 0 24 24"
		className={className}
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>{label}</title>
		<path d={icon.path} />
	</svg>
);

const providerConfig = {
	google: {
		icon: siGoogle,
		label: "Google",
		color: "hover:bg-brand-google hover:text-white hover:border-brand-google",
	},
	github: {
		icon: siGithub,
		label: "GitHub",
		color: "hover:bg-brand-github hover:text-white hover:border-brand-github",
	},
	facebook: {
		icon: siFacebook,
		label: "Facebook",
		color:
			"hover:bg-brand-facebook hover:text-white hover:border-brand-facebook",
	},
	twitter: {
		icon: siX,
		label: "X",
		color: "hover:bg-brand-twitter hover:text-white hover:border-brand-twitter",
	},
	x: {
		icon: siX,
		label: "X",
		color: "hover:bg-brand-twitter hover:text-white hover:border-brand-twitter",
	},
	linkedin: {
		icon: null, // Custom component used instead
		label: "LinkedIn",
		color:
			"hover:bg-brand-linkedin hover:text-white hover:border-brand-linkedin",
	},
} as const;

export function SocialLoginButton({
	ref,
	provider,
	isLoading = false,
	label,
	className,
	style,
	slotStyles: slotStylesRaw,
	disabled,
	...props
}: SocialLoginButtonProps) {
	const slotStyles = useSlotStyles("social-login-button", slotStylesRaw);
	const config = providerConfig[provider];
	const displayLabel = label ?? config.label;
	const icon = config.icon;
	const root = applySlot(
		cn(socialLoginButtonStyles.root, config.color, className),
		slotStyles?.root,
	);
	const iconSlot = applySlot(socialLoginButtonStyles.icon, slotStyles?.icon);

	return (
		<Button
			data-kala-component="social-login-button"
			ref={ref}
			type="button"
			variant="outline"
			className={root.className}
			style={root.style}
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading ? (
				<Loader2
				className={applySlot(socialLoginButtonStyles.spinner, slotStyles?.icon).className}
			/>
			) : provider === "linkedin" ? (
				<LinkedInIcon className={iconSlot.className} />
			) : icon ? (
				<SimpleIconWrapper
					icon={icon}
					className={iconSlot.className}
					label={displayLabel}
				/>
			) : null}
			<span>{isLoading ? "Redirecting..." : displayLabel}</span>
		</Button>
	);
}
