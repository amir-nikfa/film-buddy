import { authHandler } from "../features/auth/authHandler";
import { addMovieHandler } from "../features/movies/add";
import { refreshCardsHandler } from "../features/movies/list/controller";
import { changeListHandler } from "../features/movies/list/events";
import { searchLocalHandler } from "../features/movies/local/events";
import { UI } from "../ui/dom";
import { menuTogglerClickHandler } from "../ui/menu";
import { modalRemoveHandler } from "../ui/modal";
import { themeToggler } from "../ui/theme";

export const setupEvents = () => {
	UI.addMovieBtn.addEventListener("click", addMovieHandler);
	UI.modal.addEventListener("click", modalRemoveHandler);
	UI.changeList.addEventListener("click", changeListHandler);
	UI.menuTogglerInput.addEventListener("change", menuTogglerClickHandler);
	UI.authBtn.addEventListener("click", authHandler);
	UI.themeToggleBtn.addEventListener("change", themeToggler);
	UI.watchlistSearchInput.addEventListener("input", searchLocalHandler);
	UI.watchedSearchInput.addEventListener("input", searchLocalHandler);

	const noCardElements = document.querySelectorAll(".no-movie-cards");
	noCardElements.forEach((noCard) =>
		noCard.addEventListener("click", refreshCardsHandler)
	);
};
