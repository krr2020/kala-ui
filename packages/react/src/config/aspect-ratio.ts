export const aspectRatioStyles = {
  base: 'relative w-full overflow-hidden',
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    bordered: {
      true: 'border border-border',
      false: '',
    },
  },
  defaultVariants: {
    rounded: 'md',
    bordered: false,
  } as const,
};
