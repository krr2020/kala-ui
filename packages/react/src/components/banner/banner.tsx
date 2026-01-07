/**
 * Banner Component - Reusable notification banner
 *
 * Full-width banner for important notifications and alerts.
 *
 * Purpose: Used for system-wide or top-level messages that apply to the entire page
 * or application context. Unlike the Alert component, Banners are typically fixed
 * at the top of the viewport or container and demand immediate attention without
 * being tied to a specific form or content area.
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../lib/utils';

const bannerVariants = cva(
  'w-full z-50 px-4 py-3 text-sm font-medium flex items-center justify-between gap-4',
  {
    variants: {
      variant: {
        info: 'bg-info text-info-foreground',
        warning: 'bg-warning text-warning-foreground',
        error: 'bg-destructive text-destructive-foreground',
        success: 'bg-success text-success-foreground',
      },
      position: {
        fixed: 'fixed top-0 left-0 right-0 shadow-md',
        static: 'relative',
      },
    },
    defaultVariants: {
      variant: 'info',
      position: 'fixed',
    },
  },
);

export interface BannerProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof bannerVariants> {
  onClose?: () => void;
  /**
   * ARIA role for the banner
   * @default 'banner' - use 'alert' for important/urgent messages
   */
  role?: 'banner' | 'alert' | 'status';
  /**
   * ARIA live region for dynamic announcements
   * @default undefined - use 'polite' or 'assertive' for dynamic banners
   */
  'aria-live'?: 'polite' | 'assertive';
}

export function Banner({
  className,
  variant,
  position,
  onClose,
  children,
  role = 'banner',
  ...props
}: BannerProps) {
  return (
    <div className={cn(bannerVariants({ variant, position }), className)} role={role} {...props}>
      <div className="flex-1 flex items-center gap-3">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export { bannerVariants };
