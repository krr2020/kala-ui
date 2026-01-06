export const popoverStyles = {
  base: 'z-30 w-72 origin-(--radix-popover-content-transform-origin) rounded-md drop-shadow-md outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 duration-200',
  variants: {
    variant: {
      default: 'bg-popover text-popover-foreground border theme-popover',
      'header-primary': 'bg-popover text-popover-foreground border-0',
      'header-secondary': 'bg-popover text-popover-foreground border-0',
      'header-success': 'bg-popover text-popover-foreground border-0',
      'header-danger': 'bg-popover text-popover-foreground border-0',
      'header-warning': 'bg-popover text-popover-foreground border-0',
      'header-info': 'bg-popover text-popover-foreground border-0',
      primary: 'bg-primary text-primary-foreground border-0',
      secondary: 'bg-secondary text-secondary-foreground border-0',
      success: 'bg-success text-success-foreground border-0',
      danger: 'bg-destructive text-destructive-foreground border-0',
      warning: 'bg-warning text-warning-foreground border-0',
      info: 'bg-info text-info-foreground border-0',
    },
    padding: {
      default: 'p-4',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'default',
  },
  header: {
    base: 'font-semibold border-b border-muted-foreground rounded-t-md',
    variants: {
      variant: {
        'header-primary': 'bg-primary text-primary-foreground px-4 py-3 border-transparent',
        'header-secondary': 'bg-secondary text-secondary-foreground px-4 py-3 border-transparent',
        'header-success': 'bg-success text-success-foreground px-4 py-3 border-transparent',
        'header-danger': 'bg-destructive text-destructive-foreground px-4 py-3 border-transparent',
        'header-warning': 'bg-warning text-warning-foreground px-4 py-3 border-transparent',
        'header-info': 'bg-info text-info-foreground px-4 py-3 border-transparent',
        default: 'px-4 py-3',
        primary: 'px-4 py-2 border-white/20',
        secondary: 'px-4 py-2 border-white/20',
        success: 'px-4 py-2 border-white/20',
        danger: 'px-4 py-2 border-white/20',
        warning: 'px-4 py-2 border-white/20',
        info: 'px-4 py-2 border-white/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
  arrow: {
    base: 'z-30 size-2.5',
    variants: {
      variant: {
        default: 'bg-popover [border-color:hsl(var(--border)/var(--border-alpha,1))] theme-popover',
        primary: 'bg-primary border-primary',
        secondary: 'bg-secondary border-secondary',
        success: 'bg-success border-success',
        danger: 'bg-destructive border-destructive',
        warning: 'bg-warning border-warning',
        info: 'bg-info border-info',
        'header-primary': 'bg-primary border-primary',
        'header-secondary': 'bg-secondary border-secondary',
        'header-success': 'bg-success border-success',
        'header-danger': 'bg-destructive border-destructive',
        'header-warning': 'bg-warning border-warning',
        'header-info': 'bg-info border-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
} as const;
