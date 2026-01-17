"use client";

import { useMounted, useScrollLock } from "@kala-ui/react-hooks";
import { Bell, ChevronDown, Menu, Settings, X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { Box } from "../box";
import { Button } from "../button";
import { Flex } from "../flex";
import { List } from "../list";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from "../navigation-menu";
import { Stack } from "../stack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { Text } from "../text";

export interface HeaderNavLink {
	label: string;
	href: string;
	active?: boolean;
	children?: HeaderNavLink[];
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
	navLinks?: HeaderNavLink[];
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
		useScrollLock(!!isMobileMenuOpen);
		const mounted = useMounted();

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
			<Box
				as="header"
				ref={ref}
				data-comp="header"
				className={cn(
					"w-full bg-popover border-b sticky top-0 z-20 theme-popover",
					className,
				)}
				{...props}
			>
				<Box className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
					<Flex align="center" justify="between" className="h-14 sm:h-16 gap-2 sm:gap-4">
						{/* Logo */}
						<Box className="shrink-0 min-w-0 max-w-[120px] sm:max-w-none">
							{logo}
						</Box>

						{/* Desktop Navigation - centered for default, left-aligned for dashboard */}
						<Flex
							align="center"
							gap={variant === "default" ? 3 : 6}
							className={cn(
								"hidden lg:flex",
								variant === "default" ? "flex-1" : "",
							)}
						>
							<Box
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
															<Box className="py-2">
																<List
																	divided={false}
																	className={cn(
																		"bg-transparent border-none",
																		link.children.length <= 3
																			? "w-[220px]"
																			: "w-[440px] grid grid-cols-2",
																	)}
																>
																	{link.children.map((child) => (
																		<Box as="li" key={child.href}>
																			<NavigationMenuLink asChild>
																				<Box
																					as="a"
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
																				</Box>
																			</NavigationMenuLink>
																		</Box>
																	))}
																</List>
															</Box>
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
							</Box>
						</Flex>

						{/* Right side actions */}
						<Flex align="center" gap={1.5} className="sm:gap-2 lg:gap-3 shrink-0">
							{/* Search Bar (Desktop) */}
							{searchBar && (
								<Box className="hidden lg:block w-48 xl:w-64">{searchBar}</Box>
							)}

							{/* Language Switcher (Desktop) */}
							{languageSwitcher && (
								<Box className="hidden lg:block">{languageSwitcher}</Box>
							)}

							{/* Theme Switcher (Desktop) */}
							{themeSwitcher && (
								<Box className="hidden lg:block">{themeSwitcher}</Box>
							)}

							{/* Notifications (Desktop) */}
							{notifications && (
								<Box className="hidden lg:block">{notifications}</Box>
							)}

							{/* User Menu (Desktop) - show on larger tablets and up */}
							{userMenu && <Box className="hidden lg:block">{userMenu}</Box>}

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
						</Flex>
					</Flex>
				</Box>

				{/* Mobile Menu - Rendered via Portal to escape parent stacking contexts */}
				{isMobileMenuOpen &&
					mounted &&
					createPortal(
						<>
							{/* Mobile Menu Backdrop Overlay */}
							<Box
								className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
								onClick={onMobileMenuToggle}
								aria-hidden="true"
							/>

							{/* Mobile Navigation - Fixed positioned overlay */}
							<Box
								as="nav"
								className="fixed top-0 left-0 right-0 bottom-0 bg-popover z-40 lg:hidden overflow-hidden flex flex-col theme-popover"
								aria-label="Mobile navigation"
							>
								{/* Mobile Header with Close Button */}
								<Flex align="center" justify="between" className="px-4 h-14 sm:h-16 border-b shrink-0">
									<Box className="shrink-0 min-w-0 max-w-[120px] sm:max-w-none">
										{logo}
									</Box>
									<Button
										variant="ghost"
										size="icon"
										className="h-9 w-9 sm:h-10 sm:w-10"
										onClick={onMobileMenuToggle}
										aria-label="Close mobile menu"
									>
										<X className="w-5 h-5 sm:w-6 sm:h-6" />
									</Button>
								</Flex>

								<Tabs
									defaultValue="menu"
									className="flex flex-col flex-1 overflow-hidden"
								>
									<Box className="px-4 py-2 border-b shrink-0">
										<TabsList className="w-full grid grid-cols-3">
											<TabsTrigger value="menu">
												<Flex align="center" gap={2}>
													<Menu className="w-4 h-4" />
													<Text>Menu</Text>
												</Flex>
											</TabsTrigger>
											<TabsTrigger value="notifications">
												<Flex align="center" gap={2}>
													<Bell className="w-4 h-4" />
													<Text>Alerts</Text>
												</Flex>
											</TabsTrigger>
											<TabsTrigger value="preferences">
												<Flex align="center" gap={2}>
													<Settings className="w-4 h-4" />
													<Text>Preferences</Text>
												</Flex>
											</TabsTrigger>
										</TabsList>
									</Box>

									<Box className="flex-1 overflow-y-auto">
										<TabsContent value="menu" className="mt-0 h-full">
											{/* Mobile Search */}
											{searchBar && (
												<Box className="px-4 py-3 border-b">{searchBar}</Box>
											)}

											{/* User Profile / Account Section */}
											{userProfile ? (
												<Box className="border-b">
													<Flex align="center" gap={3} className="px-4 py-4 bg-muted">
														{userProfile.avatar ? (
															<Box
																as="img"
																src={userProfile.avatar}
																alt={userProfile.name}
																className="w-10 h-10 rounded-full object-cover"
															/>
														) : (
															<Flex align="center" justify="center" className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
																{userProfile.name.charAt(0).toUpperCase()}
															</Flex>
														)}
														<Stack gap={0} className="min-w-0">
															<Text size="sm" weight="medium" className="truncate">
																{userProfile.name}
															</Text>
															<Text size="xs" className="text-muted-foreground truncate">
																{userProfile.email}
															</Text>
														</Stack>
													</Flex>
													<Box className="py-2">
														{userProfile.links.map((link, index) => (
															<React.Fragment key={link.label}>
																{link.divider && index > 0 && (
																	<Box className="my-2 border-t" />
																)}
																{link.href ? (
																	<Box
																		as="a"
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
																			<Box as="span" className="w-4 h-4">
																				{link.icon}
																			</Box>
																		)}
																		{link.label}
																	</Box>
																) : (
																	<Button
																		variant="ghost"
																		className={cn(
																			"w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent text-left justify-start font-normal h-auto rounded-none",
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
																			<Box as="span" className="w-4 h-4">
																				{link.icon}
																			</Box>
																		)}
																		{link.label}
																	</Button>
																)}
															</React.Fragment>
														))}
													</Box>
												</Box>
											) : userMenu ? (
												<Box className="px-4 py-3 border-b">
													<Text size="xs" weight="semibold" className="text-muted-foreground uppercase mb-2">
														Account
													</Text>
													{userMenu}
												</Box>
											) : null}

											{/* Mobile Nav Links */}
											<Box className="py-2">
												{navLinks.map((link) => (
													<React.Fragment key={link.label}>
														<Flex direction="column">
															<Box
																as="a"
																href={link.href}
																className={cn(
																	"text-sm font-medium px-4 py-3 flex items-center justify-between transition-colors hover:bg-accent border-l-4",
																	link.active
																		? "bg-primary/10 text-primary border-primary"
																		: "text-foreground border-transparent hover:border-border",
																)}
																aria-current={link.active ? "page" : undefined}
																onClick={(e: React.MouseEvent) => {
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
															</Box>
															{link.children &&
																expandedItems.has(link.label) && (
																	<Box className="bg-muted animate-in slide-in-from-top-2 duration-200">
																		{link.children.map((child) => (
																			<Box
																				as="a"
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
																			</Box>
																		))}
																	</Box>
																)}
														</Flex>
													</React.Fragment>
												))}
											</Box>
										</TabsContent>

										<TabsContent value="notifications" className="mt-0 h-full">
											{mobileNotifications || notifications ? (
												<Box className="p-0">
													{mobileNotifications || notifications}
												</Box>
											) : (
												<Flex direction="column" align="center" justify="center" className="h-64 text-muted-foreground">
													<Bell className="w-12 h-12 mb-4 opacity-20" />
													<Text>No notifications</Text>
												</Flex>
											)}
										</TabsContent>

										<TabsContent value="preferences" className="mt-0 h-full">
											<Flex direction="column">
												{/* Theme & Language Settings */}
												{(themeSwitcherMobile || languageSwitcherMobile) && (
													<Stack gap={6} className="p-4">
														<Text size="xs" weight="semibold" className="text-muted-foreground uppercase">
															Preferences
														</Text>
														<Stack gap={6}>
															{themeSwitcherMobile && (
																<Box className="w-full">
																	{themeSwitcherMobile}
																</Box>
															)}
															{languageSwitcherMobile && (
																<Box className="w-full">
																	{languageSwitcherMobile}
																</Box>
															)}
														</Stack>
													</Stack>
												)}
											</Flex>
										</TabsContent>
									</Box>
								</Tabs>
							</Box>
						</>,
						document.body,
					)}
			</Box>
		);
	},
);

Header.displayName = "Header";
