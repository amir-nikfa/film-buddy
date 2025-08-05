import { getMovieDetails } from "./api/movieApi";

export const enrichMovies = async (movieIds) => {
	return await Promise.all(
		movieIds.map(async (imdbId) => {
			const details = await getMovieDetails(imdbId).catch(() => null);
			return {
				id: imdbId || "",
				poster: details.Poster || "",
				title: details.Title || "",
				type: details.Type || "",
				year: details.Year || "",
				plot: details?.Plot || "",
				rate: details?.imdbRating || "",
			};
		})
	);
};
