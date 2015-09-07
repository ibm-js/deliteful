/**
 * @module deliteful/list/_LoadingPanel
 * @private
 */
define([
	"delite/register",
	"delite/Widget",
	"delite/handlebars!./List/_LoadingPanel.html"
], function (register, Widget, template) {

	/**
	 * A widget that renders a panel masking a list and displaying a progress indicator and a message.
	 * @class module:deliteful/list/_LoadingPanel
	 * @augments module:delite/Widget
	 * @private
	 */
	return register("d-list-loading-panel", [HTMLElement, Widget], /** @lends module:deliteful/list/_LoadingPanel# */{
		/**
		 * The message to display
		 * @member {string}
		 * @default ""
		 */
		message: "",

		template: template
	});
});