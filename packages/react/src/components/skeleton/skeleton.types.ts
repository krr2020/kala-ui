/**
 * Skeleton Component Types
 *
 * TypeScript definitions and utility types for skeleton components.
 */

/**
 * Base skeleton configuration interface
 */
export interface BaseSkeletonConfig {
	/**
	 * Animation variant for the skeleton
	 */
	variant?: "default" | "pulse" | "fade" | "wave";
	/**
	 * Enable animation
	 */
	animate?: boolean;
	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Loading state props interface
 *
 * Common props pattern for components that support loading states
 */
export interface LoadingStateProps {
	/**
	 * Show loading skeleton
	 */
	isLoading?: boolean;
	/**
	 * Skeleton configuration object
	 */
	skeletonConfig?: BaseSkeletonConfig;
	/**
	 * Custom skeleton override
	 */
	skeleton?: React.ReactNode;
}

/**
 * Skeleton variant type
 */
export type SkeletonVariant = "default" | "pulse" | "fade" | "wave";

/**
 * Skeleton wrapper configuration
 */
export interface SkeletonWrapperConfig {
	/**
	 * Enable fade transition
	 */
	transition?: boolean;
	/**
	 * Transition duration in milliseconds
	 */
	duration?: number;
	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Pattern configuration options
 */
export interface PatternConfig {
	/**
	 * Number of elements to render
	 */
	count?: number;
	/**
	 * Element sizes
	 */
	size?: "sm" | "md" | "lg" | "xl";
	/**
	 * Element spacing
	 */
	spacing?: "tight" | "normal" | "loose";
}

/**
 * Card skeleton configuration
 */
export interface CardSkeletonConfig {
	/**
	 * Card layout variant
	 */
	variant?:
		| "default"
		| "withImage"
		| "withImageTop"
		| "horizontal"
		| "withFooter"
		| "minimal";
	/**
	 * Show header in skeleton
	 */
	hasHeader?: boolean;
	/**
	 * Show image in skeleton
	 */
	hasImage?: boolean;
	/**
	 * Show footer actions in skeleton
	 */
	hasFooter?: boolean;
	/**
	 * Image position (for horizontal layout)
	 */
	imagePosition?: "top" | "left" | "right";
	/**
	 * Number of content lines
	 */
	contentRows?: number;
	/**
	 * Show action buttons
	 */
	showActions?: boolean;
}

/**
 * List skeleton configuration
 */
export interface ListSkeletonConfig {
	/**
	 * List layout variant
	 */
	variant?: "simple" | "withAvatar" | "withIcon" | "withBadge" | "multiLine";
	/**
	 * Number of list items
	 */
	itemCount?: number;
	/**
	 * Show dividers between items
	 */
	showDividers?: boolean;
	/**
	 * Dense spacing mode
	 */
	dense?: boolean;
}

/**
 * Table skeleton configuration
 */
export interface TableSkeletonConfig extends BaseSkeletonConfig {
	/**
	 * Number of rows to display
	 */
	rows?: number;
	/**
	 * Number of columns
	 */
	columns?: number;
	/**
	 * Show action column
	 */
	showActions?: boolean;
	/**
	 * Column headers (optional, for matching actual headers)
	 */
	headers?: string[];
	/**
	 * Column widths (to match actual table and prevent CLS)
	 */
	columnWidths?: string[];
	/**
	 * Show checkbox column for selection
	 */
	showCheckboxes?: boolean;
	/**
	 * Enable sticky header
	 */
	stickyHeader?: boolean;
}

/**
 * Field skeleton configuration
 */
export interface FieldSkeletonConfig {
	/**
	 * Show label
	 */
	showLabel?: boolean;
	/**
	 * Show required indicator
	 */
	required?: boolean;
	/**
	 * Show helper text
	 */
	showHelperText?: boolean;
	/**
	 * Control height
	 */
	controlHeight?: string;
	/**
	 * Field variant
	 */
	variant?: "default" | "error";
}

/**
 * Navigation skeleton configuration
 */
export interface NavigationSkeletonConfig extends BaseSkeletonConfig {
	/**
	 * Navigation orientation
	 */
	orientation?: "horizontal" | "vertical";
	/**
	 * Number of navigation items
	 */
	itemCount?: number;
	/**
	 * Show icon for each item
	 */
	showIcons?: boolean;
	/**
	 * Show badge indicators
	 */
	showBadges?: boolean;
	/**
	 * Show nested items
	 */
	nested?: boolean;
}

/**
 * Sidebar skeleton configuration
 */
export interface SidebarSkeletonConfig extends BaseSkeletonConfig {
	/**
	 * Collapsed state
	 */
	collapsed?: boolean;
	/**
	 * Show header section
	 */
	showHeader?: boolean;
	/**
	 * Show footer section
	 */
	showFooter?: boolean;
	/**
	 * Number of navigation sections
	 */
	sectionCount?: number;
	/**
	 * Items per section
	 */
	itemsPerSection?: number;
}

/**
 * Header skeleton configuration
 */
export interface HeaderSkeletonConfig extends BaseSkeletonConfig {
	/**
	 * Show navigation items
	 */
	showNavigation?: boolean;
	/**
	 * Number of navigation items
	 */
	navItemCount?: number;
	/**
	 * Show search input
	 */
	showSearch?: boolean;
	/**
	 * Show notifications button
	 */
	showNotifications?: boolean;
	/**
	 * Show user menu button
	 */
	showUserMenu?: boolean;
}

/**
 * Breadcrumbs skeleton configuration
 */
export interface BreadcrumbsSkeletonConfig extends BaseSkeletonConfig {
	/**
	 * Number of breadcrumb levels
	 */
	depth?: number;
	/**
	 * Show home icon
	 */
	showHome?: boolean;
	/**
	 * Separator character
	 */
	separator?: string;
}

/**
 * Steps skeleton configuration
 */
export interface StepsSkeletonConfig extends BaseSkeletonConfig {
	/**
	 * Number of steps
	 */
	stepCount?: number;
	/**
	 * Orientation of the stepper
	 */
	orientation?: "horizontal" | "vertical";
	/**
	 * Show step labels and descriptions
	 */
	showLabels?: boolean;
}

/**
 * Tabs skeleton configuration
 */
export interface TabsSkeletonConfig {
	/**
	 * Number of tabs
	 */
	tabCount?: number;
	/**
	 * Tab variant style
	 */
	variant?: "default" | "pills" | "underline";
	/**
	 * Show tab content skeleton
	 */
	showContent?: boolean;
	/**
	 * Number of content rows
	 */
	contentRows?: number;
}

/**
 * Accordion skeleton configuration
 */
export interface AccordionSkeletonConfig extends BaseSkeletonConfig {
	/**
	 * Number of accordion items
	 */
	itemCount?: number;
	/**
	 * Show expanded content
	 */
	defaultExpanded?: boolean;
	/**
	 * Number of content rows when expanded
	 */
	contentRows?: number;
}

/**
 * Calendar skeleton configuration
 */
export interface CalendarSkeletonConfig extends BaseSkeletonConfig {
	/**
	 * Show month/year header
	 */
	showHeader?: boolean;
	/**
	 * Show day labels
	 */
	showDayLabels?: boolean;
	/**
	 * Number of weeks to show
	 */
	weekCount?: number;
}

/**
 * Pagination skeleton configuration
 */
export interface PaginationSkeletonConfig extends BaseSkeletonConfig {
	/**
	 * Number of page buttons to show
	 */
	pageCount?: number;
	/**
	 * Show prev/next buttons
	 */
	showPrevNext?: boolean;
	/**
	 * Show info text
	 */
	showInfo?: boolean;
}

/**
 * Dialog skeleton configuration
 */
export interface DialogSkeletonConfig extends BaseSkeletonConfig {
	/**
	 * Show dialog header
	 */
	showHeader?: boolean;
	/**
	 * Show dialog footer
	 */
	showFooter?: boolean;
	/**
	 * Number of content rows
	 */
	contentRows?: number;
}

/**
 * Drawer skeleton configuration (extends Dialog)
 */
export interface DrawerSkeletonConfig extends DialogSkeletonConfig {}

/**
 * Popover skeleton configuration
 */
export interface PopoverSkeletonConfig extends BaseSkeletonConfig {
	/**
	 * Number of content rows
	 */
	contentRows?: number;
	/**
	 * Use compact spacing
	 */
	compact?: boolean;
}

/**
 * Metric card skeleton configuration
 */
export interface MetricCardSkeletonConfig {
	/**
	 * Metric card layout variant
	 */
	variant?: "default" | "withIcon" | "simple";
	/**
	 * Show icon in skeleton
	 */
	showIcon?: boolean;
	/**
	 * Show change indicator in skeleton
	 */
	showChange?: boolean;
}

/**
 * Session card skeleton configuration
 */
export interface SessionCardSkeletonConfig {
	/**
	 * Show current session badge
	 */
	showBadge?: boolean;
	/**
	 * Show revoke button
	 */
	showRevokeButton?: boolean;
}

/**
 * Empty state skeleton configuration
 */
export interface EmptyStateSkeletonConfig {
	/**
	 * Show icon in skeleton
	 */
	showIcon?: boolean;
	/**
	 * Show action button in skeleton
	 */
	showAction?: boolean;
}

/**
 * Banner skeleton configuration
 */
export interface BannerSkeletonConfig {
	/**
	 * Banner variant
	 */
	variant?: "default" | "info" | "warning" | "error" | "success";
	/**
	 * Show icon in skeleton
	 */
	showIcon?: boolean;
	/**
	 * Show close button in skeleton
	 */
	showCloseButton?: boolean;
}

/**
 * Alert skeleton configuration
 */
export interface AlertSkeletonConfig {
	/**
	 * Alert variant
	 */
	variant?:
		| "default"
		| "primary"
		| "secondary"
		| "success"
		| "danger"
		| "destructive"
		| "warning"
		| "info";
	/**
	 * Show icon in skeleton
	 */
	showIcon?: boolean;
}

/**
 * Helper type for component with loading state support
 */
export type WithLoadingState<T> = T & LoadingStateProps;

/**
 * Extract skeleton config type from component props
 */
export type ExtractSkeletonConfig<T> = T extends { skeletonConfig?: infer C }
	? C
	: never;
