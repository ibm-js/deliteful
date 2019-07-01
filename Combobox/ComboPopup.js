/** @module deliteful/Combobox/ComboPopup */
define([
	"delite/register",
	"./ComboboxImplementation",
	"delite/handlebars!./ComboPopup.html"
], function (
	register,
	ComboboxImplementation,
	template
) {
	/**
	 * Auxiliary widget used by deliteful/Combobox on mobile.  It's displayed inside
	 * a Dialog or TooltipDialog, and contains the list of options, and conditionally
	 * a search field and OK button.
	 *
	 * This widget is intended for being instantiated only by deliteful/Combobox;
	 * it should not be instantiated directly.  If needed, its template
	 * (deliteful/Combobox/Combobox-mobile.html) can be customized.
	 * @class module:deliteful/Combobox/ComboPopup
	 * @augments module:delite/ComboboxImplementation
	 */
	return register("d-combo-popup",
		[HTMLElement, ComboboxImplementation], /** @lends module:deliteful/Combobox/ComboPopup# */ {
		baseClass: "d-combo-popup",

		template: template,

		// id of node containing label
		labelledBy: "",

		// Whether or not to make the results be filterable.  Computed value.
		showInput: true,

		// Whether or not to display the list.  Computed value.
		showList: false,

		postRender: function () {
			this._showOrHideList();
		},

		computeProperties: function () {
			this.showInput = this.autoFilter && this.selectionMode !== "multiple";
		},

		refreshRendering: function (oldValues) {
			if ("list" in oldValues) {
				if (this.list) {
					this.list.placeAt(this.listNode, "replace");
					this.list.addClass("fill")
						.removeClass("d-hidden");
				}
				this._prepareInput(this.inputNode);
			}
			if ("showList" in oldValues && this.list) {
				this.list.setAttribute("d-shown", this.showList);
			}
		},

		okButtonClickHandler: function () {
			this.emit("execute");
		},

		/**
		 * Called by HasDropDown in order to focus inside the dialog/tooltip dialog containing the ComboPopup.
		 * Returns true if it found a spot to focus.
		 * @protected
		 */
		focus: function () {
			if (this.autoFilter && this.selectionMode === "single") {
				this.inputNode.focus();
				return true;
			} else if (this.list && this.showList && this.list.containerNode.children.length > 0) {
				var id = this.list.getIdentity(
					this.list.selectedItems.length > 0 ? this.list.selectedItems[0] : "");
				var renderer = (id && id !== -1) ? this.list.getRendererByItemId(id) :
					this.list.getItemRendererByIndex(0);
				this.list.navigateTo(renderer);
				return true;
			}
		},

		/**
		 * Toggles the list's visibility, and filters it by latest input.
		 */
		_showOrHideList: function () {
			// Compute whether or not to show the list.  Note that in mobile mode ComboPopup doesn't display a
			// down arrow icon to manually show/hide the list, so on mobile,
			// if the Combobox has a down arrow icon, the list is always shown.
			this.showList = !this.showInput || (this.inputNode && this.inputNode.value.length >= this.minFilterChars);
			if (this.showList) {
				if (this.showInput) {
					this.filter(this.inputNode.value);
				} else {
					this.list.source = this.source;
				}
			}
			if (this.inputNode) {
				this.inputNode.setAttribute("aria-expanded", "" + this.showList);
			}
		}
	});
});
