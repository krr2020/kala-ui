"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Label } from "../label";
import { Separator } from "../separator";

interface FieldContextValue {
	/** Id applied to the description element rendered by FieldDescription. */
	descriptionId: string;
	/** Id applied to the error element rendered by FieldError. */
	errorId: string;
	/** Id FieldControl falls back to when the wrapped control has none. */
	controlId: string;
	/** Effective id of the first FieldControl inside the field (for label binding). */
	registeredControlId: string | null;
	/** Whether a FieldDescription is currently rendered inside the field. */
	descriptionPresent: boolean;
	/** Whether a FieldError is currently rendered inside the field. */
	errorPresent: boolean;
	registerControlId: (id: string) => void;
	setDescriptionPresent: (present: boolean) => void;
	setErrorPresent: (present: boolean) => void;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useField(): FieldContextValue | null {
	return React.useContext(FieldContext);
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
	return (
		<fieldset
			data-slot="field-set"
			className={cn(
				"flex flex-col gap-6",
				"has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
				className,
			)}
			{...props}
		/>
	);
}

function FieldLegend({
	className,
	variant = "legend",
	...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
	return (
		<legend
			data-slot="field-legend"
			data-variant={variant}
			className={cn(
				"mb-3 font-medium",
				"data-[variant=legend]:text-base",
				"data-[variant=label]:text-sm",
				className,
			)}
			{...props}
		/>
	);
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-group"
			className={cn(
				"group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
				className,
			)}
			{...props}
		/>
	);
}

export const fieldVariants = cva(
	"group/field flex w-full min-w-0 gap-2 data-[invalid=true]:text-destructive",
	{
		variants: {
			orientation: {
				vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
				horizontal: [
					"flex-row items-center",
					"[&>[data-slot=field-label]]:flex-auto",
					"has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
				],
				responsive: [
					"flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
					"@md/field-group:[&>[data-slot=field-label]]:flex-auto",
					"@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
				],
			},
		},
		defaultVariants: {
			orientation: "vertical",
		},
	},
);

function Field({
	className,
	orientation = "vertical",
	...props
}: React.ComponentProps<"fieldset"> & VariantProps<typeof fieldVariants>) {
	const descriptionId = React.useId();
	const errorId = React.useId();
	const controlId = React.useId();
	const [registeredControlId, setRegisteredControlId] = React.useState<
		string | null
	>(null);
	const [descriptionPresent, setDescriptionPresent] = React.useState(false);
	const [errorPresent, setErrorPresent] = React.useState(false);

	const context = React.useMemo<FieldContextValue>(
		() => ({
			descriptionId,
			errorId,
			controlId,
			registeredControlId,
			descriptionPresent,
			errorPresent,
			registerControlId: setRegisteredControlId,
			setDescriptionPresent,
			setErrorPresent,
		}),
		[
			descriptionId,
			errorId,
			controlId,
			registeredControlId,
			descriptionPresent,
			errorPresent,
		],
	);

	return (
		<fieldset
			data-slot="field"
			data-orientation={orientation}
			className={cn(fieldVariants({ orientation }), className)}
			{...props}
		>
			<FieldContext.Provider value={context}>
				{props.children}
			</FieldContext.Provider>
		</fieldset>
	);
}

/**
 * Wires a form control into its surrounding Field: merges
 * `aria-describedby` (FieldDescription/FieldError), `aria-invalid` and
 * `aria-errormessage` onto the control and gives it an id so FieldLabel
 * binds to it. Renders exactly one child element.
 */
function FieldControl({
	children,
	...props
}: React.ComponentProps<typeof Slot>) {
	const field = useField();
	const child = React.Children.only(children) as React.ReactElement<
		Record<string, unknown>
	>;

	const childId = (child.props.id as string | undefined) ?? field?.controlId;

	React.useEffect(() => {
		if (!field || !childId) return;
		field.registerControlId(childId);
		return () => field.registerControlId(childId);
	}, [field, childId]);

	if (!field) {
		return (
			<Slot data-slot="field-control" {...props}>
				{children}
			</Slot>
		);
	}

	const childDescribedBy =
		typeof child.props["aria-describedby"] === "string"
			? child.props["aria-describedby"]
			: undefined;
	const describedBy =
		[
			childDescribedBy,
			field.descriptionPresent ? field.descriptionId : null,
			field.errorPresent ? field.errorId : null,
		]
			.filter(Boolean)
			.join(" ") || undefined;

	const childInvalid = child.props["aria-invalid"];
	const invalid =
		childInvalid !== undefined ? childInvalid : field.errorPresent || undefined;

	const merged = React.cloneElement(child, {
		id: childId,
		"aria-describedby": describedBy,
		"aria-invalid": invalid,
		"aria-errormessage":
			field.errorPresent && invalid ? field.errorId : undefined,
	} as Record<string, unknown>);

	return (
		<Slot data-slot="field-control" {...props}>
			{merged}
		</Slot>
	);
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-content"
			className={cn(
				"group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
				className,
			)}
			{...props}
		/>
	);
}

function FieldLabel({
	className,
	htmlFor,
	...props
}: React.ComponentProps<typeof Label>) {
	const field = useField();
	return (
		<Label
			data-slot="field-label"
			htmlFor={htmlFor ?? field?.registeredControlId ?? undefined}
			className={cn(
				"group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
				"has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-4",
				"has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary",
				className,
			)}
			{...props}
		/>
	);
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-label"
			className={cn(
				"flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
	const field = useField();

	React.useEffect(() => {
		if (!field) return;
		field.setDescriptionPresent(true);
		return () => field.setDescriptionPresent(false);
	}, [field]);

	return (
		<p
			data-slot="field-description"
			id={field?.descriptionId}
			className={cn(
				"text-muted-foreground text-xs leading-normal font-normal group-has-data-[orientation=horizontal]/field:text-balance",
				"last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
				"[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
				className,
			)}
			{...props}
		/>
	);
}

function FieldSeparator({
	children,
	className,
	...props
}: React.ComponentProps<"div"> & {
	children?: React.ReactNode;
}) {
	return (
		<div
			data-slot="field-separator"
			data-content={!!children}
			className={cn(
				"relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
				className,
			)}
			{...props}
		>
			<Separator className="absolute inset-0 top-1/2" />
			{children && (
				<span
					className="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
					data-slot="field-separator-content"
				>
					{children}
				</span>
			)}
		</div>
	);
}

function FieldError({
	className,
	children,
	errors,
	...props
}: React.ComponentProps<"div"> & {
	errors?: Array<{ message?: string } | undefined>;
}) {
	const field = useField();

	const content = React.useMemo(() => {
		if (children) {
			return children;
		}

		if (!errors?.length) {
			return null;
		}

		const uniqueErrors = [
			...new Map(errors.map((error) => [error?.message, error])).values(),
		];

		if (uniqueErrors?.length === 1) {
			return uniqueErrors[0]?.message;
		}

		return (
			<ul className="ml-4 flex list-disc flex-col gap-1">
				{uniqueErrors.map(
					(error) =>
						error?.message && <li key={error.message}>{error.message}</li>,
				)}
			</ul>
		);
	}, [children, errors]);

	const present = content != null;

	React.useEffect(() => {
		if (!field) return;
		field.setErrorPresent(present);
		return () => field.setErrorPresent(false);
	}, [field, present]);

	if (!content) {
		return null;
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			id={field?.errorId}
			className={cn("text-destructive text-xs font-medium", className)}
			{...props}
		>
			{content}
		</div>
	);
}

export {
	Field,
	FieldContent,
	FieldControl,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
};
