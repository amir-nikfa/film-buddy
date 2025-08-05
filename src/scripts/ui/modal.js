import { UI } from "./dom";
import { toggleMenu } from "./menu";

export const closeModals = () => {
	const openedModals = document.querySelectorAll(".overlay--active");

	openedModals.forEach(modal => modal.classList.remove("overlay--active"));
}

export const isAnyModalOpen = () => {
	const openedModals = document.querySelectorAll(".overlay--active");

	return openedModals.length > 0;
}

export const addToModal = (title, ...contents) => {
	const modalContentEl = UI.modalContent;

	modalContentEl.innerHTML = "";

	const modalTitleEl = UI.modal.querySelector(".modal__title");
	modalTitleEl.textContent = title;

	for (const content of contents) {
		modalContentEl.appendChild(content);
	}
};

export const openModal = () => {
	toggleMenu(false);
	UI.modal.classList.add("overlay--active");
};

export const modalRemoveHandler = (event) => {
	const target = event.target;
	const wrapper = event.currentTarget;
	const isInsideModal = target.closest(".modal");
	const isCloseBtn = target.id === "modal-close";

	if (isInsideModal && !isCloseBtn) return;

	const content = wrapper.querySelector(".modal__content");
	if (!content) return;

	wrapper.classList.remove("overlay--active");

	const clearModalContent = () => {
		wrapper.removeEventListener("transitionend", clearModalContent);
		content.innerHTML = "";
	};

	wrapper.addEventListener("transitionend", clearModalContent);
};
