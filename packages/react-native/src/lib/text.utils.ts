/**
 * Pure text helpers shared across components: name-to-initials
 * extraction for avatar-style fallbacks.
 */

/** First letters of the first two words, uppercase; en-dash when unnamed. */
export function initialsFor(name?: string): string {
	const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return "–";
	return words
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase();
}
