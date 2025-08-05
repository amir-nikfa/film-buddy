import { Preferences } from "@capacitor/preferences";
import { $ } from "./dom";

const setModeText = (theme) => {
	const themeModeEl = $(".menu-item__mode");
	themeModeEl.textContent = `${theme} mode`;
}

export const setSavedTheme = async () => {
	const { value } = await Preferences.get({
		key: "theme",
	});

	const theme = value ?? "light";
	const bodyClass = document.body.classList;
	const themeToggler = $(".theme-toggler__input");

	setModeText(theme);

	bodyClass.remove("light", "dark");
	bodyClass.add(theme);

	themeToggler.checked = theme === "dark";
};

export const themeToggler = (event) => {
	const checked = event.target.checked;
	const theme = checked ? "dark" :  "light";

	document.body.classList.toggle("dark", checked);
	document.body.classList.toggle("light", !checked);	
	
	setModeText(theme);

	Preferences.set({
		key: "theme",
		value: checked ? "dark" : "light",
	});
};
