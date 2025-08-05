import { qs } from "../utils/dom";

const prepareSpinner = (container, hide) => {
	const elements = container.querySelectorAll(":scope > *");

	container.classList.toggle("spinner-wrapper", hide);
	elements.forEach((element) => element.classList.toggle("hidden", hide));
}

export const removeSpinner = (container) => {
	prepareSpinner(container, false)

	const spinner = qs(container, ".spinner");
	spinner.remove();
};

export const addSpinner = (container) => {
	prepareSpinner(container, true);

	container.insertAdjacentHTML("afterbegin", "<div class='spinner'></div>");
};
