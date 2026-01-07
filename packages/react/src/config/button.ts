export const buttonStyles = {
  base: 'cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed focus-ring',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      success: 'bg-success text-success-foreground hover:bg-success/80',
      warning: 'bg-warning text-warning-foreground hover:bg-warning/80',
      danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      info: 'bg-info text-info-foreground hover:bg-info/80',
      dark: 'bg-foreground text-card hover:bg-foreground/90',
      light: 'bg-muted text-muted-foreground hover:bg-muted/80',
      muted: 'bg-accent text-accent-foreground hover:bg-accent/80',
      link: 'text-primary underline-offset-4 hover:underline',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      outline: 'border bg-card hover:bg-accent hover:text-accent-foreground',
      'outline-primary':
        'border border-primary text-primary bg-card hover:bg-primary hover:text-primary-foreground',
      'outline-secondary':
        'border border-secondary text-secondary bg-card hover:bg-secondary hover:text-secondary-foreground',
      'outline-success':
        'border border-success text-success bg-card hover:bg-success hover:text-success-foreground',
      'outline-warning':
        'border border-warning text-warning bg-card hover:bg-warning hover:text-warning-foreground',
      'outline-danger':
        'border border-destructive text-destructive bg-card hover:bg-destructive hover:text-destructive-foreground',
      'outline-info':
        'border border-info text-info bg-card hover:bg-info hover:text-info-foreground',
      'outline-dark':
        'border border-foreground text-foreground bg-card hover:bg-foreground hover:text-card',
      'outline-light':
        'border text-muted-foreground bg-card hover:bg-muted hover:text-muted-foreground',
      'outline-muted':
        'border border-accent text-accent-foreground bg-card hover:bg-accent hover:text-accent-foreground',
    },
    size: {
      default: 'h-10 px-4 py-2',
      xs: 'h-7 rounded px-2 text-xs',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    },
    fullWidth: {
      true: 'w-full',
    },
    rounded: {
      true: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    fullWidth: false,
    rounded: false,
  } as const,
};
