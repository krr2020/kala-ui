/**
 * Internal per-variant skeleton row for the List loading arm. Not part
 * of the public surface.
 */
import type { ReactElement, ReactNode } from "react";
import { View } from "react-native";
import { Skeleton } from "../skeleton";
import { SKELETON } from "./list.styles";
import type { ListSkeletonConfig } from "./list.types";

export function SkeletonRow({
	variant,
	dense,
}: {
	variant: ListSkeletonConfig["variant"];
	dense: boolean;
}) {
	const lineH = dense ? SKELETON.lineH.dense : SKELETON.lineH.regular;
	const avatar = (
		<Skeleton
			variant="circle"
			style={{
				width: SKELETON.avatarCircle,
				height: SKELETON.avatarCircle,
			}}
		/>
	);
	const line = (width: `${number}%` | number): ReactElement => (
		<Skeleton style={{ height: lineH, width }} />
	);
	const body = (children: ReactNode): ReactElement => (
		<View style={{ flex: 1, gap: dense ? 3 : 5 }}>{children}</View>
	);
	const icon = (
		<Skeleton
			variant="circle"
			style={{
				width: dense ? SKELETON.iconCircle.dense : SKELETON.iconCircle.regular,
				height: dense ? SKELETON.iconCircle.dense : SKELETON.iconCircle.regular,
			}}
		/>
	);
	return (
		<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
			{variant === "withAvatar" ? avatar : null}
			{variant === "withIcon" ? icon : null}
			{variant === "multiLine"
				? body(
						<>
							{line("75%" as const)}
							{line("50%" as const)}
						</>,
					)
				: null}
			{variant === "simple" ||
			variant === "withAvatar" ||
			variant === "withIcon"
				? body(line("60%" as const))
				: null}
			{variant === "withBadge" ? body(line("65%" as const)) : null}
			{variant === "withBadge" ? line(48) : null}
		</View>
	);
}
