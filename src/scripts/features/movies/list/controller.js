import { getErrorMessage, OFFLINE_ERROR_MESSAGE } from "../../../core/session/messageFormatter";
import { getIsLoggedIn } from "../../../core/session/selectors";
import { addAlertModal } from "../../../ui/alertModal";
import { UI } from "../../../ui/dom";
import { qs } from "../../../utils/dom";
import { isOffline } from "../../../utils/utils";
import { updateLists } from "../add/store";
import { resetMovies } from "../local/clearLocalMovies";
import { getList } from "./model";
import { renderMovieCard } from "./view";

export const refreshCardsHandler = async (event) => {
	if(isOffline()) {
		addAlertModal(OFFLINE_ERROR_MESSAGE, true);
		return;
	}
	if(!getIsLoggedIn()) {
		addAlertModal("Sign in to sync your movies.", true);
		return;
	}
	const element = event.currentTarget;
	const refreshBtn = qs(element, ".no-movie-cards__refresh");

	addAlertModal("Updating Lists...");
	refreshBtn.classList.add("no-movie-cards__refresh--active");
	await renderList();
	refreshBtn.classList.remove("no-movie-cards__refresh--active");
};

export const renderList = async () => {
	const movies = await getList();

	const error = movies.error;

	if (error) {
		console.error(error.message);
		const errorMsg = getErrorMessage(error);
		addAlertModal("Fetching movies failed: " + errorMsg, true);
		return error;
	}

	resetMovies();

	updateLists(movies.watchlist, movies.watched);

	renderMovieCard(UI.watchlist, movies.watchlist, "watchlist");
	renderMovieCard(UI.watched, movies.watched, "watched");

	const noMovie = movies.watchlist.length < 1 && movies.watched.length < 1;
	const msg = noMovie
		? "No movies were found to load."
		: "Movies have been loaded.";

	addAlertModal(msg, noMovie);
	return { error: null };
};
