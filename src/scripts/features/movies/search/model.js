import { debouncedAddId } from "../../../core/listsApi";
import { addToWatchlist } from "../addMovie/store";

export async function addMovieToWatchlist(movie) {
	// returns { success: true } or throws
	const { error } = await debouncedAddId("watchlist", movie.id);
	if (error) {
		throw new Error(error.userErrorMessage);
	}
	addToWatchlist(movie.id, movie.title);
}
