---
"@kala-ui/react-native": minor
"@kala-ui/react-native-app": minor
---

First content release of the native pair (0.x pre mode: minor is the breaking bump).

@kala-ui/react-native — the port completes: Calendar, DatePicker, TimePicker (hand-rolled date math, zero new runtime deps), Combobox, MultiSelect, Timeline, TagInput, ContextMenu, DropdownMenu (ActionSheet pattern), InputOtp, PasswordStrengthIndicator, Steps, AvatarGroup, RingProgress, LoadingOverlay, ErrorBoundary, CopyButton, Field, Select, NumberInput, and the List family.

Breaking (mobile-scope re-scope, `6677aa1`): Breadcrumbs, Pagination, Toolbar, and Table are removed — web-only idioms; the table role lives in `@kala-ui/react-native-app`'s DataTable. InputGroup stays unported: `TextInput`'s `leftSection`/`rightSection` is the native equivalent.

@kala-ui/react-native-app — new package: AppShell, Header, TabBar (+ skeletons), BarChart, DonutChart, Sparkline, ChartSkeleton, read-only DataTable (+ skeleton), MetricCard (+ skeleton). Zero new third-party runtime deps beyond the `@kala-ui/react-native` workspace link.
