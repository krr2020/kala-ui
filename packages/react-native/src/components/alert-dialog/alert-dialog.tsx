/**
 * AlertDialog: destructive-confirmation modal composed ON Dialog's
 * hardened shell (themed scrim, status-bar-safe wrapper, fixed-chrome
 * column, drag finger-follow) at the narrow sm tier — an alert is a
 * focused interruption, not a content panel. Defaults to NOT
 * dismissable: no overlay press, no hardware back, no drag —
 * dismissal only happens through the explicit Action/Cancel
 * affordances, mirroring web radix alert semantics. The container
 * surfaces as a single accessibility alert element.
 */

import type { ReactElement } from "react";
import { createContext, useContext } from "react";
import type { ButtonProps } from "../button";
import { Button } from "../button";
import { Dialog } from "../dialog";
import { DialogBody } from "../dialog/dialog-body";
import { DialogDescription } from "../dialog/dialog-description";
import { DialogFooter } from "../dialog/dialog-footer";
import { DialogHeader } from "../dialog/dialog-header";
import { DialogTitle } from "../dialog/dialog-title";
import type {
	AlertDialogPartProps,
	AlertDialogProps,
	AlertDialogTextProps,
} from "./alert-dialog.types";

interface AlertDialogContextValue {
	close: () => void;
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

export function AlertDialog({
	open,
	onOpenChange,
	dismissable = false,
	accessibilityLabel,
	slotStyles,
	testID = "k-alert-dialog",
	children,
}: AlertDialogProps): ReactElement | null {
	const close = () => onOpenChange(false);
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			dismissable={dismissable}
			size="sm"
			accessibilityLabel={accessibilityLabel}
			slotStyles={slotStyles}
			testID={testID}
			// one a11y element for the whole alert (same idiom as Alert/Toast);
			// Dialog's card already sets accessibilityViewIsModal
			accessibilityRole="alert"
		>
			<AlertDialogContext.Provider value={{ close }}>
				{children}
			</AlertDialogContext.Provider>
		</Dialog>
	);
}

/** Both affordances close the dialog first, then run their own onPress. */
function AlertDialogAction({
	onPress,
	testID = "k-alert-dialog-action",
	children,
	...buttonProps
}: ButtonProps): ReactElement {
	const ctx = useContext(AlertDialogContext);
	return (
		<Button
			{...buttonProps}
			testID={testID}
			onPress={() => {
				ctx?.close();
				onPress?.();
			}}
		>
			{children}
		</Button>
	);
}

function AlertDialogCancel({
	onPress,
	testID = "k-alert-dialog-cancel",
	children,
	...buttonProps
}: ButtonProps): ReactElement {
	const ctx = useContext(AlertDialogContext);
	return (
		<Button
			{...buttonProps}
			variant="outline"
			testID={testID}
			onPress={() => {
				ctx?.close();
				onPress?.();
			}}
		>
			{children}
		</Button>
	);
}

const prefixed =
	<T extends { testID?: string }>(Part: (props: T) => ReactElement, part: string) =>
	(props: T) =>
		<Part {...props} testID={`k-alert-dialog-${part}`} />;

AlertDialog.Header = prefixed(DialogHeader, "header");
AlertDialog.Footer = prefixed(DialogFooter, "footer");
AlertDialog.Title = prefixed(DialogTitle, "title");
AlertDialog.Description = prefixed(DialogDescription, "description");
AlertDialog.Body = prefixed(DialogBody, "body");
AlertDialog.Action = AlertDialogAction;
AlertDialog.Cancel = AlertDialogCancel;
