/** @module deliteful/Combobox/ComboPopup */
define([
	"delite/register",
	"requirejs-dplugins/jquery!attributes/classes",	// addClass()
	"delite/Widget",
	"delite/handlebars!./ComboPopup.html"
], function (register, $, Widget, template) {
	/**
	 * Auxiliary widget used in some cases by deliteful/Combobox for displaying
	 * a popup containing conditionally a search field and OK/Cancel buttons.
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

		/**
		 * Popup's header, to remind user what the popup is for (since it likely covers up the original label).
		 */
		header: "",

		computeProperties: function (oldValues) {
			if ("combobox" in oldValues) {
				// Find Combobox's label and use it as my header.
				var combobox = this.combobox;
				var headerNode = (combobox.focusNode.id &&
					this.ownerDocument.querySelector("label[for=" + combobox.focusNode.id + "]")) ||
					(combobox.hasAttribute("aria-labelledby") &&
					this.ownerDocument.getElementById(combobox.getAttribute("aria-labelledby")));
				this.header = headerNode ? headerNode.textContent.trim() : (combobox.getAttribute("aria-label") || "");
			}
		},

		refreshRendering: function (oldValues) {
			if ("combobox" in oldValues) {
				if (this.combobox) {
					var list = this.combobox.list;
					if (list) {
						list.placeAt(this.listNode, "replace");
						$(list).addClass("fill");
					}
					this.combobox._prepareInput(this.inputNode);
				}
			}
		},
		
		/**
		 * Called when clicking the OK button of the popup.
		 * @protected
		 */
		okHandler: function () {
			this.combobox._validateMultiple(this.combobox.inputNode);
			this.combobox.closeDropDown();
		},
		
		/**
		 * Called when clicking the Cancel button of the popup.
		 * @protected
		 */
		cancelHandler: function () {
			this.combobox.list.selectedItems = this.combobox._selectedItems;
			this.combobox.closeDropDown();
		}
	});
});
