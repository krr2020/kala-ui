"use client";

import { useUncontrolled } from "@kala-ui/react-hooks";
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
	 * Array of tag values (controlled)
	 */
	value?: string[];
	/**
	 * Initial tags (uncontrolled)
	 */
	defaultValue?: string[];
	/**
	 * Callback when tags change
	 */
	onValueChange?: (tags: string[]) => void;
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
			value,
			defaultValue,
			onValueChange,
			separators = [","],
			allowDuplicates = false,
			maxTags,
			validateTag,
			transformTag = (tag: string) => tag.trim(),
			className,
			placeholder = "Type and press comma...",
			disabled = false,
			hasError = false,
			onKeyDown,
			onPaste,
			...props
		},
		ref,
	) => {
		const [tags, setTags] = useUncontrolled<string[]>({
			value,
			defaultValue: defaultValue ?? [],
			onChange: onValueChange,
		});
		const [inputValue, setInputValue] = React.useState("");
		const inputRef = React.useRef<HTMLInputElement>(null);

		React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

		// Adds a batch of candidate tags in one pass. Every tag in the batch is
		// validated against the CURRENT value plus the tags already accepted in
		// this batch, so pasting "a,b,c" produces ["a","b","c"] — not just "c".
		const addTags = React.useCallback(
			(candidates: string[]) => {
				const existing = allowDuplicates ? null : new Set(tags);
				const accepted: string[] = [];

				for (const candidate of candidates) {
					const transformed = transformTag(candidate);

					// Skip empty tags
					if (!transformed) continue;

					// Check max tags limit
					if (
						maxTags !== undefined &&
						tags.length + accepted.length >= maxTags
					) {
						break;
					}

					// Check duplicates (also catches repeats within the same paste)
					if (existing?.has(transformed)) continue;

					// Validate tag
					if (validateTag && !validateTag(transformed)) continue;

					existing?.add(transformed);
					accepted.push(transformed);
				}

				if (accepted.length === 0) return;

				setTags([...tags, ...accepted]);
				setInputValue("");
			},
			[tags, setTags, transformTag, allowDuplicates, maxTags, validateTag],
		);

		const removeTag = React.useCallback(
			(indexToRemove: number) => {
				setTags(tags.filter((_, index) => index !== indexToRemove));
			},
			[tags, setTags],
		);

		const clearAllTags = React.useCallback(() => {
			setTags([]);
		}, [setTags]);

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			// Consumer handler runs first and may preventDefault to opt out of
			// the built-in separator/backspace behavior.
			onKeyDown?.(e);
			if (e.defaultPrevented) return;

			// Handle separator keys
			if (separators.includes(e.key)) {
				e.preventDefault();
				addTags([inputValue]);
				return;
			}

			// Handle backspace on empty input to remove last tag
			if (e.key === "Backspace" && !inputValue && tags.length > 0) {
				e.preventDefault();
				removeTag(tags.length - 1);
			}
		};

		const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
			onPaste?.(e);
			if (e.defaultPrevented) return;

			// Handle pasting separator-separated values
			const pastedText = e.clipboardData.getData("text");

			// Check if paste contains separators
			const hasSeparator = separators.some((sep) =>
				sep === "Enter" ? pastedText.includes("\n") : pastedText.includes(sep),
			);

			if (hasSeparator) {
				e.preventDefault();

				// Split by all separators (escaped — a separator like "+" or "("
				// must not be treated as regex syntax)
				const regex = new RegExp(
					separators
						.map((sep) =>
							sep === "Enter"
								? "\\n"
								: sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
						)
						.join("|"),
					"g",
				);
				const tags = pastedText.split(regex);

				addTags(tags);
			}
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
				{/* biome-ignore lint/a11y/noStaticElementInteractions: click/keyboard anywhere in the chip container routes focus to the embedded input, which is the interactive element */}
				<div
					className={cn(
						"flex min-h-[2.5rem] w-full flex-wrap gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm kala-surface-input",
						"kala-focus-within-ring",
						hasError && "border-destructive kala-focus-within-ring-destructive",
						disabled && "cursor-not-allowed bg-muted",
						tags.length > 0 && "pr-10",
						className,
					)}
					onClick={handleContainerClick}
					onKeyDown={handleContainerKeyDown}
					tabIndex={-1}
				>
					{/* Render tags */}
					{tags.map((tag, index) => (
						<Badge
							key={`${tag}-${index}`}
							color="secondary"
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
						// placeholder alone is not an accessible name — keep one even
						// once the visible placeholder is hidden by existing tags
						aria-label={placeholder}
						placeholder={tags.length === 0 ? placeholder : ""}
						className={cn(
							"flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground",
							"text-foreground",
							"disabled:cursor-not-allowed",
						)}
						{...props}
					/>
				</div>

				{/* Clear all button */}
				{tags.length > 0 && !disabled && (
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
