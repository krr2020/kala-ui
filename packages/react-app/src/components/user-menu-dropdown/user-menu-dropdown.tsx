"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@kala-ui/react/avatar";
import { Button } from "@kala-ui/react/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@kala-ui/react/dropdown-menu";
import { useSlotStyles } from "@kala-ui/react/kala-provider";
import { applySlot } from "@kala-ui/react/lib/slot-styles";
import { cn } from "@kala-ui/react/lib/utils";
import { LogOut, Settings, User } from "lucide-react";
import { userMenuDropdownStyles } from "../../config/user-menu-dropdown";
import type { UserMenuDropdownProps } from "./user-menu-dropdown.types";

export function UserMenuDropdown({
	user,
	isOpen,
	onOpenChange,
	onLogout,
	baseUrl = "/admin",
	className,
	style,
	slotStyles: slotStylesRaw,
	ref,
	...props
}: UserMenuDropdownProps) {
	const slotStyles = useSlotStyles("user-menu-dropdown", slotStylesRaw);
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

	const trigger = applySlot(
		cn(userMenuDropdownStyles.trigger, className),
		slotStyles?.trigger,
	);
	const avatar = applySlot(userMenuDropdownStyles.avatar, slotStyles?.avatar);
	const avatarFallback = applySlot(
		userMenuDropdownStyles.avatarFallback,
		slotStyles?.avatarFallback,
	);
	const content = applySlot(
		userMenuDropdownStyles.content,
		slotStyles?.content,
	);
	const label = applySlot(userMenuDropdownStyles.label, slotStyles?.label);
	const name = applySlot(userMenuDropdownStyles.name, slotStyles?.name);
	const email = applySlot(userMenuDropdownStyles.email, slotStyles?.email);
	const itemIcon = applySlot(
		userMenuDropdownStyles.itemIcon,
		slotStyles?.itemIcon,
	);

	return (
		<DropdownMenu
			data-kala-component="user-menu-dropdown"
			{...(isOpen !== undefined && { open: isOpen })}
			{...(onOpenChange && { onOpenChange })}
		>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					ref={ref}
					className={trigger.className}
					style={trigger.style}
					aria-label="User menu"
					{...props}
				>
					<Avatar className={avatar.className} style={avatar.style}>
						{user.avatar && (
							<AvatarImage src={user.avatar} alt={user.name ?? "User"} />
						)}
						<AvatarFallback
							className={avatarFallback.className}
							style={avatarFallback.style}
						>
							{initials}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className={content.className}
				style={content.style}
			>
				<DropdownMenuLabel>
					<div className={label.className} style={label.style}>
						{user.name && (
							<p className={name.className} style={name.style}>
								{user.name}
							</p>
						)}
						{user.email && (
							<p className={email.className} style={email.style}>
								{user.email}
							</p>
						)}
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleProfileClick}>
					<User className={itemIcon.className} />
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleSettingsClick}>
					<Settings className={itemIcon.className} />
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogoutClick} color="destructive">
					<LogOut className={itemIcon.className} />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
