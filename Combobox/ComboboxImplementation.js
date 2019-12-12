/** @module deliteful/Combobox/ComboboxImplementation */
define([
	"dcl/dcl",
	"dstore/Filter",
	"dojo/string",
	"delite/CssState",
	"delite/FormValueWidget",
	"../features",
	"./ComboboxAPI",
	"requirejs-dplugins/css!./Combobox.css"
], function (
	dcl,
	Filter,
	string,
	CssState,
	FormValueWidget,
	has,
	ComboboxAPI
) {

	// Counter used to generate unique ids for the dropdown items, so that aria-activedescendant is set to
	// a reasonable value.
	var idCounter = 1;

	var isMobile = !has("desktop-like-channel");

	/**
	 * Base class for Combobox on desktop, and the ComboPopup dialog opened by Combobox on mobile.
	 * Not used by the Combobox on mobile, since it is merely a button to display the ComboPopup.
	 */
	return dcl([FormValueWidget, CssState, ComboboxAPI], /** @lends module:deliteful/ComboboxImplementation# */ {

		// TODO: handle the situation the list has a null/undefined store.
		// Would be nice to have a global policy for all subclasses of
		// delite/Store (in terms of error feedback).
		// TODO: future mechanism at the level of delite/Store-delite/StoreMap
		// to allow delegation from host widget to a different widget - to get
		// a clean mechanism to support all possible use-cases. (Probably also
		// requires changes in List).

		// Avoid that List gives focus to list items when navigating, which would
		// blur the input field used for entering the filtering criteria.
		focusDescendants: false,

		refreshRendering: function (oldValues) {
			if ("list" in oldValues) {
				this._initList();
			}

			if ("selectionMode" in oldValues) {
				if (this.list) {
					this.list.selectionMode = this.selectionMode === "single" ?
						"radio" : "multiple";
				}
			}

			if ("value" in oldValues) {
				// Set selected items in dropdown list.  Could alternately do this when dropdown is opened.
				this._setSelectedItems();
			}
		},

		focus: dcl.superCall(function (sup) {
			return function () {
				sup.apply(this, arguments);

				// Set flag used in "input' handler.
				this._justFocused = true;
				this.defer(function () {
					this._justFocused = false;
				});
			};
		}),

		_initList: function () {
			if (this.list) {
				// Class added on the list such that Combobox' theme can have a specific
				// CSS selector for elements inside the List when used as dropdown in
				// the combo.
				this.list.classList.add("d-combobox-list");

				// The drop-down is hidden initially
				this.list.classList.add("d-hidden");

				// The role=listbox is required for the list part of a combobox by the
				// aria spec of role=combobox
				this.list.type = "listbox";

				this.list.selectionMode = this.selectionMode === "single" ?
					"radio" : "multiple";

				this._initHandlers();

				// TODO
				// This is a workaround waiting for a proper mechanism (at the level
				// of delite/Store - delite/StoreMap) to allow a store-based widget
				// to delegate the store-related functions to a parent widget (delite#323).
				if (!this.list.attached) {
					this.list.connectedCallback();
				}
			}
		},

		_initHandlers: function () {
			if (this._ListListeners) {
				this._ListListeners.forEach(function (handle) {
					handle.remove();
				});
			}

			this._ListListeners = [
				this.list.on("keynav-child-navigated", function (evt) {
					var navigatedChild = evt.newValue; // never null
					var rend = this.list.getEnclosingRenderer(navigatedChild);
					var item = rend.item;
					if (this.selectionMode === "single" && item && !this.list.isSelected(item)) {
						this.list.selectFromEvent(evt, item, rend, true);
					} // else do not change the selection state of an item already selected
					if (evt.triggerEvent && // only for keyboard navigation
						(evt.triggerEvent.type === "keydown" || evt.triggerEvent.type === "keypress")) {
						this._updateScroll(item, true);
					}
					this._setActiveDescendant(navigatedChild);
				}.bind(this)),

				this.list.on("click", function (evt) {
					if (this.selectionMode === "single") {
						var rend = this.list.getEnclosingRenderer(evt.target);
						if (rend && this.list.isItemRenderer(rend)) {
							this.defer(function () {
								// deferred such that the user can see the selection feedback
								// before the dropdown closes.
								this.handleOnChange(this.value);
								this.list.emit("execute");
							}.bind(this), 100); // worth exposing a property for the delay?
						}
					}
				}.bind(this)),

				// React to interactive changes of selected items
				this.list.on("selection-change", function () {
					this._validateInput();
					this.handleOnInput(this.value); // emit "input" event
				}.bind(this)),

				this.list.on("query-success", this._setSelectedItems.bind(this))
			];
		},

		/**
		 * Returns the label of a List item renderer.
		 * @private
		 */
		_getItemRendererLabel: function (itemRenderer) {
			return this._getItemLabel(itemRenderer.item);
		},

		/**
		 * Returns the value of a List item renderer. Defaults to its label
		 * if the underlying data item has no value.
		 * @private
		 */
		_getItemRendererValue: function (itemRenderer) {
			return this._getItemValue(itemRenderer.item);
		},

		/**
		 * Returns the label of a List render item.
		 * @private
		 */
		_getItemLabel: function (item) {
			return item.label;
		},

		/**
		 * Returns the value of a List render item. Defaults to its label
		 * if the underlying data item has no value.
		 * @private
		 */
		_getItemValue: function (item) {
			return "value" in item ? item.value : item.label;
		},

		_setActiveDescendant: function (nd) {
			if (nd) {
				if (!nd.id) {
					nd.id = "d-combobox-item-" + idCounter++;
				}

				this.inputNode.setAttribute("aria-activedescendant", nd.id);
			}
		},

		/**
		 * Toggles the lists's visibility, and filters it by latest input.
		 * If in mobile, toggles list visibility.
		 * If in desktop, closes or opens the popup.
		 */
		_showOrHideList: function (/* suppressChangeEvent */) {
			throw new Error("Must be implemented in subclass");
		},

		/**
		 * True iff the `<input>`'s value was set by user typing.
		 * We only filter the dropdown list when the value was set by the user typing into the `<input>`,
		 * and specifically avoid filtering the list to a single item when the user selects an item from
		 * list and then reopens the dropdown.
		 */
		_valueSetByUserInput: false,

		value: dcl.prop({
			set: function (val) {
				if (val !== this.value) {
					this._set("value", val);
					this._valueSetByUserInput = false;
				}
			},
			get: function () {
				return this._get("value") || "";
			},
			enumerable: true,
			configurable: true
		}),

		/**
		 * Called when there's a "keydown" event on the <input>.
		 * @param evt
		 */
		inputKeydownHandler: function (evt) {
			/* jshint maxcomplexity: 17 */
			// deliteful issue #382: prevent the browser from navigating to
			// the previous page when typing backspace in a readonly input
			if (this.inputNode.readOnly && evt.key === "Backspace") {
				evt.stopPropagation();
				evt.preventDefault();
			} else if (evt.key === "Enter") {
				evt.stopPropagation();
				evt.preventDefault();
				if (this.selectionMode === "multiple") {
					// Path for closing multi-select dropdown.
					this.closeDropDown(true/*refocus*/);
				} else {
					// Delegate handling to the list.  This allows subclasses to implement hierarchical menus etc.
					var activeDescendant = this.opened && this.list.querySelector(".d-active-descendant");
					if (activeDescendant) {
						activeDescendant.click();
					}
				}
			} else if (evt.key === "Spacebar" && this.opened) {
				// Simply forwarding the key event to List doesn't allow toggling
				// the selection, because List's mechanism is based on the event target
				// which here is the input element outside the List. TODO: see deliteful #500.
				if (this.selectionMode === "multiple") {
					var rend = this.list.getEnclosingRenderer(this.list.navigatedDescendant);
					if (rend) {
						this.list.selectFromEvent(evt, rend.item, rend, true);
					}
				}
				if (this.selectionMode === "multiple" || !this.autoFilter) {
					evt.stopPropagation();
					evt.preventDefault();
				}
			} else if (evt.key === "ArrowDown" || evt.key === "ArrowUp" ||
				evt.key === "PageDown" || evt.key === "PageUp" ||
				evt.key === "Home" || evt.key === "End") {
				if (isMobile) {
					this.list.emit("keydown", evt);
				}
				evt.stopPropagation();
				evt.preventDefault();
			}
		},

		/**
		 * Called when there's an "input" event on the <input>.
		 * @param evt
		 */
		inputInputHandler: function (evt) {
			if (this._justFocused) {
				// Ignore spurious "input" event on IE when focusing an <input> with a placeholder.
				return;
			}

			// TODO
			// Would be nice to also have an "incrementalFilter" boolean property.
			// On desktop, this would allow to redo the filtering only for "change"
			// events, triggered when pressing ENTER. This would also fit for Chrome/Android,
			// where pressing the search key of the virtual keyboard also triggers a
			// change event. But there's no equivalent on Safari / iOS...

			// save what user typed at each keystroke.
			this.displayedValue = this.inputNode.value;

			// Clear value.  No value until user selects something from dropdown again.
			this.value = "";
			this._valueSetByUserInput = true;
			if (this.list && this.list.selectedItems.length > 0) {
				this.list.selectedItems = [];
			}
			this.handleOnInput(this.value); // if we just cleared this.value then emit "input" event

			if (this._timeoutHandle !== undefined) {
				this._timeoutHandle.remove();
				delete this._timeoutHandle;
			}
			this._timeoutHandle = this.defer(function () {
				// Note: set suppressChangeEvent=true because we shouldn't get a change event because
				// the dropdown closed just because the user backspaced while typing in the <input>.
				this._showOrHideList(true);
			}.bind(this), this.filterDelay);

			// Stop the spurious "input" events emitted while the user types
			// such that only the "input" events emitted via FormValueWidget.handleOnInput()
			// bubble to widget's root node.
			evt.stopPropagation();
			evt.preventDefault();
		},

		/**
		 * Called when there's a "change" event on the <input>.
		 * @param evt
		 */
		inputChangeHandler: function (evt) {
			// Stop the spurious "change" events emitted while the user types
			// such that only the "change" events emitted via FormValueWidget.handleOnChange()
			// bubble to widget's root node.
			evt.stopPropagation();
			evt.preventDefault();
		},

		_validateInput: function () {
			if (this.selectionMode === "single") {
				this._validateSingle();
			} else {
				this._validateMultiple();
			}
		},

		_validateSingle: function () {
			var selectedItem = this.list.selectedItem;
			// selectedItem non-null because List in radio selection mode, but
			// the List can be empty, so:
			this.displayedValue = selectedItem ? this._getItemLabel(selectedItem) : "";
			this.value = selectedItem ? this._getItemValue(selectedItem) : "";
		},

		_validateMultiple: function () {
			var n;
			var selectedItems = this.list.selectedItems;
			n = selectedItems ? selectedItems.length : 0;
			var value = [];
			if (n > 1) {
				this.displayedValue = string.substitute(this.multipleChoiceMsg, {items: n});
				for (var i = 0; i < n; i++) {
					value.push(selectedItems[i] ? this._getItemValue(selectedItems[i]) : "");
				}
			} else if (n === 1) {
				var selectedItem = this.list.selectedItem;
				this.displayedValue = this._getItemLabel(selectedItem);
				value.push(this._getItemValue(selectedItem));
			} else { // no option selected
				this.displayedValue = this.multipleChoiceNoSelectionMsg;
			}

			// Only set this.value if the value has changed.  Otherwise it's a spurious
			// notification.  Stateful doesn't detect that two arrays are deep-equal because
			// ["foo"] !== ["foo"]
			if (!this.value || this.value.join(",") !== value.join(",")) {
				this.value = value;
			}

			// FormWidget.refreshRendering() also updates valueNode.value, but we need to
			// make sure this is already done when FormValueWidget.handleOnInput() runs.
			this.valueNode.value = value.toString();
			this.handleOnInput(this.value); // emit "input" event
		},

		/**
		 * Filters the embedded List to only show the items matching `filterTxt`.
		 * If `autoFilter` is `true` and `selectionMode` is `"single"`, the method
		 * is called automatically while the user types into the editable input
		 * element, with `filterTxt` being the currently entered text.
		 * @protected
		 */
		filter: function (inputText) {
			if (!this.autoFilter || inputText.length === 0 || !this._valueSetByUserInput) {
				// Display the full list.
				this.list.query = this._getDefaultQuery();
			} else {
				// Display the list filtered by what user typed into <input>.

				// Escape special chars in search string, see
				// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex.
				var filterTxt = inputText.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
				if (this.filterMode === "startsWith") {
					filterTxt = "^" + filterTxt;
				} else if (this.filterMode === "is") {
					filterTxt = "^" + filterTxt + "$";
				} // nothing to add for "contains"

				var rexExp = new RegExp(filterTxt, this.ignoreCase ? "i" : "");
				this.list.query = this.getQuery({
					rexExp: rexExp,
					inputText: inputText
				});
			}

			if (this.source) {
				this.list.source = this.source;
			}
		},

		/**
		 * Gets the list's query.
		 * This method can be overridden when using other store types.
		 * The default implementation uses `dstore/Filter.match()`.
		 * The matching is performed against the `list.labelAttr` or `list.labelFunc` attributes of
		 * the data store items.
		 * The method can be overridden for implementing other filtering strategies.
		 * @protected
		 * @param  {Object.<string, Object>} args Dictionary containing by default
		 * the regular expression and the original input text.
		 * @returns {Object} New query to set to the list.
		 */
		getQuery: function (args) {
			return (new Filter()).match(this.list.labelAttr || this.list.labelFunc, args.rexExp);
		},

		_getDefaultQuery: function () {
			return (typeof this.defaultQuery === "function") ?
				this.defaultQuery() : this.defaultQuery;
		},

		_setSelectedItems: function () {
			if (this.list && this.list.source && this.list.renderItems) {
				var selectedItems = [],
					presetItems = Array.isArray(this.value) && this.value.length >= 1 ? this.value : [this.value];
				selectedItems = this.list.renderItems.filter(function (renderItem) {
					return presetItems.indexOf(this._getItemValue(renderItem)) >= 0;
				}.bind(this));

				this.list.selectedItems = selectedItems;
				if (selectedItems.length) {
					this._validateInput();
				}
			}
		},

		/**
		 * Scrolls the list inside the popup such that the specified item, or
		 * the first selected item if no item is specified, is visible.
		 * @private
		 */
		_updateScroll: function (item, navigate) {
			// Since List is in focus-less mode, it does not give focus to
			// navigated items, thus the browser does not autoscroll.
			// TODO: see deliteful #498

			if (!item) {
				var selectedItems = this.list.selectedItems;
				item = selectedItems && selectedItems.length > 0 ?
					selectedItems[0] : null;
			}
			if (item) {
				// Make the first selected item (if any) visible.
				// Must be done after sup.apply, because List.getBottomDistance
				// relies on dimensions which are not available if the DOM nodes
				// are not (yet) visible, hence the popup needs to be shown before.
				var id = this.list.getIdentity(item);
				var renderer = this.list.getRendererByItemId(id);
				if (renderer) {
					this.list.scrollBy({y: this.list.getBottomDistance(renderer)});
					if (navigate) {
						this.list.navigatedDescendant = this.list.type === "grid" ?
							renderer.firstElementChild : renderer;
					}
				} // null if the list is empty because no item matches the auto-filtering
			}
		},

		destroy: function () {
			if (this._ListListeners) {
				this._ListListeners.forEach(function (handle) {
					handle.remove();
				});
			}
			this._ListListeners = null;

			this.list = null;
		}
	});
});
