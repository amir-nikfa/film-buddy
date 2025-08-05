import { getListContext } from "./utils.js";
import { addSpinner, removeSpinner } from "../../../ui/spinner.js";
import { addAlertModal } from "../../../ui/alertModal.js";
import { debouncedAddId, debouncedRemoveId } from "../../../core/listsApi.js";
import { toggleNoMovieCard, updateWatchStatusButton } from "./view.js";
import { UI } from "../../../ui/dom.js";
import { removeFromWatched, removeFromWatchlist } from "../add/store.js";

export async function handleDelete(event) {
	const { btn, movieCard, id, listSection, listName } = getListContext(event);

	addSpinner(btn);
	addAlertModal("Deleting movie...");

	const { error } = await debouncedRemoveId(listName, id);
	removeSpinner(btn);

	if (error) {
		console.error(error.message);
		addAlertModal(error.userErrorMessage, true);
		return;
	}

	movieCard.remove();
	if(listName === "watchlist") {
		removeFromWatchlist(id);
	} else if(listName === "watched") {
		removeFromWatched(id);
	}
	addAlertModal("Movie deleted.");
	toggleNoMovieCard(listSection);
}

export async function handleMove(event) {
	const {
		btn,
		movieCard,
		id,
		listSection,
		listName,
		targetListSection,
		targetListName,
		isTargetWatchlist,
		movieCardsContainer,
	} = getListContext(event);

	addSpinner(btn);
	addAlertModal(`Moving to ${targetListName}...`);

	// Step 1: remove from original list
	const { error: rmError } = await debouncedRemoveId(listName, id);
	if (rmError) {
		removeSpinner(btn);
		console.error(rmError.message);
		addAlertModal(rmError.userErrorMessage, true);
		updateWatchStatusButton(btn, !isTargetWatchlist);
		return;
	}

	// Step 2: add to target list
	const { error: addError } = await debouncedAddId(targetListName, id);
	removeSpinner(btn);

	addAlertModal(`Moved to ${targetListName}`);
	updateWatchStatusButton(btn, isTargetWatchlist);

	if (addError) {
		console.error(addError.message);
		addAlertModal(addError.userErrorMessage, true);
		return;
	}

	// Step 3: move DOM node
	movieCardsContainer.appendChild(movieCard);
	toggleNoMovieCard(targetListSection, true);
	toggleNoMovieCard(listSection);
}

export const changeListHandler = (event) => {
	const selectedBtn = event.target.closest(".main-nav__item");
	if (!selectedBtn) return;

	const buttons = event.currentTarget.querySelectorAll(".main-nav__item");
	buttons.forEach((button) => {
		button.classList.remove("main-nav__item--active");
	});

	selectedBtn.classList.add("main-nav__item--active");

	const selectedBtnType = selectedBtn.getAttribute("data-type");
	const isWatchListActive = selectedBtnType === "watchlist";

	UI.watchlist.classList.toggle("hidden", !isWatchListActive);
	UI.watched.classList.toggle("hidden", isWatchListActive);
	UI.main.scrollTop = 0;
};

// exports for your original bindings
export const removeBtnHandler = handleDelete;
export const watchBtnHandler = handleMove;
