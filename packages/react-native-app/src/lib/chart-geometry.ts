/**
 * Pure chart geometry: value sanitation and coordinate math shared by the
 * hand-rolled SVG charts. No react-native imports so vitest (node env)
 * can exercise every degenerate input directly.
 */

export interface DonutArc {
	/** Start position as a fraction of the full circle. */
	offset: number;
	/** Sweep as a fraction of the full circle. */
	fraction: number;
}

function sanitize(values: number[]): number[] {
	return values.map((v) => (Number.isFinite(v) ? Math.max(0, v) : 0));
}

/**
 * Bar heights normalized against the tallest value. Negative and NaN
 * entries collapse to the visible minimum bar (they are real data slots,
 * not gaps), and an all-zero series still draws baseline stubs.
 */
export function barHeights(
	values: number[],
	height: number,
	minHeight = 2,
): number[] {
	const clean = sanitize(values);
	if (clean.length === 0) return [];
	const max = Math.max(...clean);
	if (max <= 0) return clean.map(() => minHeight);
	return clean.map((v) => Math.max(minHeight, (v / max) * height));
}

/**
 * Donut arcs as circumference fractions. A zero total yields no arcs —
 * the caller renders the empty state instead of NaN dash arrays.
 */
export function donutArcs(values: number[]): DonutArc[] {
	const clean = sanitize(values);
	const total = clean.reduce((sum, v) => sum + v, 0);
	if (total <= 0) return [];
	let offset = 0;
	return clean.map((v) => {
		const arc: DonutArc = { offset, fraction: v / total };
		offset += v / total;
		return arc;
	});
}

/**
 * SVG polyline points string for a sparkline series. NaN entries are
 * dropped (a missing sample is not a 0), an all-equal series draws a
 * flat centered line, and a single sample is duplicated to both ends so
 * something visible renders.
 */
export function sparklinePoints(
	data: number[],
	width: number,
	height: number,
	pad = 2,
): string {
	const clean = data.filter((v) => Number.isFinite(v));
	if (clean.length === 0) return "";
	const min = Math.min(...clean);
	const max = Math.max(...clean);
	const span = height - pad * 2;
	const y = (v: number): number =>
		max === min ? height / 2 : pad + (1 - (v - min) / (max - min)) * span;
	const step = clean.length > 1 ? width / (clean.length - 1) : 0;
	const pts = clean.map(
		(v, i) => `${Math.round(i * step)},${Math.round(y(v))}`,
	);
	if (pts.length === 1) return `${pts[0]} ${width},${pts[0].split(",")[1]}`;
	return pts.join(" ");
}
