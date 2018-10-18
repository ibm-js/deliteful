define([
	"delite/popup",
	"delite/register",
	"delite/Container",
	"delite/Dialog",
	"delite/handlebars!./Dialog/Dialog.html",
	"requirejs-dplugins/i18n!./Dialog/nls/Dialog",
	"delite/theme!./Dialog/themes/{{theme}}/Dialog.css"
], function (
	popup,
	register,
	Container,
	Dialog,
	template,
	messages
) {

	"use strict";

	/**
	 * A dialog widget, to be used as a popup.
	 * Meant to contain forms or interactive controls (ex: links, buttons).
	 *
	 * @class module:deliteful/Dialog
	 * @augments module:delite/Dialog
	 * @augments module:delite/Container
	 */
	return register("d-dialog", [HTMLElement, Dialog, Container],  /** @lends module:deliteful/Dialog# */ {

		baseClass: "d-dialog",

		nls: messages,

		template: template,

		/**
		 * Whether or not dialog is modal.
		 */
		modal: true,

		/**
		 * The title of the Dialog, displayed at the top, above the content.
		 * @member {string}
		 */
		label: "",

		/**
		 * Class to display the close button icon.
		 * @member {string}
		 * @default "d-dialog-close-icon"
		 */
		closeButtonIconClass: "d-dialog-close-icon",

		/**
		 * Display the Dialog.
		 */
		open: function () {
			this._originalStyle = this.style.cssText;

			var previouslyFocusedNode = this.ownerDocument.activeElement;

			popup.open({
				parent: previouslyFocusedNode,
				popup: this,
				orient: ["center"],
				onExecute: this.close.bind(this),
				onCancel: this.close.bind(this),
				onClose: function () {
					// Restore original height/width etc.  But don't put back display:none.
					// That is handled by the popup wrapper.
					this.style.cssText = this._originalStyle;
					if (this.style.display === "none") {
						this.style.display = "";
					}
					if (this.style.visibility === "hidden") {
						this.style.visibility = "";
					}

					// Focus previously focused node unless it's hidden or destroyed,
					// in which case caller must handle the focus.
					if (previouslyFocusedNode && previouslyFocusedNode.focus &&
						previouslyFocusedNode.offsetParent !== null) {
						previouslyFocusedNode.focus();
					}
				}.bind(this)
			});

			this.focus();
		},

		/**
		 * Closes the dialog.
		 * Called automatically when dialog emits an "execute" or "cancel" event.
		 */
		close: function () {
			popup.close(this);
		},

		focus: function () {
			// Focus on first field.
			this._getFocusItems();
			if (this._firstFocusItem && this._firstFocusItem !== this) {
				this._firstFocusItem.focus();
			}
		},

		/**
		 * Called when clicking the dialog's close button.
		 * @protected
		 */
		closeButtonClickHandler: function () {
			this.emit("cancel");
		}
	});
});
