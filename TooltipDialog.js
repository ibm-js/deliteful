/** @module deliteful/TooltipDialog */
define([
	"delite/register",
	"./Tooltip",
	"delite/handlebars!./TooltipDialog/TooltipDialog.html",
	"delite/theme!./TooltipDialog/themes/{{theme}}/TooltipDialog.css"
], function (register, Tooltip, template) {

	/**
	 * A tooltip dialog widget, to be used as a popup.
	 * @class module:deliteful/TooltipDialog
	 * @augments module:delite/Tooltip
	 */
	return register("d-tooltip-dialog", [Tooltip], /** @lends module:deliteful/TooltipDialog# */ {
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-tooltip"
		 */
		baseClass: "d-tooltip d-tooltip-dialog",

		template: template,

		/**
		 * The title of the TooltipDialog, displayed at the top, above the content.
		 * @member {string}
		 */
		label: "",

		/**
		 *  Class to display the close button icon.
		 * @member {string}
		 * @default "d-close-icon"
		 */
		closeButtonIconClass: "d-close-icon",

		closeButtonClickHandler: function () {
			this.emit("cancel");
		}
	});
});
