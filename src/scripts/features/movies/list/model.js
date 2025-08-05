import { fetchLists } from "../../../core/listsApi";
import { enrichMovies } from "../../../core/movieEnricher";

export const getList = async () => {
	const { data, error } = await fetchLists();

	if (error) {
		return { error };
	}

	const watchlistIds = data.watchlist;
	const watchedIds = data.watched;

	const watchlist = await enrichMovies(watchlistIds);
	const watched = await enrichMovies(watchedIds);

	return {
		watchlist,
		watched,
	};
};