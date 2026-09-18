"use client";

import type { Easing } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import type * as React from "react";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";

export interface CollapseProps {
	ref?: React.Ref<HTMLDivElement>;
	/** If true, the content will be visible */
	in: boolean;
	/** The content to be collapsed */
	children: React.ReactNode;
	/** Id — lets aria-controls point at the collapsible region */
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	/** Transition duration in seconds */
	transitionDuration?: number;
	/** Transition timing function */
	transitionTimingFunction?: Easing | Easing[];
	/** Called when transition starts */
	onTransitionEnd?: () => void;
	/** If true, opacity will be animated */
	animateOpacity?: boolean;
	slotStyles?: SlotStyles;
}

export function Collapse({
	ref,
	children,
	in: opened,
	id,
	className,
	style,
	slotStyles,
	transitionDuration = 0.2,
	transitionTimingFunction = "easeInOut",
	onTransitionEnd,
	animateOpacity = true,
}: CollapseProps) {
	const root = applySlot(className, slotStyles?.root);
	return (
		<AnimatePresence initial={false}>
			{opened && (
				<motion.div
					data-kala-component="collapse"
					ref={ref}
					id={id}
					className={root.className}
					style={{
						overflow: "hidden",
						...mergeStyle(style, root.style),
					}}
					initial={{ height: 0, opacity: animateOpacity ? 0 : 1 }}
					animate={{
						height: "auto",
						opacity: 1,
						transition: {
							height: {
								duration: transitionDuration,
								ease: transitionTimingFunction as Easing,
							},
							opacity: {
								duration: transitionDuration,
								ease: transitionTimingFunction as Easing,
							},
						},
					}}
					exit={{
						height: 0,
						opacity: animateOpacity ? 0 : 1,
						transition: {
							height: {
								duration: transitionDuration,
								ease: transitionTimingFunction as Easing,
							},
							opacity: {
								duration: transitionDuration,
								ease: transitionTimingFunction as Easing,
							},
						},
					}}
					onAnimationComplete={onTransitionEnd}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
