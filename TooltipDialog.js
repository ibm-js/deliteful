/** @module deliteful/TooltipDialog */
define([
	"delite/register",
	"delite/Dialog",
	"./Tooltip",
	"delite/handlebars!./TooltipDialog/TooltipDialog.html",
	"delite/theme!./TooltipDialog/themes/{{theme}}/TooltipDialog.css",
	"delite/uacss"	// TooltipDialog.less uses d-ie class
], function (register, Dialog, Tooltip, template) {

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
		 * @default "d-tooltip-dialog-close-icon"
		 */
		closeButtonIconClass: "d-tooltip-dialog-close-icon",

		focus: function () {
			// Focus on first field.
			this._getFocusItems();
			if (this._firstFocusItem && this._firstFocusItem !== this) {
				this._firstFocusItem.focus();
			}
		},

		closeButtonClickHandler: function () {
			this.emit("cancel");
		},

		// Override Toolip#onOpen() and onClose() to *not* set aria-describedby,
		// because it shouldn't be set for TooltipDialog, but only for Tooltip
		onOpen: function () {},
		onClose: function () {}
	});
});
