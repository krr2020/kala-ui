import { Button } from "@kala-ui/react/button";
import { Card, CardContent, CardHeader } from "@kala-ui/react/card";
import { useSlotStyles } from "@kala-ui/react/kala-provider";
import { applySlot } from "@kala-ui/react/lib/slot-styles";
import { cn } from "@kala-ui/react/lib/utils";
import { sessionCardStyles } from "../../config/session-card";
import type * as React from "react";
import {
	Clock,
	HelpCircle,
	MapPin,
	Monitor,
	Smartphone,
	Tablet,
	Wifi,
} from "lucide-react";
import { SessionCardSkeleton } from "./session-card-skeleton";
import type { SessionCardProps, SessionData } from "./session-card.types";

function getDeviceIcon(device: string) {
	const deviceLower = device.toLowerCase();
	if (deviceLower.includes("mobile") || deviceLower.includes("phone")) {
		return Smartphone;
	}
	if (deviceLower.includes("tablet") || deviceLower.includes("ipad")) {
		return Tablet;
	}
	if (deviceLower.includes("desktop") || deviceLower.includes("computer")) {
		return Monitor;
	}
	return HelpCircle;
}

function formatTimestamp(timestamp: string): string {
	const date = new Date(timestamp);

	if (Number.isNaN(date.getTime())) {
		return "Unknown";
	}

	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "Just now";
	if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
	if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
	if (diffDays === 1) {
		return `Yesterday at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
	}
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

export function SessionCard({
	session,
	onRevoke,
	isRevoking,
	className,
	style,
	slotStyles: slotStylesRaw,
	isLoading = false,
	skeletonConfig,
	skeleton,
	ref,
	...props
}: SessionCardProps) {
	const slotStyles = useSlotStyles("session-card", slotStylesRaw);
	const root = applySlot(cn(sessionCardStyles.root, className), slotStyles?.root);

	if (isLoading) {
		if (skeleton) {
			return (
				<Card
					data-kala-component="session-card"
					ref={ref}
					className={root.className}
					style={root.style}
					{...props}
				>
					{skeleton}
				</Card>
			);
		}
		return (
			<SessionCardSkeleton
				data-kala-component="session-card"
				className={root.className}
				{...skeletonConfig}
			/>
		);
	}

	const DeviceIcon = getDeviceIcon(session.device);
	const lastActive = formatTimestamp(session.lastActiveAt);

	const handleRevoke = () => {
		if (onRevoke && !session.isCurrent) {
			void onRevoke(session.id);
		}
	};

	const header = applySlot(sessionCardStyles.header, slotStyles?.header);
	const headerRow = applySlot(
		sessionCardStyles.headerRow,
		slotStyles?.headerRow,
	);
	const headerMain = applySlot(
		sessionCardStyles.headerMain,
		slotStyles?.headerMain,
	);
	const deviceIcon = applySlot(
		sessionCardStyles.deviceIcon,
		slotStyles?.deviceIcon,
	);
	const titleBlock = applySlot(
		sessionCardStyles.titleBlock,
		slotStyles?.titleBlock,
	);
	const titleRow = applySlot(sessionCardStyles.titleRow, slotStyles?.titleRow);
	const title = applySlot(sessionCardStyles.title, slotStyles?.title);
	const subtitle = applySlot(sessionCardStyles.subtitle, slotStyles?.subtitle);
	const currentBadge = applySlot(
		sessionCardStyles.currentBadge,
		slotStyles?.currentBadge,
	);
	const revokeButton = applySlot(
		sessionCardStyles.revokeButton,
		slotStyles?.revokeButton,
	);
	const content = applySlot(sessionCardStyles.content, slotStyles?.content);
	const detailList = applySlot(
		sessionCardStyles.detailList,
		slotStyles?.detailList,
	);
	const detailRow = applySlot(
		sessionCardStyles.detailRow,
		slotStyles?.detailRow,
	);
	const detailIcon = applySlot(
		sessionCardStyles.detailIcon,
		slotStyles?.detailIcon,
	);

	return (
		<Card
			data-kala-component="session-card"
			ref={ref}
			className={root.className}
			style={root.style}
			{...props}
		>
			<CardHeader className={header.className} style={header.style}>
				<div className={headerRow.className} style={headerRow.style}>
					<div className={headerMain.className} style={headerMain.style}>
						<DeviceIcon
							className={deviceIcon.className}
							style={deviceIcon.style}
							aria-hidden="true"
						/>
						<div className={titleBlock.className} style={titleBlock.style}>
							<div className={titleRow.className} style={titleRow.style}>
								<h4 className={title.className} style={title.style}>
									{session.browser}
								</h4>
							</div>
							<p className={subtitle.className} style={subtitle.style}>
								{session.os} • {session.device}
							</p>
						</div>
					</div>
					{session.isCurrent ? (
						<div
							className={currentBadge.className}
							style={currentBadge.style}
						>
							Current Session
						</div>
					) : (
						onRevoke && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleRevoke}
								disabled={isRevoking}
								className={revokeButton.className}
								style={revokeButton.style}
								aria-label="Revoke session"
							>
								{isRevoking ? "Revoking..." : "Revoke"}
							</Button>
						)
					)}
				</div>
			</CardHeader>
			<CardContent className={content.className} style={content.style}>
				<div className={detailList.className} style={detailList.style}>
					{session.location && (
						<div className={detailRow.className} style={detailRow.style}>
							<MapPin className={detailIcon.className} aria-hidden="true" />
							<span>{session.location}</span>
						</div>
					)}
					<div className={detailRow.className} style={detailRow.style}>
						<Wifi className={detailIcon.className} aria-hidden="true" />
						<span>{session.ip}</span>
					</div>
					<div className={detailRow.className} style={detailRow.style}>
						<Clock className={detailIcon.className} aria-hidden="true" />
						<span>Last active {lastActive}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export type { SessionData } from "./session-card.types";
