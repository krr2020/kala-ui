# Skeleton Loading Components

Comprehensive skeleton loading system for preventing Cumulative Layout Shift (CLS) and providing excellent loading experiences.

## Overview

The skeleton system provides:
- **Base Skeleton primitive** - For custom skeletons with pulse or fade animations
- **SkeletonWrapper** - Smooth transition management between loading and loaded states
- **Skeleton Patterns** - Reusable patterns for common UI elements
- **Type-safe configuration** - Full TypeScript support with IntelliSense

## Installation

```tsx
import {
  Skeleton,
  SkeletonWrapper,
  SkeletonText,
  SkeletonCircle,
  SkeletonRectangle,
  SkeletonAvatar,
  SkeletonParagraph,
  SkeletonHeader,
  SkeletonButton,
  SkeletonCardContent,
} from '@kala-ui/react/skeleton';
```

## Base Skeleton

The base `Skeleton` component provides a customizable loading placeholder.

### Basic Usage

```tsx
<Skeleton className="w-20 h-20" />
```

### Pulse vs Fade Mode

```tsx
// Default: pulse animation
<Skeleton className="w-full h-4" />

// Fade animation
<Skeleton fade={true} fadeDuration={500} className="w-full h-4" />
```

### Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `fade` | `boolean` | `false` | Enable fade transition instead of pulse |
| `fadeDuration` | `number` | `300` | Fade duration in milliseconds |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Inline styles |

## SkeletonWrapper

Smooth transition component that handles fade-in/fade-out between skeleton and content.

### Basic Usage

```tsx
<SkeletonWrapper
  isLoading={!data}
  skeleton={<SkeletonText lines={3} />}
>
  <div>{data}</div>
</SkeletonWrapper>
```

### Custom Duration

```tsx
<SkeletonWrapper
  isLoading={loading}
  duration={500}
  skeleton={<SkeletonText />}
>
  <Content />
</SkeletonWrapper>
```

### Disable Transition

```tsx
<SkeletonWrapper
  isLoading={loading}
  transition={false}
  skeleton={<SkeletonText />}
>
  <Content />
</SkeletonWrapper>
```

### Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `isLoading` | `boolean` | - | Whether content is still loading |
| `skeleton` | `ReactNode` | - | Skeleton component to show while loading |
| `children` | `ReactNode` | - | Actual content to show when loaded |
| `className` | `string` | - | Additional CSS classes for container |
| `duration` | `number` | `300` | Transition duration in milliseconds |
| `transition` | `boolean` | `true` | Enable/disable transition |

## Skeleton Patterns

Reusable patterns for common UI elements.

### SkeletonText

Text lines with configurable count and last line width.

```tsx
<SkeletonText lines={3} lastLineWidth="60%" />
```

### SkeletonCircle

Circular skeleton for avatars, icons, etc.

```tsx
<SkeletonCircle size="3rem" />
```

### SkeletonRectangle

Rectangular skeleton for images, cards, etc.

```tsx
<SkeletonRectangle width="100%" height="200px" rounded="lg" />
```

### SkeletonAvatar

Avatar skeleton with standard sizes.

```tsx
<SkeletonAvatar size="md" />
```

### SkeletonParagraph

Multi-paragraph skeleton with varying line lengths.

```tsx
<SkeletonParagraph paragraphs={2} />
```

### SkeletonHeader

Header pattern with title and subtitle.

```tsx
<SkeletonHeader showSubtitle titleWidth="50%" />
```

### SkeletonButton

Button skeleton with standard sizes.

```tsx
<SkeletonButton width="8rem" size="md" />
```

### SkeletonCardContent

Complete card content with header, content, and footer.

```tsx
<SkeletonCardContent
  showHeader={true}
  contentLines={3}
  showFooter={true}
/>
```

## Usage Patterns

### Pattern 1: Simple Loading State

```tsx
<SkeletonWrapper isLoading={!data} skeleton={<SkeletonText />}>
  <div>{data}</div>
</SkeletonWrapper>
```

### Pattern 2: Card Loading

```tsx
<SkeletonWrapper
  isLoading={loading}
  skeleton={<SkeletonCardContent showHeader showFooter />}
>
  <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
    </CardHeader>
    <CardContent>Content</CardContent>
  </Card>
</SkeletonWrapper>
```

### Pattern 3: List Loading

```tsx
<SkeletonWrapper
  isLoading={loading}
  skeleton={
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonAvatar size="sm" />
          <SkeletonText lines={1} />
        </div>
      ))}
    </div>
  }
>
  <List>
    {items.map((item) => (
      <ListItem key={item.id}>{item.name}</ListItem>
    ))}
  </List>
</SkeletonWrapper>
```

### Pattern 4: Custom Skeleton

```tsx
<SkeletonWrapper
  isLoading={loading}
  skeleton={
    <div className="flex gap-4">
      <SkeletonRectangle width="100px" height="100px" />
      <div className="flex-1 space-y-2">
        <SkeletonHeader showSubtitle={false} />
        <SkeletonText lines={2} />
      </div>
    </div>
  }
>
  <CustomComponent data={data} />
</SkeletonWrapper>
```

## Preventing CLS

### Match Exact Layouts

Ensure skeleton dimensions match actual content to prevent layout shift:

```tsx
// Bad: Random widths
<div>
  {Array.from({ length: 3 }).map((_, i) => (
    <Skeleton key={i} className={`h-4 w-${Math.random() * 40 + 60}%`} />
  ))}
</div>

// Good: Explicit widths matching content
<div>
  <Skeleton className="h-4 w-64" />
  <Skeleton className="h-4 w-48" />
  <Skeleton className="h-4 w-32" />
</div>
```

### Use Fixed Heights

```tsx
// For images
<SkeletonRectangle width="100%" height="200px" />

// For cards
<div className="h-48">
  <SkeletonRectangle width="100%" height="100%" />
</div>
```

### Match Spacing

```tsx
<div className="space-y-4">
  <SkeletonHeader />
  <SkeletonText lines={2} />
</div>
```

## Accessibility

- Skeletons use `role="status"` and `aria-live="polite"`
- `aria-busy="true"` indicates loading state
- `aria-hidden="true"` during fade-out transition
- Respects `prefers-reduced-motion` preference

## Performance

- **Simple skeleton**: <16ms render time
- **Complex skeleton**: <100ms render time
- **60fps animations**: Maintained
- **No layout shift**: Exact dimension matching

## Best Practices

### Do ✅

- Match exact dimensions of loaded content
- Use consistent spacing and alignment
- Provide meaningful loading states
- Test for CLS using Lighthouse
- Respect reduced-motion preferences

### Don't ❌

- Use random widths/sizes
- Skip critical layout elements
- Over-animate transitions
- Block content during loading
- Ignore accessibility

## Examples

### User Profile Loading

```tsx
<SkeletonWrapper
  isLoading={!user}
  skeleton={
    <div className="flex items-center gap-4">
      <SkeletonAvatar size="lg" />
      <div className="space-y-2">
        <SkeletonHeader showSubtitle={false} />
        <SkeletonText lines={1} lastLineWidth="60%" />
      </div>
    </div>
  }
>
  <div className="flex items-center gap-4">
    <Avatar size="lg" src={user.avatar}>
      {user.name}
    </Avatar>
    <div>
      <h2 className="font-semibold">{user.name}</h2>
      <p className="text-sm text-muted-foreground">{user.email}</p>
    </div>
  </div>
</SkeletonWrapper>
```

### Data Grid Loading

```tsx
<SkeletonWrapper
  isLoading={loading}
  skeleton={
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <SkeletonCardContent showHeader={false} contentLines={2} showFooter={false} />
        </Card>
      ))}
    </div>
  }
>
  <div className="grid grid-cols-3 gap-4">
    {items.map((item) => (
      <Card key={item.id}>
        <CardContent>{item.content}</CardContent>
      </Card>
    ))}
  </div>
</SkeletonWrapper>
```

## Type Safety

All components have full TypeScript support:

```tsx
import type { SkeletonProps, SkeletonWrapperProps, CardSkeletonConfig } from '@kala-ui/react/skeleton';

const skeletonConfig: CardSkeletonConfig = {
  variant: 'withImage',
  contentRows: 3,
  hasFooter: true,
};

function MyComponent() {
  return (
    <SkeletonWrapper
      isLoading={loading}
      skeleton={<SkeletonCardContent {...skeletonConfig} />}
    >
      {/* content */}
    </SkeletonWrapper>
  );
}
```

## Migration

**Note:** The deprecated `skeleton-fade` component has been removed. Use `SkeletonWrapper` from `@kala-ui/react/skeleton` instead.

### From SkeletonFade (Deprecated - Removed)

```tsx
// Old (no longer available)
import { SkeletonFade } from '@kala-ui/react/skeleton-fade';
<SkeletonFade isLoading={loading} skeleton={<Skeleton />}>
  {content}
</SkeletonFade>

// New
import { SkeletonWrapper } from '@kala-ui/react/skeleton';
<SkeletonWrapper isLoading={loading} skeleton={<Skeleton />}>
  {content}
</SkeletonWrapper>
```

### From loading/SkeletonCard

```tsx
// Old
import { SkeletonCard } from '@kala-ui/react/loading';
<SkeletonCard showImage textLines={3} />

// New
import { SkeletonCardContent } from '@kala-ui/react/skeleton';
<Card>
  <SkeletonCardContent showHeader={false} contentLines={3} showFooter={false} />
</Card>
```

### From loading/SkeletonText

```tsx
// Old
import { SkeletonText } from '@kala-ui/react/loading';
<SkeletonText lines={3} lastLineWidth="60%" />

// New (same import, different source)
import { SkeletonText } from '@kala-ui/react/skeleton';
<SkeletonText lines={3} lastLineWidth="60%" />
```

## Related Components

- [`Card`](../card/) - Card component for content display
- [`List`](../list/) - List component for item collections
- [`Table`](../table/) - Table component with built-in skeleton support
- [`DataTable`](../data-table/) - Advanced data table with skeleton support
