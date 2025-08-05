import { searchMovies } from "../../../core/api/movieApi";
import { OFFLINE_ERROR_MESSAGE } from "../../../core/session/messageFormatter";
import { restoreSession } from "../../../core/session/session";
import { addAlertModal } from "../../../ui/alertModal";
import { UI } from "../../../ui/dom";
import { isOffline } from "../../../utils/utils";
import { movieStore } from "../addMovie/store";
import { changeSearchStatus } from "../addMovie/ui";
import { addSearchResults } from "./controller";
import { addMovieToWatchlist } from "./model";
import { validateCanAdd } from "./validator";
import { renderAddedMovieCard } from "./view";

export async function searchResultClickHandler(e) {
	const item = e.target.closest(".search-result");
	if (!item) return;

	const id = item.dataset.id;
	const movie = movieStore.get(id);
	if (!movie) return;

	if (!validateCanAdd(movie)) return;

	addAlertModal("Adding Movie...", false);

	try {
		await addMovieToWatchlist(movie);
		renderAddedMovieCard(movie);
	} catch (err) {
		console.error(err);
		addAlertModal(`Adding '${movie.title}' failed – ${err.message}`, true);
	}
}

export const searchInputHandler = async (e) => {
	if (e.key !== "Enter") return;

	if (isOffline()) {
		changeSearchStatus(true, OFFLINE_ERROR_MESSAGE, { error: true });
		return;
	}

	changeSearchStatus(true, "Searching...");
	const result = await restoreSession();

	if (result.error) {
		changeSearchStatus(true, result.errorMessage, { error: true });
		return;
	}

	if (!result.user) {
		changeSearchStatus(
			true,
			"You must be signed in to search for movies.",
			{ error: true }
		);
		return;
	}

	const value = e.target.value.trim();
	if (!value) return;

	movieStore.clear();

	UI.modalContent.querySelector("#search-results")?.remove();

	try {
		const results = await searchMovies(value);
		await addSearchResults(results, "MOVIE_SEARCH");
	} catch (error) {
		console.error(error);
	}
};
