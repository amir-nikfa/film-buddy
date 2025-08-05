import { logOut } from "../../core/auth.js";
import { getIsLoggedIn } from "../../core/session/selectors.js";
import { addAlertModal } from "../../ui/alertModal.js";
import { templates, UI } from "../../ui/dom.js";
import { toggleAuthItem } from "../../ui/menu.js";
import { addToModal, openModal } from "../../ui/modal.js";
import { addSpinner, removeSpinner } from "../../ui/spinner.js";
import { cloneTemplate } from "../../utils/dom.js";
import { resetMovies } from "../movies/local/clearLocalMovies.js";
import { inputChangeHandler, inputFocusHandler, inputBlurHandler } from "./inputs.js";
import { formToggleHandler } from "./formToggle.js";
import { formSubmitHandler } from "./formSubmit.js";

export const authHandler = async (event) => {
	const authBtn = event.currentTarget;
	const isLoggedIn = getIsLoggedIn();

	if (isLoggedIn) {
		addSpinner(authBtn);
		const { error, message } = await logOut();
		removeSpinner(authBtn);
		toggleAuthItem();
		addAlertModal(message);
		resetMovies();
		return;
	}

	const form = cloneTemplate(templates.form);
	const formInputs = form.querySelectorAll("input");
	const formToggler = form.querySelector(".auth-form__toggler");

	formInputs.forEach((input) => {
		input.addEventListener("input", inputChangeHandler);
		input.addEventListener("focus", inputFocusHandler);
		input.addEventListener("blur", inputBlurHandler);
	});

	formToggler.addEventListener("click", formToggleHandler);
	form.addEventListener("submit", formSubmitHandler);

	addToModal("Welcome ❤️", form);
	openModal();
};
