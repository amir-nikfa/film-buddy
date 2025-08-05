// Username validation rules
const usernameConditions = {
	"username-start": (val) => /^[a-zA-Z]/.test(val),
	"username-letters": (val) => /^[a-zA-Z0-9_]*$/.test(val),
	"username-valid": (val) => !/[^a-zA-Z0-9_]/.test(val),
	"username-length": (val) => val.length >= 5 && val.length <= 20,
};

// Password validation rules
const passwordConditions = {
	"password-length": (val) => val.length >= 8,
	"password-upper": (val) => /[A-Z]/.test(val),
	"password-lower": (val) => /[a-z]/.test(val),
	"password-number": (val) => /\d/.test(val),
	"password-special": (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
};

const validateConditions = (value, conditions, tooltip) => {
	let allValid = true;

	for (const [key, testFn] of Object.entries(conditions)) {
		const el = tooltip.querySelector(`[data-check="${key}"]`);
		if (!el) continue;

		const passed = testFn(value);
		el.classList.toggle("condition--valid", passed);
		el.classList.toggle("condition--invalid", !passed);

		if (!passed) allValid = false;
	}

	return allValid;
};

export const validateInput = (input, tooltip) => {
	const isUsername = input.id.startsWith("username");
	const conditions = isUsername ? usernameConditions : passwordConditions;

	return validateConditions(input.value, conditions, tooltip);
};
