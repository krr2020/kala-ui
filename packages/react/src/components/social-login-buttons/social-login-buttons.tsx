/**
 * SocialLoginButtons Component
 * Grid of all OAuth provider buttons with divider
 */

import type * as React from 'react';
import { cn } from '../../lib/utils';
import { SocialLoginButton, type SocialLoginButtonProps } from '../social-login-button';

export interface SocialLoginButtonsProps {
  /**
   * Callback when any provider button is clicked
   */
  onProviderClick: (provider: SocialLoginButtonProps['provider']) => void;

  /**
   * Currently loading provider (if any)
   */
  loadingProvider?: SocialLoginButtonProps['provider'];

  /**
   * Optional list of providers to display (defaults to all 5)
   */
  providers?: SocialLoginButtonProps['provider'][];

  /**
   * Optional custom class name for the container
   */
  className?: string;

  /**
   * Show divider with "Or continue with" text
   */
  showDivider?: boolean;

  /**
   * Custom text for the divider
   * @default "Or sign in with"
   */
  dividerText?: string;
}

const defaultProviders: SocialLoginButtonProps['provider'][] = [
  'google',
  'github',
  'facebook',
  'x',
  'linkedin',
];

export function SocialLoginButtons({
  onProviderClick,
  loadingProvider,
  providers = defaultProviders,
  className,
  showDivider = true,
  dividerText = 'Or sign in with',
}: SocialLoginButtonsProps): React.JSX.Element {
  return (
    <div data-comp="social-login-buttons" className={cn('w-full space-y-3', className)}>
      {showDivider && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{dividerText}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        {providers.map((provider) => (
          <SocialLoginButton
            key={provider}
            provider={provider}
            isLoading={loadingProvider === provider}
            onClick={() => onProviderClick(provider)}
            disabled={loadingProvider !== undefined && loadingProvider !== provider}
          />
        ))}
      </div>
    </div>
  );
}
