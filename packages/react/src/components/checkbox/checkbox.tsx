'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import type * as React from 'react';

import { checkboxIndicatorStyles, checkboxStyles } from '../../config/checkbox';
import { cn } from '../../lib/utils';

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxStyles.base, className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={checkboxIndicatorStyles.base}
      >
        {props.checked === 'indeterminate' ? (
          <Minus className="size-3.5 stroke-3" />
        ) : (
          <Check className="size-3.5 stroke-3" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
