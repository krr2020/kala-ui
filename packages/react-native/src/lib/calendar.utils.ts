/**
 * Pure month-grid math for the calendar family: ISO day keys and the
 * 42-cell leading/in-month/trailing cell builder.
 */
import { addMonths, daysInMonth, firstWeekdayOffset } from "./date.utils";

export const iso = (d: Date): string =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
		d.getDate(),
	).padStart(2, "0")}`;

/** Split items into fixed-size rows; the last row may be short. */
export function chunk<T>(items: T[], size: number): T[][] {
	const rows: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		rows.push(items.slice(i, i + size));
	}
	return rows;
}

/** 42 cells: leading days of the previous month, this month, trailing next. */
export function buildMonth(view: Date): { date: Date; inMonth: boolean }[] {
	const year = view.getFullYear();
	const month = view.getMonth();
	const dim = daysInMonth(year, month);
	const offset = firstWeekdayOffset(new Date(year, month, 1));
	const prev = addMonths(view, -1);
	const prevDim = daysInMonth(prev.getFullYear(), prev.getMonth());
	const cells: { date: Date; inMonth: boolean }[] = [];
	for (let i = offset; i > 0; i--) {
		cells.push({
			date: new Date(prev.getFullYear(), prev.getMonth(), prevDim - i + 1),
			inMonth: false,
		});
	}
	for (let day = 1; day <= dim; day++) {
		cells.push({ date: new Date(year, month, day), inMonth: true });
	}
	const next = addMonths(view, 1);
	let trail = 1;
	while (cells.length < 42) {
		cells.push({
			date: new Date(next.getFullYear(), next.getMonth(), trail++),
			inMonth: false,
		});
	}
	return cells;
}
