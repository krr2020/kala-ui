import type * as React from "react";

/** SVG props + pixel/CSS-unit `size` — any icon-library component accepting these is a valid IconComponent (lucide, phosphor, tabler, …). */
export type KalaIconProps = React.SVGProps<SVGSVGElement> & {
	/** Icon edge length in px (or any CSS length); defaults to 24. */
	size?: number | string;
};

/** Any icon-library component renderable with kala's glyph contract — pass it via a component's `*Icon` slot. */
export type IconComponent = React.ComponentType<KalaIconProps>;
