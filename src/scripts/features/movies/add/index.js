
import { templates, UI } from "../../../ui/dom";
import { addToModal, openModal } from "../../../ui/modal";
import { cloneTemplate, qs, toggleBtnDisabled } from "../../../utils/dom";
import { searchInputHandler } from "../search/events";

/* Render search modal + wire up Enter key handler */
const renderSearchModal = () => {
	const content = cloneTemplate(templates.searchMovie);

	const statusEl = document.createElement("p");
	statusEl.classList.add("searching", "hidden");
	
	addToModal("Add Movie", content,statusEl);

	const searchInput = qs(UI.modalContent, "#add-movie-search-input");
	if (searchInput) searchInput.addEventListener("keyup", searchInputHandler);
	
	openModal();
};

export const addMovieHandler = (event) => {
	const addMovieBtn = event.currentTarget;

	toggleBtnDisabled(addMovieBtn, true);

	renderSearchModal();

	const enableAddBtnHandler = () => {
		toggleBtnDisabled(addMovieBtn, false);
		UI.modal.removeEventListener("click", enableAddBtnHandler);
	};

	UI.modal.addEventListener("click", enableAddBtnHandler);
};
