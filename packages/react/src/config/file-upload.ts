/** FileUpload styles — per-part base classes keyed by slotStyles part name. */
export const fileUploadStyles = {
	root: "w-full",
	dropzone:
		"relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded transition-colors cursor-pointer kala-surface-input",
	icon: "p-3 mb-3 rounded-full bg-muted",
} as const;
