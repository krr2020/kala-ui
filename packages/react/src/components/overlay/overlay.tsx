import * as React from "react";
import { cn } from "../../lib/utils";
import { Box, type BoxProps } from "../box";

export interface OverlayProps extends BoxProps {
  /** Overlay background color, ignored if gradient is set, default #000 */
  color?: string;
  /** Overlay background opacity, ignored if gradient is set, default 0.6 */
  backgroundOpacity?: number;
  /** Overlay background blur in px */
  blur?: number;
  /** Overlay background gradient, overrides color and backgroundOpacity */
  gradient?: string;
  /** Overlay z-index */
  zIndex?: number;
  /** Use fixed position instead of absolute, default false */
  fixed?: boolean;
  /** Overlay border radius */
  radius?: number | string;
  /** Content inside overlay */
  children?: React.ReactNode;
}

// Helper to convert hex to rgb (simplified)
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
};

const Overlay = React.forwardRef<HTMLElement, OverlayProps>(
  (
    {
      className,
      color = "#000",
      backgroundOpacity = 0.6,
      blur,
      gradient,
      zIndex,
      fixed = false,
      radius,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const backgroundStyle = gradient
      ? { backgroundImage: gradient }
      : color.startsWith("#")
        ? {
          backgroundColor: `rgba(${hexToRgb(color)?.r ?? 0
            }, ${hexToRgb(color)?.g ?? 0}, ${hexToRgb(color)?.b ?? 0}, ${backgroundOpacity})`,
        }
        : {
          backgroundColor: color,
          // If we can't parse color, we can't easily set rgba.
          // We could use `opacity` but that affects children.
          // Alternative: Use a pseudo-element or just accept that named colors + opacity prop might behave like standard opacity if we can't mix them.
          // Or just leave it as is and let user pass rgba string as color.
        };

    // Refined approach: If we used the `opacity` CSS property, it would fade out the children (like text/loader).
    // The requirement is to only fade the background.
    // So if it's a hex color, we convert to RGBA.
    // If it's not hex, we rely on the user passing a valid color string (which might be rgba).
    // If they pass a named color like 'red' and opacity 0.5, we can't easily mix them without a lib.
    // I will stick to hex conversion for now as it covers most cases (default is #000).

    return (
      <Box
        ref={ref}
        className={cn(
          fixed ? "fixed" : "absolute",
          "inset-0",
          className
        )}
        style={{
          ...backgroundStyle,
          backdropFilter: blur ? `blur(${blur}px)` : undefined,
          zIndex,
          borderRadius: radius,
          ...style,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Overlay.displayName = "Overlay";

export { Overlay };
