import { debounceBatch } from "../utils/debounce";
import { runCloudSafe } from "./api/cloudApi";

export const fetchLists = async () => {
	return runCloudSafe("list_get");
};

export const addId = (field, movieIds) => {
	return runCloudSafe("list_add", { field, movieIds });
};

export const removeId = async (field, movieIds) => {
	return runCloudSafe("list_remove", { field, movieIds });
};

export const debouncedAddId = debounceBatch(addId, 1000);

export const debouncedRemoveId = debounceBatch(removeId, 1000);
