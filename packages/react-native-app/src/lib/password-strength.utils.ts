/**
 * Pure password-strength scoring shared by the indicator component:
 * length tiers plus character-class checks, capped at four segments.
 */

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_STRONG_LENGTH = 12;
export const PASSWORD_MAX_STRENGTH = 4;

export const STRENGTH_LABELS = [
	"Very Weak",
	"Weak",
	"Fair",
	"Good",
	"Strong",
] as const;

export function calculatePasswordStrength(pwd: string): number {
	if (!pwd) {
		return 0;
	}

	let strength = 0;
	if (pwd.length >= PASSWORD_MIN_LENGTH) strength++;
	if (pwd.length >= PASSWORD_STRONG_LENGTH) strength++;
	if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
	if (/\d/.test(pwd)) strength++;
	if (/[@$!%*?&]/.test(pwd)) strength++;

	return Math.min(strength, PASSWORD_MAX_STRENGTH);
}
