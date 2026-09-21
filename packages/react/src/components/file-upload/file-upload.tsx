"use client";

import { CloudUpload, File as FileIcon, X } from "lucide-react";
import * as React from "react";
import { fileUploadStyles } from "../../config/file-upload";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import type { FileUploadProps } from "./file-upload.types";

export function FileUpload({
	value,
	onValueChange,
	accept,
	maxSize,
	disabled,
	error,
	progress,
	onError,
	className,
	style,
	slotStyles,
	...props
}: FileUploadProps) {
	const [isDragging, setIsDragging] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const errorId = React.useId();

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		if (!disabled) {
			setIsDragging(true);
		}
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		if (disabled) return;

		const files = e.dataTransfer.files;
		const file = files[0];
		if (file) {
			validateAndSelectFile(file);
		}
	};

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		const file = files?.[0];
		// Reset so selecting the same file again still fires change.
		e.target.value = "";
		if (file) {
			validateAndSelectFile(file);
		}
	};

	/** Matches a File against an `accept` list (extensions, "type/*", exact types) */
	const isAccepted = (file: File): boolean => {
		if (!accept) return true;
		const name = file.name.toLowerCase();
		const type = file.type.toLowerCase();
		return accept.split(",").some((token) => {
			const t = token.trim().toLowerCase();
			if (!t) return false;
			if (t.startsWith(".")) return name.endsWith(t);
			if (t.endsWith("/*")) return type.startsWith(t.slice(0, -1));
			return type === t;
		});
	};

	const validateAndSelectFile = (file: File) => {
		if (!isAccepted(file)) {
			onError?.(
				`File type not accepted. Allowed: ${accept?.split(",").join(", ") ?? "any"}`,
			);
			return;
		}
		if (maxSize && file.size > maxSize) {
			onError?.(`File size exceeds ${formatFileSize(maxSize)}`);
			return;
		}
		onValueChange?.(file);
	};

	const handleClick = () => {
		if (!disabled) {
			inputRef.current?.click();
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const root = applySlot(
		cn(fileUploadStyles.root, className),
		slotStyles?.root,
	);
	const iconCircle = applySlot(fileUploadStyles.icon, slotStyles?.icon);

	return (
		<div
			data-kala-component="file-upload"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			{/* Native file input lives outside the trigger so no interactive
			    elements nest; the button opens it programmatically. */}
			<input
				ref={inputRef}
				type="file"
				className="hidden"
				accept={accept}
				onChange={handleFileInput}
				disabled={disabled}
				tabIndex={-1}
				aria-hidden="true"
			/>
			{value ? (
				<div className="relative flex items-center p-4 border rounded bg-muted kala-surface-card">
					<div className="p-2 mr-4 bg-background rounded border kala-surface-card">
						<FileIcon className="w-6 h-6 text-primary" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-foreground truncate">
							{value.name}
						</p>
						<p className="text-xs text-muted-foreground">
							{formatFileSize(value.size)}
						</p>
						{progress !== undefined && (
							<div className="w-full bg-muted rounded-full h-1.5 mt-2">
								<div
									className="bg-primary h-1.5 rounded-full transition-all duration-300"
									style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
									role="progressbar"
									aria-valuenow={Math.min(100, Math.max(0, progress))}
									aria-valuemin={0}
									aria-valuemax={100}
								/>
							</div>
						)}
					</div>
					{!disabled && onValueChange && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="ml-2 text-muted-foreground hover:text-destructive"
							onClick={() => onValueChange(null)}
							aria-label="Clear selected file"
						>
							<X className="w-4 h-4" />
						</Button>
					)}
				</div>
			) : (
				<button
					type="button"
					onClick={handleClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? errorId : undefined}
					className={cn(
						fileUploadStyles.dropzone,
						"kala-focus-ring",
						isDragging
							? "border-primary bg-primary/10"
							: "bg-background hover:bg-muted",
						disabled && "opacity-50 cursor-not-allowed hover:bg-background",
						error && "border-destructive bg-destructive/10",
						className,
					)}
				>
					<div className={iconCircle.className} style={iconCircle.style}>
						<CloudUpload className="w-6 h-6 text-muted-foreground" />
					</div>
					<p className="mb-1 text-sm font-medium text-foreground">
						<span className="text-primary">Click to upload</span> or drag and
						drop
					</p>
					<p className="text-xs text-muted-foreground">
						{accept ? accept.split(",").join(", ") : "Any file"}
						{maxSize && ` (max ${formatFileSize(maxSize)})`}
					</p>
				</button>
			)}
			{error && (
				<p id={errorId} role="alert" className="mt-2 text-sm text-destructive">
					{error}
				</p>
			)}
		</div>
	);
}
