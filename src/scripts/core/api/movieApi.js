import { runCloudSafe } from "./cloudApi"; // ← adjust path

export const searchMovies = async (title, type) => {
	const { data, error } = await runCloudSafe("fetchMoviesFromOMDb", {
		query: title,
		type, // optional: 'movie', 'series', 'episode'
	});

	if (error) {
		console.error("[searchMovies] Search error:", error.message);
		return { movies: [], error };
	}

	return { movies: data ?? [], error: null };
};

export const getMovieDetails = async (imdbID) => {
	const { data, error } = await runCloudSafe("fetchMovieById", {
		id: imdbID,
	});

	if (error) {
		console.error("[getMovieDetails] Detail fetch error:", error.message);
		return null;
	}

	return data;
};