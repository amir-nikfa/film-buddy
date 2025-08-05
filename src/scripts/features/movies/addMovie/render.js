import { qs, setFields, setSrc } from "../../../utils/dom";
import { removeBtnHandler, watchBtnHandler } from "../list/events";

/* ------------------------------ utilities ------------------------------ */

/** Build the text fields object we want to render. */
const buildTextFields = (movie) => ({
	title: movie.title,
	type: movie.type,
	year: movie.year,
	rate: movie.rate,
	plot: movie.plot,
});

/* ------------------------------ rendering ------------------------------ */

export const fillMovieSearchItem = (li, movie) => {
	li.setAttribute("data-id", movie.id);

	setSrc(
		qs(li, "[data-field='poster']"),
		movie.poster,
		movie.title ? `${movie.title} poster` : "Movie poster"
	);

	const fields = buildTextFields(movie);
	setFields(li, fields);
};

export const fillMovieCard = (cardLi, movie) => {
	cardLi.setAttribute("data-id", movie.id);

	setSrc(
		qs(cardLi, "[data-field='poster']"),
		movie.poster,
		movie.title ? `${movie.title} poster` : "Movie poster"
	);

	const fields = buildTextFields(movie);
	setFields(cardLi, fields);

	const watchedBtn = qs(cardLi, ".movie-card__watched");
	const removeBtn = qs(cardLi, ".movie-card__remove");

	watchedBtn.addEventListener("click", watchBtnHandler);
	removeBtn.addEventListener("click", removeBtnHandler);
};
