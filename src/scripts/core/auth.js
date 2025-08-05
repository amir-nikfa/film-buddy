import Parse from "parse";
import { getErrorMessage } from "./session/messageFormatter";
import { formatError, formatSuccess } from "./session/utils";

export async function signUp(username, password) {
	const user = new Parse.User();
	user.set("username", username);
	user.set("password", password);

	try {
		const signedUpUser = await user.signUp();
		return formatSuccess(signedUpUser, "Sign-up");
	} catch (error) {
		console.error(error);
		const msg = getErrorMessage(error);
		return formatError(error, msg);
	}
}

export async function login(username, password) {
	try {
		const loggedInUser = await Parse.User.logIn(username, password);
		return formatSuccess(loggedInUser, "Login");
	} catch (error) {
		console.error(error);
		const msg = getErrorMessage(error, "login");
		return formatError(error, msg);
	}
}

export const logOut = async () => {
	try {
		await Parse.User.logOut();
	} catch (error) {
		console.error(error);
	}
	return {
		user: null,
		error: null,
		message: "Sign-out successful",
	};
};
