import type * as React from "react";
import type { KalaIconProps } from "./icons.types";

/** Kala's built-in, dependency-free glyph set — 24×24 stroke geometry aligned with the lucide paths these replace; glyphs inherit `currentColor`, size via `size` or CSS, and serve as defaults for component `*Icon` slots. */

function Base({ size = 24, children, ...props }: KalaIconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			focusable="false"
			{...props}
		>
			{children}
		</svg>
	);
}

export function AlertCircle(props: KalaIconProps) {
	return (
		<Base {...props}>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" x2="12" y1="8" y2="12" />
			<line x1="12" x2="12.01" y1="16" y2="16" />
		</Base>
	);
}

export function AlertTriangle(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
			<path d="M12 9v4" />
			<path d="M12 17h.01" />
		</Base>
	);
}

export function ArrowDown(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M12 5v14" />
			<path d="m19 12-7 7-7-7" />
		</Base>
	);
}

export function ArrowUp(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="m5 12 7-7 7 7" />
			<path d="M12 19V5" />
		</Base>
	);
}

export function ArrowUpDown(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="m21 16-4 4-4-4" />
			<path d="M17 20V4" />
			<path d="m3 8 4-4 4 4" />
			<path d="M7 4v16" />
		</Base>
	);
}

export function Bell(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M10.268 21a2 2 0 0 0 3.464 0" />
			<path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
		</Base>
	);
}

export function Calendar(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M8 2v3" />
			<path d="M16 2v3" />
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<path d="M3 9h18" />
		</Base>
	);
}

export function Check(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M20 6 9 17l-5-5" />
		</Base>
	);
}

export function CheckCircle2(props: KalaIconProps) {
	return (
		<Base {...props}>
			<circle cx="12" cy="12" r="10" />
			<path d="m16 9-5.5 5.5L8 12" />
		</Base>
	);
}

export function ChevronDown(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="m6 9 6 6 6-6" />
		</Base>
	);
}

export function ChevronLeft(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="m15 18-6-6 6-6" />
		</Base>
	);
}

export function ChevronRight(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="m9 18 6-6-6-6" />
		</Base>
	);
}

export function ChevronUp(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="m18 15-6-6-6 6" />
		</Base>
	);
}

export function ChevronsUpDown(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="m7 15 5 5 5-5" />
			<path d="m7 9 5-5 5 5" />
		</Base>
	);
}

export function Circle(props: KalaIconProps) {
	return (
		<Base {...props}>
			<circle cx="12" cy="12" r="10" />
		</Base>
	);
}

export function CloudUpload(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M12 13v8" />
			<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
			<path d="m8 17 4-4 4 4" />
		</Base>
	);
}

export function Copy(props: KalaIconProps) {
	return (
		<Base {...props}>
			<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
		</Base>
	);
}

export function Eye(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
			<circle cx="12" cy="12" r="3" />
		</Base>
	);
}

export function EyeOff(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
			<path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
			<path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
			<path d="m2 2 20 20" />
		</Base>
	);
}

export function Clock(props: KalaIconProps) {
	return (
		<Base {...props}>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 6v6l4 2" />
		</Base>
	);
}

export function File(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
			<path d="M14 2v5a1 1 0 0 0 1 1h5" />
		</Base>
	);
}

export function Filter(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
		</Base>
	);
}

export function HelpCircle(props: KalaIconProps) {
	return (
		<Base {...props}>
			<circle cx="12" cy="12" r="10" />
			<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
			<path d="M12 17h.01" />
		</Base>
	);
}

export function Inbox(props: KalaIconProps) {
	return (
		<Base {...props}>
			<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
			<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
		</Base>
	);
}

export function Info(props: KalaIconProps) {
	return (
		<Base {...props}>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 16v-4" />
			<path d="M12 8h.01" />
		</Base>
	);
}

export function Loader2(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</Base>
	);
}

export function Lock(props: KalaIconProps) {
	return (
		<Base {...props}>
			<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
			<path d="M7 11V7a5 5 0 0 1 10 0v4" />
		</Base>
	);
}

export function LogOut(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="m16 17 5-5-5-5" />
			<path d="M21 12H9" />
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
		</Base>
	);
}

export function MapPin(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
			<circle cx="12" cy="10" r="3" />
		</Base>
	);
}

export function Menu(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M4 5h16" />
			<path d="M4 12h16" />
			<path d="M4 19h16" />
		</Base>
	);
}

export function MoreHorizontal(props: KalaIconProps) {
	return (
		<Base {...props}>
			<circle cx="12" cy="12" r="1" />
			<circle cx="19" cy="12" r="1" />
			<circle cx="5" cy="12" r="1" />
		</Base>
	);
}

export function Monitor(props: KalaIconProps) {
	return (
		<Base {...props}>
			<rect width="20" height="14" x="2" y="3" rx="2" />
			<line x1="8" x2="16" y1="21" y2="21" />
			<line x1="12" x2="12" y1="17" y2="21" />
		</Base>
	);
}

export function Minus(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M5 12h14" />
		</Base>
	);
}

export function Plus(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</Base>
	);
}

export function Search(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="m21 21-4.34-4.34" />
			<circle cx="11" cy="11" r="8" />
		</Base>
	);
}

export function Settings(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
			<circle cx="12" cy="12" r="3" />
		</Base>
	);
}

export function Smartphone(props: KalaIconProps) {
	return (
		<Base {...props}>
			<rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
			<path d="M12 18h.01" />
		</Base>
	);
}

export function Star(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
		</Base>
	);
}

export function Tablet(props: KalaIconProps) {
	return (
		<Base {...props}>
			<rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
			<line x1="12" x2="12.01" y1="18" y2="18" />
		</Base>
	);
}

export function User(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</Base>
	);
}

export function Wifi(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M12 20h.01" />
			<path d="M2 8.82a15 15 0 0 1 20 0" />
			<path d="M5 12.859a10 10 0 0 1 14 0" />
			<path d="M8.5 16.429a5 5 0 0 1 7 0" />
		</Base>
	);
}

export function X(props: KalaIconProps) {
	return (
		<Base {...props}>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</Base>
	);
}
