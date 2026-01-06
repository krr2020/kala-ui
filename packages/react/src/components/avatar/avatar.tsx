'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { avatarFallbackStyles, avatarImageStyles, avatarStyles } from '../../config/avatar';
import { cn } from '../../lib/utils';

const AvatarContext = React.createContext<{ shape?: 'circle' | 'rounded' | 'square' }>({
  shape: 'circle',
});

const avatarVariants = cva(avatarStyles.base, {
  variants: avatarStyles.variants,
  compoundVariants: avatarStyles.compoundVariants as never,
  defaultVariants: avatarStyles.defaultVariants,
});

interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

function Avatar({ className, size, shape, status, ...props }: AvatarProps) {
  return (
    <AvatarContext.Provider value={{ shape: shape || 'circle' }}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(avatarVariants({ size, shape, status }), className)}
        {...props}
      />
    </AvatarContext.Provider>
  );
}

interface AvatarImageProps extends React.ComponentProps<typeof AvatarPrimitive.Image> {
  shape?: 'circle' | 'rounded' | 'square';
}

function AvatarImage({ className, shape: shapeProp, ...props }: AvatarImageProps) {
  const { shape: contextShape } = React.useContext(AvatarContext);
  const shape = shapeProp || contextShape || 'circle';

  const avatarImageVariants = cva(avatarImageStyles.base, {
    variants: avatarImageStyles.variants,
    defaultVariants: avatarImageStyles.defaultVariants,
  });

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(avatarImageVariants({ shape }), className)}
      {...props}
    />
  );
}

const avatarFallbackVariants = cva(avatarFallbackStyles.base, {
  variants: avatarFallbackStyles.variants,
  defaultVariants: avatarFallbackStyles.defaultVariants,
});

interface AvatarFallbackProps
  extends React.ComponentProps<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarFallbackVariants> {}

function AvatarFallback({ className, shape: shapeProp, variant, ...props }: AvatarFallbackProps) {
  const { shape: contextShape } = React.useContext(AvatarContext);
  const shape = shapeProp || contextShape || 'circle';

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackVariants({ shape, variant }), className)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants, type AvatarProps };
