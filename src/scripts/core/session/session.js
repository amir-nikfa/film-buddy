import Parse from "parse";
import {
	getErrorMessage,
} from "./messageFormatter.js";
import { isSessionExpiredError } from "./errorTypes.js";

export const restoreSession = async (context) => {
	const user = await Parse.User.currentAsync();

	if (user) {
		try {
			await user.fetch();
		} catch (error) {
			if (isSessionExpiredError(error)) {
				try {
					await Parse.User.logOut();
				} catch (logoutErr) {
					console.error("[session] " + logoutErr.message);
					const msg = getErrorMessage(logoutErr, context);
					return {
						error: logoutErr,
						errorMessage:
							"[session] Session expired, unable to log-out: " +
							msg,
						user: null,
					};
				}

				const msg = getErrorMessage(error, context);
				return {
					error,
					errorMessage: msg,
					user: null,
				};
			}

			const msg = getErrorMessage(error, context);
			return {
				error,
				errorMessage: msg,
				user: null,
			};
		}
	}

	return {
		error: null,
		user,
	};
};

export const getCurrentUser = () => {
	const user = Parse.User.current();
	return user ?? null; // explicit for clarity
};

