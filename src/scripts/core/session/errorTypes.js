import Parse from "parse";

// Session error checker
export const isSessionExpiredError = (err) => {
	return (
		err?.code === Parse.Error.INVALID_SESSION_TOKEN // 209
	);
};

// Network error checker
export const isNetwork = (err) => {
	return (
		err?.code === Parse.Error.CONNECTION_FAILED || // 100
		err?.code === Parse.Error.TIMEOUT || // 124
		(typeof navigator !== "undefined" && navigator?.onLine === false)
	);
};