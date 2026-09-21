import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";

export interface FileUploadProps
	extends Omit<React.ComponentProps<"div">, "onError"> {
	/** Selected file (controlled; null = cleared) */
	value?: File | null;
	/** Fired with the newly selected file, or null when cleared */
	onValueChange?: (file: File | null) => void;
	accept?: string;
	/** Max file size in bytes */
	maxSize?: number;
	disabled?: boolean;
	error?: string;
	progress?: number;
	onError?: (error: string) => void;
	/** Per-part overrides: `root` wins over `className`/`style`, `icon` targets the dropzone glyph circle. */
	slotStyles?: SlotStyles;
}
