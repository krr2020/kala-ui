import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import * as React from 'react';

import { alertStyles } from '../../config/alert';
import { cn } from '../../lib/utils';

const alertVariants = cva(alertStyles.base, {
  variants: alertStyles.variants,
  compoundVariants: alertStyles.compoundVariants as never,
  defaultVariants: alertStyles.defaultVariants,
});

export interface AlertProps
  extends Omit<React.ComponentProps<'div'>, 'style'>,
    VariantProps<typeof alertVariants> {
  dismissable?: boolean;
  onDismiss?: () => void;
  showIcon?: boolean;
}

const variantIcons = {
  primary: Info,
  secondary: Info,
  success: CheckCircle2,
  danger: AlertCircle,
  destructive: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

function Alert({
  className,
  variant = 'primary',
  style: alertStyle,
  dismissable = false,
  onDismiss,
  showIcon = true,
  children,
  ...props
}: AlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const Icon = variant ? variantIcons[variant as keyof typeof variantIcons] : Info;
  const hasCustomIcon = React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    const type = child.type;
    if (typeof type === 'string') return type === 'svg';

    // Check for Lucide icons or other icon components
    const componentType = type as { displayName?: string; name?: string };
    const name = componentType.displayName || componentType.name || '';
    const props = child.props as { className?: string };

    return (
      name.includes('Icon') ||
      name.includes('Alert') ||
      name.includes('Check') ||
      name.includes('Info') ||
      name.includes('X') ||
      props.className?.includes('lucide')
    );
  });

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        alertVariants({ variant, style: alertStyle }),
        dismissable && 'pr-10',
        className,
      )}
      {...props}
    >
      {showIcon && !hasCustomIcon && <Icon className="size-4 translate-y-0.5" aria-hidden="true" />}
      {children}
      {dismissable && (
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-md p-1 hover:bg-accent transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('col-start-2 text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
