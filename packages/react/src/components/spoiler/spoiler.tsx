import { useDisclosure } from "@kala-ui/react-hooks";
import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Box } from "../box";
import { Button } from "../button";
import { Flex } from "../flex";

export interface SpoilerProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Max height in collapsed state (px) */
	maxHeight: number;
	/** Label for "Show more" button */
	showLabel?: React.ReactNode;
	/** Label for "Show less" button */
	hideLabel?: React.ReactNode;
	/** Initial state */
	initialState?: boolean;
	/** Transition duration in seconds */
	transitionDuration?: number;
}

export const Spoiler = React.forwardRef<HTMLDivElement, SpoilerProps>(
	(
		{
			className,
			children,
			maxHeight = 100,
			showLabel = "Show more",
			hideLabel = "Show less",
			initialState = false,
			transitionDuration = 0.2,
			...props
		},
		ref,
	) => {
		const [expanded, { toggle: toggleExpanded }] = useDisclosure(initialState);
		const [showButton, setShowButton] = React.useState(false);
		const contentRef = React.useRef<HTMLDivElement>(null);

		React.useEffect(() => {
			if (contentRef.current) {
				setShowButton(contentRef.current.scrollHeight > maxHeight);
			}
		}, [maxHeight]);

		return (
			<Box ref={ref} className={cn("relative", className)} {...props}>
				<motion.div
					initial={false}
					animate={{ height: expanded ? "auto" : maxHeight }}
					transition={{ duration: transitionDuration, ease: "easeInOut" }}
					className="overflow-hidden"
				>
					<Box ref={contentRef}>{children}</Box>
				</motion.div>

				{showButton && (
					<Flex justify="center" className="mt-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={toggleExpanded}
						>
							{expanded ? hideLabel : showLabel}
						</Button>
					</Flex>
				)}
			</Box>
		);
	},
);

Spoiler.displayName = "Spoiler";
