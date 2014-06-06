/**
 * @module deliteful/list/_LoadingPanel
 * @private
 */
define(["dcl/dcl",
	"delite/register",
	"delite/Widget",
	"delite/handlebars",
	"requirejs-text/text!./List/_LoadingPanel.html",
	"../ProgressIndicator"
], function (dcl, register, Widget, handlebars, template) {

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

		buildRendering: handlebars.compile(template)

	});

	return register("d-list-loading-panel", [HTMLElement, _LoadingPanel]);

});