/** @module deliteful/Combobox/ComboPopup */
define([
	"delite/register",
	"delite/Dialog",
	"delite/handlebars!./ComboPopup.html"
], function (register, Dialog, template) {
	/**
	 * Auxiliary widget used in some cases by deliteful/Combobox for displaying
	 * a popup containing conditionally a search field and OK/Cancel buttons.
	 * This widget is intended for being instantiated only by deliteful/Combobox;
	 * it should not be instantiated directly.  If needed, its template
	 * (deliteful/Combobox/ComboPopup.html) can be customized.
	 * @class module:deliteful/Combobox/ComboPopup
	 * @augments module:delite/Widget
	 */
	return register("d-combo-popup", [HTMLElement, Dialog], /** @lends module:deliteful/Combobox/ComboPopup# */ {

		baseClass: "d-combo-popup",

		template: template,

		/**
		 * The instance of `deliteful/Combobox` for which this widget is used.
		 * This property is set by Combobox when creating the popup, and it
		 * is used in the template of ComboPopup for accessing the properties
		 * of the Combobox.
		 * @member {boolean} module:deliteful/Combobox/ComboPopup#combobox
		 * @default null
		 * @protected
		 */
		combobox: null,

		/**
		 * Popup's title, to remind user what the popup is for (since it likely covers up the original label).
		 */
		header: "",

		/**
		 *  Class to display the close button icon.
		 * @member {string}
		 */
		closeButtonIconClass: "",

		refreshRendering: function (oldValues) {
			if ("combobox" in oldValues) {
				if (this.combobox) {
					var list = this.combobox.list;
					if (list) {
						list.placeAt(this.listNode, "replace");
						list.addClass("fill")
							.removeClass("d-hidden");
					}
					this.combobox._prepareInput(this.inputNode);
				}
			}
		},

		/**
		 * Called when clicking the close button of the popup.
		 * @protected
		 */
		closeButtonClickHandler: function () {
			// NOTE: no need to validate since it's handled by the `selection-change` listener
			this.emit("execute");
		},

		/**
		 * Called by HasDropDown in order to get the focus on the widget's list.
		 * @protected
		 */
		focus: function () {
			if (this.combobox.autoFilter && this.combobox.selectionMode === "single") {
				this.inputNode.focus();
			} else {
				// first check if list is not hidden.
				if (!this.combobox.list.hasClass("d-hidden")
						&& this.combobox.list && this.combobox.list.containerNode.children.length > 0) {
					var id = this.combobox.list.getIdentity(
						this.combobox.list.selectedItems.length > 0 ? this.combobox.list.selectedItems[0] : "");
					var renderer = (id && id !== -1) ? this.combobox.list.getRendererByItemId(id) :
						this.combobox.list.getItemRendererByIndex(0);
					this.combobox.list.navigateTo(renderer);
				}
			}

		}
	});
});
