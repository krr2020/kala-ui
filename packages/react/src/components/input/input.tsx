/**
 * Input Component - Simple primitive input with optional password toggle
 *
 * A flexible input component that maintains simplicity while supporting common patterns:
 * - Password visibility toggle
 * - Prefix/suffix icons
 * - Error and success states
 *
 * For specialized inputs with validation logic (like username checking),
 * create separate composed components.
 */

import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import { inputStyles } from '../../config/input';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Show password visibility toggle button (only for type="password") */
  showPasswordToggle?: boolean;
  /** Prefix icon element */
  prefixIcon?: React.ReactNode;
  /** Suffix icon element */
  suffixIcon?: React.ReactNode;
  /** Error state styling */
  hasError?: boolean;
  /** Success state styling */
  hasSuccess?: boolean;
  /** Disable wrapper div (use when inside InputGroup) */
  unstyled?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type: typeProp = 'text',
      showPasswordToggle = false,
      prefixIcon,
      suffixIcon,
      hasError = false,
      hasSuccess = false,
      unstyled = false,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalType, setInternalType] = React.useState(typeProp);

    // Handle password toggle
    React.useEffect(() => {
      if (typeProp === 'password' && showPasswordToggle) {
        setInternalType(showPassword ? 'text' : 'password');
      } else {
        setInternalType(typeProp);
      }
    }, [typeProp, showPassword, showPasswordToggle]);

    const hasPrefix = !!prefixIcon;
    const hasSuffix = !!suffixIcon || (typeProp === 'password' && showPasswordToggle);

    // Simple input without wrapper (for InputGroup compatibility)
    if (unstyled || (!hasPrefix && !hasSuffix)) {
      return (
        <input
          type={internalType}
          className={cn(
            inputStyles.base,
            inputStyles.file,
            hasError && inputStyles.error,
            hasSuccess && inputStyles.success,
            className,
          )}
          ref={ref}
          {...props}
        />
      );
    }

    // Input with wrapper for icons and password toggle
    return (
      <div data-comp="input" className="relative w-full">
        {hasPrefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            {prefixIcon}
          </div>
        )}

        <input
          type={internalType}
          className={cn(
            inputStyles.base,
            inputStyles.file,
            hasPrefix && 'pl-10',
            hasSuffix && 'pr-10',
            hasError && inputStyles.error,
            hasSuccess && inputStyles.success,
            className,
          )}
          ref={ref}
          {...props}
        />

        {hasSuffix && (
          <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
            {/* Password visibility toggle */}
            {typeProp === 'password' && showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            )}

            {/* Custom suffix icon */}
            {suffixIcon && (
              <span className="pointer-events-none text-muted-foreground">{suffixIcon}</span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
