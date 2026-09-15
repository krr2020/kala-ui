import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface AppShellProps {
	/** Screen content; verbatim inside the content region. */
	children: ReactNode;
	/** Optional header node (usually <Header/>), pinned above the content. */
	header?: ReactNode;
	/** Optional tab bar node (usually <TabBar/>), pinned below the content. */
	tabBar?: ReactNode;
	/** Wraps ONLY the content region in a ScrollView; chrome never scrolls. */
	scrollable?: boolean;
	style?: StyleProp<ViewStyle>;
	/** Slot overrides: root wins over the library surface and `style`. */
	styles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}
