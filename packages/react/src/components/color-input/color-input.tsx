import { useUncontrolled } from "@kala-ui/react-hooks";
import * as React from "react";
import { inputStyles } from "../../config/input";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export interface ColorInputProps
	extends Omit<React.ComponentProps<"input">, "onChange"> {
	/**
	 * Value for controlled component
	 */
	value?: string;
	/**
	 * Default value for uncontrolled component
	 */
	defaultValue?: string;
	/**
	 * Callback fired when value changes
	 */
	onValueChange?: (value: string) => void;
	/**
	 * If true, renders with error styles
	 */
	error?: boolean;
	/**
	 * If true, renders with success styles
	 */
	success?: boolean;
	/**
	 * If true, hides the color preview swatch
	 */
	withPreview?: boolean;
}

const PRESET_COLORS: { value: string; label: string }[] = [
	{ value: "#000000", label: "Black" },
	{ value: "#ffffff", label: "White" },
	{ value: "#ef4444", label: "Red" },
	{ value: "#22c55e", label: "Green" },
	{ value: "#3b82f6", label: "Blue" },
	{ value: "#f59e0b", label: "Amber" },
];

export function ColorInput({
	ref,
	className,
	value: valueProp,
	defaultValue,
	onValueChange,
	error,
	success,
	withPreview = true,
	disabled,
	...props
}: ColorInputProps) {
	const [internalValue, setInternalValue] = useUncontrolled<string>({
		value: valueProp,
		defaultValue: defaultValue ?? "",
		onChange: onValueChange,
	});
	const [open, setOpen] = React.useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInternalValue(e.target.value);
	};

	const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInternalValue(e.target.value);
	};

	return (
		<div className="relative flex items-center">
			{withPreview && (
				<div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<button
								type="button"
								className="h-5 w-5 rounded border shadow-sm cursor-pointer overflow-hidden p-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								style={{ backgroundColor: internalValue || "transparent" }}
								disabled={disabled}
							>
								<span className="sr-only">Pick a color</span>
							</button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-3" align="start">
								<div className="flex flex-col gap-2">
									<fieldset className="flex gap-2 border-0 p-0 m-0">
										<legend className="sr-only">Preset colors</legend>
										{PRESET_COLORS.map(({ value, label }) => (
											<button
												key={value}
												type="button"
												aria-label={label}
												aria-pressed={
													internalValue.toLowerCase() === value ? true : undefined
												}
												className={cn(
													"h-6 w-6 rounded border shadow-sm hover:scale-110 transition-transform",
													internalValue.toLowerCase() === value &&
														"ring-2 ring-ring ring-offset-1",
												)}
												style={{ backgroundColor: value }}
												onClick={() => {
													setInternalValue(value);
													setOpen(false);
												}}
											/>
										))}
									</fieldset>
								<input
									type="color"
									value={internalValue.length === 7 ? internalValue : "#000000"}
									onChange={handleColorChange}
									className="h-8 w-full cursor-pointer"
									aria-label="Custom color"
								/>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			)}

			<input
				type="text"
				ref={ref}
				value={internalValue}
				onChange={handleChange}
				disabled={disabled}
				className={cn(
					inputStyles.base,
					error && inputStyles.error,
					success && inputStyles.success,
					withPreview && "pl-10",
					className,
				)}
				placeholder="#000000"
				{...props}
			/>
		</div>
	);
}
