import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Box } from "../box";

const indicatorVariants = cva(
    "absolute flex items-center justify-center font-bold z-50",
    {
        variants: {
            position: {
                "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
                "top-center": "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
                "middle-left": "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
                "middle-center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "middle-right": "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
                "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
                "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
                "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
            },
            color: {
                primary: "bg-primary text-primary-foreground",
                secondary: "bg-secondary text-secondary-foreground",
                danger: "bg-destructive text-destructive-foreground",
                success: "bg-success text-success-foreground",
                warning: "bg-warning text-warning-foreground",
                info: "bg-info text-info-foreground",
            },
            withBorder: {
                true: "border-2 border-background",
            },
            processing: {
                true: "animate-pulse",
            },
        },
        defaultVariants: {
            position: "top-right",
            color: "primary",
            withBorder: false,
            processing: false,
        },
    }
);

export interface IndicatorProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof indicatorVariants> {
    /** Indicator position relative to the target element */
    position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "middle-left"
    | "middle-center"
    | "middle-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
    /** Offset from the edge of the target element, in px */
    offset?: number;
    /** Determines whether the indicator should be displayed inline */
    inline?: boolean;
    /** Size of the indicator in px */
    size?: number;
    /** Determines whether the indicator should have a border */
    withBorder?: boolean;
    /** Determines whether the indicator should be disabled (hidden) */
    disabled?: boolean;
    /** Determines whether the indicator should show a processing animation */
    processing?: boolean;
    /** Indicator label */
    label?: React.ReactNode;
    /** Target element */
    children?: React.ReactNode;
}

const Indicator = React.forwardRef<HTMLDivElement, IndicatorProps>(
    (
        {
            className,
            position = "top-right",
            offset = 0,
            inline = false,
            size = 10,
            withBorder = false,
            disabled = false,
            processing = false,
            color = "primary",
            label,
            children,
            style,
            ...props
        },
        ref
    ) => {
        const getPositionStyles = () => {
            const styles: React.CSSProperties = {};

            if (offset) {
                switch (position) {
                    case "top-left":
                        styles.top = offset;
                        styles.left = offset;
                        break;
                    case "top-center":
                        styles.top = offset;
                        break;
                    case "top-right":
                        styles.top = offset;
                        styles.right = offset;
                        break;
                    case "middle-left":
                        styles.left = offset;
                        break;
                    case "middle-right":
                        styles.right = offset;
                        break;
                    case "bottom-left":
                        styles.bottom = offset;
                        styles.left = offset;
                        break;
                    case "bottom-center":
                        styles.bottom = offset;
                        break;
                    case "bottom-right":
                        styles.bottom = offset;
                        styles.right = offset;
                        break;
                }
            }

            return styles;
        };

        return (
            <Box
                ref={ref}
                className={cn("relative", inline ? "inline-block" : "block")}
            >
                {!disabled && (
                    <div
                        className={cn(
                            indicatorVariants({ position, color, withBorder, processing }),
                            "rounded-full",
                            className
                        )}
                        style={{
                            width: label ? "auto" : size,
                            height: size,
                            minWidth: size,
                            padding: label ? `0 ${size / 3}px` : 0,
                            fontSize: size * 0.7,
                            ...getPositionStyles(),
                            ...style,
                        }}
                        {...props}
                    >
                        {label}
                    </div>
                )}
                {children}
            </Box>
        );
    }
);

Indicator.displayName = "Indicator";

export { Indicator, indicatorVariants };
