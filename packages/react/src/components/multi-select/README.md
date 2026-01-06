# MultiSelect Component

A powerful multi-selection component with search, chips/tags display, and bulk actions. Built on top of Radix UI Popover and cmdk.

## Features

- ✅ Multiple selection support
- ✅ Search/filter functionality
- ✅ Chips/tags display for selected items
- ✅ "Select All" / "Clear All" actions
- ✅ Maximum selection limit
- ✅ Keyboard navigation
- ✅ Accessible (WCAG 2.1 AA)
- ✅ React 19 compatible

## Installation

```tsx
import { MultiSelect } from '@/components/ui/multi-select';
```

## Basic Usage

```tsx
const [value, setValue] = useState<string[]>([]);

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
];

<MultiSelect
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Select frameworks..."
/>
```

## Examples

### With Preselected Values

```tsx
const [value, setValue] = useState(['react', 'vue']);

<MultiSelect
  options={options}
  value={value}
  onValueChange={setValue}
/>
```

### Max Selections Limit

```tsx
<MultiSelect
  options={options}
  value={value}
  onValueChange={setValue}
  maxSelected={3}
  placeholder="Select up to 3 items..."
/>
```

### Without Bulk Actions

```tsx
<MultiSelect
  options={options}
  value={value}
  onValueChange={setValue}
  showActions={false}
/>
```

### Disabled Options

```tsx
const options = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2', disabled: true },
];

<MultiSelect options={options} value={value} onValueChange={setValue} />
```

## API Reference

### MultiSelect

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `MultiSelectOption[]` | **required** | Options to display |
| `value` | `string[]` | `[]` | Selected values |
| `onValueChange` | `(value: string[]) => void` | - | Change handler |
| `placeholder` | `string` | `'Select options...'` | Trigger placeholder |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `emptyText` | `string` | `'No results found.'` | Empty state text |
| `maxSelected` | `number` | - | Max number of selections |
| `disabled` | `boolean` | `false` | Disabled state |
| `showActions` | `boolean` | `true` | Show Select/Clear All |
| `className` | `string` | - | Additional CSS classes |

### MultiSelectOption

```tsx
interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

## Keyboard Navigation

- **↓ Arrow Down**: Move to next option
- **↑ Arrow Up**: Move to previous option
- **Enter**: Toggle selection of focused option
- **Escape**: Close popover
- **Type characters**: Search/filter options
- **Backspace**: Remove last selected item (when search is empty)

## Accessibility

- Proper `role="combobox"`
- `aria-expanded` state
- `aria-disabled` for disabled options
- Keyboard navigation support
- Screen reader announcements for selection changes
- Focus management

## Best Practices

1. **Use MultiSelect when:**
   - Users need to select multiple items from a list
   - Search/filter is needed for the list
   - Selected items need to be visible as tags

2. **Use Checkbox Group when:**
   - List is small (< 10 items)
   - No search needed
   - Items should be always visible

3. **Use Combobox when:**
   - Only single selection is needed
   - Search is primary interaction
