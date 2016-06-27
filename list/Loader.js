/** @module deliteful/list/Loader */
define([
	"dcl/dcl",
	"delite/register",
	"delite/Widget",
	"delite/handlebars!./List/Loader.html"
], function (dcl, register, Widget, template) {
	"use strict";

	/**
	 * An helper widget that renders a progress indicator and a label.
	 *
	 * Depending of the value of its `loading` property, it shows a `loadingMessage` or a `loadMessage`.
	 * Furthermore, if `loading` is equal to `true`, an active progress indicator is displayed too.
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
		 * Loader's message.
		 * @type {string}
		 * @default ""
		 */
		label: "",

		/**
		 * It determines if the loader is active or not.
		 * @type {Boolean}
		 * @default false
		 */
		loading: false
	});
});