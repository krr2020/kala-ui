"use client";

import type { Easing } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export interface CollapseProps {
	/** If true, the content will be visible */
	in: boolean;
	/** The content to be collapsed */
	children: React.ReactNode;
	/** Transition duration in seconds */
	transitionDuration?: number;
	/** Transition timing function */
	transitionTimingFunction?: Easing | Easing[];
	/** Called when transition starts */
	onTransitionEnd?: () => void;
	/** If true, opacity will be animated */
	animateOpacity?: boolean;
}

export const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
	(
		{
			children,
			in: opened,
			transitionDuration = 0.2,
			transitionTimingFunction = "ease",
			onTransitionEnd,
			animateOpacity = true,
		},
		ref,
	) => {
		return (
			<AnimatePresence initial={false}>
				{opened && (
					<motion.div
						ref={ref}
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
						style={{ overflow: "hidden" }}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		);
	},
);

Collapse.displayName = "Collapse";
