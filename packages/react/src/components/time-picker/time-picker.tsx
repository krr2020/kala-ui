"use client";

import { useUncontrolled } from "@kala-ui/react-hooks";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";
import type { TimePickerProps, TimeValue } from "./time-picker.types";

const pad = (n: number) => String(n).padStart(2, "0");

function TimeColumn({
	values,
	selected,
	onSelect,
	disabled,
	label,
}: {
	values: number[];
	selected: number;
	onSelect: (v: number) => void;
	disabled?: boolean;
	label: string;
}) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	// First alignment happens before user interaction — jump without
	// animation so opening the picker doesn't visibly scroll.
	const isFirstAlignRef = React.useRef(true);

	// Scrolls ONLY the column viewport. Native scrollIntoView would also
	// scroll every ancestor up to the page.
	React.useLayoutEffect(() => {
		const container = containerRef.current;
		const selectedEl = container?.querySelector<HTMLButtonElement>(
			"[data-selected='true']",
		);
		if (!container || !selectedEl) return;

		const containerRect = container.getBoundingClientRect();
		const elementRect = selectedEl.getBoundingClientRect();
		const delta =
			elementRect.top -
			containerRect.top -
			(container.clientHeight - elementRect.height) / 2;

		if (typeof container.scrollTo === "function") {
			container.scrollTo({
				top: container.scrollTop + delta,
				behavior: isFirstAlignRef.current ? "auto" : "smooth",
			});
		} else {
			container.scrollTop += delta;
		}
		isFirstAlignRef.current = false;
	}, [selected]);

	return (
		<div className="flex flex-col items-center gap-1 min-w-0">
			<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
				{label}
			</span>
			<div
				ref={containerRef}
				className="h-[160px] overflow-y-auto scrollbar-none flex flex-col gap-0.5 px-1"
				style={{ scrollbarWidth: "none" }}
			>
				{values.map((v) => (
					<button
						key={v}
						type="button"
						data-selected={v === selected ? "true" : undefined}
						disabled={disabled}
						onClick={() => onSelect(v)}
						className={cn(
							"w-10 h-8 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							v === selected
								? "bg-primary text-primary-foreground"
								: "text-foreground hover:bg-accent hover:text-accent-foreground",
							disabled && "opacity-50 cursor-not-allowed",
						)}
					>
						{pad(v)}
					</button>
				))}
			</div>
		</div>
	);
}

function TimePicker({
	value,
	defaultValue,
	onValueChange,
	hourCycle = 24,
	showSeconds = false,
	disabled = false,
	hasError = false,
	isLoading = false,
	className,
}: TimePickerProps) {
	const [current, commit] = useUncontrolled<TimeValue>({
		value,
		defaultValue: defaultValue ?? { hours: 0, minutes: 0, seconds: 0 },
		onChange: onValueChange,
	});
	// Derived, never stored: AM/PM always mirrors the effective value, so a
	// controlled value crossing the noon boundary can't leave a stale toggle.
	const period: "AM" | "PM" = current.hours < 12 ? "AM" : "PM";

	const hours24 = Array.from({ length: 24 }, (_, i) => i);
	const hours12 = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
	const minutes = Array.from({ length: 60 }, (_, i) => i);
	const seconds = Array.from({ length: 60 }, (_, i) => i);

	const displayHour =
		hourCycle === 12
			? current.hours === 0
				? 12
				: current.hours > 12
					? current.hours - 12
					: current.hours
			: current.hours;

	const handleHourSelect = (h: number) => {
		let h24 = h;
		if (hourCycle === 12) {
			if (period === "AM") {
				h24 = h === 12 ? 0 : h;
			} else {
				h24 = h === 12 ? 12 : h + 12;
			}
		}
		commit({ ...current, hours: h24 });
	};

	const handlePeriodToggle = () => {
		const h24 =
			period === "AM"
				? current.hours < 12
					? current.hours + 12
					: current.hours
				: current.hours >= 12
					? current.hours - 12
					: current.hours;
		commit({ ...current, hours: h24 });
	};

	if (isLoading) {
		return (
			<Skeleton className={cn("h-[216px] w-full rounded-md", className)} />
		);
	}

	return (
		<div
			data-slot="time-picker"
			className={cn(
				"inline-flex flex-col rounded-md border bg-card p-3 kala-surface-input",
				hasError && "border-destructive",
				disabled && "opacity-50",
				className,
			)}
		>
			<div className="flex gap-2 items-start">
				<TimeColumn
					label="HH"
					values={hourCycle === 12 ? hours12 : hours24}
					selected={displayHour}
					onSelect={handleHourSelect}
					disabled={disabled}
				/>

				<div className="flex items-center self-center mt-5 text-muted-foreground font-bold text-lg select-none">
					:
				</div>

				<TimeColumn
					label="MM"
					values={minutes}
					selected={current.minutes}
					onSelect={(m) => commit({ ...current, minutes: m })}
					disabled={disabled}
				/>

				{showSeconds && (
					<>
						<div className="flex items-center self-center mt-5 text-muted-foreground font-bold text-lg select-none">
							:
						</div>
						<TimeColumn
							label="SS"
							values={seconds}
							selected={current.seconds ?? 0}
							onSelect={(s) => commit({ ...current, seconds: s })}
							disabled={disabled}
						/>
					</>
				)}

				{hourCycle === 12 && (
					<div className="flex flex-col gap-1 mt-6 ml-1">
						<button
							type="button"
							disabled={disabled}
							onClick={handlePeriodToggle}
							aria-pressed={period === "AM"}
							className={cn(
								"w-10 h-8 rounded-md text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								period === "AM"
									? "bg-primary text-primary-foreground"
									: "text-foreground hover:bg-accent",
								disabled && "cursor-not-allowed",
							)}
						>
							AM
						</button>
						<button
							type="button"
							disabled={disabled}
							onClick={handlePeriodToggle}
							aria-pressed={period === "PM"}
							className={cn(
								"w-10 h-8 rounded-md text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								period === "PM"
									? "bg-primary text-primary-foreground"
									: "text-foreground hover:bg-accent",
								disabled && "cursor-not-allowed",
							)}
						>
							PM
						</button>
					</div>
				)}
			</div>

			<div className="mt-2 pt-2 border-t text-center text-sm font-mono text-muted-foreground">
				{hourCycle === 12
					? `${pad(displayHour)}:${pad(current.minutes)}${showSeconds ? `:${pad(current.seconds ?? 0)}` : ""} ${period}`
					: `${pad(current.hours)}:${pad(current.minutes)}${showSeconds ? `:${pad(current.seconds ?? 0)}` : ""}`}
			</div>
		</div>
	);
}

export { TimePicker };
