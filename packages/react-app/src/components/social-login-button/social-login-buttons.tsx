import { cn } from "@kala-ui/react/lib/utils";
import { useSlotStyles } from "@kala-ui/react/kala-provider";
import { applySlot } from "@kala-ui/react/lib/slot-styles";
import type * as React from "react";
import { socialLoginButtonsStyles } from "../../config/social-login-button";
import { SocialLoginButton } from "./social-login-button";
import type {
	SocialLoginButtonProps,
	SocialLoginButtonsProps,
} from "./social-login-button.types";

export function SocialLoginButtons({
	onProviderClick,
	loadingProvider,
	providers = ["google", "github", "facebook", "x", "linkedin"],
	className,
	showDivider = true,
	dividerText = "Or sign in with",
	slotStyles: slotStylesRaw,
}: SocialLoginButtonsProps): React.JSX.Element {
	const slotStyles = useSlotStyles("social-login-buttons", slotStylesRaw);
	const root = applySlot(
		cn(socialLoginButtonsStyles.root, className),
		slotStyles?.root,
	);
	const divider = applySlot(socialLoginButtonsStyles.divider, slotStyles?.divider);
	const dividerLine = applySlot(
		socialLoginButtonsStyles.dividerLine,
		slotStyles?.dividerLine,
	);
	const dividerMask = applySlot(
		socialLoginButtonsStyles.dividerMask,
		slotStyles?.dividerMask,
	);
	const dividerLabel = applySlot(
		socialLoginButtonsStyles.dividerLabel,
		slotStyles?.dividerLabel,
	);
	const dividerRule = applySlot(
		socialLoginButtonsStyles.dividerRule,
		slotStyles?.dividerRule,
	);
	const list = applySlot(socialLoginButtonsStyles.list, slotStyles?.list);

	return (
		<div data-kala-component="social-login-buttons" className={root.className}>
			{showDivider && (
				<div className={divider.className}>
					<div className={dividerLine.className}>
						<span className={dividerRule.className} />
					</div>
					<div className={dividerMask.className}>
						<span className={dividerLabel.className}>{dividerText}</span>
					</div>
				</div>
			)}

			<div className={list.className}>
				{providers.map((provider) => (
					<SocialLoginButton
						key={provider}
						provider={provider}
						isLoading={loadingProvider === provider}
						onClick={() => onProviderClick(provider)}
						disabled={
							loadingProvider !== undefined && loadingProvider !== provider
						}
					/>
				))}
			</div>
		</div>
	);
}

export type { SocialLoginButtonProps } from "./social-login-button.types";
