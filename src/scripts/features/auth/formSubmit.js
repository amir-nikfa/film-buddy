import { login, signUp } from "../../core/auth.js";
import { OFFLINE_ERROR_MESSAGE } from "../../core/session/messageFormatter.js";
import { addAlertModal } from "../../ui/alertModal.js";
import { UI } from "../../ui/dom.js";
import { toggleAuthItem } from "../../ui/menu.js";
import { addSpinner, removeSpinner } from "../../ui/spinner.js";
import { qs } from "../../utils/dom.js";
import { isOffline } from "../../utils/utils.js";
import { renderList } from "../movies/list/controller.js";
import { updateAuthMessage } from "./authMessage.js";
import { toggleDisabled } from "./inputs.js";

export const formSubmitHandler = async (event) => {
	event.preventDefault();
	const form = event.currentTarget;

	if (isOffline()) {
		updateAuthMessage(form, {
			failed: true,
			message: OFFLINE_ERROR_MESSAGE,
			show: true,
		});
		return;
	}

	const submitBtn = qs(form, "button[type='submit']");
	const formType = form.getAttribute("data-type");

	const username = form.querySelector("#username-input")?.value.trim();
	const password = form.querySelector("#password-input")?.value.trim();
	const toggleFormEl = qs(form, ".auth-form__toggle");

	toggleFormEl.classList.add("hidden");
	addSpinner(submitBtn);
	toggleDisabled(true);
	updateAuthMessage(form, { show: false });

	const authAction = formType === "login" ? login : signUp;
	const { error, message } = await authAction(username, password);

	updateAuthMessage(form, {
		failed: error,
		message,
		show: true,
	});

	if(!error) {
		qs(submitBtn, "span").textContent = `${formType} successful!`
	}
	removeSpinner(submitBtn);
	if (error) {
		toggleFormEl.classList.remove("hidden");
		toggleDisabled(false);
		return;
	}

	toggleAuthItem();
	if (formType === "login") {
		addAlertModal("Loading movies list...");
		renderList();
	}

	setTimeout(() => {
		UI.modal.classList.remove("overlay--active");
	}, 2000);
};
