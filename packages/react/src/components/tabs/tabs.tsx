'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { tabsContentStyles, tabsListStyles, tabsTriggerStyles } from '../../config/tabs';
import { cn } from '../../lib/utils';

function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: ((value: T) => void) | undefined;
}) {
  const [uncontrolledProp, setUncontrolledProp] = React.useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = React.useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setUncontrolledProp(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, onChange],
  );
  return [value, handleChange] as const;
}

const TabsContext = React.createContext<{
  activeTab?: string | undefined;
  setActiveTab: (value: string) => void;
  uniqueId: string;
} | null>(null);

const Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(
  (
    { className, value, onValueChange, defaultValue, orientation = 'horizontal', ...props },
    ref,
  ) => {
    const uniqueId = React.useId();
    const [activeTab, setActiveTab] = useControllableState({
      prop: value,
      onChange: onValueChange,
      defaultProp: defaultValue,
    });

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab, uniqueId }}>
        <TabsPrimitive.Root
          ref={ref}
          {...(activeTab && { value: activeTab })}
          {...(defaultValue && { defaultValue })}
          onValueChange={setActiveTab}
          orientation={orientation}
          data-slot="tabs"
          className={cn(
            'flex',
            orientation === 'vertical' ? 'flex-row gap-6' : 'flex-col',
            className,
          )}
          {...props}
        />
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = TabsPrimitive.Root.displayName;

const tabsListVariants = cva(tabsListStyles.base, {
  variants: tabsListStyles.variants,
  defaultVariants: tabsListStyles.defaultVariants,
});

const TabsListContext = React.createContext<{
  variant?: VariantProps<typeof tabsListVariants>['variant'];
}>({});

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>
>(({ className, variant = 'default', align, ...props }, ref) => (
  <TabsListContext.Provider value={{ variant }}>
    <TabsPrimitive.List
      ref={ref}
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant, align }), className)}
      {...props}
    />
  </TabsListContext.Provider>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(tabsTriggerStyles.base, {
  variants: tabsTriggerStyles.variants,
  defaultVariants: tabsTriggerStyles.defaultVariants,
});

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, children, ...props }, ref) => {
  const { variant: listVariant } = React.useContext(TabsListContext);
  const finalVariant = variant || listVariant || 'default';

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant: finalVariant }), className)}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center">{children}</span>
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn(tabsContentStyles.base, className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
