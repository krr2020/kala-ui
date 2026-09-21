import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

/**
 * Polymorphic props: everything the rendered element accepts, plus `as`/`asChild`.
 * Typed per element — `<Box as="a" href>` typechecks, `<Box gap={2}>` (a Flex prop) is a compile error.
 */
export type BoxProps<T extends React.ElementType = "div"> = Omit<
	React.ComponentProps<T>,
	"as" | "asChild"
> & {
	as?: T;
	asChild?: boolean;
	slotStyles?: SlotStyles;
};
