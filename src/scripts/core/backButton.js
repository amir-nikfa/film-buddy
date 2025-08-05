import { App } from "@capacitor/app";
import { closeModals, isAnyModalOpen } from "../ui/modal";

export const setupBackButtonHandler = () => {
	App.addListener("backButton", () => {
		if (isAnyModalOpen()) {
			closeModals();
			return;
		}

		App.exitApp();
	});
}
