/** @module deliteful/ComboBox */
define([
	"dcl/dcl",
	"dojo/dom-class", // TODO: replace (when replacement confirmed)
	"dojo/has", // has("touch") TODO: replace (add the feature to requirejs-dplugins/has?)
	"delite/register",
	"delite/FormWidget",
	"delite/HasDropDown",
	"delite/keys",
	"./list/List",
	"./LinearLayout",
	"./Button",
	"delite/handlebars!./ComboBox/ComboBox.html",
	"requirejs-dplugins/i18n!./ComboBox/nls/ComboBox",
	"delite/theme!./ComboBox/themes/{{theme}}/ComboBox.css"
], function (dcl, domClass, has, register, FormWidget, HasDropDown,
		keys, List, LinearLayout, Button, template, messages) {
	/**
	 * A form-aware and store-aware widget leveraging the deliteful/list/List widget
	 * for rendering the options.
	 * The corresponding custom tag is `<d-combobox>`.
	 * 
	 * TODO: improve doc.
	 * 
	 * Remark: the option items must be added, removed or updated exclusively using
	 * the List API. Direct operations using the DOM API are not supported.
	 * 
	 * @example <caption>Markup</caption>
	 * JS:
	 * require(["delite/register", "deliteful/Store",
	 *   "deliteful/ComboBox", "requirejs-domready/domReady!"],
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
	 *   "deliteful/ComboBox", ..., "requirejs-domready/domReady!"],
	 *   function (register, List, ComboBox, ...) {
	 *     register.parse();
	 *     var dataStore = ...; // Create data store
	 *     var list = new List({store: dataStore});
	 *     list.startup();
	 *     var comboBox = new ComboBox({list: list, selectionMode: "multiple"}).
				placeAt(...);
	 *   });
	 * 
	 * @class module:deliteful/ComboBox
	 * @augments module:delite/HasDropDown
	 * @augments module:delite/FormWidget
	 */
	return register("d-combobox", [HTMLElement, HasDropDown, FormWidget],
		/** @lends module:deliteful/ComboBox# */ {
		
		// Note: the property `disabled` is inherited from delite/FormWidget.
		
		baseClass: "d-combobox",
		
		template: template,
		
		/**
		 * If `true`, the list of options can be filtered thanks to an editable
		 * input element.
		 * @member {boolean} module:deliteful/ComboBox#autoFilter
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
		 * * The value"single" is mapped into "radio".
		 * * The value "multiple" is mapped into "multiple".
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
		 * shown by the popup of the ComboBox.
		 * @member {module:deliteful/list/List} module:deliteful/ComboBox#list
		 * @default null
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
		
		refreshRendering: function (oldValues) {
			if ("list" in oldValues) {
				// Programmatic case (List passed as ComboBox' ctor arg or set after the
				// initialization phase)
				this._initList(true/*addToDom*/);
			} else if ("selectionMode" in oldValues) {
				if (this.list) {
					this.list.selectionMode = this.selectionMode === "single" ?
						"radio" : "multiple";
				}
			}
		},
		
		attachedCallback: function () {
			// Declarative case (list specified declaratively inside the declarative ComboBox)
			if (!this.list) {
				this.list = this.querySelector("d-list");
				if (this.list) {
					if (!this.list.attached) {
						this.list.addEventListener("customelement-attached",
							this._attachedlistener = function () {
								this._initList(false/*addToDom*/);
								this.list.removeEventListener("customelement-attached", this._attachedlistener);
							}.bind(this));
					} else {
						this._initList(false/*addToDom*/);
					}
				}
			}
			
			// To provide graphic feedback for focus, react to focus/blur events
			// on the underlying native select. The CSS class is used instead
			// of the focus pseudo-class because the browsers give the focus
			// to the underlying select, not to the widget.
			this.on("focus", function (evt) {
				domClass.toggle(this, "d-combobox-focus", evt.type === "focus");
			}.bind(this), this);
			this.on("blur", function (evt) {
				domClass.toggle(this, "d-combobox-focus", evt.type === "focus");
			}.bind(this), this);
		},
		
		_initList: function (addToDom) {
			// Class added on the list such that ComboBox' theme can have a specific
			// CSS selector for elements inside the List when used as dropdown in
			// the combo. 
			domClass.add(this.list, "d-combobox-list");
			
			// The drop-down is hidden initially
			domClass.add(this.list, "d-combobox-list-hidden");
			
			if (addToDom) {
				// TODO CHECKME change of list must remove from DOM => custom setter??
				this.list.placeAt(this);
			}
			
			// The role=listbox is required for the list part of a combobox by the
			// aria spec of role=combobox
			this.list.isAriaListbox = true;
			
			// Avoid that List gives focus to list items when navigating, which would
			// blur the input field used for entering the filtering criteria. 
			this.list.focusDescendants = false;
			
			this.list.selectionMode = this.selectionMode === "single" ?
				"radio" : "multiple";
			
			var dropDown = this._createDropDown(this.list);
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
			} else {
				// For future updates:
				var initDone = false;
				this.list.on("query-success", function () {
					if (!initDone) {
						var firstItemRenderer = this.list.getItemRendererByIndex(0);
						var input = this._popupInput || this.input;
						if (firstItemRenderer && !initDone) {
							input.value = firstItemRenderer.item[this.list.labelAttr];
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
		 * The default implementation returns `true` on touch-enabled devices.
		 * @protected
		 */
		useCenteredDropDown: function () {
			// TODO: take final decision about the choice criteria
			return has("touch");
		},
		
		_createDropDown: function (list) {
			var centeredDropDown = this.useCenteredDropDown();
			
			// The ComboBox template binds the readonly attribute of the input
			// element on this property 
			this._inputReadOnly = centeredDropDown || this.selectionMode === "multiple";
			
			var dropDown = centeredDropDown ?
				this._createCenteredDropDown(list) :
				this._createNormalDropDown(list);
			
			this.forceWidth = true; // has no effect in "center" mode
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
			var topLayout = new LinearLayout();
			domClass.add(list, "fill");
			topLayout.addChild(list);
			topLayout.startup();
			return topLayout;
		},
		
		_createCenteredDropDown: function (list) {
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
				okButton.startup();
				bottomLayout.startup();
				topLayout.addChild(bottomLayout);
			}
			topLayout.startup();
			return topLayout;
		},
		
		/**
		 * Creates the input element inside the popup.
		 * Only used for single-choice mode.
		 * @private
		 */
		_createPopupInput: function () {
			var popupInput = document.createElement("input");
			domClass.add(popupInput, "d-combobox-popup-input");
			popupInput.setAttribute("role", "combobox");
			popupInput.setAttribute("autocomplete", "off");
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
				this.defer(function() {
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
		})
	});
});
