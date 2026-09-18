import { ChevronRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface BreadcrumbsProps {
	items: BreadcrumbItem[];
	className?: string;
	style?: CSSProperties;
	separator?: ReactNode;
	variant?: "default" | "style1" | "style2" | "style3";
	slotStyles?: SlotStyles;
}

export function Breadcrumbs({
	items,
	className,
	style,
	separator,
	variant = "default",
	slotStyles,
}: BreadcrumbsProps) {
	if (!items.length) return null;

	// Default separators based on variant
	const getDefaultSeparator = () => {
		if (separator) return separator;

		switch (variant) {
			case "style2":
				return <span className="text-muted-foreground">&gt;</span>;
			case "style3":
				return <span className="text-muted-foreground">•</span>;
			default:
				return <ChevronRight className="size-4 text-muted-foreground" />;
		}
	};

	const separatorElement = getDefaultSeparator();

	const root = applySlot(cn(className), slotStyles?.root);

	return (
		<nav
			data-kala-component="breadcrumbs"
			aria-label="breadcrumb"
			className={root.className}
			style={mergeStyle(style, root.style)}
		>
			<ol
				className={cn(
					"flex items-center gap-0 list-none p-0 m-0",
					variant === "style1" && "text-uppercase",
				)}
			>
				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<li
							key={`${item.label}-${index}`}
							className={cn(
								"flex items-center text-sm",
								isLast && "text-foreground font-normal",
								!isLast && "text-muted-foreground",
							)}
							{...(isLast && { "aria-current": "page" })}
						>
							{isLast ? (
								<span>{item.label}</span>
							) : (
								<>
									{item.href ? (
										<a
											href={item.href}
											className="hover:text-primary transition-colors"
										>
											{item.label}
										</a>
									) : (
										<span>{item.label}</span>
									)}
									<span className="flex items-center mx-2">
										{separatorElement}
									</span>
								</>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
