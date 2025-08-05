import { UI } from "../../../ui/dom";
import { toggleNoMovieCard } from "../list/view";

export const resetMovies = () => {
	const watchlistCards = UI.watchlist.querySelectorAll(".movie-card");
	const watchedCard = UI.watched.querySelectorAll(".movie-card");

	const removeMovies = (movie) => {
		movie.remove();
	}

	watchlistCards.forEach(removeMovies);
	watchedCard.forEach(removeMovies);

	toggleNoMovieCard(UI.watched, false)
	toggleNoMovieCard(UI.watchlist, false)
}