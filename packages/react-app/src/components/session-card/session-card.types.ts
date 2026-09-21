import type { SlotStyles } from "@kala-ui/react/lib/slot-styles";
import type { SessionCardSkeletonConfig } from "@kala-ui/react/skeleton";
import type * as React from "react";

export interface SessionData {
	id: string;
	device: string;
	browser: string;
	os: string;
	location?: string;
	ip: string;
	lastActiveAt: string;
	createdAt: string;
	isCurrent: boolean;
}

export interface SessionCardProps extends React.ComponentProps<"div"> {
	session: SessionData;
	onRevoke?: (sessionId: string) => void | Promise<void>;
	isRevoking?: boolean;
	className?: string;
	isLoading?: boolean;
	skeletonConfig?: SessionCardSkeletonConfig;
	skeleton?: React.ReactNode;
	/** Per-part overrides: root, header, headerRow, deviceIcon, title, subtitle,
	 * currentBadge, revokeButton, content, detailList, detailRow, detailIcon. */
	slotStyles?: SlotStyles;
}
