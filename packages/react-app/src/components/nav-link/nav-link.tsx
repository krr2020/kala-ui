import { cn } from '@kala-ui/react/lib/utils';
import { useUncontrolled } from '@kala-ui/react-hooks';
import { ChevronRight } from 'lucide-react';
import type * as React from 'react';

export interface NavLinkProps extends Omit<React.ComponentProps<'button'>, 'onChange' | 'ref'> {
  /** Link label */
  label: React.ReactNode;
  /** Link description */
  description?: React.ReactNode;
  /** Left icon */
  icon?: React.ReactNode;
  /** Right section (e.g. badge, icon) */
  rightSection?: React.ReactNode;
  /** Active state */
  active?: boolean;
  /**
   * Renders the NavLink as a real anchor (<a href>) instead of a button.
   * Use for top-level navigation targets: the href keeps middle-click,
   * clone-tab and keyboard semantics native. A plain left-click is
   * preventDefaulted so SPA routers can route client-side; modifier clicks
   * are left to the browser. Nested-collapse behavior (children chevron
   * toggle) only applies in button mode.
   */
  href?: string;
  /** Collapsed/Expanded state for nested items */
  defaultOpen?: boolean;
  /** Controlled opened state */
  open?: boolean;
  /** Callback for opened state change */
  onOpenChange?: (open: boolean) => void;
  /** Nested links */
  children?: React.ReactNode;
  /** Disable right section rotation when opened */
  disableRightSectionRotation?: boolean;
  /** Indentation for nested items */
  indent?: boolean;
}

/** Click handler type broad enough for both the button and anchor arms —
 *  the DOM event target differences are irrelevant to callers. */
type NavLinkClickHandler = (e: React.MouseEvent<HTMLElement>) => void;

/** True for plain left-clicks only — modifier and non-left clicks stay native
 *  so open-in-new-tab and download-as-link keep working. */
function isPlainLeftClick(e: React.MouseEvent<HTMLAnchorElement>): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

type NavLinkCommonProps = Omit<
  NavLinkProps,
  | 'label'
  | 'description'
  | 'icon'
  | 'rightSection'
  | 'active'
  | 'defaultOpen'
  | 'open'
  | 'onOpenChange'
  | 'children'
  | 'disableRightSectionRotation'
  | 'indent'
  | 'href'
  | 'type'
  | 'disabled'
  | 'onClick'
>;

/** Props shared by both arms with element-specific handlers widened to a
 *  common HTMLElement base, so the same rest-object spreads onto <button>
 *  and <a> without fighting their event-target variance. */
const widenHandlers = (props: NavLinkCommonProps): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    out[key] =
      typeof value === 'function' && (key.startsWith('on') || key === 'ref')
        ? (value as (e: never) => void)
        : value;
  }
  return out;
};

/** Label/description/icon/right-section row shared by the anchor and
 *  button arms. */
function NavLinkContent({
  label,
  description,
  icon,
  rightSection,
  children,
  disableRightSectionRotation,
  isOpened,
}: {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  rightSection?: React.ReactNode;
  children?: React.ReactNode;
  disableRightSectionRotation: boolean;
  isOpened: boolean;
}) {
  return (
    <>
      {icon && <span className="flex items-center justify-center">{icon}</span>}

      <div className="flex flex-1 flex-col items-start overflow-hidden">
        <span className="truncate">{label}</span>
        {description && (
          <span className="truncate text-xs text-muted-foreground font-normal">{description}</span>
        )}
      </div>

      {(rightSection || children) && (
        <span
          className={cn(
            'flex items-center justify-center text-muted-foreground transition-transform duration-200',
            children && !disableRightSectionRotation && isOpened && 'rotate-90'
          )}
        >
          {rightSection || (children && <ChevronRight className="h-4 w-4" />)}
        </span>
      )}
    </>
  );
}

/** Base classes for both arms; the active variant swaps fg/bg. */
function navLinkBaseClassName(active: boolean | undefined, className?: string): string {
  return cn(
    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
    className
  );
}

export function NavLink({
  className,
  label,
  description,
  icon,
  rightSection,
  active,
  href,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children,
  disableRightSectionRotation = false,
  indent = false,
  onClick,
  type,
  disabled,
  ...props
}: NavLinkProps) {
  const [isOpened, handleOpenChange] = useUncontrolled<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const content = (
    <NavLinkContent
      label={label}
      description={description}
      icon={icon}
      rightSection={rightSection}
      children={children}
      disableRightSectionRotation={disableRightSectionRotation}
      isOpened={isOpened}
    />
  );

  const baseClassName = navLinkBaseClassName(active, className);

  if (href) {
    // Anchor mode: button-only props (type/disabled) are invalid on <a> —
    // disabled degrades to aria-disabled + pointer-events styling. Plain
    // left-clicks are the SPA router's to handle; every other click
    // (modifiers, middle) stays native so open-in-new-tab keeps working.
    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isPlainLeftClick(e)) e.preventDefault();
      (onClick as NavLinkClickHandler | undefined)?.(e);
    };
    return (
      <a
        data-kala-component="nav-link"
        href={href}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        className={cn(baseClassName, disabled && 'pointer-events-none opacity-50')}
        onClick={handleAnchorClick}
        {...widenHandlers(props as NavLinkCommonProps)}
      >
        {content}
      </a>
    );
  }

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (children) {
      e.preventDefault();
      handleOpenChange(!isOpened);
    }
    (onClick as NavLinkClickHandler | undefined)?.(e);
  };

  return (
    <>
      <button
        data-kala-component="nav-link"
        type={type ?? ('button' as const)}
        disabled={disabled}
        className={baseClassName}
        onClick={handleToggle}
        {...widenHandlers(props as NavLinkCommonProps)}
      >
        {content}
      </button>

      {children && isOpened && (
        <div className={cn('flex flex-col gap-1', indent && 'pl-4')}>{children}</div>
      )}
    </>
  );
}
