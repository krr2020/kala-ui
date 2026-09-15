/**
 * Pure date/time math for the calendar family. No date library — the
 * grid only ever needs month arithmetic, so every function here is a
 * small pure helper with direct unit tests (leap years, year rollover).
 */

export const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
] as const;

const MONTH_NAMES_SHORT = MONTH_NAMES.map((m) => m.slice(0, 3));

export function daysInMonth(year: number, monthIndex: number): number {
	return new Date(year, monthIndex + 1, 0).getDate();
}

export function startOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, delta: number): Date {
	const target = new Date(date.getFullYear(), date.getMonth() + delta, 1);
	const day = Math.min(
		date.getDate(),
		daysInMonth(target.getFullYear(), target.getMonth()),
	);
	target.setDate(day);
	return target;
}

/** Index (0=Sunday) of the weekday the 1st of the month lands on. */
export function firstWeekdayOffset(firstOfMonth: Date): number {
	return firstOfMonth.getDay();
}

export function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

const monthKey = (d: Date): number => d.getFullYear() * 12 + d.getMonth();

export function monthIsBefore(a: Date, b: Date): boolean {
	return monthKey(a) < monthKey(b);
}

export function monthIsAfter(a: Date, b: Date): boolean {
	return monthKey(a) > monthKey(b);
}

/** Clamps v into [0, maxExclusive); NaN and negatives collapse to 0. */
export function clampTimePart(v: number, maxExclusive: number): number {
	if (!Number.isFinite(v)) return 0;
	const n = Math.floor(v);
	if (n < 0) return 0;
	if (n >= maxExclusive) return maxExclusive - 1;
	return n;
}

export function formatMonthYear(date: Date): string {
	return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

/** Short human date, e.g. "Feb 10, 2026" — the picker trigger format. */
export function formatDay(date: Date): string {
	return `${MONTH_NAMES_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** Zero-padded two-digit label for wheel items. */
export function pad2(v: number): string {
	return String(v).padStart(2, "0");
}
