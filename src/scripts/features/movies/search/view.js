import { templates, UI } from "../../../ui/dom";
import { cloneTemplate, qs } from "../../../utils/dom";
import { fillMovieCard } from "../addMovie/render";
import { removeNoCardEl } from "../addMovie/ui";
import { toggleNoMovieCard } from "../list/view";

export function renderAddedMovieCard(movie) {
	const card = cloneTemplate(templates.movieCard);
	fillMovieCard(card, movie);
	removeNoCardEl();
	toggleNoMovieCard(UI.watchlist, true);
	qs(UI.watchlist, ".movie-cards").appendChild(card);
}
