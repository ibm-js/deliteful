/** @module deliteful/Combobox/ComboPopup */
define([
	"delite/register",
	"delite/Dialog",
	"delite/handlebars!./ComboPopup.html"
], function (
	register,
	Widget,
	template
) {
	/**
	 * Auxiliary widget used by deliteful/Combobox on mobile.  It's displayed inside
	 * a Dialog or TooltipDialog, and contains the list of options, and conditionally
	 * a search field and OK button.
	 *
	 * This widget is intended for being instantiated only by deliteful/Combobox;
	 * it should not be instantiated directly.  If needed, its template
	 * (deliteful/Combobox/ComboPopup.html) can be customized.
	 * @class module:deliteful/Combobox/ComboPopup
	 * @augments module:delite/Widget
	 */
	return register("d-combo-popup", [HTMLElement, Widget], /** @lends module:deliteful/Combobox/ComboPopup# */ {

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

		okButtonClickHandler: function () {
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
