/**
 * Radius table for Skeleton variants; the pulse loop stays in the
 * component because it owns the Animated value.
 */
import type { SkeletonVariant } from "./skeleton.types";

export const RADIUS: Record<SkeletonVariant, number> = { rect: 8, circle: 999 };
