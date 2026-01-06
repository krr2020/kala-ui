# Combobox Component

A searchable/filterable select component with autocomplete functionality, built with Radix UI Popover and cmdk. Perfect for large datasets where users need to search through options.

## Component Architecture Guide

### When to Use Each Component

| Component | Use Case | Features | Best For |
|-----------|----------|----------|----------|
| **NativeSelect** | Simple selection | Native HTML `<select>`, mobile pickers | Forms, mobile-first, performance |
| **Select** | Custom UI selection | Radix UI, custom styling, positioning | Desktop apps, rich UI, design control |
| **Combobox** | Searchable selection | Search/filter, autocomplete, large lists | Large datasets (50+ options), search |
| **MultiSelect** | Multiple selections | Select multiple values, chips/tags | Multiple categories, tags, filters |

## Features

- ✅ Search/filter functionality
- ✅ Keyboard navigation (↑↓ arrows, type-ahead)
- ✅ Autocomplete behavior
- ✅ Large dataset support (100+ options)
- ✅ Disabled options
- ✅ Custom empty state
- ✅ Size variants (sm, default)
- ✅ React 19 compatible
- ✅ Fully accessible (WCAG 2.1 AA)

## Installation

```tsx
import { Combobox } from '@/components/ui/combobox';
```

## Basic Usage

```tsx
const [value, setValue] = useState('');

const options = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Select framework..."
/>
```

## Examples

### With Search Placeholder

```tsx
<Combobox
  options={countries}
  value={value}
  onValueChange={setValue}
  placeholder="Select country..."
  searchPlaceholder="Search countries..."
/>
```

### Large Dataset (100+ options)

```tsx
const timezones = [
  { value: 'America/New_York', label: '(GMT-05:00) Eastern Time' },
  { value: 'America/Chicago', label: '(GMT-06:00) Central Time' },
  // ... 100+ timezones
];

<Combobox
  options={timezones}
  value={value}
  onValueChange={setValue}
  searchPlaceholder="Search timezones..."
/>
```

### With Disabled Options

```tsx
const options = [
  { value: 'option1', label: 'Available Option' },
  { value: 'option2', label: 'Disabled Option', disabled: true },
];

<Combobox options={options} value={value} onValueChange={setValue} />
```

### Small Size

```tsx
<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
  size="sm"
/>
```

### Controlled Component

```tsx
const [value, setValue] = useState('next.js');

const handleChange = (newValue: string) => {
  console.log('Selected:', newValue);
  setValue(newValue);
};

<Combobox
  options={frameworks}
  value={value}
  onValueChange={handleChange}
/>
```

## API Reference

### Combobox

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `ComboboxOption[]` | **required** | Options to display |
| `value` | `string` | - | Selected value |
| `onValueChange` | `(value: string) => void` | - | Change handler |
| `placeholder` | `string` | `'Select option...'` | Trigger placeholder |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `emptyText` | `string` | `'No results found.'` | Empty state text |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | - | Additional CSS classes |
| `size` | `'sm' \| 'default'` | `'default'` | Size variant |

### ComboboxOption

```tsx
interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

## Keyboard Navigation

- **↓ Arrow Down**: Move to next option
- **↑ Arrow Up**: Move to previous option
- **Enter**: Select focused option
- **Escape**: Close popover
- **Type characters**: Search/filter options (type-ahead)
- **Tab**: Close popover and move to next element

## Accessibility

- Proper `role="combobox"` with ARIA attributes
- `aria-expanded` state management
- Keyboard navigation (arrows, enter, escape)
- Focus management and trap
- Screen reader announcements
- Type-ahead search support
- High contrast mode compatible

## Advanced: Custom Command Components

For advanced use cases, you can use the lower-level Command components:

```tsx
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/combobox';

<Command>
  <CommandInput placeholder="Type a command..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem>Profile</CommandItem>
      <CommandItem>Billing</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

## Multi-Select Support

**For multi-select functionality, you need a separate MultiSelect component.**

The Combobox is designed for single selection with search. Multi-select requires:
- Different data structure (array of values)
- Chips/tags UI for displaying selections
- "Select All" / "Clear All" actions
- Different keyboard behavior
- More complex state management

### Creating a MultiSelect Component

```tsx
// Example structure for MultiSelect (separate component needed)
interface MultiSelectProps {
  options: ComboboxOption[];
  value: string[];  // Array of selected values
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  maxSelected?: number;
}

// Usage:
<MultiSelect
  options={tags}
  value={selectedTags}
  onValueChange={setSelectedTags}
  placeholder="Select tags..."
  maxSelected={5}
/>
```

**Recommendation:** Create a separate `MultiSelect` component in `/packages/ui/src/components/multi-select/` that:
1. Uses Command/Popover primitives like Combobox
2. Manages array of selected values
3. Renders selected items as chips/tags
4. Provides remove functionality for each chip
5. Includes "Select All" and "Clear All" options

## Form Integration

### With React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form';

const { control, handleSubmit } = useForm();

<Controller
  name="framework"
  control={control}
  render={({ field }) => (
    <Combobox
      options={frameworks}
      value={field.value}
      onValueChange={field.onChange}
    />
  )}
/>
```

### With Validation

```tsx
const [value, setValue] = useState('');
const [error, setError] = useState('');

const handleChange = (newValue: string) => {
  setValue(newValue);
  if (!newValue) {
    setError('Please select an option');
  } else {
    setError('');
  }
};

<div>
  <Combobox
    options={options}
    value={value}
    onValueChange={handleChange}
  />
  {error && <p className="text-destructive text-sm mt-1">{error}</p>}
</div>
```

## Performance Optimization

### Large Datasets

The Combobox uses `cmdk` which is optimized for large lists:

```tsx
// Works efficiently even with 1000+ options
const countries = [...]; // 200+ countries

<Combobox
  options={countries}
  value={value}
  onValueChange={setValue}
  searchPlaceholder="Search 200+ countries..."
/>
```

### Virtualization

For extremely large datasets (10,000+ items), consider:
1. Server-side filtering/pagination
2. Debounced search
3. Limit initial render to first 100 items

```tsx
const [filteredOptions, setFilteredOptions] = useState(allOptions.slice(0, 100));

const handleSearch = useMemo(
  () =>
    debounce((search: string) => {
      const filtered = allOptions.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredOptions(filtered.slice(0, 100));
    }, 300),
  [allOptions]
);
```

## Comparison: Select vs Combobox

| Feature | Select | Combobox |
|---------|--------|----------|
| Search | ❌ No | ✅ Yes |
| Filter | ❌ No | ✅ Yes |
| Large datasets | ⚠️ Ok (< 50) | ✅ Great (100+) |
| Keyboard nav | ✅ Arrows only | ✅ Arrows + search |
| Bundle size | Smaller | Larger (+cmdk) |
| Performance | Faster | Fast |
| Use case | Simple selection | Searchable selection |

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (responsive)

## Styling

Follows design system with Tailwind CSS:
- Border: `border`
- Focus: `ring`
- Hover: `bg-accent`
- Selected: Check icon with accent color
- Height: `h-9` (default), `h-8` (sm)

## Dependencies

- `@radix-ui/react-popover`: Popover positioning
- `cmdk`: Command palette / search functionality
- `lucide-react`: Icons (Check, ChevronsUpDown)

## Testing

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './combobox';

it('filters options on search', async () => {
  const user = userEvent.setup();
  render(<Combobox options={options} />);
  
  await user.click(screen.getByRole('combobox'));
  await user.type(screen.getByPlaceholderText('Search...'), 'option 2');
  
  await waitFor(() => {
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
});
```

## Migration from Select

If you need search functionality:

```tsx
// Before (Select - no search)
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    {options.map(opt => (
      <SelectItem value={opt.value}>{opt.label}</SelectItem>
    ))}
  </SelectContent>
</Select>

// After (Combobox - with search)
<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Select..."
/>
```

## Best Practices

1. **Use Combobox when:**
   - 50+ options to choose from
   - Users need to search/filter
   - Autocomplete behavior needed
   - Large datasets (countries, timezones, etc.)

2. **Use Select when:**
   - Less than 50 options
   - No search needed
   - Simple dropdown selection

3. **Use NativeSelect when:**
   - Mobile-first design
   - Simple form input
   - Performance critical
   - No custom styling needed

4. **Create MultiSelect when:**
   - Multiple selections needed
   - Tags/categories selection
   - Filter chips interface
   - "Select All" functionality needed
