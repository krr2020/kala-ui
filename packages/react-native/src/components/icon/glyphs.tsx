import type { ReactNode } from "react";
import { Circle, Line, Path, Polyline, Rect, Svg } from "react-native-svg";
import type { IconComponent } from "./icon.types";

/** Kala's built-in, dependency-free RN glyph set — 24×24 stroke geometry aligned with the web glyphs; any `{size, color}` icon component satisfies IconComponent, these are the defaults. */

type GlyphProps = { size?: number; color?: string; testID?: string };

function Base({
	size = 24,
	color = "#000",
	children,
	...rest
}: GlyphProps & { children: ReactNode }) {
	return (
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			{...rest}
		>
			{children}
		</Svg>
	);
}

export const AlertCircle: IconComponent = (props) => (
	<Base {...props}>
		<Circle cx="12" cy="12" r="10" />
		<Line x1="12" x2="12" y1="8" y2="12" />
		<Line x1="12" x2="12.01" y1="16" y2="16" />
	</Base>
);

export const AlertTriangle: IconComponent = (props) => (
	<Base {...props}>
		<Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
		<Path d="M12 9v4" />
		<Path d="M12 17h.01" />
	</Base>
);

export const Calendar: IconComponent = (props) => (
	<Base {...props}>
		<Path d="M8 2v3" />
		<Path d="M16 2v3" />
		<Rect x="3" y="3" width="18" height="18" rx="2" />
		<Path d="M3 9h18" />
	</Base>
);

export const Check: IconComponent = (props) => (
	<Base {...props}>
		<Path d="M20 6 9 17l-5-5" />
	</Base>
);

export const CheckCircle2: IconComponent = (props) => (
	<Base {...props}>
		<Circle cx="12" cy="12" r="10" />
		<Path d="m16 9-5.5 5.5L8 12" />
	</Base>
);

export const ChevronDown: IconComponent = (props) => (
	<Base {...props}>
		<Path d="m6 9 6 6 6-6" />
	</Base>
);

export const ChevronLeft: IconComponent = (props) => (
	<Base {...props}>
		<Path d="m15 18-6-6 6-6" />
	</Base>
);

export const ChevronRight: IconComponent = (props) => (
	<Base {...props}>
		<Path d="m9 18 6-6-6-6" />
	</Base>
);

export const ChevronUp: IconComponent = (props) => (
	<Base {...props}>
		<Path d="m18 15-6-6-6 6" />
	</Base>
);

export const Copy: IconComponent = (props) => (
	<Base {...props}>
		<Rect x="8" y="8" width="14" height="14" rx="2" ry="2" />
		<Path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
	</Base>
);

export const Inbox: IconComponent = (props) => (
	<Base {...props}>
		<Polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
		<Path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
	</Base>
);

export const Info: IconComponent = (props) => (
	<Base {...props}>
		<Circle cx="12" cy="12" r="10" />
		<Path d="M12 16v-4" />
		<Path d="M12 8h.01" />
	</Base>
);

export const Loader2: IconComponent = (props) => (
	<Base {...props}>
		<Path d="M21 12a9 9 0 1 1-6.219-8.56" />
	</Base>
);

export const Lock: IconComponent = (props) => (
	<Base {...props}>
		<Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
		<Path d="M7 11V7a5 5 0 0 1 10 0v4" />
	</Base>
);

export const Minus: IconComponent = (props) => (
	<Base {...props}>
		<Path d="M5 12h14" />
	</Base>
);

export const Plus: IconComponent = (props) => (
	<Base {...props}>
		<Path d="M5 12h14" />
		<Path d="M12 5v14" />
	</Base>
);

export const Star: IconComponent = (props) => (
	<Base {...props}>
		<Path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
	</Base>
);

export const X: IconComponent = (props) => (
	<Base {...props}>
		<Path d="M18 6 6 18" />
		<Path d="m6 6 12 12" />
	</Base>
);
