import { Toaster as Sonner } from "sonner";
import * as React from "react";
import { useTheme, type ResolvedTheme } from "../theme-provider";

type ToastProps = React.ComponentProps<typeof Sonner>;

const DARK_THEMES: readonly ResolvedTheme[] = ["dark", "high-contrast-dark"];

// useTheme throws without a provider; toasts must still render in apps that
// toggle theme classes by hand, so fall back to a static light toaster there.
function useOptionalResolvedTheme(): ResolvedTheme | null {
	try {
		return useTheme().resolvedTheme;
	} catch {
		return null;
	}
}

const Toast = ({ theme, ...props }: ToastProps) => {
	// Sonner paints its own light/dark surfaces from data-sonner-theme, so it
	// must be told which kala-ui theme is active or toasts stay light while the
	// app goes dark. resolvedTheme is concrete from the provider's first render
	// (getSystemTheme initializes synchronously from matchMedia), so there is no
	// undefined window; the provider is optional for apps toggling classes by hand.
	const resolvedTheme = useOptionalResolvedTheme();
	const sonnerTheme =
		theme ??
		(resolvedTheme && DARK_THEMES.includes(resolvedTheme) ? "dark" : "light");

	return (
		<Sonner
			data-kala-component="toast"
			className="toaster group"
			theme={sonnerTheme}
			closeButton
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-popover group-[.toaster]:text-foreground group-[.toaster]:border data-[type=error]:!border-destructive data-[type=success]:!border-success data-[type=warning]:!border-warning data-[type=info]:!border-info data-[type=success]:[&_[data-icon]]:!text-success data-[type=error]:[&_[data-icon]]:!text-destructive data-[type=warning]:[&_[data-icon]]:!text-warning data-[type=info]:[&_[data-icon]]:!text-info",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-data-[type=success]:!bg-success group-data-[type=success]:!text-success-foreground group-data-[type=error]:!bg-destructive group-data-[type=error]:!text-destructive-foreground group-data-[type=warning]:!bg-warning group-data-[type=warning]:!text-warning-foreground group-data-[type=info]:!bg-info group-data-[type=info]:!text-info-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
					icon: "group-[.toast]:!text-current",
					closeButton:
						"group-[.toast]:bg-popover group-[.toast]:border group-[.toast]:hover:bg-accent group-[.toast]:!left-auto group-[.toast]:!-right-4 group-[.toast]:!-top-1 group-data-[type=success]:!border-success group-data-[type=error]:!border-destructive group-data-[type=warning]:!border-warning group-data-[type=info]:!border-info",
				},
			}}
			{...props}
		/>
	);
};

export { Toast };
