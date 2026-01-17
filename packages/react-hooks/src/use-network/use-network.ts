import { useCallback, useEffect, useState } from "react";
import { useWindowEvent } from "../use-window-event/use-window-event";

interface NetworkStatus {
	online: boolean;
	downlink?: number;
	effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
	saveData?: boolean;
	rtt?: number;
}

// biome-ignore lint/suspicious/noExplicitAny: Support non-standard navigator properties
function getConnection(): any {
	if (typeof navigator === "undefined") {
		return {};
	}

	// biome-ignore lint/suspicious/noExplicitAny: Support non-standard navigator properties
	const _navigator = navigator as any;
	return (
		_navigator.connection ||
		_navigator.mozConnection ||
		_navigator.webkitConnection
	);
}

function getNetworkStatus(): NetworkStatus {
	if (typeof navigator === "undefined") {
		return { online: true };
	}

	const connection = getConnection();
	return {
		online: navigator.onLine,
		downlink: connection?.downlink,
		effectiveType: connection?.effectiveType,
		saveData: connection?.saveData,
		rtt: connection?.rtt,
	};
}

/**
 * Returns network status
 *
 * @example
 * ```tsx
 * const status = useNetwork();
 * ```
 */
export function useNetwork(): NetworkStatus {
	const [status, setStatus] = useState<NetworkStatus>(getNetworkStatus());
	const handleConnectionChange = useCallback(
		() => setStatus(getNetworkStatus()),
		[],
	);

	useWindowEvent("online", handleConnectionChange);
	useWindowEvent("offline", handleConnectionChange);

	useEffect(() => {
		const connection = getConnection();
		if (connection) {
			connection.addEventListener("change", handleConnectionChange);
			return () =>
				connection.removeEventListener("change", handleConnectionChange);
		}
	}, [handleConnectionChange]);

	return status;
}
