export const $ = (selector) => document.querySelector(selector);

export const templates = {
	searchMovie: $("#search-movie-template"),
	movieSearchList: $("#search-list-template"),
	movieSearchItem: $("#search-item-template"),
	movieCard: $("#movie-card-template"),
	alertModal: $("#alert-modal-template"),
	form: $("#auth-form-template")
};

export const UI = {
	main: $(".main"),
	modal: $(".modal-wrapper"),
	modalContent: $(".modal__content"),
	addMovieBtn: $("#add-btn"),
	menuTogglerInput: $("#menu-toggler-input"),
	authBtn: $(".menu-item[data-menu-item='auth'"),
	themeToggleBtn: $(".theme-toggler__input"),
	changeList: $(".main-nav"),
	watchlist: $(".watchlist"),
	watched: $(".watched"),
	watchlistSearchInput: $("#watchlist-search-input"),
	watchedSearchInput: $("#watched-search-input"),
};