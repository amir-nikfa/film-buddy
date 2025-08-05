import { OFFLINE_ERROR_MESSAGE } from "../../../core/session/messageFormatter";
import { addAlertModal } from "../../../ui/alertModal";
import { isOffline } from "../../../utils/utils";
import { isInWatched, isInWatchlist } from "../addMovie/store";

export function validateCanAdd(movie) {
	if (isInWatched(movie.id)) {
		addAlertModal(
			`"${movie.title}" is already in your Watched list.`,
			true
		);
		return false;
	}
	if (isInWatchlist(movie.id)) {
		addAlertModal(`"${movie.title}" is already in your Watchlist.`, true);
		return false;
	}
	if (isOffline()) {
		addAlertModal(OFFLINE_ERROR_MESSAGE, true);
		return false;
	}
	return true;
}
