'use client';

import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

export interface NativeSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Size variant
   * @default "default"
   */
  size?: 'sm' | 'default';
  /**
   * Error state styling
   */
  error?: boolean;
}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, size = 'default', error, children, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full rounded-md border bg-background text-sm transition-colors theme-input',
            'focus-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'appearance-none pr-10',
            {
              'h-9 px-3 py-2': size === 'default',
              'h-8 px-2 py-1 text-xs': size === 'sm',
              'border-destructive focus-ring-destructive': error,
            },
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <ChevronDown
            className={cn('opacity-70', size === 'sm' ? 'size-3' : 'size-4')}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  },
);

NativeSelect.displayName = 'NativeSelect';

export interface NativeSelectOptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

const NativeSelectOption = React.forwardRef<HTMLOptionElement, NativeSelectOptionProps>(
  ({ className, ...props }, ref) => {
    return <option ref={ref} {...props} />;
  },
);

NativeSelectOption.displayName = 'NativeSelectOption';

export interface NativeSelectOptGroupProps
  extends React.OptgroupHTMLAttributes<HTMLOptGroupElement> {}

const NativeSelectOptGroup = React.forwardRef<HTMLOptGroupElement, NativeSelectOptGroupProps>(
  ({ className, ...props }, ref) => {
    return <optgroup ref={ref} className={className} {...props} />;
  },
);

NativeSelectOptGroup.displayName = 'NativeSelectOptGroup';

export { NativeSelect, NativeSelectOption, NativeSelectOptGroup };
