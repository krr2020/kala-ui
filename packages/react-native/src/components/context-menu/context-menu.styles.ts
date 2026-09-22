/**
 * Non-component wiring for ContextMenu: the long-press trigger row and
 * the menu-body layout inside the shared Sheet.
 */
import type { ViewStyle } from "react-native";

/** the trigger stretches so the long-press target spans the child row */
export const triggerStyle: ViewStyle = { alignSelf: "stretch" };

export const childRowStyle: ViewStyle = { flexDirection: "row" };

/** row gap inside the sheet — same cadence as DropdownMenu's list */
export const contentStyle: ViewStyle = { gap: 2 };
