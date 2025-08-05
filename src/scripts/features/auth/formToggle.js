import { updateAuthMessage } from "./authMessage";

export const formToggleHandler = (event) => {
	const form = event.target.closest("form");
	if (!form) return;

	updateAuthMessage(form, { show: false });

	const isLogin = form.getAttribute("data-type") === "login";

	const content = isLogin
		? {
				title: "Sign Up!",
				message: "Already have an account?",
				toggler: "Login",
				submit: "Create Account and Login",
				nextType: "sign-up",
		  }
		: {
				title: "Login!",
				message: "Don't have an account?",
				toggler: "Sign Up",
				submit: "Login",
				nextType: "login",
		  };

	const selectors = {
		title: ".auth-form__title",
		message: ".auth-form__message",
		toggler: ".auth-form__toggler",
		submit: "button[type='submit'] span",
	};

	Object.entries(selectors).forEach(([key, selector]) => {
		const el = form.querySelector(selector);
		if (el) el.textContent = content[key];
	});

	form.setAttribute("data-type", content.nextType);
};
