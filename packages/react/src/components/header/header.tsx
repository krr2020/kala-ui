"use client";

import { Bell, ChevronDown, Menu, Settings, X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from "../navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";

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

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
	(
		{
			className,
			logo,
			navLinks = [],
			userMenu,
			userProfile,
			searchBar,
			notifications,
			mobileNotifications,
			themeSwitcher,
			themeSwitcherMobile,
			languageSwitcher,
			languageSwitcherMobile,
			onMobileMenuToggle,
			isMobileMenuOpen,
			variant = "default",
			...props
		},
		ref,
	) => {
		// Lock body scroll when mobile menu is open
		React.useEffect(() => {
			if (isMobileMenuOpen) {
				// Calculate scrollbar width
				const scrollbarWidth =
					window.innerWidth - document.documentElement.clientWidth;
				document.body.style.setProperty(
					"--removed-body-scroll-bar-size",
					`${scrollbarWidth}px`,
				);
				document.body.setAttribute("data-scroll-locked", "1");
			} else {
				document.body.removeAttribute("data-scroll-locked");
				document.body.style.removeProperty("--removed-body-scroll-bar-size");
			}

			// Cleanup on unmount
			return () => {
				document.body.removeAttribute("data-scroll-locked");
				document.body.style.removeProperty("--removed-body-scroll-bar-size");
			};
		}, [isMobileMenuOpen]);

		const [mounted, setMounted] = React.useState(false);
		React.useEffect(() => {
			setMounted(true);
		}, []);

		// Track expanded mobile menu items
		const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
			new Set(),
		);

		const toggleExpanded = (label: string) => {
			setExpandedItems((prev) => {
				const next = new Set(prev);
				if (next.has(label)) {
					next.delete(label);
				} else {
					next.add(label);
				}
				return next;
			});
		};

		return (
			<header
				ref={ref}
				data-comp="header"
				className={cn(
					"w-full bg-popover border-b sticky top-0 z-20 theme-popover",
					className,
				)}
				{...props}
			>
				<div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
					<div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
						{/* Logo */}
						<div className="shrink-0 min-w-0 max-w-[120px] sm:max-w-none">
							{logo}
						</div>

						{/* Desktop Navigation - centered for default, left-aligned for dashboard */}
						<div
							className={cn(
								"hidden lg:flex items-center gap-3 lg:gap-6",
								variant === "default" ? "flex-1" : "",
							)}
						>
							<div
								className={cn("flex", variant === "default" ? "mx-auto" : "")}
							>
								<NavigationMenu>
									<NavigationMenuList>
										{navLinks.map((link) => (
											<NavigationMenuItem key={link.href}>
												{link.children ? (
													<>
														<NavigationMenuTrigger
															className={cn(
																"text-sm lg:text-base",
																link.active && "text-primary",
															)}
														>
															{link.label}
														</NavigationMenuTrigger>
														<NavigationMenuContent>
															<ul
																className={cn(
																	"py-2",
																	link.children.length <= 3
																		? "w-[220px]"
																		: "w-[440px] grid grid-cols-2",
																)}
															>
																{link.children.map((child) => (
																	<li key={child.href}>
																		<NavigationMenuLink asChild>
																			<a
																				href={child.href}
																				className={cn(
																					"block px-4 py-2.5 text-sm font-normal no-underline outline-none transition-colors",
																					"text-foreground",
																					"hover:bg-accent hover:text-accent-foreground",
																					"focus:bg-accent focus:text-accent-foreground",
																					child.active &&
																						"text-primary bg-primary/10",
																				)}
																			>
																				{child.label}
																			</a>
																		</NavigationMenuLink>
																	</li>
																))}
															</ul>
														</NavigationMenuContent>
													</>
												) : (
													<NavigationMenuLink
														href={link.href}
														className={cn(
															"px-4 py-2 text-sm lg:text-base",
															link.active && "text-primary",
														)}
														aria-current={link.active ? "page" : undefined}
													>
														{link.label}
													</NavigationMenuLink>
												)}
											</NavigationMenuItem>
										))}
									</NavigationMenuList>

									<NavigationMenuViewport />
								</NavigationMenu>
							</div>
						</div>

						{/* Right Side: Search, Language, Theme, Notifications, User Menu */}
						<div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
							{/* Search Bar (Desktop) */}
							{searchBar && (
								<div className="hidden lg:block w-48 xl:w-64">{searchBar}</div>
							)}

							{/* Language Switcher (Desktop) */}
							{languageSwitcher && (
								<div className="hidden lg:block">{languageSwitcher}</div>
							)}

							{/* Theme Switcher (Desktop) */}
							{themeSwitcher && (
								<div className="hidden lg:block">{themeSwitcher}</div>
							)}

							{/* Notifications (Desktop) */}
							{notifications && (
								<div className="hidden lg:block">{notifications}</div>
							)}

							{/* User Menu (Desktop) - show on larger tablets and up */}
							{userMenu && <div className="hidden lg:block">{userMenu}</div>}

							{/* Mobile Menu Toggle */}
							{onMobileMenuToggle && (
								<Button
									variant="ghost"
									size="icon"
									className="lg:hidden h-9 w-9 sm:h-10 sm:w-10"
									onClick={onMobileMenuToggle}
									aria-label="Toggle mobile menu"
									aria-expanded={isMobileMenuOpen}
								>
									{isMobileMenuOpen ? (
										<X className="w-5 h-5 sm:w-6 sm:h-6" />
									) : (
										<Menu className="w-5 h-5 sm:w-6 sm:h-6" />
									)}
								</Button>
							)}
						</div>
					</div>
				</div>

				{/* Mobile Menu - Rendered via Portal to escape parent stacking contexts */}
				{isMobileMenuOpen &&
					mounted &&
					createPortal(
						<>
							{/* Mobile Menu Backdrop Overlay */}
							<div
								className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
								onClick={onMobileMenuToggle}
								aria-hidden="true"
							/>

							{/* Mobile Navigation - Fixed positioned overlay */}
							<nav
								className="fixed top-0 left-0 right-0 bottom-0 bg-popover z-40 lg:hidden overflow-hidden flex flex-col theme-popover"
								aria-label="Mobile navigation"
							>
								{/* Mobile Header with Close Button */}
								<div className="flex items-center justify-between px-4 h-14 sm:h-16 border-b shrink-0">
									<div className="shrink-0 min-w-0 max-w-[120px] sm:max-w-none">
										{logo}
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="h-9 w-9 sm:h-10 sm:w-10"
										onClick={onMobileMenuToggle}
										aria-label="Close mobile menu"
									>
										<X className="w-5 h-5 sm:w-6 sm:h-6" />
									</Button>
								</div>

								<Tabs
									defaultValue="menu"
									className="flex flex-col flex-1 overflow-hidden"
								>
									<div className="px-4 py-2 border-b shrink-0">
										<TabsList className="w-full grid grid-cols-3">
											<TabsTrigger value="menu">
												<span className="flex items-center gap-2">
													<Menu className="w-4 h-4" />
													<span>Menu</span>
												</span>
											</TabsTrigger>
											<TabsTrigger value="notifications">
												<span className="flex items-center gap-2">
													<Bell className="w-4 h-4" />
													<span>Alerts</span>
												</span>
											</TabsTrigger>
											<TabsTrigger value="preferences">
												<span className="flex items-center gap-2">
													<Settings className="w-4 h-4" />
													<span>Preferences</span>
												</span>
											</TabsTrigger>
										</TabsList>
									</div>

									<div className="flex-1 overflow-y-auto">
										<TabsContent value="menu" className="mt-0 h-full">
											{/* Mobile Search */}
											{searchBar && (
												<div className="px-4 py-3 border-b">{searchBar}</div>
											)}

											{/* User Profile / Account Section */}
											{userProfile ? (
												<div className="border-b">
													<div className="px-4 py-4 flex items-center gap-3 bg-muted">
														{userProfile.avatar ? (
															<img
																src={userProfile.avatar}
																alt={userProfile.name}
																className="w-10 h-10 rounded-full object-cover"
															/>
														) : (
															<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
																{userProfile.name.charAt(0).toUpperCase()}
															</div>
														)}
														<div className="flex flex-col min-w-0">
															<span className="text-sm font-medium text-foreground truncate">
																{userProfile.name}
															</span>
															<span className="text-xs text-muted-foreground truncate">
																{userProfile.email}
															</span>
														</div>
													</div>
													<div className="py-2">
														{userProfile.links.map((link, index) => (
															<React.Fragment key={link.label}>
																{link.divider && index > 0 && (
																	<div className="my-2 border-t" />
																)}
																{link.href ? (
																	<a
																		href={link.href}
																		className={cn(
																			"flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent",
																			link.variant === "danger"
																				? "text-destructive hover:bg-destructive/10"
																				: "text-foreground hover:text-foreground",
																		)}
																		onClick={onMobileMenuToggle}
																	>
																		{link.icon && (
																			<span className="w-4 h-4">
																				{link.icon}
																			</span>
																		)}
																		{link.label}
																	</a>
																) : (
																	<button
																		type="button"
																		className={cn(
																			"w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent text-left",
																			link.variant === "danger"
																				? "text-destructive hover:bg-destructive/10"
																				: "text-foreground hover:text-foreground",
																		)}
																		onClick={() => {
																			link.onClick?.();
																			onMobileMenuToggle?.();
																		}}
																	>
																		{link.icon && (
																			<span className="w-4 h-4">
																				{link.icon}
																			</span>
																		)}
																		{link.label}
																	</button>
																)}
															</React.Fragment>
														))}
													</div>
												</div>
											) : userMenu ? (
												<div className="px-4 py-3 border-b">
													<div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
														Account
													</div>
													{userMenu}
												</div>
											) : null}

											{/* Mobile Nav Links */}
											<div className="py-2">
												{navLinks.map((link) => (
													<React.Fragment key={link.label}>
														<div className="flex flex-col">
															<a
																href={link.href}
																className={cn(
																	"text-sm font-medium px-4 py-3 flex items-center justify-between transition-colors hover:bg-accent border-l-4",
																	link.active
																		? "bg-primary/10 text-primary border-primary"
																		: "text-foreground border-transparent hover:border-border",
																)}
																aria-current={link.active ? "page" : undefined}
																onClick={(e) => {
																	if (link.children || link.href === "#") {
																		e.preventDefault();
																		toggleExpanded(link.label);
																	} else {
																		onMobileMenuToggle?.();
																	}
																}}
															>
																{link.label}
																{link.children && (
																	<ChevronDown
																		className={cn(
																			"w-4 h-4 transition-transform duration-200",
																			expandedItems.has(link.label)
																				? "rotate-180"
																				: "",
																		)}
																	/>
																)}
															</a>
															{link.children &&
																expandedItems.has(link.label) && (
																	<div className="bg-muted animate-in slide-in-from-top-2 duration-200">
																		{link.children.map((child) => (
																			<a
																				key={child.label}
																				href={child.href}
																				className={cn(
																					"block text-sm px-8 py-2.5 transition-colors hover:bg-accent border-l-4 border-transparent",
																					child.active
																						? "text-primary font-medium"
																						: "text-muted-foreground hover:text-foreground",
																				)}
																				onClick={onMobileMenuToggle}
																			>
																				{child.label}
																			</a>
																		))}
																	</div>
																)}
														</div>
													</React.Fragment>
												))}
											</div>
										</TabsContent>

										<TabsContent value="notifications" className="mt-0 h-full">
											{mobileNotifications || notifications ? (
												<div className="p-0">
													{mobileNotifications || notifications}
												</div>
											) : (
												<div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
													<Bell className="w-12 h-12 mb-4 opacity-20" />
													<p>No notifications</p>
												</div>
											)}
										</TabsContent>

										<TabsContent value="preferences" className="mt-0 h-full">
											<div className="flex flex-col">
												{/* Theme & Language Settings */}
												{(themeSwitcherMobile || languageSwitcherMobile) && (
													<div className="p-4 space-y-6">
														<div className="text-xs font-semibold text-muted-foreground uppercase">
															Preferences
														</div>
														<div className="flex flex-col gap-6">
															{themeSwitcherMobile && (
																<div className="w-full">
																	{themeSwitcherMobile}
																</div>
															)}
															{languageSwitcherMobile && (
																<div className="w-full">
																	{languageSwitcherMobile}
																</div>
															)}
														</div>
													</div>
												)}
											</div>
										</TabsContent>
									</div>
								</Tabs>
							</nav>
						</>,
						document.body,
					)}
			</header>
		);
	},
);

Header.displayName = "Header";
