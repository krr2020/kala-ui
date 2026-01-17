import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const gridVariants = cva("grid", {
	variants: {
		cols: {
			1: "grid-cols-1",
			2: "grid-cols-2",
			3: "grid-cols-3",
			4: "grid-cols-4",
			5: "grid-cols-5",
			6: "grid-cols-6",
			7: "grid-cols-7",
			8: "grid-cols-8",
			9: "grid-cols-9",
			10: "grid-cols-10",
			11: "grid-cols-11",
			12: "grid-cols-12",
			none: "grid-cols-none",
		},
		gap: {
			0: "gap-0",
			1: "gap-1",
			2: "gap-2",
			3: "gap-3",
			4: "gap-4",
			5: "gap-5",
			6: "gap-6",
			8: "gap-8",
			10: "gap-10",
			12: "gap-12",
			16: "gap-16",
		},
		flow: {
			row: "grid-flow-row",
			col: "grid-flow-col",
			rowDense: "grid-flow-row-dense",
			colDense: "grid-flow-col-dense",
		},
		align: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			stretch: "items-stretch",
			baseline: "items-baseline",
		},
		justify: {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
			between: "justify-between",
			around: "justify-around",
			evenly: "justify-evenly",
		},
	},
	defaultVariants: {
		cols: 1,
		gap: 0,
		flow: "row",
	},
});

export interface GridProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof gridVariants> {
	asChild?: boolean;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
	(
		{ className, cols, gap, flow, align, justify, asChild = false, ...props },
		ref,
	) => {
		const Comp = asChild ? Slot : "div";
		return (
			<Comp
				className={cn(
					gridVariants({ cols, gap, flow, align, justify, className }),
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Grid.displayName = "Grid";

const gridItemVariants = cva("", {
	variants: {
		colSpan: {
			1: "col-span-1",
			2: "col-span-2",
			3: "col-span-3",
			4: "col-span-4",
			5: "col-span-5",
			6: "col-span-6",
			7: "col-span-7",
			8: "col-span-8",
			9: "col-span-9",
			10: "col-span-10",
			11: "col-span-11",
			12: "col-span-12",
			full: "col-span-full",
			auto: "col-auto",
		},
		rowSpan: {
			1: "row-span-1",
			2: "row-span-2",
			3: "row-span-3",
			4: "row-span-4",
			5: "row-span-5",
			6: "row-span-6",
			full: "row-span-full",
			auto: "row-auto",
		},
		colStart: {
			1: "col-start-1",
			2: "col-start-2",
			3: "col-start-3",
			4: "col-start-4",
			5: "col-start-5",
			6: "col-start-6",
			7: "col-start-7",
			8: "col-start-8",
			9: "col-start-9",
			10: "col-start-10",
			11: "col-start-11",
			12: "col-start-12",
			13: "col-start-13",
			auto: "col-start-auto",
		},
		colEnd: {
			1: "col-end-1",
			2: "col-end-2",
			3: "col-end-3",
			4: "col-end-4",
			5: "col-end-5",
			6: "col-end-6",
			7: "col-end-7",
			8: "col-end-8",
			9: "col-end-9",
			10: "col-end-10",
			11: "col-end-11",
			12: "col-end-12",
			13: "col-end-13",
			auto: "col-end-auto",
		},
	},
});

export interface GridItemProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof gridItemVariants> {
	asChild?: boolean;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
	(
		{
			className,
			colSpan,
			rowSpan,
			colStart,
			colEnd,
			asChild = false,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "div";
		return (
			<Comp
				className={cn(
					gridItemVariants({ colSpan, rowSpan, colStart, colEnd, className }),
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
GridItem.displayName = "GridItem";

export { Grid, GridItem, gridVariants, gridItemVariants };
