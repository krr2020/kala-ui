# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- **DataTable**: Server-side data fetching support with callbacks
  - `onSortChange` callback for server-side sorting
  - `onFilterChange` callback for server-side filtering
  - `pagination.onChange` callback for server-side pagination
  - `searchable.onChange` callback for server-side search
  - Pagination now respects `pagination.total` prop for accurate page counts
  - New Storybook example: "Server-Side Data Fetching"
  - Updated documentation with server-side examples

### 0.1.0 - 2025-01-06

#### Added
- Initial release of Kala UI React component library
- 65+ accessible components built with Radix UI primitives
- Tailwind CSS integration with design tokens
- Full TypeScript support
- Storybook documentation
- Comprehensive test coverage

#### Components
- Accordion
- Alert
- Alert Dialog
- Avatar
- Badge
- Banner
- Button
- Calendar
- Command
- Combobox
- Charts
- Checkbox
- Date Picker
- Dialog
- Drawer
- Dropdown Menu
- Empty State
- Field
- File Upload
- Footer
- Header
- Input
- Input Group
- Input OTP
- Label
- List
- Navigation
- DND
- Menubar
- Navigation Menu
- Page Transition
- Pagination
- Steps
- Slider
- Toast
- Popover
- Progress
- Radio Group
- Resizable
- Select
- Separator
- Scroll Area
- Skeleton
- Skeleton Fade
- Skip to Content
- Social Login Button
- Social Login Buttons
- Sparkline Chart
- Spinner
- Switch
- Table
- Table Skeleton
- Data Table
- Tabs
- Tag Input
- Textarea
- Tooltip
- Toggle
- Password Strength Indicator
- Card
- Metric Card
- Multi Select
- Sidebar
- Breadcrumbs
- User Menu Dropdown
- Session Card
- Loading
- Error Boundary

#### Features
- Accessibility-first design with Radix UI primitives
- Dark mode support via CSS variables
- Modular component architecture
- Customizable via Tailwind CSS
- Type-safe with TypeScript
- Comprehensive testing with Vitest

#### Documentation
- Interactive Storybook stories
- Component usage examples
- Props documentation
