import type * as React from "react";

export interface TableSkeletonConfig {
	/**
	 * Number of skeleton rows to show (default: 5)
	 */
	rows?: number;
	/**
	 * Number of skeleton columns to show (default: 4)
	 */
	columns?: number;
	/**
	 * Column headers to show (optional - shows actual headers or skeletons)
	 */
	headers?: string[];
	/**
	 * Column widths to match actual table layout (prevents CLS)
	 */
	columnWidths?: string[];
	/**
	 * Whether to show action column
	 */
	showActions?: boolean;
	/**
	 * Whether to show selection checkboxes
	 */
	showCheckboxes?: boolean;
	/**
	 * Whether header should be sticky
	 */
	stickyHeader?: boolean;
}

export interface TableProps extends React.ComponentProps<"table"> {
	/**
	 * Show loading skeleton instead of content
	 */
	isLoading?: boolean;
	/**
	 * Number of skeleton rows to show when loading (default: 5) - DEPRECATED: Use skeletonConfig
	 */
	loadingRows?: number;
	/**
	 * Number of skeleton columns to show when loading (default: 4) - DEPRECATED: Use skeletonConfig
	 */
	loadingColumns?: number;
	/**
	 * Show actions column in skeleton (default: false) - DEPRECATED: Use skeletonConfig
	 */
	loadingShowActions?: boolean;
	/**
	 * Headers to show in skeleton (optional) - DEPRECATED: Use skeletonConfig
	 */
	loadingHeaders?: string[];
	/**
	 * Skeleton configuration for advanced control (preferred)
	 */
	skeletonConfig?: TableSkeletonConfig;
	/**
	 * Custom skeleton override
	 */
	skeleton?: React.ReactNode;
}
