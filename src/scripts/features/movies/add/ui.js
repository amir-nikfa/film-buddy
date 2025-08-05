import { UI } from "../../../ui/dom";
import { qs } from "../../../utils/dom";

/* ------------------------------ UI helpers ----------------------------- */

export const removeNoCardEl = () => {
	UI.movieCards?.querySelector(".no-movie-cards")?.remove();
};

export const changeSearchStatus = (
	show,
	text = "",
	{ error = false, success = false } = {}
) => {
	const statusEl = qs(UI.modalContent, ".searching");
	
	if (!statusEl) return;

	statusEl.textContent = text;
	statusEl.classList.toggle("hidden", !show);
	statusEl.classList.toggle("success", success);
	statusEl.classList.toggle("error", error);
};
