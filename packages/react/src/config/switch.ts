export const switchStyles = {
	base: "cursor-pointer peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all focus-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
};

export const switchThumbStyles = {
	base: "bg-card pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
};
