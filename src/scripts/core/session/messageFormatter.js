// parseError.js
import Parse from "parse";
import { isNetwork, isSessionExpiredError } from "./errorTypes";

// Message constants
export const IMPORTANT_ERROR_MESSAGE =
	"Your session expired - please log in again.";
export const OFFLINE_ERROR_MESSAGE =
	"You're offline - check your Internet connection and try again.";
export const GENERAL_ERROR_MESSAGE = "Something went wrong. Please try again.";

// Unified error message getter
export const getErrorMessage = (err, context) => {
	let msg;

	if (isNetwork(err)) {
		msg = OFFLINE_ERROR_MESSAGE;
	} else if (isSessionExpiredError(err)) {
		msg = IMPORTANT_ERROR_MESSAGE;
	} else {
		switch (err?.code) {
			case Parse.Error.USERNAME_TAKEN: // 202
				msg = "This username is already taken.";
				break;
			case Parse.Error.USERNAME_MISSING: // 200
				msg = "Username is required.";
				break;
			case Parse.Error.PASSWORD_MISSING: // 201
				msg = "Password is required.";
				break;
			case Parse.Error.OBJECT_NOT_FOUND: // 101
				switch (context) {
					case "login":
						msg = "Invalid username or password.";
						break;
					case "MOVIE_SEARCH":
						msg = "No movies found matching your search.";
						break;
					default:
						msg = "The requested item was not found.";
				}
				break;
			default:
				msg = GENERAL_ERROR_MESSAGE;
		}
	}
	return msg;
};
