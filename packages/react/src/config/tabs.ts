export const tabsListStyles = {
  base: 'inline-flex items-center rounded-lg text-muted-foreground relative',
  variants: {
    variant: {
      default: 'bg-muted p-1 h-10',
      line: 'bg-transparent p-0 h-auto border-b border-border w-full rounded-none',
      vertical: 'flex-col h-auto bg-transparent p-0 items-stretch',
    },
    align: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
  },
  defaultVariants: {
    variant: 'default',
    align: 'start',
  } as const,
};

export const tabsTriggerStyles = {
  base: 'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all focus-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  variants: {
    variant: {
      default:
        'rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      line: 'rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 font-semibold text-muted-foreground shadow-none transition-colors data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=active]:shadow-none hover:text-foreground',
      vertical:
        'justify-start rounded-md px-4 py-2 hover:bg-muted data-[state=active]:bg-muted data-[state=active]:text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  } as const,
};

export const tabsContentStyles = {
  base: 'mt-2 focus-ring',
};
