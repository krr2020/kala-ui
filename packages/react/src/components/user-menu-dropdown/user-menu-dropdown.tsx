"use client";

import { LogOut, Settings, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";

export interface UserMenuDropdownProps {
	/**
	 * User information to display
	 */
	user: {
		name?: string;
		email?: string;
		avatar?: string;
	};
	/**
	 * Whether the dropdown is currently open
	 */
	isOpen?: boolean;
	/**
	 * Callback when dropdown open state changes
	 */
	onOpenChange?: (open: boolean) => void;
	/**
	 * Callback when logout is clicked
	 */
	onLogout?: () => void;
	/**
	 * Base URL for navigation links (default: '/admin')
	 */
	baseUrl?: string;
	/**
	 * Additional CSS classes for the trigger button
	 */
	className?: string;
}

export function UserMenuDropdown({
	user,
	isOpen,
	onOpenChange,
	onLogout,
	baseUrl = "/admin",
	className,
}: UserMenuDropdownProps) {
	const initials = user.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: (user.email?.[0]?.toUpperCase() ?? "?");

	const handleProfileClick = () => {
		window.location.href = `${baseUrl}/profile`;
	};

	const handleSettingsClick = () => {
		window.location.href = `${baseUrl}/profile/security`;
	};

	const handleLogoutClick = () => {
		onLogout?.();
	};

	return (
		<DropdownMenu
			{...(isOpen !== undefined && { open: isOpen })}
			{...(onOpenChange && { onOpenChange })}
		>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className={cn("h-auto p-1 rounded-full hover:bg-accent", className)}
					aria-label="User menu"
				>
					<Avatar className="size-8">
						{user.avatar && (
							<AvatarImage src={user.avatar} alt={user.name ?? "User"} />
						)}
						<AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
							{initials}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>
					<div className="flex flex-col space-y-1">
						{user.name && (
							<p className="text-sm font-medium leading-none">{user.name}</p>
						)}
						{user.email && (
							<p className="text-xs text-muted-foreground leading-none">
								{user.email}
							</p>
						)}
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleProfileClick}>
					<User className="mr-2 size-4" />
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleSettingsClick}>
					<Settings className="mr-2 size-4" />
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogoutClick} variant="destructive">
					<LogOut className="mr-2 size-4" />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
