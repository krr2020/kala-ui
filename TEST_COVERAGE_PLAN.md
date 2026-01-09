# Test Coverage Improvement Plan

## Overview

### Current Coverage Status
- **Lines**: 51.22%
- **Functions**: 64.81%
- **Statements**: 51.22%
- **Branches**: 52.97%

### Target Coverage
- **Lines**: 90%+
- **Functions**: 90%+
- **Statements**: 90%+
- **Branches**: 90%+

### Timeline
- **Total Duration**: 8-11 weeks
- **Phase 1**: 1-2 weeks (Quick Wins)
- **Phase 2**: 2-3 weeks (Medium Complexity)
- **Phase 3**: 3-4 weeks (High Complexity)
- **Phase 4**: 2 weeks (Final Polish)

---

## Phase 1: Quick Wins
**Duration**: 1-2 weeks
**Target Coverage**: 60-65%
**Focus**: Low-hanging fruit - components with existing tests that can be easily improved.

### 1.1 Fix use-mobile.ts Hook (0% → 100%)
- [x] Create test file: `src/lib/__tests__/use-mobile.test.ts`
  - [x] Test initial state on desktop (width >= 768px)
  - [x] Test initial state on mobile (width < 768px)
  - [x] Test resize event listener is added
  - [x] Test state updates on resize from desktop to mobile
  - [x] Test state updates on resize from mobile to desktop
  - [x] Test cleanup function removes event listener
  - [x] Test multiple resize events work correctly
  - [x] Test with SSR considerations (window check)

**Result**: 87.5% line coverage, 80% branch coverage, 100% statement coverage (improved from 0%)

### 1.2 Improve Skeleton Component Coverage (0-6% → 80%+)
- [x] Test skeleton-skeleton-patterns.test.tsx coverage
  - [x] Test all skeleton pattern variants
  - [x] Test custom className prop
  - [x] Test loading state behavior
  - [x] Test animation classes
  - [x] Test accessibility attributes (aria-busy)

- [x] Test skeleton-skeleton-wrapper.test.tsx coverage
  - [x] Test loading state renders skeleton
  - [x] Test loaded state renders children
  - [x] Test smooth transition between states
  - [x] Test custom skeleton props
  - [x] Test with async data loading scenarios

- [x] Test other skeleton components
  - [x] header-skeleton.test.tsx (test all header variants)
  - [x] steps-skeleton.test.tsx (test all steps variants)
  - [x] navigation-skeleton.test.tsx (test all navigation variants)
  - [x] calendar-skeleton.test.tsx (test calendar loading state)
  - [x] tabs-skeleton.test.tsx (test tabs loading state)
  - [x] pagination-skeleton.test.tsx (test pagination loading state)
  - [x] sidebar-skeleton.test.tsx (test sidebar loading state)
  - [x] drawer-skeleton.test.tsx (test drawer loading state)
  - [x] popover-skeleton.test.tsx (test popover loading state)
  - [x] dialog-skeleton.test.tsx (test dialog loading state)
  - [x] breadcrumbs-skeleton.test.tsx (test breadcrumbs loading state)
  - [x] accordion-skeleton.test.tsx (test accordion loading state)
  - [x] form-skeleton.test.tsx (NEW - 36 tests created)

**Result**: Created form-skeleton.test.tsx with 36 comprehensive tests covering FormSkeleton and FieldGroupSkeleton components. Total skeleton tests now: 237 tests across 16 files.

### 1.3 Enhance Components Below 70% Coverage

#### 1.3.1 empty-state (52% → 80%)
- [x] Add tests for empty-state.tsx
  - [x] Test all empty-state variants
  - [x] Test custom icon rendering (LucideIcon, string, default)
  - [x] Test custom title and description
  - [x] Test action button functionality
  - [x] Test accessibility attributes (aria-hidden, data-comp)
  - [x] Test empty-state-skeleton.tsx variants
  - [x] Test size variants (default, sm, lg)
  - [x] Test loading state behavior
  - [x] Test children rendering
  - [x] Test styling and layout classes

**Result**: Created 40 tests for empty-state.tsx and 22 tests for empty-state-skeleton.tsx (62 total tests, improved from 10 tests).

#### 1.3.2 file-upload (65% → 85%)
- [x] Enhance file-upload.test.tsx
  - [x] Test all upload modes (single, multiple)
  - [x] Test drag and drop functionality
  - [x] Test file selection via click
  - [x] Test file validation (size, type)
  - [x] Test upload progress states
  - [x] Test error handling scenarios
  - [x] Test file removal functionality
  - [x] Test disabled state

**Result**: Expanded from 7 tests to 38 comprehensive tests organized into 10 describe blocks covering basic rendering, file selection via input, drag and drop, selected file display, progress bar, clear functionality, error handling, disabled state, click to upload, and file size formatting.

#### 1.3.3 resizable (66% → 85%)
- [x] Enhance resizable.test.tsx
  - [x] Test all panel directions (horizontal, vertical)
  - [x] Test resize handle interaction
  - [x] Test min/max size constraints
  - [x] Test resize handle positioning
  - [x] Test collapsed panel state
  - [x] Test default size prop behavior
  - [x] Test nested resizable panels
  - [x] Test keyboard resize controls

**Result**: Expanded from 22 tests to 48 comprehensive tests organized into 10 describe blocks covering ResizablePanelGroup (direction, props/styling), ResizablePanel (rendering/content, props/styling, size constraints, collapsible behavior), ResizableHandle (rendering, handle indicator, props/styling, callbacks), Imperative Panel API, Nested Panels, Accessibility, and Edge Cases.

#### 1.3.4 error-boundary (80% → 95%)
- [ ] Enhance error-boundary.test.tsx
  - [ ] Test error catching with React components
  - [ ] Test fallback component rendering
  - [ ] Test custom error messages
  - [ ] Test error logging functionality
  - [ ] Test reset mechanism
  - [ ] Test error-fallback.tsx component
  - [ ] Test error boundary with async errors
  - [ ] Test error boundary with nested components

#### 1.3.5 password-strength-indicator (83% → 95%)
- [ ] Enhance password-strength-indicator.test.tsx
  - [ ] Test all password strength levels
  - [ ] Test strength calculation logic
  - [ ] Test custom strength requirements
  - [ ] Test strength meter visual feedback
  - [ ] Test strength text messages
  - [ ] Test with different password scenarios
  - [ ] Test accessibility announcements

### 1.4 Fix Other Low Coverage Areas
- [ ] Test footer component (78% → 90%)
  - [ ] Test all footer variants
  - [ ] Test responsive behavior
  - [ ] Test custom content rendering

- [ ] Test pagination component (75% → 85%)
  - [ ] Test all pagination states
  - [ ] Test page range calculation
  - [ ] Test disabled edge pages
  - [ ] Test custom page sizes

- [ ] Test label component (79% → 90%)
  - [ ] Test all label variants
  - [ ] Test required indicator
  - [ ] Test disabled state
  - [ ] Test accessibility (htmlFor)

---

## Phase 2: Medium Complexity Components
**Duration**: 2-3 weeks
**Target Coverage**: 75-80%
**Focus**: Components with moderate complexity that need more comprehensive testing.

### 2.1 Navigation Components

#### 2.1.1 navigation-menu (48% → 90%)
- [ ] Enhance navigation-menu.test.tsx
  - [ ] Test keyboard navigation (Arrow keys, Tab, Escape)
  - [ ] Test focus management between menu items
  - [ ] Test dropdown menu open/close behavior
  - [ ] Test hover vs click interaction
  - [ ] Test nested menu support
  - [ ] Test custom trigger components
  - [ ] Test menu positioning
  - [ ] Test disabled menu items
  - [ ] Test accessibility (ARIA attributes, roles)
  - [ ] Test mobile responsive behavior
  - [ ] Test active state management
  - [ ] Test animation behavior

#### 2.1.2 navigation (49% → 85%)
- [ ] Enhance navigation.test.tsx
  - [ ] Test all navigation variants
  - [ ] Test active link detection
  - [ ] Test navigation with routing
  - [ ] Test mobile menu toggle
  - [ ] Test navigation-skeleton.test.tsx variants
  - [ ] Test custom link components
  - [ ] Test nested navigation items
  - [ ] Test disabled links
  - [ ] Test external link handling
  - [ ] Test accessibility (nav role, ARIA)

#### 2.1.3 breadcrumbs (65% → 90%)
- [ ] Enhance breadcrumbs.test.tsx
  - [ ] Test all breadcrumb variants
  - [ ] Test breadcrumb navigation
  - [ ] Test custom separator rendering
  - [ ] Test max items truncation
  - [ ] Test active breadcrumb state
  - [ ] Test breadcrumbs-skeleton.test.tsx variants
  - [ ] Test accessibility (breadcrumbList role)
  - [ ] Test home icon rendering
  - [ ] Test custom link components

### 2.2 Form Components

#### 2.2.1 field (50% → 90%)
- [ ] Enhance field.test.tsx
  - [ ] Test all form field types (text, email, password, number, etc.)
  - [ ] Test validation states (error, warning, success)
  - [ ] Test helper text rendering
  - [ ] Test label positioning
  - [ ] Test required field indicator
  - [ ] Test disabled state
  - [ ] Test error message display
  - [ ] Test custom field components
  - [ ] Test field-skeleton.tsx variants
  - [ ] Test accessibility (aria-invalid, aria-describedby)

#### 2.2.2 input-group (50% → 90%)
- [ ] Enhance input-group.test.tsx
  - [ ] Test all input group layouts
  - [ ] Test prefix/suffix components
  - [ ] Test multiple inputs in group
  - [ ] Test input group with buttons
  - [ ] Test vertical vs horizontal layouts
  - [ ] Test responsive behavior
  - [ ] Test custom spacing

#### 2.2.3 tag-input (69% → 90%)
- [ ] Enhance tag-input.test.tsx
  - [ ] Test adding tags (Enter key, button click)
  - [ ] Test removing tags (X button, Backspace)
  - [ ] Test duplicate tag prevention
  - [ ] Test max tags limit
  - [ ] Test custom tag rendering
  - [ ] Test tag editing functionality
  - [ ] Test tag validation
  - [ ] Test keyboard navigation within tags
  - [ ] Test accessibility (tag role, announcements)

#### 2.2.4 textarea (72% → 90%)
- [ ] Enhance textarea.test.tsx
  - [ ] Test all textarea variants
  - [ ] Test auto-resize functionality
  - [ ] Test character limit enforcement
  - [ ] Test character count display
  - [ ] Test validation states
  - [ ] Test disabled and readonly states
  - [ ] Test resize handle behavior
  - [ ] Test accessibility (aria-live for character count)

### 2.3 Table Components

#### 2.3.1 table (49% → 85%)
- [ ] Enhance table.test.tsx
  - [ ] Test all table variants
  - [ ] Test sortable columns
  - [ ] Test sorting direction indicators
  - [ ] Test column filtering
  - [ ] Test pagination integration
  - [ ] Test row selection (checkbox)
  - [ ] Test sticky header
  - [ ] Test empty table state
  - [ ] Test loading state
  - [ ] Test accessibility (aria-sort, colScope)

#### 2.3.2 data-table (71% → 90%)
- [ ] Enhance data-table.test.tsx
  - [ ] Test server-side data fetching
  - [ ] Test column visibility toggle
  - [ ] Test bulk row actions
  - [ ] Test row expansion
  - [ ] Test custom cell renderers
  - [ ] Test global search functionality
  - [ ] Test advanced filtering
  - [ ] Test data refresh functionality
  - [ ] Test error handling (fetch failures)

### 2.4 Other Medium Complexity Components

#### 2.4.1 calendar (60% → 85%)
- [ ] Enhance calendar.test.tsx
  - [ ] Test date selection (click, keyboard)
  - [ ] Test month/year navigation
  - [ ] Test range selection
  - [ ] Test disabled dates
  - [ ] Test custom date formatting
  - [ ] Test calendar-skeleton.test.tsx variants
  - [ ] Test week number display
  - [ ] Test min/max date constraints
  - [ ] Test accessibility (grid, aria-selected)

#### 2.4.2 date-picker (63% → 90%)
- [ ] Enhance date-picker.test.tsx
  - [ ] Test date picker open/close
  - [ ] Test date selection from picker
  - [ ] Test manual date input
  - [ ] Test date validation
  - [ ] Test range date selection
  - [ ] Test custom date formats
  - [ ] Test time zone handling
  - [ ] Test disabled state
  - [ ] Test accessibility (calendar button, input)

#### 2.4.3 tabs (58% → 90%)
- [ ] Enhance tabs.test.tsx
  - [ ] Test all tabs variants (horizontal, vertical)
  - [ ] Test tab switching (click, keyboard)
  - [ ] Test tab activation state
  - [ ] Test disabled tabs
  - [ ] Test dynamic tab addition/removal
  - [ ] Test tab-skeleton.test.tsx variants
  - [ ] Test custom tab content
  - [ ] Test tab list scrolling
  - [ ] Test accessibility (tab role, aria-selected)

---

## Phase 3: High Complexity Components
**Duration**: 3-4 weeks
**Target Coverage**: 85-90%
**Focus**: Complex interactive components requiring comprehensive testing.

### 3.1 Multi-Select & Dropdowns

#### 3.1.1 multi-select (46% → 90%)
- [ ] Enhance multi-select.test.tsx
  - [ ] Test single selection
  - [ ] Test multiple selection
  - [ ] Test deselect all functionality
  - [ ] Test search/filter within options
  - [ ] Test custom option rendering
  - [ ] Test selected values as chips
  - [ ] Test chip removal
  - [ ] Test keyboard navigation
  - [ ] Test virtual scrolling (many options)
  - [ ] Test accessibility (aria-multiselectable)

#### 3.1.2 combobox (64% → 90%)
- [ ] Enhance combobox.test.tsx
  - [ ] Test all combobox variants
  - [ ] Test search/filter functionality
  - [ ] Test custom option rendering
  - [ ] Test create new option feature
  - [ ] Test keyboard navigation
  - [ ] Test clear selection
  - [ ] Test disabled options
  - [ ] Test grouped options
  - [ ] Test async option loading
  - [ ] Test accessibility (aria-autocomplete)

#### 3.1.3 select (69% → 90%)
- [ ] Enhance select.test.tsx
  - [ ] Test all select variants
  - [ ] Test option selection
  - [ ] Test placeholder functionality
  - [ ] Test disabled select
  - [ ] Test custom trigger component
  - [ ] Test grouped options
  - [ ] Test keyboard navigation
  - [ ] Test select position
  - [ ] Test accessibility (role, aria-expanded)

### 3.2 Interactive Components

#### 3.2.1 slider (69% → 90%)
- [ ] Enhance slider.test.tsx
  - [ ] Test single value slider
  - [ ] Test range slider (min/max)
  - [ ] Test thumb drag interaction
  - [ ] Test keyboard controls (Arrow keys, Home, End)
  - [ ] Test step increments
  - [ ] Test min/max constraints
  - [ ] Test disabled state
  - [ ] Test slider value display
  - [ ] Test accessibility (aria-valuemin, aria-valuemax)

#### 3.2.2 resizable (66% → 90%)
- [ ] Enhance resizable.test.tsx
  - [ ] Test all panel directions (horizontal, vertical)
  - [ ] Test resize handle interaction
  - [ ] Test min/max size constraints
  - [ ] Test resize handle positioning
  - [ ] Test collapsed panel state
  - [ ] Test default size prop behavior
  - [ ] Test nested resizable panels
  - [ ] Test keyboard resize controls
  - [ ] Test resize persistence

#### 3.2.3 sidebar (68% → 90%)
- [ ] Enhance sidebar.test.tsx
  - [ ] Test sidebar open/close
  - [ ] Test collapsible sections
  - [ ] Test responsive behavior (mobile, tablet, desktop)
  - [ ] Test sidebar-skeleton.test.tsx variants
  - [ ] Test nested navigation items
  - [ ] Test active state management
  - [ ] Test custom sidebar content
  - [ ] Test sidebar width customization
  - [ ] Test keyboard navigation

#### 3.2.4 drawer (73% → 90%)
- [ ] Enhance drawer.test.tsx
  - [ ] Test drawer open/close (trigger, backdrop click, Esc)
  - [ ] Test all drawer positions (left, right, top, bottom)
  - [ ] Test drawer sizes
  - [ ] Test drawer-skeleton.test.tsx variants
  - [ ] Test nested drawer behavior
  - [ ] Test backdrop behavior
  - [ ] Test custom drawer content
  - [ ] Test drawer animations
  - [ ] Test accessibility (dialog role, aria-modal)

### 3.3 Advanced Components

#### 3.3.1 command (92% → 95%)
- [ ] Enhance command.test.tsx
  - [ ] Test command palette search
  - [ ] Test fuzzy search functionality
  - [ ] Test keyboard shortcuts (Ctrl+K, navigation)
  - [ ] Test command groups
  - [ ] Test custom command rendering
  - [ ] Test command actions
  - [ ] Test empty state
  - [ ] Test loading state
  - [ ] Test accessibility (listbox role)

#### 3.3.2 dropdown-menu (42% → 90%)
- [ ] Enhance dropdown-menu.test.tsx
  - [ ] Test all dropdown menu variants
  - [ ] Test nested submenus
  - [ ] Test dropdown positioning
  - [ ] Test menu item interactions
  - [ ] Test keyboard navigation
  - [ ] Test disabled items
  - [ ] Test menu item shortcuts
  - [ ] Test custom trigger components
  - [ ] Test accessibility (menu role, aria-haspopup)

#### 3.3.3 menubar (64% → 90%)
- [ ] Enhance menubar.test.tsx
  - [ ] Test menubar keyboard shortcuts
  - [ ] Test radio behavior within menus
  - [ ] Test checkbox menu items
  - [ ] Test menu item shortcuts display
  - [ ] Test menubar responsiveness
  - [ ] Test nested menu structure
  - [ ] Test custom menubar items
  - [ ] Test accessibility (menubar role)

### 3.4 Layout Components

#### 3.4.1 header (76% → 90%)
- [ ] Enhance header.test.tsx
  - [ ] Test all header variants
  - [ ] Test responsive behavior
  - [ ] Test mobile menu integration
  - [ ] Test header-skeleton.test.tsx variants
  - [ ] Test custom header content
  - [ ] Test header positioning
  - [ ] Test header with navigation
  - [ ] Test accessibility (banner role)

#### 3.4.2 footer (78% → 90%)
- [ ] Enhance footer.test.tsx
  - [ ] Test all footer variants
  - [ ] Test footer layouts
  - [ ] Test responsive behavior
  - [ ] Test custom footer content
  - [ ] Test footer links functionality
  - [ ] Test footer positioning
  - [ ] Test accessibility (contentinfo role)

#### 3.4.3 pagination (75% → 90%)
- [ ] Enhance pagination.test.tsx
  - [ ] Test all pagination states
  - [ ] Test page range calculation
  - [ ] Test disabled edge pages
  - [ ] Test custom page sizes
  - [ ] Test pagination-skeleton.test.tsx variants
  - [ ] Test page size selector
  - [ ] Test pagination with filters
  - [ ] Test accessibility (navigation role)

---

## Phase 4: Final Polish
**Duration**: 2 weeks
**Target Coverage**: 90%+
**Focus**: Reach 90% target, add integration tests, improve test quality.

### 4.1 Edge Case Testing
- [ ] Add accessibility tests across all components
  - [ ] Test ARIA attributes for all components
  - [ ] Test keyboard navigation for interactive components
  - [ ] Test screen reader compatibility
  - [ ] Test focus management
  - [ ] Test color contrast compliance

- [ ] Add error boundary scenarios
  - [ ] Test component crash recovery
  - [ ] Test error fallback rendering
  - [ ] Test error logging
  - [ ] Test async error handling

- [ ] Add concurrent state tests
  - [ ] Test rapid user interactions
  - [ ] Test race conditions in async operations
  - [ ] Test state update batching
  - [ ] Test unmounting during updates

### 4.2 Integration Testing
- [ ] Test component interactions
  - [ ] Test form with multiple fields (field, input-group, textarea)
  - [ ] Test multi-step flows (steps + form components)
  - [ ] Test table with pagination and filters
  - [ ] Test navigation with routing
  - [ ] Test modal workflows (dialog + form)

- [ ] Test responsive behavior
  - [ ] Test all breakpoints (mobile, tablet, desktop)
  - [ ] Test responsive layouts (sidebar, header, footer)
  - [ ] Test mobile menu interactions
  - [ ] Test responsive tables and grids

- [ ] Test theme integration
  - [ ] Test component with light/dark themes
  - [ ] Test CSS custom properties
  - [ ] Test theme switching

### 4.3 Performance & Memory Tests
- [ ] Test component unmounting and cleanup
  - [ ] Test event listener removal
  - [ ] Test timer cleanup
  - [ ] Test subscription cleanup
  - [ ] Test memory leaks

- [ ] Test large datasets
  - [ ] Test table with 1000+ rows
  - [ ] Test dropdown with 500+ options
  - [ ] Test virtualization performance
  - [ ] Test render performance

- [ ] Test animation handling
  - [ ] Test animation frame cleanup
  - [ ] Test animation state management
  - [ ] Test reduced motion preference

### 4.4 Test Quality Improvements
- [ ] Review and refactor existing tests
  - [ ] Eliminate duplicate tests
  - [ ] Consolidate similar test cases
  - [ ] Improve test readability
  - [ ] Add test comments for complex scenarios

- [ ] Add test documentation
  - [ ] Document test setup and teardown
  - [ ] Document test utilities and helpers
  - [ ] Document test patterns and conventions
  - [ ] Add examples for common test scenarios

- [ ] Ensure test determinism
  - [ ] Fix flaky tests
  - [ ] Add proper test cleanup
  - [ ] Mock external dependencies
  - [ ] Use deterministic test data

### 4.5 Coverage Threshold & CI Integration
- [ ] Update vitest.config.ts thresholds to 90%
  - [ ] Set statements: 90%
  - [ ] Set branches: 90%
  - [ ] Set functions: 90%
  - [ ] Set lines: 90%

- [ ] Set up CI/CD coverage reporting
  - [ ] Add coverage report to GitHub Actions
  - [ ] Set up coverage badge in README
  - [ ] Configure coverage notifications
  - [ ] Set up coverage trend tracking

- [ ] Add pre-commit hooks
  - [ ] Add coverage check hook
  - [ ] Add test run before commit
  - [ ] Add linting and type checking

---

## Appendix

### Testing Tools
- **Vitest**: Test runner and framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: Simulate user interactions
- **@testing-library/jest-dom**: Custom Jest matchers
- **jsdom**: DOM implementation for testing

### Test Command Reference
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for specific component
pnpm test button

# Run tests matching pattern
pnpm test -- --grep "skeleton"
```

### Coverage Report Location
- **HTML Report**: `packages/react/coverage/index.html`
- **JSON Report**: `packages/react/coverage/coverage-final.json`
- **Text Report**: Console output

### Key Testing Best Practices
1. **Test user behavior, not implementation details**
2. **Use meaningful test names that describe the behavior**
3. **Arrange-Act-Assert pattern for test structure**
4. **Test happy path and edge cases**
5. **Mock external dependencies**
6. **Keep tests isolated and independent**
7. **Use descriptive assertions**
8. **Clean up after tests**
9. **Test accessibility alongside functionality**
10. **Maintain fast test execution**

---

## Progress Tracking

### Overall Progress
- [x] 1.1 Fix use-mobile.ts Hook (0% → 87.5% line coverage)
- [x] 1.2 Improve Skeleton Component Coverage (237 tests across 16 files)
- [x] 1.3.1 empty-state (52% → 62 tests created)
- [x] 1.3.2 file-upload (7 → 38 tests created)
- [x] 1.3.3 resizable (22 → 48 tests created)
- [ ] 1.3.4 error-boundary (80% → 95%)
- [ ] 1.3.5 password-strength-indicator (83% → 95%)
- [ ] 1.4 Fix Other Low Coverage Areas
- [ ] Phase 1 Complete (60-65% coverage)
- [ ] Phase 2 Complete (75-80% coverage)
- [ ] Phase 3 Complete (85-90% coverage)
- [ ] Phase 4 Complete (90%+ coverage)

### Notes
- Update coverage numbers after each phase completion
- Document any blockers or challenges encountered
- Track time spent on each component
- Update estimates if needed based on actual progress
- **Phase 1 Progress**: 3.3 of 4 major tasks completed (82.5%)

---

**Last Updated**: January 9, 2026 (Updated with Phase 1.3.3 resizable completion)
**Next Review**: After Phase 1 completion
