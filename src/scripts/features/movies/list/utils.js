import { UI } from "../../../ui/dom";
import { qs } from "../../../utils/dom";

export function getListContext(event) {
  const btn = event.target.closest(".btn");
  const movieCard = btn.closest(".movie-card[data-id]");
  const id = movieCard.getAttribute("data-id");

  const listSection = btn.closest("section#watchlist, section#watched");
  const listName = listSection.id;

  const targetListSection = listSection === UI.watchlist ? UI.watched : UI.watchlist;
  const targetListName = targetListSection.id;
  const isTargetWatchlist = targetListSection === UI.watchlist;

  return {
    btn,
    movieCard,
    id,
    listSection,
    listName,
    targetListSection,
    targetListName,
    isTargetWatchlist,
    movieCardsContainer: qs(targetListSection, ".movie-cards"),
    originalCardsContainer: qs(listSection, ".movie-cards")
  };
}
