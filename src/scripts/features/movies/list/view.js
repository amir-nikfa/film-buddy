
import { templates } from "../../../ui/dom";
import { cloneTemplate, qs } from "../../../utils/dom";
import { fillMovieCard } from "../add/render";

const hasMovieCard = (container) => {
	const movieCards = container.querySelectorAll(".movie-card");
	return movieCards.length > 0;
};

export const toggleNoMovieCard = (container, hasMov) => {
	const hasMovie = hasMov ?? hasMovieCard(container);
	const movieCardsEl = qs(container, ".movie-cards");
	const noMovieCardsEl = qs(movieCardsEl, ".no-movie-cards");

	noMovieCardsEl.classList.toggle("hidden", hasMovie);
};

export const renderMovieCard = (container, movies, type) => {
	if (movies.length < 1) return;

	toggleNoMovieCard(container, true);
	const movieCardsEl = qs(container, ".movie-cards");

	movies.forEach((movie) => {
		const movieCard = cloneTemplate(templates.movieCard);
		fillMovieCard(movieCard, movie);
		movieCardsEl.appendChild(movieCard);

		const isWatchlist = type === "watchlist";
		const btn = qs(movieCard, "button[data-type='watch-status']");
		updateWatchStatusButton(btn, isWatchlist);
	});
};

export const updateWatchStatusButton = (btn, isWatchlist) => {
	const btnContent = qs(btn, ".btn-content");
	btnContent.textContent = isWatchlist ? "Watched" : "Unwatched";

	qs(btn, ".fa-eye").classList.toggle("hidden", !isWatchlist);
	qs(btn, ".fa-eye-slash").classList.toggle("hidden", isWatchlist);
};
