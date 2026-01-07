/**
 * Session Card Component
 * Displays information about an active session with device, browser, location, and last activity
 */

import {
	Clock,
	HelpCircle,
	MapPin,
	Monitor,
	Smartphone,
	Tablet,
	Wifi,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Card, CardContent, CardHeader } from "../card";
import { SessionCardSkeleton } from "./session-card-skeleton";
import type { SessionCardSkeletonConfig } from "../skeleton/skeleton.types";

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

export interface SessionCardProps {
	session: SessionData;
	onRevoke?: (sessionId: string) => void | Promise<void>;
	isRevoking?: boolean;
	className?: string;
	isLoading?: boolean;
	skeletonConfig?: SessionCardSkeletonConfig;
	skeleton?: React.ReactNode;
}

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
	isLoading = false,
	skeletonConfig,
	skeleton,
}: SessionCardProps) {
	if (isLoading) {
		if (skeleton) {
			return (
				<Card
					data-comp="session-card"
					className={cn("relative", className)}
				>
					{skeleton}
				</Card>
			);
		}
		return (
			<SessionCardSkeleton className={className} {...skeletonConfig} />
		);
	}

	const DeviceIcon = getDeviceIcon(session.device);
	const lastActive = formatTimestamp(session.lastActiveAt);

	const handleRevoke = () => {
		if (onRevoke && !session.isCurrent) {
			void onRevoke(session.id);
		}
	};

	return (
		<Card data-comp="session-card" className={cn("relative", className)}>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-3 flex-1">
						<DeviceIcon
							className="size-6 text-muted-foreground mt-0.5"
							aria-hidden="true"
						/>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<h4 className="font-semibold text-sm">{session.browser}</h4>
							</div>
							<p className="text-xs text-muted-foreground mt-0.5">
								{session.os} • {session.device}
							</p>
						</div>
					</div>
					{session.isCurrent ? (
						<div className="inline-flex items-center rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success border border-success/20">
							Current Session
						</div>
					) : (
						onRevoke && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleRevoke}
								disabled={isRevoking}
								className="text-destructive hover:text-destructive hover:bg-destructive/10"
								aria-label="Revoke session"
							>
								{isRevoking ? "Revoking..." : "Revoke"}
							</Button>
						)
					)}
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-1.5 text-xs text-muted-foreground">
					{session.location && (
						<div className="flex items-center gap-1.5">
							<MapPin className="size-3.5" aria-hidden="true" />
							<span>{session.location}</span>
						</div>
					)}
					<div className="flex items-center gap-1.5">
						<Wifi className="size-3.5" aria-hidden="true" />
						<span>{session.ip}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Clock className="size-3.5" aria-hidden="true" />
						<span>Last active {lastActive}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
