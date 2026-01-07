export const radioGroupStyles = {
  variants: {
    variant: {
      default: 'grid gap-3',
      cards: 'grid gap-3',
      buttons: 'flex flex-wrap gap-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  } as const,
};

export const radioGroupItemStyles = {
  base: 'cursor-pointer group relative shrink-0 rounded-full border transition-all outline-none focus-ring disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    variant: {
      default: 'border text-primary data-[state=checked]:border-primary data-[state=checked]:text-primary',
      cards: 'border text-primary data-[state=checked]:border-primary data-[state=checked]:text-primary',
      buttons:
        'inline-flex items-center justify-center rounded-md border bg-card px-4 py-2 text-sm font-medium transition-all theme-input data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground hover:bg-accent hover:text-accent-foreground disabled:bg-muted disabled:text-muted-foreground',
    },
    size: {
      sm: 'size-3',
      md: 'size-4',
      lg: 'size-5',
    },
    error: {
      true: 'border-destructive ring-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    error: false,
  } as const,
};

export const radioGroupItemWrapperStyles = {
  default: 'flex items-start gap-3',
  cards:
    'relative flex cursor-pointer rounded-lg border bg-card p-4 transition-all theme-card hover:bg-accent focus-within-ring has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5',
  buttons:
    'relative inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all border bg-card hover:bg-accent hover:text-accent-foreground focus-within-ring has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[state=checked]:bg-primary has-data-[state=checked]:text-primary-foreground has-data-[state=checked]:border-primary',
};

export const radioGroupLabelStyles = {
  base: 'cursor-pointer',
  error: 'text-destructive',
  cardBase: 'text-sm font-medium',
};

export const radioGroupDescriptionStyles = {
  base: 'text-sm text-muted-foreground',
  error: 'text-destructive/80',
};

export const radioGroupIndicatorSizes = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-2.5',
};
