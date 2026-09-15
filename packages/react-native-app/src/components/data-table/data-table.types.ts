import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface DataTableColumn<T> {
	/** Row field this column reads; also names the header marker. */
	key: keyof T;
	header: string;
	/** Custom cell renderer; defaults to String(row[key]). */
	cell?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
	columns: DataTableColumn<T>[];
	rows: T[];
	/** Row field whose value becomes the row marker; defaults to the index. */
	rowKey?: keyof T;
	onRowPress?: (row: T) => void;
	emptyMessage?: string;
	isLoading?: boolean;
	style?: StyleProp<ViewStyle>;
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}

export interface DataTableSkeletonProps {
	rowCount?: number;
	style?: StyleProp<ViewStyle>;
	styles?: { root?: StyleProp<ViewStyle> };
	testID?: string;
}
