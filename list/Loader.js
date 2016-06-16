/** @module deliteful/list/Loader */
define([
	"dcl/dcl",
	"delite/register",
	"delite/Widget",
	"delite/handlebars!./List/Loader.html"
], function (dcl, register,	Widget, template) {
	"use strict";

	/**
	 * A widget that renders a loader widget.
	 *
	 * Depending of the value of its `loading` propertiy, it will show a `loadingMessage` or a `loadMessage`.
	 * Furthermore, if `loading` is equal to `true`, an active progress indicator will be shown too.
	 *
	 * See the {@link https://github.com/ibm-js/deliteful/tree/master/docs/list/PageableList.md user documentation}
	 * for more details.
	 *
	 * @class module:deliteful/list/Loader
	 * @augments module:deliteful/list/Loader
	 */
	return register("d-list-loader", [HTMLElement, Widget], {

		baseClass: "d-list-loader",

		template: template,

		/**
		 * Set of messages to show for each value of `loading` property.
		 * @type {Object}
		 */
		labels: {
			loadMessage: "",
			loadingMessage: ""
		},

		/**
		 * It determines if the loader is active or not.
		 * If `true`, the `labels.loadingMessage` is shown, `labels.loadMessage` otherwise.
		 * @type {Boolean}
		 */
		loading: false,
	});
});