import { useState } from "react";

interface UseUncontrolledInput<T> {
	/** Controlled value */
	value?: T;

	/** Initial value for uncontrolled state */
	defaultValue?: T;

	/** Final value for uncontrolled state when value and defaultValue are not provided */
	finalValue?: T;

	/** Controlled state onChange handler */
	onChange?: (value: T, ...payload: unknown[]) => void;
}

export function useUncontrolled<T>({
	value,
	defaultValue,
	finalValue,
	onChange,
}: UseUncontrolledInput<T>): [
	T,
	(value: T, ...payload: unknown[]) => void,
	boolean,
] {
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue !== undefined ? defaultValue : finalValue,
	);

	const handleUncontrolledChange = (val: T, ...payload: unknown[]) => {
		setUncontrolledValue(val);
		onChange?.(val, ...payload);
	};

	if (value !== undefined) {
		return [
			value as T,
			onChange as (value: T, ...payload: unknown[]) => void,
			true,
		];
	}

	return [uncontrolledValue as T, handleUncontrolledChange, false];
}
