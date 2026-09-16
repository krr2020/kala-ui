# @kala-ui/react-native

Token-driven theming and UI components for kala-ui on React Native and
Expo. Themes are transcribed from the web token source of truth and
delivered through
[react-native-unistyles](https://github.com/jpudysz/react-native-unistyles)
3.3 — every component reads its colors from the active theme, so switching
themes restyles the whole app at once.

## Installation

```bash
pnpm add @kala-ui/react-native react-native-unistyles
```

Peer dependencies: `react` ≥ 19.2, `react-native` ≥ 0.86,
`react-native-unistyles` 3.3, plus `lucide-react-native`,
`react-native-gesture-handler`, `react-native-reanimated`, and
`react-native-svg` for the components that use them.

## Theme setup

Register the kala themes with Unistyles once, before any component renders:

```ts
import { themes } from "@kala-ui/react-native/themes";
import { StyleSheet } from "react-native-unistyles";

StyleSheet.configure({
	themes,
	settings: {
		initialTheme: "light",
	},
});
```

Built-in themes: `light`, `dark`, `highContrastLight`, `highContrastDark`
(the `themeNames` export lists them). Switch at runtime with
`UnistylesRuntime.setTheme("dark")`.

## Usage

```tsx
import { Avatar, Button } from "@kala-ui/react-native";

export function SaveButton() {
	return <Button onPress={() => {}}>Save</Button>;
}
```

## Styling components

Every component takes two styling props with different jobs:

- **`style`** — the classic React Native prop. It styles the component's
  outer container and is meant for layout in the parent (margins,
  positioning). It cannot reach inner parts.
- **`slotStyles`** — a slot-override object with one key per internal
  part. Each slot merges on top of the library defaults for that part;
  nothing is replaced wholesale.

```tsx
<Avatar
	name="Ada Lovelace"
	status="online"
	style={{ marginRight: 8 }}
	slotStyles={{
		root: { borderWidth: 1 },              // outer container
		image: { borderRadius: 12 },           // the photo
		fallback: { backgroundColor: "gold" }, // initials tile
		status: { width: 14, height: 14 },     // corner dot
	}}
/>
```

Precedence on the root is `library defaults → style → slotStyles.root` —
the slot entry always wins. Inner parts follow
`library defaults → slotStyles.<slot>`.

**When to use which.** Reach for `style` when the parent is speaking:
margins, positioning, flex sizing in the screen's layout. Reach for
`slotStyles` when you are re-skinning the library's own parts. Keeping
the channels separate means a design-system wrapper's `slotStyles` and
an app screen's `style` never fight over the same keys. Each slot entry
is also typed to its host element — `Avatar`'s `image` slot takes
`ImageStyle`, `Alert`'s `title` slot takes `TextStyle` — so tsc flags
styling a part with keys its element cannot honor.

Slot keys mirror the component's stable `k-*` testIDs (`k-avatar`,
`k-avatar-fallback`, …), so anything you can style you can also target in
tests and E2E flows.

## TestIDs

Every component renders a stable `k-<name>` testID root (e.g. `k-avatar`,
`k-avatar-group`) plus `k-<name>-<part>` markers for its inner slots.
These are part of the public contract — rely on them in unit tests and
Maestro flows.
