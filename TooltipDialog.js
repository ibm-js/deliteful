/** @module deliteful/TooltipDialog */
define([
	"delite/register",
	"delite/Dialog",
	"./Tooltip",
	"delite/handlebars!./TooltipDialog/TooltipDialog.html",
	"requirejs-dplugins/i18n!./Dialog/nls/Dialog",
	"requirejs-dplugins/css!./TooltipDialog/TooltipDialog.css",
	"delite/uacss"	// TooltipDialog.less uses d-ie class
], function (
	register,
	Dialog,
	Tooltip,
	template,
	messages
) {

	/**
	 * A tooltip dialog widget, to be used as a popup.
	 * Meant to contain forms or interactive controls (ex: links, buttons).
	 *
	 * @class module:deliteful/TooltipDialog
	 * @augments module:delite/Dialog
	 * @augments module:deliteful/Tooltip
	 */
	return register("d-tooltip-dialog", [Tooltip, Dialog], /** @lends module:deliteful/TooltipDialog# */ {
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-tooltip d-tooltip-dialog"
		 */
		baseClass: "d-tooltip d-tooltip-dialog",

		template: template,

		nls: messages,

		/**
		 * The title of the TooltipDialog, displayed at the top, above the content.
		 * @member {string}
		 */
		label: "",

		/**
		 * Class to display the close button icon.
		 * @member {string}
		 * @default "d-tooltip-dialog-close-icon"
		 */
		closeButtonIconClass: "d-tooltip-dialog-close-icon",

		closeButtonClickHandler: function () {
			this.emit("cancel");
		},

		// Override Tooltip#onOpen() and onClose() to *not* set aria-describedby,
		// because it shouldn't be set for TooltipDialog, but only for Tooltip.
		onOpen: function () {},
		onClose: function () {}
	});
});
