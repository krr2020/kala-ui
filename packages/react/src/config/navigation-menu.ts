export const navigationMenuStyles = {
  base: 'relative z-10 flex max-w-max flex-1 justify-center',
  variants: {
    variant: {
      default: '',
      filled: 'bg-card',
      bordered: 'border rounded-lg',
      minimal: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  } as const,
};
