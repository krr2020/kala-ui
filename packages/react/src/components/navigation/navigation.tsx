'use client';

import { ChevronDown } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';

export interface NavigationLink {
  label: string;
  href: string;
}

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Array of navigation links
   */
  links: NavigationLink[];
  /**
   * Orientation of the navigation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Mobile layout style
   * @default 'dropdown'
   */
  mobileLayout?: 'dropdown' | 'vertical';
  /**
   * Current pathname for active link detection
   */
  pathname?: string;
}

export const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  (
    {
      className,
      links,
      orientation = 'horizontal',
      mobileLayout = 'dropdown',
      pathname = '',
      ...props
    },
    ref,
  ) => {
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    const isActive = (href: string) => {
      if (href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(href);
    };

    // Close mobile menu when clicking outside
    React.useEffect(() => {
      if (!isMobileOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-mobile-nav]')) {
          setIsMobileOpen(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileOpen]);

    // Desktop Navigation (horizontal or vertical)
    if (orientation === 'vertical' || mobileLayout === 'vertical') {
      return (
        <nav
          data-comp="navigation"
          className={cn(
            orientation === 'vertical'
              ? 'hidden md:flex md:flex-col gap-2'
              : 'flex md:hidden flex-col gap-2',
            className,
          )}
          aria-label="Navigation"
          {...props}
          ref={ref}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium px-3 py-2 rounded-md transition-colors',
                isActive(link.href)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground',
              )}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      );
    }

    // Horizontal desktop + dropdown mobile
    return (
      <>
        {/* Desktop Horizontal Navigation */}
        <nav
          data-comp="navigation"
          className={cn('hidden md:flex flex-row items-center gap-6', className)}
          aria-label="Main navigation"
          {...props}
          ref={ref}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActive(link.href) ? 'text-primary' : 'text-foreground',
              )}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Dropdown Navigation */}
        <div className="md:hidden" data-mobile-nav>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileOpen(!isMobileOpen);
            }}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            aria-label="Toggle mobile navigation"
            aria-expanded={isMobileOpen}
          >
            Menu
            <ChevronDown
              className={cn('size-4 transition-transform', isMobileOpen && 'rotate-180')}
            />
          </button>
          {isMobileOpen && (
            // biome-ignore lint/a11y/useKeyWithClickEvents: Stop propagation is not an interactive action
            <nav
              data-comp="navigation"
              className="mt-2 flex flex-col gap-2 bg-popover border rounded-md p-3 text-popover-foreground theme-popover"
              aria-label="Mobile navigation"
              onClick={(e) => e.stopPropagation()}
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'text-sm font-medium px-3 py-2 rounded-md transition-colors',
                    isActive(link.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </>
    );
  },
);

Navigation.displayName = 'Navigation';
