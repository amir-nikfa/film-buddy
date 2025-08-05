import { validateInput } from "../../ui/formValidators.js";
import { UI } from "../../ui/dom.js";

export const toggleDisabled = (disabled) => {
	const inputs = UI.modal.querySelectorAll("button, input");
	inputs.forEach((input) => {
		input.disabled = disabled;
	});
};

export const inputChangeHandler = (event) => {
	const input = event.target;
	const form = input.closest("form");
	const tooltip = input.nextElementSibling;

	const isUsername = input.id.startsWith("username");
	const isValid = validateInput(input, tooltip);

	form.dataset.usernameValid = isUsername
		? String(isValid)
		: form.dataset.usernameValid;
	form.dataset.passwordValid = isUsername
		? form.dataset.passwordValid
		: String(isValid);

	const submitBtn = form.querySelector("button[type='submit']");
	submitBtn.disabled =
		form.dataset.usernameValid !== "true" ||
		form.dataset.passwordValid !== "true";
};

export const inputFocusHandler = (event) => {
	event.target.nextElementSibling.classList.remove("hidden");
};

export const inputBlurHandler = (event) => {
	event.target.nextElementSibling.classList.add("hidden");
};
