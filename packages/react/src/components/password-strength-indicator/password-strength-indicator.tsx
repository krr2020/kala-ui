import type { ReactElement } from 'react';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_STRONG_LENGTH = 12;
const PASSWORD_MAX_STRENGTH = 4;

const STRENGTH_LABELS = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;

interface PasswordStrengthIndicatorProps {
  password: string;
}

function calculatePasswordStrength(pwd: string): number {
  if (!pwd) {
    return 0;
  }

  let strength = 0;

  if (pwd.length >= PASSWORD_MIN_LENGTH) {
    strength++;
  }

  if (pwd.length >= PASSWORD_STRONG_LENGTH) {
    strength++;
  }

  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) {
    strength++;
  }

  if (/\d/.test(pwd)) {
    strength++;
  }

  if (/[@$!%*?&]/.test(pwd)) {
    strength++;
  }

  return Math.min(strength, PASSWORD_MAX_STRENGTH);
}

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps): ReactElement | null {
  if (!password) {
    return null;
  }

  const strength = calculatePasswordStrength(password);

  return (
    <div data-comp="password-strength-indicator" className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Password Strength</span>
        <span className="text-xs font-medium text-muted-foreground">
          {STRENGTH_LABELS[strength]}
        </span>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map((level) => {
          const isActive = level <= strength;
          return (
            <div
              key={`strength-${level}`}
              className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
                isActive
                  ? strength === 0
                    ? 'bg-destructive'
                    : strength === 1
                      ? 'bg-destructive/70'
                      : strength === 2
                        ? 'bg-warning'
                        : strength === 3
                          ? 'bg-success/70'
                          : 'bg-success'
                  : 'bg-muted'
              }`}
            />
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Use {PASSWORD_MIN_LENGTH}+ characters with uppercase, lowercase, numbers, and symbols
      </p>
    </div>
  );
}
