/** @module deliteful/Combobox */
define([
	"dcl/dcl",
	"dojo/dom-class", // TODO: replace (when replacement confirmed)
	"decor/sniff",
	"delite/register",
	"delite/FormWidget",
	"delite/HasDropDown",
	"delite/keys",
	"./list/List",
	"./LinearLayout",
	"./Button",
	"delite/handlebars!./Combobox/Combobox.html",
	"requirejs-dplugins/i18n!./Combobox/nls/Combobox",
	"delite/theme!./Combobox/themes/{{theme}}/Combobox.css"
], function (dcl, domClass, has, register, FormWidget, HasDropDown,
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
	 * are used for filtering the shown list items. The filtering is
	 * case-insensitive. An item is shown if the `label` property of the
	 * corresponding data item contains the entered string.
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
	 * @augments module:delite/FormWidget
	 */
	return register("d-combobox", [HTMLElement, HasDropDown, FormWidget],
		/** @lends module:deliteful/Combobox# */ {
		
		// TODO: handle the situation the list has a null/undefined store.
		// Would be nice to have a global policy for all subclasses of
		// delite/Store (in terms of error feedback).
		// TODO: future mechanism at the level of delite/Store-delite/StoreMap
		// to allow delegation from host widget to a different widget - to get
		// a clean mechanism to support all possible use-cases. (Probably also
		// requires changes in List).
		// TODO: improve API doc.
		
		// Note: the property `disabled` is inherited from delite/FormWidget.
		
		baseClass: "d-combobox",
		
		template: template,
		
		/**
		 * If `true`, the list of options can be filtered thanks to an editable
		 * input element. No-op if `selectionMode` is "multiple".
		 * @member {boolean} module:deliteful/Combobox#autoFilter
		 * @default false
		 */
		autoFilter: false,
		
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

		// TODO: worth exposing a property of it too?
		// The default text displayed in the input for a multiple choice
		_multipleChoiceMsg: messages["multiple-choice"],
		
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
				var input = this._popupInput || this.input;
				if (evt.newValue) {
					this.list.selectFromEvent(evt, evt.newValue, evt.newValue, true);
					input.setAttribute("aria-activedescendant", evt.newValue.id);
				} else {
					input.removeAttribute("aria-activedescendant");
				}
			}.bind(this));
			*/

			// List already filled
			var firstItemRenderer = this.list.getItemRendererByIndex(0);
			if (firstItemRenderer) {
				this.input.value = firstItemRenderer.item[this.list.labelAttr];
				// Initialize widget's value
				this._set("value", this.input.value);
			} else {
				// For future updates:
				var initDone = false;
				this.list.on("query-success", function () {
					if (!initDone) {
						var firstItemRenderer = this.list.getItemRendererByIndex(0);
						var input = this._popupInput || this.input;
						if (firstItemRenderer && !initDone) {
							input.value = firstItemRenderer.item[this.list.labelAttr];
							// Initialize widget's value
							this._set("value", input.value);
						}
						initDone = true;
					}
				}.bind(this));
			}
			
			var actionHandler = function (event, list) {
				var renderer = list.getEnclosingRenderer(event.target);
				if (renderer && !list.isCategoryRenderer(renderer)) {
					// __item is set by StoreMap.itemToRenderItem()
					var label = renderer.item.__item[list.labelAttr];
					this.input.value = label;
					// TODO: temporary till solving issues with introducing valueAttr
					this.value = label;
					if (this.selectionMode !== "multiple") {
						this.closeDropDown(true/*refocus*/);
					}
				}
			}.bind(this);
			
			if (this.selectionMode !== "multiple") {
				this.list.on("click", function (event) {
					actionHandler(event, this.list);
				}.bind(this));
				this.list.on("keydown", function (event) {
					if (event.keyCode === keys.ENTER) {
						actionHandler(event, this.list);
					}
				}.bind(this));
			}
			
			if (this.selectionMode === "multiple" &&
				!this.useCenteredDropDown()) {
				this.list.on("selection-change", function () {
					var selectedItem;
					var input = this._popupInput || this.input;
					var selectedItems = this.list.selectedItems;
					var n = selectedItems ? selectedItems.length : 0;
					if (n > 1) {
						input.value = this._multipleChoiceMsg;
					} else if (n === 1) {
						selectedItem = this.list.selectedItem;
						input.value = selectedItem ? selectedItem[this.list.labelAttr] : "";
					} else { // no option selected
						input.value = "";
					}
					
					this._set("value", input.value);
				}.bind(this));
			}
			
			this.on("input", function () {
				this.list.selectedItem = null;
				var txt = this.input.value;
				this.list.query = function (obj) {
					return this._filterFunction(obj[this.list.labelAttr], txt);
				}.bind(this);
				this.openDropDown(); // reopen if closed
			}.bind(this), this.input);
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
			// TODO: does it help to embed List in LinearLayout?
			// Depends on outcome of https://github.com/ibm-js/deliteful/pull/341
			// TODO: move to separate widget.
			var topLayout = new LinearLayout();
			domClass.add(list, "fill");
			topLayout.addChild(list);
			return topLayout;
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
				var cancelButton = new Button({label: "Cancel"});
				var okButton = new Button({label: "OK"});
				okButton.onclick = function () {
					var selectedItems = this.list.selectedItems;
					var n = selectedItems ? selectedItems.length : 0;
					if (n > 1) {
						this.input.value = this._multipleChoiceMsg;
					} else if (n === 1) {
						var selectedItem = this.list.selectedItem;
						this.input.value = selectedItem ? selectedItem[this.list.labelAttr] : "";
					} else { // no option selected
						this.input.value = "";
					}
					this.closeDropDown();
				}.bind(this);
				cancelButton.onclick = function () {
					this.list.selectedItems = this._selectedItems;
					this.closeDropDown();
				}.bind(this);
				bottomLayout.addChild(cancelButton);
				var centralSpan = document.createElement("div");
				domClass.add(centralSpan, "fill");
				bottomLayout.addChild(centralSpan);
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
			this.on("input", function () {
				this.list.selectedItem = null;
				var txt = this._popupInput.value;
				// TODO: what about server-side filtering of the store? (needs at least a
				// mechanism allowing the user to implement it).
				// TODO: might be nice that, if no item matches the query thus the list is empty,
				// the popup shows some specific graphic feedback.
				this.list.query = function (obj) {
					return this._filterFunction(obj[this.list.labelAttr], txt);
				}.bind(this);
				this.openDropDown(); // reopen if closed
			}.bind(this), popupInput);
			
			return popupInput;
		},
		
		_filterFunction: function (itemLabel, queryTxt) {
			// TODO: options for case-sensitiveness, startsWith/contains
			// TODO: check fancy locale support...
			queryTxt = queryTxt.toLocaleUpperCase();
			itemLabel = itemLabel.toLocaleUpperCase();
			return itemLabel.indexOf(queryTxt) === 0;
		},
		
		openDropDown: dcl.superCall(function (sup) {
			return function () {
				// Store the value, to be able to restore on cancel. (Could spare
				// it in situations when there is  no cancel button, though.)
				this._selectedItems = this.list.selectedItems;
				
				// Temporary workaround for issue with bad pairing in List of the 
				// busy on/off state. The issue appears to go away if List.attachedCallback
				// wouldn't break the automatic chaining (hence the workaround wouldn't
				// be necessary if List gets this change), but this requires further
				// investigation. 
				this.defer(function () {
					this.list._hideLoadingPanel();
				}.bind(this), 300);
				
				sup.apply(this, arguments);
			};
		}),
		
		closeDropDown: dcl.superCall(function (sup) {
			return function () {
				// Reinit the query. Necessary such that after closing the dropdown
				// in autoFilter mode with a text in the input field not matching
				// any item, when the dropdown will be reopen it shows all items
				// instead of being empty 
				this.list.query = {};
				sup.apply(this, arguments);
				document.body.style.overflow = "visible";
			};
		}),
		
		_setValueAttr: function (value) {
			if (this.valueNode) {
				this.valueNode.value = value;
			}
			this._set("value", value);
		}
	});
});
