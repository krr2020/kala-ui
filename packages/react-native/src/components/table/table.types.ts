import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface TableColumn {
	/** lookup key into each row record */
	key: string;
	header: ReactNode;
	/** shared header/body column width; omit for equal flex */
	width?: number;
	align?: "left" | "center" | "right";
}

export type TableRow = Record<string, ReactNode>;

export interface TableSkeletonConfig {
	/** skeleton body rows; default 5 */
	rows?: number;
	/** skeleton columns; default 4 */
	columns?: number;
	/** real headers in the skeleton head row */
	headers?: string[];
}

export interface TableProps {
	columns: TableColumn[];
	rows: TableRow[];
	/** renders rows as pressable buttons firing with the row record */
	onRowPress?: (row: TableRow) => void;
	/** swaps the grid for the skeleton surface */
	isLoading?: boolean;
	skeletonConfig?: TableSkeletonConfig;
	emptyMessage?: string;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
		head?: StyleProp<ViewStyle>;
		row?: StyleProp<ViewStyle>;
		cell?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
