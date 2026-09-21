import { cn } from "../../lib/utils";
import { Box } from "../box";
import { Overlay } from "../overlay";
import { Spinner } from "../spinner";
import type { LoadingOverlayProps } from "./loading-overlay.types";

function LoadingOverlay({
	ref,
	className,
	visible = false,
	zIndex = 400,
	overlayProps,
	loaderProps,
	transitionDuration = 0,
	style,
	...props
}: LoadingOverlayProps) {
	const { children: loaderChildren, ...otherLoaderProps } = loaderProps || {};

	if (!visible && transitionDuration === 0) {
		return null;
	}

	return (
		<Box
			data-kala-component="loading-overlay"
			ref={ref}
			// aria-busy marks the loading region; the Spinner's <output> is the
			// live status. The fade-out shell gets aria-hidden so screen readers
			// drop the stale status node once loading ends.
			aria-busy="true"
			aria-hidden={!visible || undefined}
			className={cn(
				"absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity",
				visible ? "opacity-100 pointer-events-auto" : "opacity-0",
				className,
			)}
			style={{
				zIndex,
				transitionDuration: `${transitionDuration}ms`,
				...style,
			}}
			{...props}
		>
			<Overlay
				zIndex={zIndex}
				fixed={false} // LoadingOverlay is usually absolute to parent
				{...overlayProps}
			/>
			<Box className="relative z-10">
				{loaderChildren ? (
					loaderChildren
				) : (
					<Spinner size="lg" {...otherLoaderProps} />
				)}
			</Box>
		</Box>
	);
}

export { LoadingOverlay };
