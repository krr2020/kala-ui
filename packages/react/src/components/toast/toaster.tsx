import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border theme-popover data-[type=error]:!border-destructive data-[type=success]:!border-success data-[type=warning]:!border-warning data-[type=info]:!border-info data-[type=success]:[&_[data-icon]]:!text-success data-[type=error]:[&_[data-icon]]:!text-destructive data-[type=warning]:[&_[data-icon]]:!text-warning data-[type=info]:[&_[data-icon]]:!text-info',
          description: 'group-[.toast]:text-popover-foreground/80',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-data-[type=success]:!bg-success group-data-[type=success]:!text-success-foreground group-data-[type=error]:!bg-destructive group-data-[type=error]:!text-destructive-foreground group-data-[type=warning]:!bg-warning group-data-[type=warning]:!text-warning-foreground group-data-[type=info]:!bg-info group-data-[type=info]:!text-info-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-popover-foreground/60',
          icon: 'group-[.toast]:!text-current',
          closeButton:
            'group-[.toast]:bg-popover group-[.toast]:border group-[.toast]:hover:bg-accent group-[.toast]:!left-auto group-[.toast]:!-right-4 group-[.toast]:!-top-1 group-data-[type=success]:!border-success group-data-[type=error]:!border-destructive group-data-[type=warning]:!border-warning group-data-[type=info]:!border-info',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
