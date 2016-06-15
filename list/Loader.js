define([
	"dcl/dcl",
	"delite/register",
	"delite/Widget",
	"delite/handlebars!./List/Loader.html"
], function (dcl, register,	Widget, template) {
	"use strict";

	return register("d-list-loader", [HTMLElement, Widget], {

		baseClass: "d-list-loader",

		template: template,

		labels: {
			loadMessage: "",
			loadingMessage: ""
		},

		loading: false,
	});
});