import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";
import { inputStyles } from "../../config/input";
import { cn } from "../../lib/utils";

export interface NumberInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	/**
	 * Value for controlled component
	 */
	value?: number | string;
	/**
	 * Default value for uncontrolled component
	 */
	defaultValue?: number | string;
	/**
	 * Callback fired when value changes
	 */
	onChange?: (value: number | string) => void;
	/**
	 * Minimum value
	 */
	min?: number;
	/**
	 * Maximum value
	 */
	max?: number;
	/**
	 * Step size
	 */
	step?: number;
	/**
	 * If true, renders with error styles
	 */
	error?: boolean;
	/**
	 * If true, renders with success styles
	 */
	success?: boolean;
	/**
	 * If true, hides the controls (spinners)
	 */
	hideControls?: boolean;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
	(
		{
			className,
			value: valueProp,
			defaultValue,
			onChange,
			min,
			max,
			step = 1,
			disabled,
			error,
			success,
			hideControls = false,
			...props
		},
		ref,
	) => {
		const [internalValue, setInternalValue] = React.useState<string>(
			(valueProp ?? defaultValue ?? "").toString(),
		);

		React.useEffect(() => {
			if (valueProp !== undefined) {
				setInternalValue(valueProp.toString());
			}
		}, [valueProp]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const val = e.target.value;
			if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
				setInternalValue(val);
				onChange?.(val === "" ? "" : Number.parseFloat(val));
			}
		};

		const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
			if (internalValue === "" || internalValue === "-") return;

			let val = Number.parseFloat(internalValue);
			let changed = false;

			if (min !== undefined && val < min) {
				val = min;
				changed = true;
			}
			if (max !== undefined && val > max) {
				val = max;
				changed = true;
			}

			if (changed) {
				setInternalValue(val.toString());
				onChange?.(val);
			}

			props.onBlur?.(e);
		};

		const increment = () => {
			let val = Number.parseFloat(internalValue || "0");
			if (Number.isNaN(val)) val = 0;

			const next = val + step;
			if (max !== undefined && next > max) return;

			// Fix floating point precision
			const precision = step.toString().split(".")[1]?.length || 0;
			const nextFixed =
				precision > 0 ? next.toFixed(precision) : next.toString();

			setInternalValue(nextFixed);
			onChange?.(Number.parseFloat(nextFixed));
		};

		const decrement = () => {
			let val = Number.parseFloat(internalValue || "0");
			if (Number.isNaN(val)) val = 0;

			const next = val - step;
			if (min !== undefined && next < min) return;

			// Fix floating point precision
			const precision = step.toString().split(".")[1]?.length || 0;
			const nextFixed =
				precision > 0 ? next.toFixed(precision) : next.toString();

			setInternalValue(nextFixed);
			onChange?.(Number.parseFloat(nextFixed));
		};

		return (
			<div className="relative flex items-center">
				<input
					type="text"
					role="spinbutton"
					aria-valuemin={min}
					aria-valuemax={max}
					aria-valuenow={
						internalValue === "" ? undefined : Number.parseFloat(internalValue)
					}
					ref={ref}
					value={internalValue}
					onChange={handleChange}
					onBlur={handleBlur}
					disabled={disabled}
					className={cn(
						inputStyles.base,
						error && inputStyles.error,
						success && inputStyles.success,
						!hideControls && "pr-10",
						className,
					)}
					{...props}
				/>

				{!hideControls && !disabled && (
					<div className="absolute right-1 top-1 bottom-1 flex flex-col border-l">
						<button
							type="button"
							tabIndex={-1}
							className="flex h-1/2 items-center justify-center px-2 text-muted-foreground hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
							onClick={increment}
							disabled={
								max !== undefined &&
								Number.parseFloat(internalValue || "0") >= max
							}
						>
							<ChevronUp className="h-3 w-3" />
						</button>
						<button
							type="button"
							tabIndex={-1}
							className="flex h-1/2 items-center justify-center px-2 text-muted-foreground hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
							onClick={decrement}
							disabled={
								min !== undefined &&
								Number.parseFloat(internalValue || "0") <= min
							}
						>
							<ChevronDown className="h-3 w-3" />
						</button>
					</div>
				)}
			</div>
		);
	},
);

NumberInput.displayName = "NumberInput";
