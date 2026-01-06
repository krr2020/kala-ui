export const selectTriggerStyles = {
  base: 'bg-background text-foreground data-placeholder:text-muted-foreground aria-invalid:ring-destructive/20 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground flex w-fit items-center justify-between gap-2 rounded-md border whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 theme-input focus-ring *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
  variants: {
    size: {
      default: 'h-10 px-3 py-2 text-sm',
      sm: 'h-8 px-2 py-1 text-xs',
    },
  },
  defaultVariants: {
    size: 'default',
  } as const,
};

export const selectScrollButtonStyles = {
  base: 'flex cursor-default items-center justify-center py-1',
};

export const selectContentStyles = {
  base: 'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-30 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border theme-dropdown',
  popper: 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
  viewportPopper:
    'h-(--radix-select-trigger-height) w-full scroll-my-1',
};

export const selectLabelStyles = {
  base: 'text-muted-foreground px-2 py-1.5 text-xs font-semibold',
};

export const selectItemStyles = {
  base: 'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
};

export const selectSeparatorStyles = {
  base: 'bg-separator pointer-events-none -mx-1 my-1 h-px',
};
