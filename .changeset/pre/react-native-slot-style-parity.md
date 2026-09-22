---
"@kala-ui/react-native": patch
"@kala-ui/react-native-app": patch
---

Fix declared slotStyles being ignored or merged in the wrong order across native components. `slotStyles.root` now outranks the legacy `style` prop in Sheet, ContextMenu, and Indicator (previously inverted); the loading/read-only arms of DatePicker, DateRangePicker, Slider, TimePicker, Rating, and EmptyState keep applying their declared slots; Calendar's `day` and RadioGroup's `item` slots now actually reach their surfaces; Dialog Body/Header/Footer apply `slotStyles.root` slot-last.
