import * as React from "react";
import { cn } from "../../lib/utils";
import { Flex, type FlexProps } from "../flex/flex";

export interface GroupProps extends Omit<FlexProps, "direction"> {
  direction?: "row" | "rowReverse";
}

const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ className, direction = "row", gap = 4, align = "center", wrap = "wrap", ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction={direction}
        gap={gap}
        align={align}
        wrap={wrap}
        className={cn(className)}
        {...props}
      />
    );
  }
);
Group.displayName = "Group";

export { Group };
