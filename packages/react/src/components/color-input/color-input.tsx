import * as React from "react";
import { inputStyles } from "../../config/input";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export interface ColorInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
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
	onChange?: (value: string) => void;
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

export const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
	(
		{
			className,
			value: valueProp,
			defaultValue,
			onChange,
			error,
			success,
			withPreview = true,
			disabled,
			...props
		},
		ref,
	) => {
		const [internalValue, setInternalValue] = React.useState<string>(
			valueProp ?? defaultValue ?? "",
		);

		React.useEffect(() => {
			if (valueProp !== undefined) {
				setInternalValue(valueProp);
			}
		}, [valueProp]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const val = e.target.value;
			setInternalValue(val);
			onChange?.(val);
		};

		const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const val = e.target.value;
			setInternalValue(val);
			onChange?.(val);
		};

		return (
			<div className="relative flex items-center">
				{withPreview && (
					<div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
						<Popover>
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
									<div className="flex gap-2">
										{[
											"#000000",
											"#ffffff",
											"#ef4444",
											"#22c55e",
											"#3b82f6",
											"#f59e0b",
										].map((color) => (
											<button
												key={color}
												type="button"
												className="h-6 w-6 rounded border shadow-sm hover:scale-110 transition-transform"
												style={{ backgroundColor: color }}
												onClick={() => {
													setInternalValue(color);
													onChange?.(color);
												}}
											/>
										))}
									</div>
									<input
										type="color"
										value={
											internalValue.length === 7 ? internalValue : "#000000"
										}
										onChange={handleColorChange}
										className="h-8 w-full cursor-pointer"
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
	},
);

ColorInput.displayName = "ColorInput";
