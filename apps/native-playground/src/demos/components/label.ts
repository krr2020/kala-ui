// Display formatting for chip labels: raw registry names (kebab-case,
// pinned by the seam census) stay untouched for a11y; only what the
// user sees passes through here.
const ACRONYMS = new Set(["otp"]);

export function humanizeLabel(name: string): string {
	return name
		.split(/[-\s]+/)
		.map((word) =>
			ACRONYMS.has(word)
				? word.toUpperCase()
				: word.charAt(0).toUpperCase() + word.slice(1),
		)
		.join(" ");
}
