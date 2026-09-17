import type { ReactElement } from "react";
import { useState } from "react";
import { Image, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { IMAGE } from "./card.styles";
import type { CardImageProps } from "./card.types";

export function CardImage({
	source,
	alt,
	flush,
	style,
	slotStyles,
	testID = "k-card-image",
}: CardImageProps): ReactElement {
	// `flush` is consumed by the parent Card's clip logic (groupMedia),
	// not by the image itself — destructured here so the prop is an
	// explicit part of the component's signature.
	void flush;
	const { theme } = useUnistyles();
	const [failed, setFailed] = useState(false);
	const composed = [IMAGE, applySlot(applySlot({}, style), slotStyles?.root)];
	if (failed) {
		// A dead source must not leave an empty unstyled box — keep the
		// image geometry and degrade to the muted surface.
		return (
			<View
				testID={`${testID}-fallback`}
				style={[...composed, { backgroundColor: theme.muted }]}
			/>
		);
	}
	return (
		<Image
			testID={testID}
			source={source}
			accessibilityRole="image"
			accessibilityLabel={alt}
			resizeMode="cover"
			style={composed}
			onError={() => setFailed(true)}
		/>
	);
}
