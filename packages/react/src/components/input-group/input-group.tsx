/**
 * InputGroup - Group inputs and addons together
 *
 * Note: Input components with icons or password toggle should not use wrapper divs.
 * For best compatibility, use simple inputs without additional features inside InputGroup.
 */

import * as React from 'react';
import { cn } from '../../lib/utils';

const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full items-stretch',
          // Reset rounded corners for children - focus on direct children that are not headers/labels
          '[&>*:not(:first-child)]:rounded-l-none',
          '[&>*:not(:last-child)]:rounded-r-none',
          // Handle borders to avoid double borders
          '[&>*:not(:first-child)]:border-l-0',
          // Ensure focus ring appears on top
          '[&>*:focus-within]:z-10',
          '[&>*:focus]:z-10',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
InputGroup.displayName = 'InputGroup';

const InputGroupText = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center whitespace-nowrap rounded-md border bg-muted px-3 text-sm text-muted-foreground theme-card',
          className,
        )}
        {...props}
      />
    );
  },
);
InputGroupText.displayName = 'InputGroupText';

export { InputGroup, InputGroupText };
