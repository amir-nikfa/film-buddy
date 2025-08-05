import "../styles/main.scss";
import { setupBackButtonHandler } from "./core/backButton.js";
import { initializeBack4app } from "./core/config.js";
import { restoreSession } from "./core/session/session.js";
import { setupEvents } from "./events/events.js";
import { renderList } from "./features/movies/list/controller.js";
import { addAlertModal } from "./ui/alertModal.js";
import { toggleAuthItem } from "./ui/menu.js";
import { isAnyModalOpen } from "./ui/modal.js";
import { setSavedTheme } from "./ui/theme.js";

const initApp = async () => {
	setSavedTheme();
	setupEvents();
	setupBackButtonHandler();
	initializeBack4app();
	toggleAuthItem();

	const {error, errorMessage, user} = await restoreSession();
	if(error) {
		console.error(error);
		addAlertModal(errorMessage, true);
	}
	if(user) {
		addAlertModal("Loading movies list...")
		renderList();
	}

	setTimeout(() => {
		console.log(isAnyModalOpen());
	}, 2000);
};

initApp();
