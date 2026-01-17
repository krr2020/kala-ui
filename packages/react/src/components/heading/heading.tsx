import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const headingVariants = cva("font-bold tracking-tight text-foreground", {
  variants: {
    size: {
      h1: "text-4xl lg:text-5xl",
      h2: "text-3xl lg:text-4xl",
      h3: "text-2xl lg:text-3xl",
      h4: "text-xl lg:text-2xl",
      h5: "text-lg lg:text-xl",
      h6: "text-base lg:text-lg",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    weight: {
      default: "font-bold",
      medium: "font-medium",
      semibold: "font-semibold",
      extrabold: "font-extrabold",
    },
  },
  defaultVariants: {
    size: "h2",
    align: "left",
    weight: "default",
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, align, weight, asChild = false, ...props }, ref) => {
    const _Comp = asChild ? Slot : "h2";
    // If asChild is false, we try to use the appropriate heading tag based on size
    // But since Comp is determined by asChild, we can't easily change it dynamically if not asChild
    // Unless we map size to tag.
    
    // Simple mapping if not asChild
    const Tag = asChild ? Slot : (size as React.ElementType) || "h2";

    return (
      <Tag
        className={cn(headingVariants({ size, align, weight, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
