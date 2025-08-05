/** Successful result */
export const formatSuccess = (user, action = "Operation") => {
	// user is undefined for logout; guard username
	const username = user?.get?.("username");
	const who = username ? ` for username: ${username}` : "";
	return {
		user: user ?? null,
		error: null,
		message: `${action} successful${who}`,
	};
};

/** Error result — preserves code and uses a friendly message */
export const formatError = (err, messageOverride) => {
	const code = err?.code ?? null;
	const message = messageOverride ?? err?.message ?? "Unknown error";
	return {
		user: null,
		error: { code, message },
		message, // user-facing
	};
};
