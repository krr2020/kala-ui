/**
 * Numeric text sanitization for NumberInput: allows a leading minus and a
 * single decimal point, everything else stripped. number-pad keyboards
 * cannot type minus, so the field uses a punctuation-capable keyboard on
 * iOS and relies on sanitization everywhere.
 */
export function sanitizeNumberText(text: string): string {
	const stripped = text.replace(/[^0-9.-]/g, "");
	const negative = stripped.startsWith("-");
	let body = negative ? stripped.slice(1) : stripped;
	const [intPart, ...rest] = body.split(".");
	const frac = rest.join("");
	body = rest.length > 0 ? `${intPart}.${frac}` : intPart;
	return `${negative ? "-" : ""}${body}`;
}
