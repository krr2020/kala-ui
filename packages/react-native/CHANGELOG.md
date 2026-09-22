# @kala-ui/react-native

## 0.1.0-beta.1

### Minor Changes

- 6417fed: First content release of the native pair (0.x pre mode: minor is the breaking bump).
  
  @kala-ui/react-native — the port completes: Calendar, DatePicker, TimePicker (hand-rolled date math, zero new runtime deps), Combobox, MultiSelect, Timeline, TagInput, ContextMenu, DropdownMenu (ActionSheet pattern), InputOtp, PasswordStrengthIndicator, Steps, AvatarGroup, RingProgress, LoadingOverlay, ErrorBoundary, CopyButton, Field, Select, NumberInput, and the List family.
  
  Breaking (mobile-scope re-scope, `6677aa1`): Breadcrumbs, Pagination, Toolbar, and Table are removed — web-only idioms; the table role lives in `@kala-ui/react-native-app`'s DataTable. InputGroup stays unported: `TextInput`'s `leftSection`/`rightSection` is the native equivalent.
  
  @kala-ui/react-native-app — new package: AppShell, Header, TabBar (+ skeletons), BarChart, DonutChart, Sparkline, ChartSkeleton, read-only DataTable (+ skeleton), MetricCard (+ skeleton). Zero new third-party runtime deps beyond the `@kala-ui/react-native` workspace link.

### Patch Changes

- c6adde5: Fix declared slotStyles being ignored or merged in the wrong order across native components. `slotStyles.root` now outranks the legacy `style` prop in Sheet, ContextMenu, and Indicator (previously inverted); the loading/read-only arms of DatePicker, DateRangePicker, Slider, TimePicker, Rating, and EmptyState keep applying their declared slots; Calendar's `day` and RadioGroup's `item` slots now actually reach their surfaces; Dialog Body/Header/Footer apply `slotStyles.root` slot-last.
