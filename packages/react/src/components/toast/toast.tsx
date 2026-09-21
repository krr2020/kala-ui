import type * as React from "react";
import { Toaster as Sonner } from "sonner";
import { toastStyles } from "../../config/toast";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { type ResolvedTheme, useOptionalTheme } from "../theme-provider";

type ToastProps = React.ComponentProps<typeof Sonner> & {
	slotStyles?: SlotStyles;
};

export type { ToastProps };

const DARK_THEMES: readonly ResolvedTheme[] = ["dark", "high-contrast-dark"];

/**
 * Merge per-part slot entries over the sonner surface bases. Pure so the
 * contract is testable without firing a toast (sonner renders nothing until
 * one fires — see DELEGATIONS in the rollout suite).
 */
export const buildToastClassNames = (
	slotStyles?: SlotStyles,
): Record<keyof typeof toastStyles, string> => ({
	toast: applySlot(toastStyles.toast, slotStyles?.toast).className,
	description: applySlot(toastStyles.description, slotStyles?.description)
		.className,
	actionButton: applySlot(toastStyles.actionButton, slotStyles?.actionButton)
		.className,
	cancelButton: applySlot(toastStyles.cancelButton, slotStyles?.cancelButton)
		.className,
	icon: applySlot(toastStyles.icon, slotStyles?.icon).className,
	closeButton: applySlot(toastStyles.closeButton, slotStyles?.closeButton)
		.className,
});

// The theme context is read optionally: apps that toggle theme classes by
// hand render no provider, so the toaster falls back to light there instead
// of throwing mid-render.
function useOptionalResolvedTheme(): ResolvedTheme | null {
	return useOptionalTheme()?.resolvedTheme ?? null;
}

const Toast = ({ theme, slotStyles, ...props }: ToastProps) => {
	// Sonner paints its own light/dark surfaces from data-sonner-theme, so it
	// must be told which kala-ui theme is active or toasts stay light while the
	// app goes dark. resolvedTheme is concrete from the provider's first render
	// (getSystemTheme initializes synchronously from matchMedia), so there is no
	// undefined window; the provider is optional for apps toggling classes by hand.
	const resolvedTheme = useOptionalResolvedTheme();
	const sonnerTheme =
		theme ??
		(resolvedTheme && DARK_THEMES.includes(resolvedTheme) ? "dark" : "light");

	// Sonner owns the toast chrome (see DELEGATIONS in the rollout suite), so
	// the root slot applies to the wrapper-rendered <section> and per-part
	// slots flow through the classNames map above.
	const root = applySlot("toaster group", slotStyles?.root);
	return (
		<Sonner
			data-kala-component="toast"
			className={root.className}
			style={mergeStyle(props.style, root.style)}
			theme={sonnerTheme}
			closeButton
			toastOptions={{ classNames: buildToastClassNames(slotStyles) }}
			{...props}
		/>
	);
};

export { Toast };
