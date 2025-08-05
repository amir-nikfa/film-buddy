import { templates, UI } from "../../../ui/dom";
import { cloneTemplate, qs } from "../../../utils/dom";
import { fillMovieCard } from "../add/render";
import { removeNoCardEl } from "../add/ui";
import { toggleNoMovieCard } from "../list/view";

export function renderAddedMovieCard(movie) {
	const card = cloneTemplate(templates.movieCard);
	fillMovieCard(card, movie);
	removeNoCardEl();
	toggleNoMovieCard(UI.watchlist, true);
	qs(UI.watchlist, ".movie-cards").appendChild(card);
}
