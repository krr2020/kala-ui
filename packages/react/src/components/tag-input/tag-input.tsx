"use client";

import { X } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Badge } from "../badge";

export interface TagInputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"value" | "onChange"
	> {
	/**
	 * Array of tag values
	 */
	value?: string[];
	/**
	 * Callback when tags change
	 */
	onChange?: (tags: string[]) => void;
	/**
	 * Character(s) that trigger tag creation
	 * @default [',']
	 */
	separators?: string[];
	/**
	 * Allow duplicate tags
	 * @default false
	 */
	allowDuplicates?: boolean;
	/**
	 * Maximum number of tags allowed
	 */
	maxTags?: number;
	/**
	 * Validate tag before adding
	 */
	validateTag?: (tag: string) => boolean;
	/**
	 * Transform tag before adding (e.g., lowercase, trim)
	 */
	transformTag?: (tag: string) => string;
	/**
	 * Additional CSS classes for the container
	 */
	className?: string;
	/**
	 * Show error state
	 */
	hasError?: boolean;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
	(
		{
			value = [],
			onChange,
			separators = [","],
			allowDuplicates = false,
			maxTags,
			validateTag,
			transformTag = (tag: string) => tag.trim(),
			className,
			placeholder = "Type and press comma...",
			disabled = false,
			hasError = false,
			...props
		},
		ref,
	) => {
		const [inputValue, setInputValue] = React.useState("");
		const inputRef = React.useRef<HTMLInputElement>(null);

		React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

		const addTag = React.useCallback(
			(tagToAdd: string) => {
				const transformed = transformTag(tagToAdd);

				// Skip empty tags
				if (!transformed) return;

				// Check max tags limit
				if (maxTags && value.length >= maxTags) {
					return;
				}

				// Check duplicates
				if (!allowDuplicates && value.includes(transformed)) {
					return;
				}

				// Validate tag
				if (validateTag && !validateTag(transformed)) {
					return;
				}

				// Add the tag
				const newTags = [...value, transformed];
				onChange?.(newTags);
				setInputValue("");
			},
			[value, onChange, transformTag, allowDuplicates, maxTags, validateTag],
		);

		const removeTag = React.useCallback(
			(indexToRemove: number) => {
				const newTags = value.filter((_, index) => index !== indexToRemove);
				onChange?.(newTags);
			},
			[value, onChange],
		);

		const clearAllTags = React.useCallback(() => {
			onChange?.([]);
		}, [onChange]);

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			// Handle separator keys
			if (separators.includes(e.key)) {
				e.preventDefault();
				addTag(inputValue);
				return;
			}

			// Handle backspace on empty input to remove last tag
			if (e.key === "Backspace" && !inputValue && value.length > 0) {
				e.preventDefault();
				removeTag(value.length - 1);
				return;
			}

			// Call original onKeyDown if provided
			props.onKeyDown?.(e);
		};

		const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
			// Handle pasting comma-separated values
			const pastedText = e.clipboardData.getData("text");

			// Check if paste contains separators
			const hasSeparator = separators.some((sep) => {
				if (sep === "Enter") return pastedText.includes("\n");
				return pastedText.includes(sep);
			});

			if (hasSeparator) {
				e.preventDefault();

				// Split by all separators
				const regex = new RegExp(
					separators.map((sep) => (sep === "Enter" ? "\\n" : sep)).join("|"),
					"g",
				);
				const tags = pastedText.split(regex);

				tags.forEach((tag) => {
					const trimmed = tag.trim();
					if (trimmed) {
						addTag(trimmed);
					}
				});
			}

			props.onPaste?.(e);
		};

		const handleContainerClick = () => {
			inputRef.current?.focus();
		};

		const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
			// Focus input when user presses a key on the container
			if (e.key !== "Tab") {
				inputRef.current?.focus();
			}
		};

		return (
			<div className="relative w-full">
				<div
					className={cn(
						"flex min-h-[2.5rem] w-full flex-wrap gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm theme-input",
						"focus-within-ring",
						hasError && "border-destructive focus-within-ring-destructive",
						disabled && "cursor-not-allowed bg-muted",
						value.length > 0 && "pr-10",
						className,
					)}
					onClick={handleContainerClick}
					onKeyDown={handleContainerKeyDown}
					tabIndex={-1}
				>
					{/* Render tags */}
					{value.map((tag, index) => (
						<Badge
							key={`tag-${tag}-${Date.now()}-${index}`}
							variant="secondary"
							className="flex items-center gap-1 pl-2 pr-1 py-0 h-6 text-xs"
						>
							<span>{tag}</span>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									removeTag(index);
								}}
								disabled={disabled}
								className={cn(
									"ml-0.5 rounded-sm p-0.5 hover:bg-muted-foreground/20",
									disabled && "cursor-not-allowed opacity-50",
								)}
								aria-label={`Remove ${tag}`}
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))}

					{/* Input field */}
					<input
						ref={inputRef}
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						onPaste={handlePaste}
						disabled={disabled}
						placeholder={value.length === 0 ? placeholder : ""}
						className={cn(
							"flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground",
							"text-foreground",
							"disabled:cursor-not-allowed",
						)}
						{...props}
					/>
				</div>

				{/* Clear all button */}
				{value.length > 0 && !disabled && (
					<button
						type="button"
						onClick={clearAllTags}
						className={cn(
							"absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm",
							"text-muted-foreground hover:text-foreground hover:bg-accent",
							"transition-colors",
						)}
						aria-label="Clear all tags"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>
		);
	},
);

TagInput.displayName = "TagInput";
