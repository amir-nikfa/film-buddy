const https = require("https");

/**
 * User Sign-Up Validation Trigger
 *
 * This cloud code runs before saving a new Parse.User object (i.e., during sign-up).
 * It validates the username and password fields according to custom rules:
 * - Username must start with a letter, only contain letters, numbers, or underscores,
 *   and be 5 to 20 characters long.
 * - Password must be at least 8 characters long and include uppercase, lowercase,
 *   number, and special character.
 *
 * If any validation fails, the save operation is rejected with a validation error.
 * Updates to existing users are not affected.
 */
Parse.Cloud.beforeSave(Parse.User, async (req) => {
	const user = req.object;

	// Only run on new sign-ups, not updates
	if (!user.isNew()) return;

	const username = user.get("username");
	const password = user.get("password");

	// Username validations
	const usernameConditions = {
		"Must start with a letter": (val) => /^[a-zA-Z]/.test(val),
		"Only letters, numbers, and underscores allowed": (val) =>
			/^[a-zA-Z0-9_]*$/.test(val),
		"No invalid characters allowed": (val) => !/[^a-zA-Z0-9_]/.test(val),
		"Must be 5–20 characters long": (val) =>
			val.length >= 5 && val.length <= 20,
	};

	for (const [msg, test] of Object.entries(usernameConditions)) {
		if (!test(username)) {
			throw new Parse.Error(
				Parse.Error.VALIDATION_ERROR,
				`Invalid username: ${msg}`
			);
		}
	}

	// Password validations
	const passwordConditions = {
		"Must be at least 8 characters": (val) => val.length >= 8,
		"Must include at least one uppercase letter": (val) =>
			/[A-Z]/.test(val),
		"Must include at least one lowercase letter": (val) =>
			/[a-z]/.test(val),
		"Must include at least one number": (val) => /\d/.test(val),
		"Must include at least one special character": (val) =>
			/[!@#$%^&*(),.?":{}|<>]/.test(val),
	};

	for (const [msg, test] of Object.entries(passwordConditions)) {
		if (!test(password)) {
			throw new Parse.Error(
				Parse.Error.VALIDATION_ERROR,
				`Invalid password: ${msg}`
			);
		}
	}
});

/**
 * Cloud Functions for managing a user's movie lists (watchlist & watched).
 *
 * Functions:
 * 1. list_get    -> Returns the current user's watchlist and watched arrays.
 * 2. list_add    -> Adds a unique movieId to either "watchlist" or "watched".
 * 3. list_remove -> Removes a movieId from either "watchlist" or "watched".
 *
 * - Requires the user to be authenticated (`req.user` must exist).
 * - Each user has exactly one "List" row, created automatically on first write.
 * - Access Control: row is private to the owner via ACL; all operations use useMasterKey.
 */

// ============================= Movie List Cloud Functions =============================
const FIELDS = ["watchlist", "watched"];

Parse.Cloud.define("list_get", async (req) => {
	if (!req.user) {
		throw new Parse.Error(Parse.Error.SESSION_MISSING, "Login required");
	}

	const q = new Parse.Query("List");
	q.equalTo("user", req.user);
	const row = await q.first({ useMasterKey: true });

	if (!row) return { watchlist: [], watched: [] };

	return {
		watchlist: row.get("watchlist") || [],
		watched: row.get("watched") || [],
	};
});

Parse.Cloud.define("list_add", async (req) => {
	if (!req.user) {
		throw new Parse.Error(Parse.Error.SESSION_MISSING, "Login required");
	}

	const field = req.params?.field;
	const movieIds = req.params?.movieIds;

	if (!FIELDS.includes(field)) {
		throw new Parse.Error(
			Parse.Error.VALIDATION_ERROR,
			"field must be 'watchlist' or 'watched'"
		);
	}

	// Helper to check if a string is valid non-empty
	const isValidId = (id) => typeof id === "string" && id.trim().length > 0;

	if (Array.isArray(movieIds)) {
		if (!movieIds.every(isValidId)) {
			throw new Parse.Error(
				Parse.Error.INVALID_JSON,
				"All movieIds must be non-empty strings"
			);
		}
	} else if (!isValidId(movieIds)) {
		throw new Parse.Error(
			Parse.Error.INVALID_JSON,
			"movieIds must be a non-empty string or array of strings"
		);
	}

	const q = new Parse.Query("List");
	q.equalTo("user", req.user);
	let row = await q.first({ useMasterKey: true });

	if (!row) {
		row = new Parse.Object("List");
		row.set("user", req.user);
		row.set("watchlist", []);
		row.set("watched", []);

		const acl = new Parse.ACL(req.user);
		acl.setPublicReadAccess(false);
		acl.setPublicWriteAccess(false);
		row.setACL(acl);
	}

	if (Array.isArray(movieIds)) {
		for (const id of movieIds) {
			row.addUnique(field, id);
		}
	} else {
		row.addUnique(field, movieIds);
	}

	const saved = await row.save(null, { useMasterKey: true });

	return { field, ids: saved.get(field) || [] };
});

Parse.Cloud.define("list_remove", async (req) => {
	if (!req.user) {
		throw new Parse.Error(Parse.Error.SESSION_MISSING, "Login required");
	}

	const field = req.params?.field;
	const movieIds = req.params?.movieIds;

	if (!FIELDS.includes(field)) {
		throw new Parse.Error(
			Parse.Error.VALIDATION_ERROR,
			"field must be 'watchlist' or 'watched'"
		);
	}

	// Helper to check if a string is valid non-empty
	const isValidId = (id) => typeof id === "string" && id.trim().length > 0;

	if (Array.isArray(movieIds)) {
		if (!movieIds.every(isValidId)) {
			throw new Parse.Error(
				Parse.Error.INVALID_JSON,
				"All movieIds must be non-empty strings"
			);
		}
	} else if (!isValidId(movieIds)) {
		throw new Parse.Error(
			Parse.Error.INVALID_JSON,
			"movieIds must be a non-empty string or array of strings"
		);
	}

	const q = new Parse.Query("List");
	q.equalTo("user", req.user);
	const row = await q.first({ useMasterKey: true });

	if (!row) return { field, ids: [] };

	if (Array.isArray(movieIds)) {
		for (const id of movieIds) {
			row.remove(field, id);
		}
	} else {
		row.remove(field, movieIds);
	}

	const saved = await row.save(null, { useMasterKey: true });

	return { field, ids: saved.get(field) || [] };
});

// =====================  OMDb Search (fetchMoviesFromOMDb) =====================
// Signed-in users only. Searches OMDb by text query (optional `type`) and returns OMDb's `Search` array.
// (requires: const https = require("https");  // at the top of main.js)
Parse.Cloud.define("fetchMoviesFromOMDb", async (request) => {
	// Enforce user must be signed in
	if (!request.user) {
		throw new Parse.Error(
			Parse.Error.OPERATION_FORBIDDEN,
			"You must be signed in to call this function."
		);
	}

	const query = request.params.query;
	if (!query || query.trim() === "") {
		throw new Parse.Error(
			Parse.Error.INVALID_QUERY,
			"You must provide a search query."
		);
	}

	const type = request.params.type; // Optional: 'movie', 'series', 'episode'
	const apiKey = ""; // Your OMDb API key

	let url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
		query
	)}`;
	if (type) {
		url += `&type=${type}`;
	}

	return new Promise((resolve, reject) => {
		https
			.get(url, (res) => {
				let data = "";

				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					try {
						const json = JSON.parse(data);

						if (json.Response === "True") {
							resolve(json.Search);
						} else {
							reject(
								new Parse.Error(
									Parse.Error.OBJECT_NOT_FOUND,
									json.Error || "No results found."
								)
							);
						}
					} catch (err) {
						reject(
							new Parse.Error(
								Parse.Error.INTERNAL_SERVER_ERROR,
								"Failed to parse response."
							)
						);
					}
				});
			})
			.on("error", (err) => {
				reject(
					new Parse.Error(
						Parse.Error.CONNECTION_FAILED,
						"Failed to fetch data from OMDb API."
					)
				);
			});
	});
});

// =====================  START: OMDb Lookup (fetchMovieById) =====================
// Signed-in users only. Fetches full OMDb details for a specific IMDb ID and returns the JSON object.
// (requires: const https = require("https");  // at the top of main.js)
Parse.Cloud.define("fetchMovieById", async (request) => {
	if (!request.user) {
		throw new Parse.Error(
			Parse.Error.OPERATION_FORBIDDEN,
			"You must be signed in."
		);
	}

	const id = request.params.id;
	if (!id) {
		throw new Parse.Error(
			Parse.Error.INVALID_QUERY,
			"You must provide an IMDb ID."
		);
	}

	const apiKey = ""; // Your OMDb API key
	const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(
		id
	)}`;

	return new Promise((resolve, reject) => {
		https
			.get(url, (res) => {
				let data = "";
				res.on("data", (chunk) => {
					data += chunk;
				});
				res.on("end", () => {
					try {
						const json = JSON.parse(data);
						if (json.Response === "True") {
							resolve(json);
						} else {
							reject(
								new Parse.Error(
									Parse.Error.OBJECT_NOT_FOUND,
									json.Error || "Not found."
								)
							);
						}
					} catch (e) {
						reject(
							new Parse.Error(
								Parse.Error.INTERNAL_SERVER_ERROR,
								"Failed to parse response."
							)
						);
					}
				});
			})
			.on("error", (err) => {
				reject(
					new Parse.Error(
						Parse.Error.CONNECTION_FAILED,
						"OMDb API request failed."
					)
				);
			});
	});
});
