import { getIsLoggedIn, getUsername } from "../core/session/selectors";
import { qs } from "../utils/dom";
import { $, UI } from "./dom";

export const toggleMenu = (show) => {
	const menuToggler = UI.menuTogglerInput;

	const shouldShow = typeof show === "boolean" ? show : !menuToggler.checked;

	menuToggler.checked = shouldShow;
};

export const closeMenuOnClickOutsideHandler = (event) => {
	const clickedInsideMenu = event.target.closest(".menu-list");
	const clickedInsideMenuToggler = event.target.closest(".menu-toggler");

	if (clickedInsideMenu || clickedInsideMenuToggler) {
		return;
	}

	document.removeEventListener("click", closeMenuOnClickOutsideHandler);
	toggleMenu(false);
};

export const menuTogglerClickHandler = () => {
	document.addEventListener("click", closeMenuOnClickOutsideHandler);
};

export const toggleAuthItem = () => {
	const isLoggedIn = getIsLoggedIn();
	const username = getUsername();

	const authItem = $(".menu-item[data-menu-item='auth']");
	if (!authItem) return;

	const signEl = qs(authItem, ".menu-item__user-sign");
	const signInIcon = qs(authItem, ".fa-right-to-bracket");
	const signOutIcon = qs(authItem, ".fa-right-from-bracket");
	const usernameOpen = qs(authItem, ".menu-item__username-open");
	const usernameClose = qs(authItem, ".menu-item__username-close");
	const usernameEl = qs(authItem, "#menu-username");

	// Update link text
	signEl.textContent = isLoggedIn ? "Logout" : "Login";

	// Toggle icons
	signInIcon.classList.toggle("hidden", isLoggedIn);
	signOutIcon.classList.toggle("hidden", !isLoggedIn);

	// Update parentheses and username
	usernameOpen.textContent = isLoggedIn ? "(" : "";
	usernameClose.textContent = isLoggedIn ? ")" : "";
	usernameEl.textContent = isLoggedIn && username ? username : "";
};
