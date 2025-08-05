import Parse from "parse";
import { getErrorMessage } from "../session/messageFormatter";
import { isSessionExpiredError } from "../session/errorTypes";

export const runCloudSafe = async (name, params) => {
	try {
		const data = await Parse.Cloud.run(name, params);
		return { data, error: null };
	} catch (err) {
		if (isSessionExpiredError(err)) {
			try {
				await Parse.User.logOut();
			} catch {}
		}
		const userErrorMessage = getErrorMessage(err);
		return {
			data: null,
			error: {
				code: err?.code,
				message: err?.message || "Unknown error",
				userErrorMessage,
			},
		};
	}
};
