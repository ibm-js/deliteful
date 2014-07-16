/**
 * @module deliteful/list/_LoadingPanel
 * @private
 */
define([
	"dcl/dcl",
	"delite/register",
	"delite/Widget",
	"delite/handlebars!./List/_LoadingPanel.html"
], function (dcl, register, Widget, template) {

	/**
	 * A widget that renders a panel masking a list and displaying a progress indicator and a message.
	 * @class module:deliteful/list/_LoadingPanel
	 * @augments module:delite/Widget
	 * @private
	 */
	var _LoadingPanel = dcl([Widget], {

		/**
		 * The message to display
		 * @member {string}
		 * @default ""
		 */
		message: "",

		template: template
	});

	return register("d-list-loading-panel", [HTMLElement, _LoadingPanel]);

});