import type * as React from "react";

export interface FileUploadProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "onError"> {
	onFileSelect?: (file: File) => void;
	accept?: string;
	maxSize?: number; // in bytes
	disabled?: boolean;
	value?: File | null;
	onClear?: () => void;
	error?: string;
	progress?: number;
	onError?: (error: string) => void;
}
