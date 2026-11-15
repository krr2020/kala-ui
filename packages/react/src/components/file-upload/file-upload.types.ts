import type * as React from "react";
import type { SlotStyles } from "../../lib/slot-styles";
import type { IconComponent } from "../icons";

export interface FileUploadProps
	extends Omit<React.ComponentProps<"div">, "onError"> {
	/** Selected file (controlled; null = cleared) */
	value?: File | null;
	/** Fired with the newly selected file, or null when cleared */
	onValueChange?: (file: File | null) => void;
	/** Upload prompt glyph — any `{className, size}` icon component; defaults to kala's built-in cloud. */
	uploadIcon?: IconComponent;
	/** Selected-file glyph — any `{className, size}` icon component; defaults to kala's built-in file. */
	fileIcon?: IconComponent;
	/** Remove glyph — any `{className, size}` icon component; defaults to kala's built-in ✕. */
	removeIcon?: IconComponent;
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
