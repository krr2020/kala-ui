import type { ReactElement } from "react";
import { ButtonDemo } from "./button-demo";

// Per-component demo screens: one route per component so every variation
// of that component is visible on a single screen. Grouped routes above
// retire one entry at a time as components land here.
export interface ComponentDemo {
	name: string;
	title: string;
	render: () => ReactElement;
}

export const componentDemos: ComponentDemo[] = [
	{ name: "button", title: "Button", render: () => <ButtonDemo /> },
];
