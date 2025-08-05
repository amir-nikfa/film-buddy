import Parse from "parse";
import { getCurrentUser } from "./session";

export const getUsername = () => {
	const user = getCurrentUser();

	return user ? user.get("username") : "";
};

export const getIsLoggedIn = () => !!Parse.User.current();
