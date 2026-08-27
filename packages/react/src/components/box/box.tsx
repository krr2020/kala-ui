import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Polymorphic props: everything the rendered element accepts, plus `as` /
 * `asChild`. Typed per element — `<Box as="a" href>` typechecks, `<Box
 * gap={2}>` (a Flex prop) is a compile error.
 */
export type BoxProps<T extends React.ElementType = "div"> = Omit<
	React.ComponentProps<T>,
	"as" | "asChild"
> & {
	as?: T;
	asChild?: boolean;
};

export function Box<T extends React.ElementType = "div">(props: BoxProps<T>) {
	const {
		className,
		asChild = false,
		as: Tag = "div",
		ref,
		...rest
	} = props as BoxProps<"div">;
	const Comp = (asChild ? Slot : Tag) as React.ElementType;
	return <Comp className={cn(className)} ref={ref} {...rest} />;
}
