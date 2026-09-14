import type { ReactNode } from "react";

export type SheetSnap = "peek" | "half" | "full";

export interface SheetProps {
	open: boolean;
	onClose: () => void;
	snap?: SheetSnap;
	/** false blocks overlay-press dismissal (back/escape paths still fire) */
	dismissable?: boolean;
	children: ReactNode;
}

export interface SheetBodyProps {
	children: ReactNode;
}
