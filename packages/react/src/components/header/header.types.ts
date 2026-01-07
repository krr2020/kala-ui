import type * as React from "react";

export interface NavLink {
	label: string;
	href: string;
	active?: boolean;
	children?: NavLink[];
}

export interface UserProfileLink {
	label: string;
	href?: string;
	icon?: React.ReactNode;
	onClick?: () => void;
	divider?: boolean;
	variant?: "default" | "danger";
}

export interface UserProfile {
	name: string;
	email: string;
	username?: string | null;
	avatar?: string | null;
	role?: string;
	links: UserProfileLink[];
}

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
	logo?: React.ReactNode;
	navLinks?: NavLink[];
	userMenu?: React.ReactNode;
	userProfile?: UserProfile;
	searchBar?: React.ReactNode;
	notifications?: React.ReactNode;
	mobileNotifications?: React.ReactNode;
	themeSwitcher?: React.ReactNode;
	themeSwitcherMobile?: React.ReactNode;
	languageSwitcher?: React.ReactNode;
	languageSwitcherMobile?: React.ReactNode;
	onMobileMenuToggle?: () => void;
	isMobileMenuOpen?: boolean;
	variant?: "default" | "dashboard";
}
