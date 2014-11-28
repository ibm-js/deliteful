/** @module deliteful/Combobox */
define([
	"dcl/dcl",
	"dojo/dom-class", // TODO: replace (when replacement confirmed)
	"dstore/Filter",
	"decor/sniff",
	"delite/register",
	"delite/FormValueWidget",
	"delite/HasDropDown",
	"delite/keys",
	"./list/List",
	"./LinearLayout",
	"./Button",
	"delite/handlebars!./Combobox/Combobox.html",
	"requirejs-dplugins/i18n!./Combobox/nls/Combobox",
	"delite/theme!./Combobox/themes/{{theme}}/Combobox.css"
], function (dcl, domClass, Filter, has, register, FormValueWidget, HasDropDown,
		keys, List, LinearLayout, Button, template, messages) {
	/**
	 * A form-aware and store-aware widget leveraging the `deliteful/list/List`
	 * widget for rendering the options.
	 * 
	 * The corresponding custom tag is `<d-combobox>`.
	 * 
	 * The property `list` allows to specify the List instance used by the widget.
	 * The customization of the mapping of data item attributes into render item
	 * attributes can be done on the `List` instance using the mapping API of `List`
	 * inherited from its superclass `delite/StoreMap`.
	 * 
	 * The property `selectionMode` allows to choose between single and multiple
	 * choice modes.
	 *  
	 * In single selection mode, if the property `autoFilter` is set to `true`
	 * (default is `false`) the widget allows to type one or more characters which
	 * are used for filtering the shown list items. By default, the filtering is
	 * case-insensitive, and an item is shown if its label contains the entered
	 * string. The default filtering policy can be customized thanks to the 
	 * `filterMode` and `ignoreCase` properties.
	 * 
	 * If the widget is used in an HTML form, the submitted value is the one
	 * of the `value` property. By default, the `label` field of list render items
	 * is used as value. A different field can be specified by using attribute
	 * mapping for `value` on the List instance. In multiple selection mode, the
	 * value is an array containing the values of the selected options.
	 * 
	 * Remark: the option items must be added, removed or updated exclusively using
	 * List's store API. Direct operations using the DOM API are not supported.
	 * 
	 * @example <caption>Markup</caption>
	 * JS:
	 * require(["delite/register", "deliteful/Store",
	 *   "deliteful/Combobox", "requirejs-domready/domReady!"],
	 *   function (register) {
	 *     register.parse();
	 *   });
	 * HTML:
	 * <d-combobox id="combobox1">
	 *   <d-list store="store"></d-list>
	 * </d-combobox>
	 * <d-store id="store">
	 *   { "label": "France", "sales": 500, "profit": 50, "region": "EU" },
	 *   { "label": "Germany", "sales": 450, "profit": 48, "region": "EU" },
	 *   { "label": "UK", "sales": 700, "profit": 60, "region": "EU" },
	 *   { "label": "USA", "sales": 2000, "profit": 250, "region": "America" },
	 *   { "label": "Canada", "sales": 600, "profit": 30, "region": "America" },
	 *   { "label": "Brazil", "sales": 450, "profit": 30, "region": "America" },
	 *   { "label": "China", "sales": 500, "profit": 40, "region": "Asia" },
	 *   { "label": "Japan", "sales": 900, "profit": 100, "region": "Asia" }
	 * </d-store>
	 * 
	 * @example <caption>Programmatic</caption>
	 * JS:
	 * require(["delite/register", "deliteful/List",
	 *   "deliteful/Combobox", ..., "requirejs-domready/domReady!"],
	 *   function (register, List, Combobox, ...) {
	 *     register.parse();
	 *     var dataStore = ...; // Create data store
	 *     var list = new List({store: dataStore});
	 *     var combobox = new Combobox({list: list, selectionMode: "multiple"}).
	 *       placeAt(...);
	 *   });
	 * 
	 * @class module:deliteful/Combobox
	 * @augments module:delite/HasDropDown
	 * @augments module:delite/FormValueWidget
	 */
	return register("d-combobox", [HTMLElement, HasDropDown, FormValueWidget],
		/** @lends module:deliteful/Combobox# */ {
		
		// TODO: handle the situation the list has a null/undefined store.
		// Would be nice to have a global policy for all subclasses of
		// delite/Store (in terms of error feedback).
		// TODO: future mechanism at the level of delite/Store-delite/StoreMap
		// to allow delegation from host widget to a different widget - to get
		// a clean mechanism to support all possible use-cases. (Probably also
		// requires changes in List).
		// TODO: improve API doc.
		// TODO: add (optional) placeholder?
		
		// Note: the property `disabled` is inherited from delite/FormWidget.
		
		baseClass: "d-combobox",
		
		template: template,
		
		/**
		 * If `true`, the list of options can be filtered thanks to an editable
		 * input element. Only used if `selectionMode` is "single".
		 * @member {boolean} module:deliteful/Combobox#autoFilter
		 * @default false
		 */
		autoFilter: false,
		
		/**
		 * The chosen filter mode. Only used if `autoFilter` is `true` and
		 * `selectionMode` is `"single"`.
		 *
		 * Valid values are:
		 *
		 * 1. "startsWith": the item matches if its label starts with the filter text.
		 * 2. "contains": the item matches if its label contains the filter text.
		 * 3. "is": the item matches if its label is the filter text.
		 *
		 * @member {string}
		 * @default "startsWith"
		 */
		filterMode: "startsWith",
		
		/**
		 * If `true`, the filtering of list items ignores case when matching possible items.
		 * Only used if `autoFilter` is `true` and `selectionMode` is `"single"`.
		 * @member {boolean} module:deliteful/Combobox#autoFilter
		 * @default true
		 */
		ignoreCase: true,
		
		/**
		 * The chosen selection mode.
		 *
		 * Valid values are:
		 *
		 * 1. "single": Only one option can be selected at a time.
		 * 2. "multiple": Several options can be selected.
		 *
		 * The value of this property determines the value of the `selectionMode`
		 * property of the List instance used by this widget for displaying the options:
		 * * The value "single" is mapped to "radio".
		 * * The value "multiple" is mapped to "multiple".
		 * 
		 * Note that, regardless of the selection mode, it is always possible to set 
		 * several selected items using the `selectedItem` or `selectedItems` properties
		 * of the List instance.
		 * The mode will be enforced only when using `setSelected()` and/or
		 * `selectFromEvent()` APIs of the List.
		 *
		 * @member {string}
		 * @default "single"
		 */
		selectionMode: "single",
		
		/**
		 * The `deliteful/list/List` element which provides and renders the options
		 * shown by the popup of the Combobox.
		 * Note that this property is set by default to a newly created instance of
		 * `deliteful/list/List`.
		 * @member {module:deliteful/list/List} module:deliteful/Combobox#list
		 * @default instance of deliteful/list/List
		 */
		list: null,
		
		// Flag used for binding the readonly attribute of the input element in the template
		_inputReadOnly: true,
		
		/**
		 * The value of the placeholder attribute of the input element used
		 * for filtering the list of options. The default value is provided by the
		 * "search-placeholder" key of the message bundle.
		 * @member {string}
		 * @default "Search"
		 */
		searchPlaceHolder: messages["search-placeholder"],
		
		/**
		 * The text displayed in the input element when more than one option is
		 * selected. The default value is provided by the "search-placeholder" key of
		 * the message bundle.
		 * @member {string}
		 * @default "Search"
		 */
		multipleChoiceMsg: messages["multiple-choice"],
		
		/**
		 * The text displayed in the input element when no option is selected.
		 * The default value is provided by the "multiple-choice-no-selection" key of
		 * the message bundle.
		 * @member {string}
		 * @default "Select option(s)"
		 */
		multipleChoiceNoSelectionMsg: messages["multiple-choice-no-selection"],
		
		// TODO: worth exposing public properties?
		// The default label of the OK button
		_okButtonLabel: messages["ok-button-label"],
		// The default label of the Cancel button
		_cancelButtonLabel: messages["cancel-button-label"],
		
		preRender: function () {
			this.list = new List();
			this._defaultList = this.list;
		},
		
		refreshRendering: function (oldValues) {
			if ("list" in oldValues) {
				// Programmatic case (List passed as argument of the ctor of Combobox
				// or set after the initialization phase)
				this._initList();
			} else if ("selectionMode" in oldValues) {
				if (this.list) {
					this.list.selectionMode = this.selectionMode === "single" ?
						"radio" : "multiple";
				}
			}
		},
		
		attachedCallback: function () {
			// Declarative case (list specified declaratively inside the declarative Combobox)
			if (!this.list || this.list === this._defaultList) {
				var list = this.querySelector("d-list");
				if (list) {
					this.list = list;
					delete this._defaultList; // not needed anymore
					if (!this.list.attached) {
						this.list.addEventListener("customelement-attached",
							this._attachedlistener = function () {
								this._initList();
								this.list.removeEventListener("customelement-attached", this._attachedlistener);
							}.bind(this));
					} else {
						this._initList();
					}
				} else if (this.list && this.list === this._defaultList) {
					// Still with the default list. No other instance has been set
					// either programmatically, or declaratively.
					delete this._defaultList; // not needed anymore
					this._initList();
				}
			}
		},
		
		_initList: function () {
			// TODO
			// This is a workaround waiting for a proper mechanism (at the level
			// of delite/Store - delite/StoreMap) to allow a store-based widget
			// to delegate the store-related functions to a parent widget.
			if (!this.list.attached) {
				this.list.attachedCallback();
			}
			
			// Class added on the list such that Combobox' theme can have a specific
			// CSS selector for elements inside the List when used as dropdown in
			// the combo. 
			domClass.add(this.list, "d-combobox-list");
			
			// The drop-down is hidden initially
			domClass.add(this.list, "d-combobox-list-hidden");
			
			// The role=listbox is required for the list part of a combobox by the
			// aria spec of role=combobox
			this.list.isAriaListbox = true;
			
			// Avoid that List gives focus to list items when navigating, which would
			// blur the input field used for entering the filtering criteria. 
			this.list.focusDescendants = false;
			
			this.list.selectionMode = this.selectionMode === "single" ?
				"radio" : "multiple";
			
			var dropDown = this._createDropDown(this.list);
			
			// Since the dropdown is not a child of the Combobox, it will not inherit
			// its dir attribute. Hence:
			var dir = this.getAttribute("dir");
			if (dir) {
				dropDown.setAttribute("dir", dir);
			}
			
			this.dropDown = dropDown; // delite/HasDropDown's property
			
			/* TODO: keyboard navigation support will come later.
			this.list.on("keynav-child-navigated", function(evt) {
				var input = this._popupInput || this.inputNode;
				if (evt.newValue) {
					this.list.selectFromEvent(evt, evt.newValue, evt.newValue, true);
					input.setAttribute("aria-activedescendant", evt.newValue.id);
				} else {
					input.removeAttribute("aria-activedescendant");
				}
			}.bind(this));
			*/

			if (this.selectionMode === "single") {
				// List already filled
				var firstItemRenderer = this.list.getItemRendererByIndex(0);
				if (firstItemRenderer) {
					this.inputNode.value = this._getItemRendererLabel(firstItemRenderer);
					// Initialize widget's value
					this._set("value", this._getItemRendererValue(firstItemRenderer));
					this.list.selectedItem = firstItemRenderer.item;
				} else {
					// For future updates:
					var initDone = false;
					this.list.on("query-success", function () {
						if (!initDone) {
							var firstItemRenderer = this.list.getItemRendererByIndex(0);
							var input = this._popupInput || this.inputNode;
							if (firstItemRenderer && !initDone) {
								input.value = this._getItemRendererLabel(firstItemRenderer);
								// Initialize widget's value
								this._set("value", this._getItemRendererValue(firstItemRenderer));
								this.list.selectedItem = firstItemRenderer.item;
							}
							initDone = true;
						}
					}.bind(this));
				}
			} // else, if selectionMode === "multiple", do not select the first
			// option, because it would be confusing; the user may scroll and
			// select some other option, without deselecting the first one. The
			// native select in multiple mode doesn't select any option by default either.
			
			var singleSelectionActionHandler = function (event, list) {
				var renderer = list.getEnclosingRenderer(event.target);
				if (renderer && !list.isCategoryRenderer(renderer)) {
					this.inputNode.value = this._getItemRendererLabel(renderer);
					this.list.selectedItem = renderer.item;
					this.value = this._getItemRendererValue(renderer);
					this.handleOnInput(this.value); // emit "input" event
					this.defer(function () {
						// deferred such that the user can see the selection feedback
						// before the dropdown is closed.
						this.closeDropDown(true/*refocus*/);
					}.bind(this), 100); // worth exposing a property for the delay?
				}
			}.bind(this);
			
			if (this.selectionMode === "single") {
				this.list.on("click", function (event) {
					singleSelectionActionHandler(event, this.list);
				}.bind(this));
				this.list.on("keydown", function (event) {
					if (event.keyCode === keys.ENTER) {
						singleSelectionActionHandler(event, this.list);
					}
				}.bind(this));
			} else { // selectionMode === "multiple"
				this.inputNode.value = this.multipleChoiceNoSelectionMsg;
				// if useCenteredDropDown is true, let the dropdown's OK/Cancel
				// buttons do the job
				if (!this.useCenteredDropDown()) {
					this.list.on("selection-change", function () {
						this._validateMultiple(this._popupInput || this.inputNode);
					}.bind(this));
				}
			}
			
			this._prepareInput(this.inputNode);
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
		
		/**
		 * Returns `true` if the dropdown should be centered, and returns
		 * `false` if it should be displayed below/above the widget.
		 * The default implementation returns `true` when running on
		 * iOS or Android, and returns `false` otherwise.
		 * @protected
		 */
		useCenteredDropDown: function () {
			// TODO: the decision about the choice criteria may be
			// revisited (phone vs tablets?).
			return has("ios") || has("android");
		},
		
		_createDropDown: function (list) {
			var centeredDropDown = this.useCenteredDropDown();
			
			// The Combobox template binds the readonly attribute of the input
			// element on this property 
			this._inputReadOnly = !this.autoFilter || centeredDropDown ||
				this.selectionMode === "multiple";
			
			var dropDown = centeredDropDown ?
				this._createCenteredDropDown(list) :
				this._createNormalDropDown(list);
			
			this.dropDownPosition = centeredDropDown ?
				["center"] :
				["below", "above"]; // this is the default
			// TODO: since the user can override the protected "useCenteredDropDown()",
			// we many want to cope with a dynamic change from centered to non-centered
			// and vice-versa.
			
			return dropDown;
		},
		
		_createNormalDropDown: function (list) {
			// Use the List itself as content of the popup. Embedding it in a
			// LinearLayout has seemed useful for solving layout issues on iOS
			// (deliteful issue #270), but appears to be harmful on IE11 (deliteful
			// issue #382). Hence the List is not wrapped anymore inside a LinearLayout.
			return list;
		},
		
		_createCenteredDropDown: function (list) {
			// TODO: move to separate widget.
			var topLayout = new LinearLayout();

			if (this.autoFilter && this.selectionMode !== "multiple") {
				this._popupInput = this._createPopupInput();
				topLayout.addChild(this._popupInput);
			}
			
			domClass.add(list, "fill");
			topLayout.addChild(list);
			
			// Just as Android for the native select element, only use ok/cancel
			// buttons in the multichoice case.
			if (this.selectionMode === "multiple") {
				var bottomLayout = new LinearLayout({vertical: false, width: "100%"});
				var cancelButton = new Button({label: this._cancelButtonLabel});
				var okButton = new Button({label: this._okButtonLabel});
				okButton.onclick = function () {
					this._validateMultiple(this.inputNode);
					this.closeDropDown();
				}.bind(this);
				cancelButton.onclick = function () {
					this.list.selectedItems = this._selectedItems;
					this.closeDropDown();
				}.bind(this);
				domClass.add(cancelButton, "fill");
				domClass.add(okButton, "fill");
				bottomLayout.addChild(cancelButton);
				bottomLayout.addChild(okButton);
				topLayout.addChild(bottomLayout);
			}
			return topLayout;
		},
		
		/**
		 * Creates the input element inside the popup.
		 * Only used for single-choice mode.
		 * @private
		 */
		_createPopupInput: function () {
			// TODO: use deliteful/SearchBox when will be available.
			var popupInput = document.createElement("input");
			domClass.add(popupInput, "d-combobox-popup-input");
			popupInput.setAttribute("role", "combobox");
			popupInput.setAttribute("autocomplete", "off");
			popupInput.setAttribute("autocapitalize", "none");
			popupInput.setAttribute("autocorrect", "off");
			popupInput.setAttribute("aria-autocomplete", "list");
			popupInput.setAttribute("type", "search");
			popupInput.setAttribute("placeholder", this.searchPlaceHolder);
			this._prepareInput(popupInput);
			return popupInput;
		},

		_prepareInput: function (inputElement) {
			this.on("input", function (evt) {
				// Would be nice to also have an "incrementalFilter" boolean property.
				// On desktop, this would allow to redo the filtering only for "change"
				// events, triggered when pressing ENTER. This would also fit for Chrome/Android,
				// where pressing the search key of the virtual keyboard also triggers a
				// change event. But there's no equivalent on Safari / iOS...
				this.filter(inputElement.value);
				this.openDropDown(); // reopen if closed
				// Stop the spurious "input" events emitted while the user types
				// such that only the "input" events emitted via FormValueWidget.handleOnInput()
				// bubble to widget's root node.
				evt.stopPropagation();
				evt.preventDefault();
			}.bind(this), inputElement);
			this.on("change", function (evt) {
				// Stop the spurious "change" events emitted while the user types
				// such that only the "change" events emitted via FormValueWidget.handleOnChange()
				// bubble to widget's root node.
				evt.stopPropagation();
				evt.preventDefault();
			}.bind(this), inputElement);
			this.on("keydown", function (evt) {
				// deliteful issue #382: prevent the browser from navigating to
				// the previous page when typing backspace in a readonly input
				if (inputElement.readOnly && evt.keyCode === keys.BACKSPACE) {
					evt.stopPropagation();
					evt.preventDefault();
				}
			}.bind(this), inputElement);
		},
		
		_validateMultiple: function (inputElement) {
			var selectedItems = this.list.selectedItems;
			var n = selectedItems ? selectedItems.length : 0;
			var value = [];
			if (n > 1) {
				inputElement.value = this.multipleChoiceMsg;
				for (var i = 0; i < n; i++) {
					value.push(selectedItems[i] ? this._getItemValue(selectedItems[i]) : "");
				}
			} else if (n === 1) {
				var selectedItem = this.list.selectedItem;
				inputElement.value = this._getItemLabel(selectedItem);
				value.push(this._getItemValue(selectedItem));
			} else { // no option selected
				inputElement.value = this.multipleChoiceNoSelectionMsg;
			}
			this._set("value", value);
			this.handleOnInput(this.value); // emit "input" event
		},
		
		/**
		 * Filters the embedded List to only show the items matching `filterTxt`.
		 * If `autoFilter` is `true` and `selectionMode` is `"single"`, the method
		 * is called automatically while the user types into the editable input
		 * element, with `filterTxt` being the currently entered text.
		 * The default implementation uses `dstore/Filter.match()`.
		 * The matching is performed against the `list.labelAttr` attribute of
		 * the data store items.
		 * The method can be overridden for implementing other filtering strategies.
		 * @protected
		 */
		filter: function (filterTxt) {
			if (this.filterMode === "startsWith") {
				filterTxt = "^" + filterTxt;
			} else if (this.filterMode === "is") {
				filterTxt = "^" + filterTxt + "$";
			} // nothing to add for "contains"
			
			// TODO: might be nice that, if no item matches the query thus the list is empty,
			// the popup shows some specific graphic feedback.
			var rexExp = new RegExp(filterTxt, this.ignoreCase ? "i" : "");
			this.list.query = (new Filter()).match(this.list.labelAttr, rexExp);
		},
		
		openDropDown: dcl.superCall(function (sup) {
			return function () {
				var selectedItems = this.list.selectedItems;
				// Store the value, to be able to restore on cancel. (Could spare
				// it in situations when there is  no cancel button, though.)
				this._selectedItems = selectedItems;
				
				// Temporary workaround for issue with bad pairing in List of the 
				// busy on/off state. The issue appears to go away if List.attachedCallback
				// wouldn't break the automatic chaining (hence the workaround wouldn't
				// be necessary if List gets this change), but this requires further
				// investigation (TODO). 
				this.defer(function () {
					this.list._hideLoadingPanel();
				}.bind(this), 300);
				
				sup.apply(this, arguments);
				
				var firstSelectedItem = selectedItems && selectedItems.length > 0 ?
					selectedItems[0] : null;
				if (firstSelectedItem) {
					// Make the first selected item (if any) visible.
					// Must be done after sup.apply, because List.getBottomDistance
					// relies on dimensions which are not available if the DOM nodes
					// are not (yet) visible, hence the popup needs to be shown before.
					var id = this.list.getIdentity(firstSelectedItem);
					var renderer = this.list.getRendererByItemId(id);
					this.list.scrollBy({y: this.list.getBottomDistance(renderer)});
				}
			};
		}),
		
		closeDropDown: dcl.superCall(function (sup) {
			return function () {
				// Closing the dropdown represents a commit interaction
				this.handleOnChange(this.value); // emit "change" event
				
				// Reinit the query. Necessary such that after closing the dropdown
				// in autoFilter mode with a text in the input field not matching
				// any item, when the dropdown will be reopen it shows all items
				// instead of being empty 
				this.list.query = {};
				
				if (this.selectionMode === "single" && this.autoFilter) {
					// In autoFilter mode, reset the content of the inputNode when
					// closing the dropdown, such that next time the dropdown is opened
					// it doesn't show the text the user may have entered for filtering
					this.inputNode.value = this._getItemLabel(this.list.selectedItem);
				}
				
				sup.apply(this, arguments);
			};
		})
	});
});
