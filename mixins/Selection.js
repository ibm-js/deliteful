define(["dcl/dcl", "dojo/_base/lang", "../Widget"], function (dcl, lang, Widget) {
	return dcl(Widget, {
		// summary:
		//		Mixin for classes for widgets that manage a list of selected data items. Receiving class must extend
		//		dui/Widget.

		preCreate: function () {
			this._set("selectedItems", []);
		},

		// selectionMode: String
		//		Valid values are:
		//
		//		1. "none": No selection can be done.
		//		2. "single": Only one item can be selected at a time.
		//		3. "multiple": Several item can be selected using the control key modifier.
		//		Default value is "single".
		selectionMode: "single",

		_setSelectionModeAttr: function (value) {
			if (value !== "none" && value !== "single" && value !== "multiple") {
				throw new Error("selectionModel invalid value");
			}
			if (value !== this.selectionMode) {
				this._set("selectionMode", value);
				if (value === "none") {
					this.selectedItems = null;
				} else if (value === "single") {
					this.selectedItem = this.selectedItem; // null or last selected item
				}
			}
		},

		// selectedItem: Object
		//		In single selection mode, the selected item or in multiple selection mode the last selected item.
		selectedItem: null,

		_setSelectedItemAttr: function (value) {
			if (this.selectedItem !== value) {
				this._set("selectedItem", value);
				this.selectedItems = (value == null ? null : [value]);
			}
		},

		// selectedItems: Object[]
		//		The list of selected items.
		selectedItems: null,

		_setSelectedItemsAttr: function (value) {
			var oldSelectedItems = this.selectedItems;

			this._set("selectedItems", value);
			this._set("selectedItem", null);

			if (oldSelectedItems != null && oldSelectedItems.length > 0) {
				this.updateRenderers(oldSelectedItems, true);
			}
			if (this.selectedItems && this.selectedItems.length > 0) {
				this._set("selectedItem", this.selectedItems[0]);
				this.updateRenderers(this.selectedItems, true);
			}
		},

		_getSelectedItemsAttr: function () {
			return this._get("selectedItems") == null ? [] : this._get("selectedItems").concat();
		},

		isSelected: function (item) {
			// summary:
			//		Returns whether an item is selected or not.
			// item: Object
			//		The item to test the selection for.			
			if (this.selectedItems == null || this.selectedItems.length === 0) {
				return false;
			}

			return this.selectedItems.some(lang.hitch(this, function (sitem) {
				return this.getIdentity(sitem) === this.getIdentity(item);
			}));
		},
		/*jshint unused: vars */
		getIdentity: function (item) {
			// summary:
			//		This function must be implemented to return the id of a item.
			// item: Object
			//		The item to query the identity for.
		},
		/*jshint unused: true */

		setSelected: function (item, value) {
			// summary:
			//		Change the selection state of an item.
			// item: Object
			//		The item to change the selection state for.
			// value: Boolean
			//		True to select the item, false to deselect it. 

			if (this.selectionMode === "none" || item == null) {
				return;
			}

			// copy is returned
			var sel = this.selectedItems;

			if (this.selectionMode === "single") {
				if (value) {
					this.selectedItem = item;
				} else if (this.isSelected(item)) {
					this.selectedItems = null;
				}
			} else { // multiple
				if (value) {
					if (this.isSelected(item)) {
						return; // already selected
					}
					if (sel == null) {
						sel = [item];
					} else {
						sel.unshift(item);
					}
					this.selectedItems = sel;
				} else {
					var res = sel ? sel.filter(lang.hitch(this, function (sitem) {
						return this.getIdentity(sitem) !== this.getIdentity(item);
					})) : [];
					if (res == null || res.length === sel.length) {
						return; // already not selected
					}
					this.selectedItems = res;
				}
			}
		},

		selectFromEvent: function (e, item, renderer, dispatch) {
			// summary:
			//		Applies selection triggered by an user interaction
			// e: Event
			//		The source event of the user interaction.
			// item: Object
			//		The render item that has been selected/deselected.
			// renderer: Object
			//		The visual renderer of the selected/deselected item.			
			// dispatch: Boolean
			//		Whether an event must be dispatched or not.
			// returns: Boolean
			//		Returns true if the selection has changed and false otherwise.
			// tags:
			//		protected

			if (this.selectionMode === "none") {
				return false;
			}

			var changed;
			var oldSelectedItem = this.selectedItem;
			var selected = item == null ? false : this.isSelected(item);

			if (item == null) {
				if (!e.ctrlKey && this.selectedItem != null) {
					this.selectedItem = null;
					changed = true;
				}
			} else if (this.selectionMode === "multiple") {
				if (e.ctrlKey) {
					this.setSelected(item, !selected);
					changed = true;
				} else {
					this.selectedItem = item;
					changed = true;
				}
			} else { // single
				if (e.ctrlKey) {
					//if the object is selected deselects it.
					this.selectedItem = (selected ? null : item);
					changed = true;
				} else {
					if (!selected) {
						this.selectedItem = item;
						changed = true;
					}
				}
			}

			if (dispatch && changed) {
				this.dispatchSelectionChange(oldSelectedItem, this.selectedItem, renderer, e);
			}

			return changed;
		},

		dispatchSelectionChange: function (oldSelectedItem, newSelectedItem, renderer, triggerEvent) {
			// summary:
			//		Dispatch a selection change event.
			// oldSelectedItem: Object
			//		The previously selectedItem.
			// newSelectedItem: Object
			//		The new selectedItem.
			// renderer: Object
			//		The visual renderer of the selected/deselected item.
			// triggerEvent: Event
			//		The event that lead to the selection of the item.

			this.emit("selection-change", {
				oldValue: oldSelectedItem,
				newValue: newSelectedItem,
				renderer: renderer,
				triggerEvent: triggerEvent
			});
		}
	});
});
