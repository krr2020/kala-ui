import { ChevronRight } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface NavLinkProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
	/** Link label */
	label: React.ReactNode;
	/** Link description */
	description?: React.ReactNode;
	/** Left icon */
	icon?: React.ReactNode;
	/** Right section (e.g. badge, icon) */
	rightSection?: React.ReactNode;
	/** Active state */
	active?: boolean;
	/** Collapsed/Expanded state for nested items */
	defaultOpened?: boolean;
	/** Controlled opened state */
	opened?: boolean;
	/** Callback for opened state change */
	onChangeOpened?: (opened: boolean) => void;
	/** Nested links */
	children?: React.ReactNode;
	/** Disable right section rotation when opened */
	disableRightSectionRotation?: boolean;
	/** Indentation for nested items */
	indent?: boolean;
}

export const NavLink = React.forwardRef<HTMLButtonElement, NavLinkProps>(
	(
		{
			className,
			label,
			description,
			icon,
			rightSection,
			active,
			defaultOpened = false,
			opened: openedProp,
			onChangeOpened,
			children,
			disableRightSectionRotation = false,
			indent = false,
			onClick,
			...props
		},
		ref,
	) => {
		const [opened, setOpened] = React.useState(defaultOpened);

		const isOpened = openedProp !== undefined ? openedProp : opened;

		const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
			if (children) {
				e.preventDefault();
				if (openedProp === undefined) {
					setOpened(!opened);
				}
				onChangeOpened?.(!isOpened);
			}
			onClick?.(e);
		};

		return (
			<>
				<button
					ref={ref}
					className={cn(
						"flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
						active
							? "bg-accent text-accent-foreground"
							: "text-muted-foreground",
						className,
					)}
					onClick={handleToggle}
					{...props}
				>
					{icon && (
						<span className="flex items-center justify-center">{icon}</span>
					)}

					<div className="flex flex-1 flex-col items-start overflow-hidden">
						<span className="truncate">{label}</span>
						{description && (
							<span className="truncate text-xs text-muted-foreground font-normal">
								{description}
							</span>
						)}
					</div>

					{(rightSection || children) && (
						<span
							className={cn(
								"flex items-center justify-center text-muted-foreground transition-transform duration-200",
								children &&
									!disableRightSectionRotation &&
									opened &&
									"rotate-90",
							)}
						>
							{rightSection ||
								(children && <ChevronRight className="h-4 w-4" />)}
						</span>
					)}
				</button>

				{children && opened && (
					<div className={cn("flex flex-col gap-1", indent && "pl-4")}>
						{children}
					</div>
				)}
			</>
		);
	},
);

NavLink.displayName = "NavLink";
