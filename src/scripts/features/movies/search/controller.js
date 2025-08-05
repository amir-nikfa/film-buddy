import { getMovieDetails } from "../../../core/api/movieApi";
import { getErrorMessage } from "../../../core/session/messageFormatter";
import { templates, UI } from "../../../ui/dom";
import { cloneTemplate } from "../../../utils/dom";
import { fillMovieSearchItem } from "../add/render";
import { movieStore } from "../add/store";
import { changeSearchStatus } from "../add/ui";
import { searchResultClickHandler } from "./events";

export const addSearchResults = async (results, context = "") => {
	const { movies = [], error } = results || {};

	if (error) {
		const msg = getErrorMessage(error, context) || "No results found.";
		changeSearchStatus(true, msg, { error: true });
		return;
	}

	if (movies.length === 0) {
		changeSearchStatus(true, "No results found.");
		return;
	}

	changeSearchStatus(true, "Results found! Loading details...", {
		success: true,
	});

	const movieList = cloneTemplate(templates.movieSearchList);
	if (!movieList) {
		console.error("Search list template missing <ul>.");
		changeSearchStatus(false);
		return;
	}

	// One delegated handler for the whole list
	movieList.addEventListener("click", searchResultClickHandler);

	// Fetch extra details concurrently, then normalize
	const normalized = await Promise.all(
		movies.map(async (m) => {
			const details = await getMovieDetails(m.imdbID).catch(() => null);
			return {
				id: m.imdbID || "",
				poster: m.Poster || "",
				title: m.Title || "",
				type: m.Type || "",
				year: m.Year || "",
				plot: details?.Plot || "",
				rate: details?.imdbRating || "",
			};
		})
	);

	// Store and render
	const fragment = document.createDocumentFragment();
	for (const movie of normalized) {
		if (!movie.id) continue; // skip invalid entries

		movieStore.set(movie.id, movie);

		const li = cloneTemplate(templates.movieSearchItem);
		if (!li) continue;

		fillMovieSearchItem(li, movie);
		fragment.appendChild(li);
	}

	// Replace previous results and insert new ones
	UI.modalContent.querySelector("#search-results")?.remove();
	UI.modalContent.appendChild(movieList);
	movieList.appendChild(fragment);

	changeSearchStatus(false);
};