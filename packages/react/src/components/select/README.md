# Select Component

A fully accessible custom select component built on Radix UI primitives with comprehensive keyboard navigation and ARIA support.

## Features

- ✅ Full keyboard navigation (Arrow keys, Home, End, Enter, Escape)
- ✅ Screen reader support with proper ARIA labels
- ✅ Type-ahead search functionality
- ✅ Grouped options with labels
- ✅ Scrollable dropdown with scroll indicators
- ✅ Disabled state support
- ✅ Custom styling with Tailwind CSS
- ✅ React 19 optimized with `forwardRef`
- ✅ TypeScript support
- ✅ Two size variants: `sm` and `default`

## Native Select vs Custom Select

### Custom Select (This Component)
**Use when you need:**
- ✅ Consistent cross-browser styling
- ✅ Rich interactions (icons, images in options)
- ✅ Better accessibility control
- ✅ Grouped options with visual hierarchy
- ✅ Advanced features (search, multi-select potential)

### Native Select
**Use when you need:**
- ✅ Simple form inputs
- ✅ Mobile-optimized UI (uses native picker)
- ✅ Minimal JavaScript
- ✅ Basic functionality only

**Note:** You would need a **separate component** for native select support as the two approaches are incompatible. This component uses Radix UI primitives which cannot be mixed with native `<select>` elements.

## Installation

The component uses `@radix-ui/react-select` which is already installed in the project.

## Usage

### Basic Example

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';

export default function Example() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### With Groups

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';

export default function GroupedExample() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select food" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
```

### Controlled

```tsx
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';

export default function ControlledExample() {
  const [value, setValue] = useState('apple');

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### Disabled

```tsx
<Select disabled>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
  </SelectContent>
</Select>
```

### Small Size

```tsx
<Select>
  <SelectTrigger size="sm" className="w-[150px]">
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### With Icons

```tsx
<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">
      <div className="i-lucide-sun mr-2" />
      Light
    </SelectItem>
    <SelectItem value="dark">
      <div className="i-lucide-moon mr-2" />
      Dark
    </SelectItem>
    <SelectItem value="system">
      <div className="i-lucide-laptop mr-2" />
      System
    </SelectItem>
  </SelectContent>
</Select>
```

## API Reference

### Select

Root component that manages the select state.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The controlled value |
| `defaultValue` | `string` | - | The default value (uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Callback when value changes |
| `disabled` | `boolean` | `false` | Disable the select |
| `name` | `string` | - | Name attribute for form submission |
| `required` | `boolean` | `false` | Whether the select is required |
| `dir` | `'ltr' \| 'rtl'` | - | Reading direction |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |

### SelectTrigger

The button that opens the select dropdown.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'default'` | `'default'` | Size variant |
| `className` | `string` | - | Additional CSS classes |
| `disabled` | `boolean` | - | Disable the trigger |
| `asChild` | `boolean` | `false` | Render as child element |

### SelectValue

Displays the selected value or placeholder.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `ReactNode` | - | Placeholder text when no value is selected |
| `className` | `string` | - | Additional CSS classes |

### SelectContent

The dropdown that contains the select options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'item-aligned' \| 'popper'` | `'popper'` | Positioning strategy |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment relative to trigger |
| `className` | `string` | - | Additional CSS classes |

### SelectGroup

Groups related select items with an optional label.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### SelectLabel

Label for a group of select items.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### SelectItem

An individual option in the select.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | **Required.** The value of the option |
| `disabled` | `boolean` | `false` | Disable this option |
| `textValue` | `string` | - | Text for typeahead (defaults to children) |
| `className` | `string` | - | Additional CSS classes |

### SelectSeparator

Visual separator between groups or items.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Keyboard Navigation

The Select component supports full keyboard navigation:

- **`Space`** / **`Enter`**: Open dropdown or select focused item
- **`ArrowDown`** / **`ArrowUp`**: Navigate through options
- **`Home`** / **`End`**: Jump to first/last option
- **`Escape`**: Close dropdown
- **`Tab`**: Close dropdown and move to next focusable element
- **Type characters**: Search for options (typeahead)

## Accessibility

The Select component follows WAI-ARIA best practices:

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper labeling with `aria-label`, `aria-labelledby`
- **ARIA Expanded**: Indicates dropdown state
- **ARIA Selected**: Indicates selected option
- **ARIA Disabled**: Properly handles disabled state
- **Focus Management**: Maintains focus during interactions
- **Screen Reader Support**: Announces selections and state changes

### Labeling

Always provide a label for better accessibility:

```tsx
<label htmlFor="fruit-select">Select a fruit:</label>
<Select name="fruit-select">
  <SelectTrigger id="fruit-select" className="w-[180px]">
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
  </SelectContent>
</Select>
```

Or use `aria-label`:

```tsx
<Select>
  <SelectTrigger aria-label="Select a fruit" className="w-[180px]">
    <SelectValue placeholder="Choose a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
  </SelectContent>
</Select>
```

## Styling

The component uses Tailwind CSS and can be customized using the `className` prop:

```tsx
// Custom trigger width and styling
<SelectTrigger className="w-full max-w-xs rounded-lg">
  <SelectValue />
</SelectTrigger>

// Custom content styling
<SelectContent className="max-h-64">
  {/* items */}
</SelectContent>

// Custom item styling
<SelectItem value="custom" className="font-bold text-primary">
  Custom Item
</SelectItem>
```

## Form Integration

The Select component works seamlessly with forms:

```tsx
<form onSubmit={handleSubmit}>
  <Select name="country" required>
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="Select country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
      <SelectItem value="ca">Canada</SelectItem>
    </SelectContent>
  </Select>
  <button type="submit">Submit</button>
</form>
```

With React Hook Form:

```tsx
import { useForm } from 'react-hook-form';

function FormExample() {
  const { register, handleSubmit, setValue } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Select
        {...register('country')}
        onValueChange={(value) => setValue('country', value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
        </SelectContent>
      </Select>
    </form>
  );
}
```

## Performance

For large lists (100+ items):

1. Consider virtualization with `@tanstack/react-virtual`
2. Implement search/filter functionality
3. Use pagination or lazy loading
4. Group items to improve visual scanning

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Related Components

- [Dropdown Menu](../dropdown-menu/README.md) - For actions and commands
- [Combobox](../combobox/README.md) - For searchable selects
- [Radio Group](../radio-group/README.md) - For visible options

## Examples

See the [Storybook stories](./Select.stories.tsx) for more examples and interactive demos.
