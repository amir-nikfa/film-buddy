export const cloneTemplate = (element, deep = true) =>
	document.importNode(element.content, deep).querySelector("*");

export const qs = (root, selector) => root?.querySelector(selector) ?? null;

export const setText = (el, text = "") => {
	if (el) el.textContent = text;
};

export const setSrc = (img, src = "", alt = "") => {
	if (!img) return;
	img.src = src;
	if (alt) img.alt = alt;
	if (!img.loading) img.loading = "lazy";
};

/** Set multiple [data-field] text contents in one go. */
export const setFields = (root, fields) => {
	for (const [field, value] of Object.entries(fields)) {
		setText(qs(root, `[data-field='${field}']`), value ?? "");
	}
};

export const toggleBtnDisabled = (btn, value) => {
	btn.disabled = value;
};