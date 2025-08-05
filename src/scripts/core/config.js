import Parse from "parse";

const appId = import.meta.env.VITE_BACK4APP_APP_ID;
const jsKey = import.meta.env.VITE_BACK4APP_JS_KEY;

export const initializeBack4app = () => {
	Parse.initialize(appId, jsKey);
	Parse.serverURL = "https://parseapi.back4app.com/";
};
