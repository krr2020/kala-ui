import { useState } from "react";

export interface UseListStateHandlers<T> {
	setState: React.Dispatch<React.SetStateAction<T[]>>;
	append: (...items: T[]) => void;
	prepend: (...items: T[]) => void;
	insert: (index: number, ...items: T[]) => void;
	pop: () => void;
	shift: () => void;
	apply: (fn: (item: T, index: number) => T) => void;
	applyWhere: (
		condition: (item: T, index: number) => boolean,
		fn: (item: T, index: number) => T,
	) => void;
	remove: (...indices: number[]) => void;
	reorder: ({ from, to }: { from: number; to: number }) => void;
	swap: ({ from, to }: { from: number; to: number }) => void;
	setItem: (index: number, item: T) => void;
	setItemProp: <K extends keyof T>(index: number, prop: K, value: T[K]) => void;
	filter: (fn: (item: T, i: number) => boolean) => void;
}

/**
 * Manages array state with helper methods
 *
 * @example
 * ```tsx
 * const [state, handlers] = useListState([{ name: 'John' }]);
 * ```
 */
export function useListState<T>(
	initialValue: T[] = [],
): [T[], UseListStateHandlers<T>] {
	const [state, setState] = useState(initialValue);

	const append = (...items: T[]) =>
		setState((current) => [...current, ...items]);
	const prepend = (...items: T[]) =>
		setState((current) => [...items, ...current]);

	const insert = (index: number, ...items: T[]) =>
		setState((current) => {
			const results = [...current];
			results.splice(index, 0, ...items);
			return results;
		});

	const apply = (fn: (item: T, index: number) => T) =>
		setState((current) => current.map((item, index) => fn(item, index)));

	const remove = (...indices: number[]) =>
		setState((current) =>
			current.filter((_, index) => !indices.includes(index)),
		);

	const pop = () =>
		setState((current) => {
			const cloned = [...current];
			cloned.pop();
			return cloned;
		});

	const shift = () =>
		setState((current) => {
			const cloned = [...current];
			cloned.shift();
			return cloned;
		});

	const reorder = ({ from, to }: { from: number; to: number }) =>
		setState((current) => {
			const cloned = [...current];
			const item = cloned[from];
			cloned.splice(from, 1);
			cloned.splice(to, 0, item);
			return cloned;
		});

	const swap = ({ from, to }: { from: number; to: number }) =>
		setState((current) => {
			const cloned = [...current];
			const itemFrom = cloned[from];
			const itemTo = cloned[to];
			cloned[from] = itemTo;
			cloned[to] = itemFrom;
			return cloned;
		});

	const setItem = (index: number, item: T) =>
		setState((current) => {
			const cloned = [...current];
			cloned[index] = item;
			return cloned;
		});

	const setItemProp = <K extends keyof T>(
		index: number,
		prop: K,
		value: T[K],
	) =>
		setState((current) => {
			const cloned = [...current];
			cloned[index] = { ...cloned[index], [prop]: value };
			return cloned;
		});

	const applyWhere = (
		condition: (item: T, index: number) => boolean,
		fn: (item: T, index: number) => T,
	) =>
		setState((current) =>
			current.map((item, index) =>
				condition(item, index) ? fn(item, index) : item,
			),
		);

	const filter = (fn: (item: T, i: number) => boolean) =>
		setState((current) => current.filter(fn));

	return [
		state,
		{
			setState,
			append,
			prepend,
			insert,
			pop,
			shift,
			apply,
			applyWhere,
			remove,
			reorder,
			swap,
			setItem,
			setItemProp,
			filter,
		},
	];
}
