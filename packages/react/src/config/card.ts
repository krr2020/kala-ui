export const cardStyles = {
  base: 'rounded-md border bg-card text-card-foreground theme-card',
  header: 'flex flex-col space-y-1.5 p-6',
  title: 'text-2xl font-semibold leading-none tracking-tight',
  description: 'text-sm text-muted-foreground',
  content: 'p-6 pt-0',
  footer: 'flex items-center border-t border-separator px-6 py-4',
  subtitle: 'text-sm font-medium text-muted-foreground',
  image: 'w-full h-auto object-cover',
  overlay: 'absolute inset-0 flex flex-col justify-end p-6',
} as const;
