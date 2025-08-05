import { App } from "@capacitor/app";
import { closeModals, isAnyModalOpen } from "../ui/modal";
import { toggleBtnDisabled } from "../utils/dom";
import { $ } from "../ui/dom";

export const setupBackButtonHandler = () => {
	App.addListener("backButton", () => {
		if (isAnyModalOpen()) {
			closeModals();

			const addMovieBtn = $(".add-btn");
			toggleBtnDisabled(addMovieBtn, false);
			return;
		}

		App.exitApp();
	});
}
