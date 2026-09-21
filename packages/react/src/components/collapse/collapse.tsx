"use client";

import type { Easing } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { useSlotStyles } from "../kala-provider";
import type { CollapseProps } from "./collapse.types";

export function Collapse({
	ref,
	children,
	in: opened,
	id,
	className,
	style,
	slotStyles: slotStylesRaw,
	transitionDuration = 0.2,
	transitionTimingFunction = "easeInOut",
	onTransitionEnd,
	animateOpacity = true,
}: CollapseProps) {
	const slotStyles = useSlotStyles("collapse", slotStylesRaw);
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
