'use client';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import type * as React from 'react';

import { switchStyles, switchThumbStyles } from '../../config/switch';
import { cn } from '../../lib/utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchStyles.base, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbStyles.base)}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
