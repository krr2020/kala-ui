/**
 * Form Skeleton Utilities
 *
 * Utilities for creating full form skeletons and field groups.
 * Useful for loading entire forms or groups of related fields.
 */

import { cn } from "../../lib/utils";
import { FieldSkeleton } from "../field/field-skeleton";
import { Skeleton } from "./skeleton";

/**
 * Field type for form skeleton
 */
export type FormFieldType =
	| "input"
	| "textarea"
	| "select"
	| "checkbox"
	| "radio"
	| "date"
	| "file";

/**
 * Form field configuration
 */
export interface FormFieldConfig {
	/**
	 * Field type
	 */
	type: FormFieldType;
	/**
	 * Show label for field
	 */
	label?: boolean;
	/**
	 * Show required indicator
	 */
	required?: boolean;
	/**
	 * Show helper text
	 */
	helperText?: boolean;
	/**
	 * Control height (for inputs, selects, etc.)
	 */
	controlHeight?: string;
}

/**
 * Form skeleton configuration
 */
export interface FormSkeletonConfig {
	/**
	 * Array of field configurations
	 */
	fields: FormFieldConfig[];
	/**
	 * Show submit button
	 */
	showSubmitButton?: boolean;
	/**
	 * Number of columns (1, 2, or 3)
	 */
	columns?: 1 | 2 | 3;
	/**
	 * Additional className
	 */
	className?: string;
}

/**
 * Form skeleton component
 *
 * @example
 * ```tsx
 * <FormSkeleton
 *   fields={[
 *     { type: "input", label: true, required: true },
 *     { type: "select", label: true },
 *     { type: "textarea", label: true, helperText: true },
 *   ]}
 *   showSubmitButton
 *   columns={2}
 * />
 * ```
 */
export function FormSkeleton({
	fields,
	showSubmitButton = false,
	columns = 1,
	className,
}: FormSkeletonConfig) {
	const gridCols = {
		1: "",
		2: "grid-cols-1 md:grid-cols-2",
		3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
	};

	return (
		<div
			data-testid="form-skeleton"
			className={cn("grid gap-4", gridCols[columns], className)}
		>
			{fields.map((field, index) => {
				const controlHeight = getControlHeight(field.type);
				return (
					<FieldSkeleton
						key={`field-${index}`}
						showLabel={field.label ?? true}
						required={field.required ?? false}
						showHelperText={field.helperText ?? false}
						controlHeight={field.controlHeight ?? controlHeight}
					/>
				);
			})}

			{showSubmitButton && (
				<div className="col-span-full">
					<Skeleton className="h-10 w-32 rounded-md" />
				</div>
			)}
		</div>
	);
}

/**
 * Field group skeleton configuration
 */
export interface FieldGroupSkeletonConfig {
	/**
	 * Number of fields in the group
	 */
	fieldCount?: number;
	/**
	 * Show group label
	 */
	showGroupLabel?: boolean;
	/**
	 * Additional className
	 */
	className?: string;
}

/**
 * Field group skeleton component
 *
 * @example
 * ```tsx
 * <FieldGroupSkeleton fieldCount={3} showGroupLabel />
 * ```
 */
export function FieldGroupSkeleton({
	fieldCount = 3,
	showGroupLabel = true,
	className,
}: FieldGroupSkeletonConfig) {
	return (
		<div
			data-testid="field-group-skeleton"
			className={cn("space-y-4 p-4 border rounded-lg", className)}
		>
			{/* Group label */}
			{showGroupLabel && <Skeleton className="h-5 w-32 mb-4" />}

			{/* Fields */}
			{Array.from({ length: fieldCount }).map((_, i) => (
				<FieldSkeleton
					key={`field-${i}`}
					showLabel
					showHelperText={i === 0} // Show helper text on first field only
				/>
			))}
		</div>
	);
}

/**
 * Get control height for different field types
 */
function getControlHeight(type: FormFieldType): string {
	switch (type) {
		case "textarea":
			return "5rem";
		case "checkbox":
		case "radio":
			return "1rem";
		case "file":
			return "8rem";
		default:
			return "2.5rem";
	}
}
