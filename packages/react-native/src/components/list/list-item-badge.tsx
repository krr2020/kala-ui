/**
 * ListItemBadge: trailing status pill — delegates to Badge.
 */
import type { ReactElement } from "react";
import { Badge } from "../badge";
import type { ListItemBadgeProps } from "./list.types";

export function ListItemBadge({
	color = "muted",
	testID = "k-list-item-badge",
	children,
}: ListItemBadgeProps): ReactElement {
	return (
		<Badge testID={testID} variant="subtle" color={color} shape="pill">
			{children}
		</Badge>
	);
}
