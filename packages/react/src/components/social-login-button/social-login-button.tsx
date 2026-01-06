/**
 * SocialLoginButton Component
 * Individual OAuth provider button with loading state and brand colors from design tokens
 */

import { Loader2 } from 'lucide-react';
import * as React from 'react';
import type { SimpleIcon } from 'simple-icons';
import { siFacebook, siGithub, siGoogle, siX } from 'simple-icons';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from '../button';

export interface SocialLoginButtonProps extends Omit<ButtonProps, 'variant'> {
  /**
   * OAuth provider name (e.g., 'google', 'github')
   */
  provider: 'google' | 'github' | 'facebook' | 'twitter' | 'x' | 'linkedin';

  /**
   * Loading state during OAuth redirect
   */
  isLoading?: boolean;

  /**
   * Optional custom label (defaults to provider name, e.g., "Google")
   */
  label?: string;
}

/**
 * Provider configuration with proper brand colors
 * Using solid hover colors instead of opacity to fix white background issue
 */

// Custom LinkedIn icon (removed from simple-icons due to Microsoft legal requirements)
// See: https://github.com/simple-icons/simple-icons/issues/11372
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>LinkedIn</title>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// Wrapper component to convert SimpleIcon to React component
const SimpleIconWrapper = ({
  icon,
  className,
  label,
}: {
  icon: SimpleIcon;
  className?: string;
  label?: string;
}) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{label}</title>
    <path d={icon.path} />
  </svg>
);

const providerConfig = {
  google: {
    icon: siGoogle,
    label: 'Google',
    color: 'hover:bg-[#4285F4] hover:text-white hover:border-[#4285F4]',
  },
  github: {
    icon: siGithub,
    label: 'GitHub',
    color: 'hover:bg-[#181717] hover:text-white hover:border-[#181717]',
  },
  facebook: {
    icon: siFacebook,
    label: 'Facebook',
    color: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
  },
  twitter: {
    icon: siX,
    label: 'X',
    color: 'hover:bg-black hover:text-white hover:border-black',
  },
  x: {
    icon: siX,
    label: 'X',
    color: 'hover:bg-black hover:text-white hover:border-black',
  },
  linkedin: {
    icon: null, // Custom component used instead
    label: 'LinkedIn',
    color: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
  },
} as const;

export const SocialLoginButton = React.forwardRef<HTMLButtonElement, SocialLoginButtonProps>(
  ({ provider, isLoading = false, label, className, disabled, ...props }, ref) => {
    const config = providerConfig[provider];
    const displayLabel = label ?? config.label;
    const icon = config.icon;

    return (
      <Button
        ref={ref}
        data-comp="social-login-button"
        type="button"
        variant="outline"
        className={cn(
          'relative transition-colors duration-200 bg-transparent border-input text-foreground',
          config.color,
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : provider === 'linkedin' ? (
          <LinkedInIcon className="w-5 h-5 mr-2" />
        ) : icon ? (
          <SimpleIconWrapper icon={icon} className="w-5 h-5 mr-2" label={displayLabel} />
        ) : null}
        <span>{isLoading ? 'Redirecting...' : displayLabel}</span>
      </Button>
    );
  },
);

SocialLoginButton.displayName = 'SocialLoginButton';
