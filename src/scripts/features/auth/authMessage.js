import { qs } from "../../utils/dom";

export const getAuthMessageEl = (container) =>
	qs(container, ".auth-form__auth-message")

export const updateAuthMessage = (
	container,
	{ failed, message = "", show = true }
) => {
	const messageEl = getAuthMessageEl(container);
	if (!messageEl) return;

	messageEl.classList.toggle("auth-form__auth-message--failed", failed);
	messageEl.textContent = message;
	messageEl.classList.toggle("hidden", !show);
};
