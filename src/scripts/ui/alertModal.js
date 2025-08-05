import { cloneTemplate, setText } from "../utils/dom";
import { templates } from "./dom";

const removeAlertModal = (alertModal) => {
	alertModal.addEventListener("transitionend", () => {
		alertModal.remove();
	});
};

const scheduleAlertModalRemove = (alertModal, timeout = 3000) => {
	setTimeout(() => {
		alertModal.classList.remove("alert-modal--active");

		removeAlertModal(alertModal);
	}, timeout);
};

const removeActiveAlertModals = () => {
	const activeModals = document.querySelectorAll(".alert-modal--active");

	activeModals.forEach((modal) => {
		modal.classList.remove("alert-modal--active");
		removeAlertModal(modal);
	});
};

const removeAlertModalHandler = (event) => {
	const alertModal = event.currentTarget;

	alertModal.classList.remove("alert-modal--active");

	removeAlertModal(alertModal);
};

export const addAlertModal = (message, isError = false) => {
	removeActiveAlertModals();

	const alertModal = cloneTemplate(templates.alertModal);

	const alertModalMessage = alertModal.querySelector(".alert-modal__message");

	alertModalMessage.classList.toggle("error", isError);

	setText(alertModalMessage, message);

	document.body.insertAdjacentElement("afterbegin", alertModal);

	requestAnimationFrame(() =>
		setTimeout(() => {
			alertModal.classList.add("alert-modal--active");
		}, 10)
	);

	scheduleAlertModalRemove(alertModal);

	alertModal.addEventListener("click", removeAlertModalHandler);
};
