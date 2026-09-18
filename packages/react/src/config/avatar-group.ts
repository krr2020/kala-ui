/** AvatarGroup styles — per-part base classes keyed by slotStyles part name. */
export const avatarGroupStyles = {
	root: "flex items-center",
	ring: "ring-2 ring-background -ml-2 first:ml-0 transition-transform hover:z-10 hover:-translate-y-0.5",
	overflow: "ring-2 ring-background -ml-2",
} as const;
