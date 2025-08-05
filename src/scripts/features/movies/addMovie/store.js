/* ------------------------------ data store ----------------------------- */

import { addAlertModal } from "../../../ui/alertModal";
import { watchedIds, watchlistIds } from "../store/store";

/** Canonical store for movie data, keyed by imdbID. */
export const movieStore = new Map();

export const updateLists = (watchlist, watched) => {
	const update = (list, movies) => {
		movies.forEach((movie) => {
			list.add(movie.id);
		});
	};

	update(watchlistIds, watchlist);
	update(watchedIds, watched);
};

export const addToWatchlist = (id, title) => {
	watchlistIds.add(id);

	addAlertModal(`"${title}" added to watchlist.`);
};

export const addToWatched = (title, id) => {
	watchedIds.add(id);

	addAlertModal(`"${title}" added to watched.`);
};

export const removeFromWatchlist = (id) => {
	watchlistIds.delete(id);

	addAlertModal(`removed from watchlist.`);
};

export const removeFromWatched = (id) => {
	watchedIds.delete(id);

	addAlertModal(`removed from watched.`);
};

export const isInWatchlist = (id) => {
	return watchlistIds.has(id);
};

export const isInWatched = (id) => {
	return watchedIds.has(id);
};
