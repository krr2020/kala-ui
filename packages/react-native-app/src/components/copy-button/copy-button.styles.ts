/**
 * Non-component wiring for CopyButton: the default Copy/Check icon
 * sizing and tint.
 */
import type { KalaTheme } from "@kala-ui/react-native/types";

export const ICON_SIZE = 18;

export const iconColor = (theme: KalaTheme): string => theme.foreground;
