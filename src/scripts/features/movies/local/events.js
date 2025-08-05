import { UI } from "../../../ui/dom";

export const searchLocalHandler = (event) => {
	const searchInput = event.currentTarget;
	const enteredValue = searchInput.value.toUpperCase().trim();
	const inputType = searchInput.getAttribute("data-type");
	const movieContainer =
		inputType === "watchlist-search" ? UI.watchlist : UI.watched;

	const movieTitles = movieContainer.querySelectorAll("[data-field='title']");
	for (const movieTitle of movieTitles) {
		const movieCard = movieTitle.closest(".movie-card");
		const title = movieTitle.textContent.toUpperCase();

		movieCard.classList.toggle("hidden", !title.includes(enteredValue));
	}
};
