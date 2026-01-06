# ScrollArea Component

A customizable scroll area component with styled scrollbars for cross-browser consistency. Built on top of Radix UI's ScrollArea primitive with support for both vertical and horizontal scrolling.

## Features

- ✅ Custom-styled scrollbars for consistent cross-browser appearance
- ✅ Vertical and horizontal scrolling support
- ✅ Multiple visibility modes (hover, always, scroll, auto)
- ✅ Smooth transitions and animations
- ✅ Touch and keyboard accessible
- ✅ RTL support
- ✅ Fully customizable with Tailwind CSS
- ✅ TypeScript support with full type definitions

## Installation

The component uses `@radix-ui/react-scroll-area` which is already installed in the project.

## Usage

### Basic Example

```tsx
import { ScrollArea } from '@repo/ui/scroll-area';

export default function Example() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i}>Item {i + 1}</div>
        ))}
      </div>
    </ScrollArea>
  );
}
```

### Horizontal Scrolling

```tsx
import { ScrollArea, ScrollBar } from '@repo/ui/scroll-area';

export default function HorizontalExample() {
  return (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-40 w-60 rounded-md bg-muted" />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
```

### Both Directions

```tsx
import { ScrollArea, ScrollBar } from '@repo/ui/scroll-area';

export default function BothDirectionsExample() {
  return (
    <ScrollArea className="size-96 rounded-md border">
      <div className="min-w-[800px] p-4">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i}>Very long content line {i + 1}</div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
```

### Scrollbar Visibility Types

```tsx
import { ScrollArea } from '@repo/ui/scroll-area';

// Always visible
<ScrollArea type="always" className="h-72 w-48 rounded-md border">
  <div className="p-4">{/* Content */}</div>
</ScrollArea>

// Visible on hover (default)
<ScrollArea type="hover" className="h-72 w-48 rounded-md border">
  <div className="p-4">{/* Content */}</div>
</ScrollArea>

// Visible when scrolling
<ScrollArea type="scroll" className="h-72 w-48 rounded-md border">
  <div className="p-4">{/* Content */}</div>
</ScrollArea>

// Auto (browser default)
<ScrollArea type="auto" className="h-72 w-48 rounded-md border">
  <div className="p-4">{/* Content */}</div>
</ScrollArea>
```

### Custom Styling

```tsx
import { ScrollArea, ScrollBar } from '@repo/ui/scroll-area';

export default function StyledExample() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">{/* Content */}</div>
      <ScrollBar className="bg-primary/10">
        {/* Custom scrollbar appearance */}
      </ScrollBar>
    </ScrollArea>
  );
}
```

## API Reference

### ScrollArea

Main container component for scrollable content.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'auto' \| 'always' \| 'scroll' \| 'hover'` | `'hover'` | Controls scrollbar visibility behavior |
| `scrollHideDelay` | `number` | `600` | Delay in ms before hiding scrollbars (when type is 'hover' or 'scroll') |
| `dir` | `'ltr' \| 'rtl'` | - | Reading direction for proper scrollbar positioning |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Content to be scrolled |

All other props are passed through to the underlying Radix UI ScrollArea.Root component.

### ScrollBar

Scrollbar component that can be customized independently.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Scrollbar orientation |
| `className` | `string` | - | Additional CSS classes |

All other props are passed through to the underlying Radix UI ScrollArea.Scrollbar component.

## Common Use Cases

### Code Block with Syntax Highlighting

```tsx
<ScrollArea className="h-72 w-full rounded-md border">
  <pre className="p-4">
    <code>{codeString}</code>
  </pre>
</ScrollArea>
```

### Data Table

```tsx
<ScrollArea className="h-[400px] w-full">
  <table className="w-full">
    <thead className="sticky top-0 bg-background">
      <tr>{/* Headers */}</tr>
    </thead>
    <tbody>{/* Rows */}</tbody>
  </table>
</ScrollArea>
```

### Chat Messages

```tsx
<ScrollArea className="h-[400px] w-full rounded-md border p-4">
  <div className="space-y-4">
    {messages.map((message) => (
      <div key={message.id} className={/* alignment based on sender */}>
        {message.text}
      </div>
    ))}
  </div>
</ScrollArea>
```

### Image Gallery

```tsx
<ScrollArea className="w-full whitespace-nowrap rounded-md border">
  <div className="flex space-x-4 p-4">
    {images.map((img) => (
      <img key={img.id} src={img.url} alt={img.alt} className="h-40 w-60" />
    ))}
  </div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

### Tags List

```tsx
<ScrollArea className="h-72 w-48 rounded-md border">
  <div className="p-4">
    {tags.map((tag) => (
      <Fragment key={tag}>
        <div className="text-sm">{tag}</div>
        <Separator className="my-2" />
      </Fragment>
    ))}
  </div>
</ScrollArea>
```

## Accessibility

The ScrollArea component is built with accessibility in mind:

- **Keyboard Navigation**: Supports standard keyboard scrolling (arrow keys, Page Up/Down, Home/End)
- **Screen Readers**: Properly announces scrollable regions
- **Touch Support**: Full touch gesture support on mobile devices
- **Focus Management**: Maintains focus within scrollable content

### Best Practices

1. Ensure sufficient color contrast for scrollbars
2. Provide adequate touch targets (scrollbars are sized appropriately)
3. Consider using `type="always"` for critical scrollable content to ensure visibility
4. Use semantic HTML within the scroll area for better screen reader support

## Styling

The component uses Tailwind CSS and can be customized using the `className` prop:

```tsx
// Custom height and border
<ScrollArea className="h-[500px] rounded-lg border-2 border-primary">
  {/* Content */}
</ScrollArea>

// Custom scrollbar colors
<ScrollBar className="bg-primary/20" />
```

## Performance

For optimal performance with large lists or tables:

1. Consider using virtualization libraries like `@tanstack/react-virtual`
2. Implement pagination for very long lists
3. Use proper React keys for list items
4. Avoid heavy computations in scroll event handlers

## Browser Support

The component works across all modern browsers:

- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Related Components

- [Separator](../separator/README.md) - For dividing content within scroll areas
- [Table](../table/README.md) - For scrollable tabular data
- [Resizable](../resizable/README.md) - For resizable panels with scroll areas

## Examples

See the [Storybook stories](./ScrollArea.stories.tsx) for comprehensive examples and interactive demos.
