/** @module deliteful/Combobox */
define([
	"dcl/dcl",
	"dstore/Filter",
	"dojo/string",
	"decor/ObservableArray",
	"decor/Observable",
	"delite/register",
	"delite/CssState",
	"delite/FormValueWidget",
	"delite/HasDropDown",
	"./list/List",
	"./features!desktop-like-channel?:./Combobox/ComboPopup",
	"delite/handlebars!./Combobox/Combobox.html",
	"requirejs-dplugins/i18n!./Combobox/nls/Combobox",
	"delite/theme!./Combobox/themes/{{theme}}/Combobox.css"
], function (
	dcl,
	Filter,
	string,
	ObservableArray,
	Observable,
	register,
	CssState,
	FormValueWidget,
	HasDropDown,
	List,
	ComboPopup,
	template,
	messages
) {

	// Counter used to generate unique ids for the dropdown items, so that aria-activedescendant is set to
	// a reasonable value.
	var idCounter = 1;

	/**
	 * A form-aware and store-aware multichannel widget leveraging the `deliteful/list/List`
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
	 * The widget provides multichannel rendering. Depending on the required channel, which
	 * is determined by the value of the channel flags of `deliteful/features`, the
	 * widget displays the popup containing the options in a different manner:
	 *
	 * - if `has("desktop-like-channel")` is `true`: in a popup below or above the root node.
	 * - otherwise (that is for `"phone-like-channel"` and `"tablet-like-channel"`): in an
	 * overlay centered on the screen, filled with an instance of `deliteful/Combobox/ComboPopup`.
	 *
	 * The channel flags are set by `deliteful/features` using CSS media queries depending on
	 * the screen size. See the `deliteful/features` documentation for information about the
	 * channel flags and about how to configure them statically and how to customize the values
	 * of the screen size breakpoints used by the media queries.
	 *
	 * The `value` property of the widget contains:
	 *
	 * - Single selection mode: the value of the selected list items. By default, the
	 * value of the first item is selected.
	 * - Multiple selection mode: an array containing the values of the selected items.
	 * Defaults to `[]`.
	 *
	 * If the widget is used in an HTML form, the submitted value contains:
	 *
	 * - Single selection mode: the same as widget's `value` property.
	 * - Multiple selection mode: a string containing a comma-separated list of the values
	 * of the selected items. Defaults to `""`.
	 *
	 * By default, the `label` field of the list render item is used as item value.
	 * A different field can be specified by using attribute mapping for `value` on the
	 * List instance.
	 *
	 * Remark: the option items must be added, removed or updated exclusively using
	 * List's store API. Direct operations using the DOM API are not supported.
	 *
	 * @example <caption>Markup</caption>
	 * JS:
	 * require(["deliteful/Combobox", "requirejs-domready/domReady!"],
	 *   function () {
	 *   });
	 * HTML:
	 * <d-combobox id="combobox1">
	 *   { "label": "France", "sales": 500, "profit": 50, "region": "EU" },
	 *   { "label": "Germany", "sales": 450, "profit": 48, "region": "EU" },
	 *   { "label": "UK", "sales": 700, "profit": 60, "region": "EU" },
	 *   { "label": "USA", "sales": 2000, "profit": 250, "region": "America" },
	 *   { "label": "Canada", "sales": 600, "profit": 30, "region": "America" },
	 *   { "label": "Brazil", "sales": 450, "profit": 30, "region": "America" },
	 *   { "label": "China", "sales": 500, "profit": 40, "region": "Asia" },
	 *   { "label": "Japan", "sales": 900, "profit": 100, "region": "Asia" }
	 * </d-combobox>
	 *
	 * @example <caption>Programmatic</caption>
	 * JS:
	 * require(["deliteful/List",
	 *   "deliteful/Combobox", ..., "requirejs-domready/domReady!"],
	 *   function (List, Combobox, ...) {
	 *     var dataStore = ...; // Create data store
	 *     var combobox = new Combobox({source: dataStore, selectionMode: "multiple"}).
	 *       placeAt(...);
	 *   });
	 *
	 * @class module:deliteful/Combobox
	 * @augments module:delite/HasDropDown
	 * @augments module:delite/FormValueWidget
	 */
	return register("d-combobox", [HTMLElement, HasDropDown, FormValueWidget, CssState],
		/** @lends module:deliteful/Combobox# */ {

		// TODO: handle the situation the list has a null/undefined store.
		// Would be nice to have a global policy for all subclasses of
		// delite/Store (in terms of error feedback).
		// TODO: future mechanism at the level of delite/Store-delite/StoreMap
		// to allow delegation from host widget to a different widget - to get
		// a clean mechanism to support all possible use-cases. (Probably also
		// requires changes in List).

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
		 * The text displayed in the input element when no option is selected.
		 * The default value is provided by the "multiple-choice-no-selection" key of
		 * the message bundle. This message can contains placeholders for the
		 * Combobox attributes to be replaced by their runtime value. For example, the
		 * message can include the number of selected items by using the
		 * placeholder `${items}`.
		 * @member {string}
		 * @default localized version of "{items} selected"
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

		/**
		 * The text displayed in the OK button when the combobox popup contains such a button.
		 * The default value is provided by the "ok-button-label" key of
		 * the message bundle.
		 * @member {string}
		 * @default "OK"
		 */
		okMsg: messages["ok-button-label"],

		/**
		 * The text displayed in the Cancel button when the combobox popup contains such a button.
		 * The default value is provided by the "cancel-button-label" key of
		 * the message bundle.
		 * @member {string}
		 * @default "Cancel"
		 */
		cancelMsg: messages["cancel-button-label"],

		/**
		 * Displays or not the down arrow button.
		 * @type {boolean}
		 * @default true
		 */
		hasDownArrow: true,

		/**
		 * Source for the inner list.
		 * @type {dstore/Store|decor/ObservableArray|Array} Source set.
		 */
		source: null,

		/**
		 * Minimum number of characters before the dropdown automatically opens.
		 * However, aside the above, depending of its value, the widget behavior changes slightly.
		 * In fact:
		 * - if minFilterChars = 0
		 * -- show the dropdown on pointer down.
		 * -- show the dropdown even if the user clears the input field.
		 * - if minFilterChars = 1
		 * -- do not show the dropdown on pointer down.
		 * -- clearing the input field will close the dropdown.
		 * @type {number}
		 * @default 1
		 */
		minFilterChars: 1,

		/**
		 * Text displayed in the Combobox's `<input>`.
		 * @type {string}
		 */
		displayedValue: "",

		/**
		 * It's `true` if the dropdown should be centered, and returns
		 * `false` if it should be displayed below/above the widget.
		 * It's `true` when the module `deliteful/Combobox/ComboPopup` has
		 * been loaded. Note that the module is loaded conditionally, depending
		 * on the channel has() features set by `deliteful/features`.
		 */
		_isMobile: !!ComboPopup,

		/**
		 * The Combobox widget is a special component where we don't need to move the
		 * aria attributes from the root element to the focusNode. So here we're
		 * overriding this property to false, disabling the move procedure.
		 */
		moveAriaAttributes: false,

		createdCallback: function () {
			// Declarative case.
			var list = this.querySelector("d-list");
			if (list) {
				// Old API: <d-list> child of <d-combobox>.  Possibly remove this in the future.
				if (!list.attached) {
					list.addEventListener("customelement-attached", this._attachedlistener = function () {
						list.removeEventListener("customelement-attached", this._attachedlistener);
						this.list = list;
						this.deliver();
					}.bind(this));
				} else {
					this.list = list;
				}
			} else if (this.textContent.trim()) {
				// New API: JSON data as innerHTML of <d-combobox>.
				var data = JSON.parse("[" + this.textContent + "]");
				if (data.length) {
					this.source = new ObservableArray();
					for (var j = 0; j < data.length; j++) {
						if (!data[j].id) {
							data[j].id = Math.random();
						}
						this.source[j] = new Observable(data[j]);
					}
				}
				this.textContent = "";
			}
		},

		/**
		 * Handle clicks on the `<input>`.
		 * Note that HasDropDown handles clicks on the arrow icon.
		 */
		inputClickHandler: function (event) {
			event.stopPropagation();
			event.preventDefault();

			if (this.disabled) {
				return;
			}

		    if (this._isMobile || !this.minFilterChars || this._inputReadOnly) {
				this.toggleDropDown();
			}
		},

		parseAttribute: dcl.superCall(function (sup) {
			return function (name, value) {
				var capitalize = /f(?=unc$)|a(?=ttr$)/;
				if (/Attr$|Func$/i.test(name)) {
					name = name.toLowerCase();	// needed only on IE9
					name = this._propCaseMap[name] ||
							name.replace(capitalize, capitalize.exec(name)[0].toUpperCase());
					return {
						prop: name,
						value: /Attr$/.test(name) ? value :
							this.parseFunctionAttribute(value, ["item", "store", "value"])
					};
				} else {
					return sup.apply(this, arguments);
				}
			};
		}),

		attachedCallback: function () {
			if (!this.list) {
				var regexp = /^(?!_)(\w)+(?=Attr$|Func$)/;
				var listArgs = {
					showNoItems: true
				};

				// attributes
				this._parsedAttributes.filter(function (attr) {
					return regexp.test(attr.prop);
				}).forEach(function (item) {
					listArgs[item.prop] = item.value;
				}.bind(this));

				// properties
				for (var prop in this) {
					var match = regexp.exec(prop);
					if (match && !(match.input in listArgs)) {
						listArgs[match.input] = this[match.input];
					}
				}

				this.list = new List(listArgs);
				this.deliver();
			}

			if (!this.list.id) {
				this.list.id = this.id ? this.id + "-list" : this.widgetId + "-list";
			}
		},

		postRender: function () {
			this._prepareInput(this.inputNode);
		},

		computeProperties: function (oldValues) {
			// If value was specified as a string (like during creation from markup),
			// but selectionMode === multiple, need to convert it to an array.
			if (this.selectionMode === "multiple" && typeof this.value === "string") {
				this.value = this.value ? this.value.split(",") : [];

				// So computeProperties doesn't get called again and oldValues contains "value"
				// but not "displayedValue", which would trigger code below to run.
				this.discardComputing();
			}

			this._inputReadOnly = this.readOnly || !this.autoFilter ||
				this._isMobile || this.selectionMode === "multiple";

			// Set this.displayedValue based on this.value.
			if ("value" in oldValues) {
				if (this.selectionMode === "multiple" && this.value.length === 0) {
					this.displayedValue = this.multipleChoiceNoSelectionMsg;
				} else if (this.selectionMode === "multiple" && this.value.length > 1) {
					this.displayedValue = string.substitute(this.multipleChoiceMsg, {items: this.value.length});
				}
			}
		},

		/* jshint maxcomplexity: 17 */
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
			if ("_inputReadOnly" in oldValues) {
				// Note: Can't just put readonly={{_inputReadOnly}} in the template because we need to override
				// when delite/FormWidget sets the <input>'s readonly attribute based on this.readOnly.
				this.inputNode.readOnly = this._inputReadOnly;
			}

			// Update <input>'s value if necessary, but don't update the value because the user
			// typed a character into the <input> as that will move the caret to the end of the
			// <input>.
			if ("displayedValue" in oldValues) {
				if (this.displayedValue !== this.inputNode.value) {
					this.inputNode.value = this.displayedValue;
				}
				if (this._popupInput && this.displayedValue !== this._popupInput.value) {
					this._popupInput.value = this.displayedValue;
				}
			}
		},

		afterFormResetCallback: function () {
			if (this.value !== this.valueNode.value) {
				if (this.selectionMode === "single") {
					this.value = this.valueNode.value || "";
				} else if (this.selectionMode === "multiple") {
					this.value = this.valueNode.value ? this.valueNode.value.split(",") : [];
				}
			}
		},

		_initList: function () {
			if (this.list) {
				// TODO
				// This is a workaround waiting for a proper mechanism (at the level
				// of delite/Store - delite/StoreMap) to allow a store-based widget
				// to delegate the store-related functions to a parent widget (delite#323).
				if (!this.list.attached) {
					this.list.attachedCallback();
				}

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
					if (this.selectionMode === "single" && !this.list.isSelected(item)) {
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
						if (rend && !this.list.isCategoryRenderer(rend)) {
							this.defer(function () {
								// deferred such that the user can see the selection feedback
								// before the dropdown closes.
								this.closeDropDown(true/*refocus*/);
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

		loadDropDown: function () {
			var dropDown = this._isMobile ?
				this.createCenteredDropDown() :
				this.createAboveBelowDropDown();

			this.dropDownPosition = this._isMobile ?
				["center"] :
				["below", "above"]; // this is the default

			// Since the dropdown is not a child of the Combobox, it will not inherit
			// its dir attribute. Hence:
			var dir = this.getAttribute("dir");
			if (dir) {
				dropDown.setAttribute("dir", dir);
			}

			this.dropDown = dropDown; // delite/HasDropDown's property

			if (this._isMobile) {
				// Set correct (initial) value of aria-expanded on ComboPopup <input>.
				this._togglePopupList(dropDown.inputNode);
			}

			return dropDown;
		},

		/**
		 * Factory method which creates the widget used inside above/below drop-down.
		 * The default implementation simply returns `this.list`.
		 * @protected
		 */
		createAboveBelowDropDown: function () {
			// Use the List itself as content of the popup. Embedding it in a
			// LinearLayout has seemed useful for solving layout issues on iOS
			// (deliteful issue #270), but appears to be harmful on IE11 (deliteful
			// issue #382). Hence the List is not wrapped anymore inside a LinearLayout.
			return this.list;
		},

		/**
		 * Factory method which creates the widget used inside centered drop-down.
		 * The default implementation returns a new instance of deliteful/Combobox/ComboPopup
		 * (the present widget is set for its `combobox` property).
		 * The method can be overridden in order to create a subclass of ComboPopup (for
		 * specifying a custom template, for instance).
		 * @protected
		 */
		createCenteredDropDown: function () {
			return new ComboPopup({combobox: this});
		},

		/**
		 * Toggles the popup's visibility.
		 * If in mobile, toggles list visibility.
		 * If in desktop, closes or opens the popup.
		 */
		_togglePopupList: function (inputElement, suppressChangeEvent) {
			// Compute whether or not to show the list.  Note that in mobile mode ComboPopup doesn't display a
			// down arrow icon to manually show/hide the list, so on mobile,
			// if the Combobox has a down arrow icon, the list is always shown.
			var showList = inputElement.value.length >= this.minFilterChars ||
				(this._isMobile && this.hasDownArrow);
			if (this._isMobile) {
				// Mobile version.
				if (showList) {
					this.filter(inputElement.value);
				}
				this.list.setAttribute("d-shown", "" + showList);
				if (this.dropDown) {
					this.dropDown.inputNode.setAttribute("aria-expanded", "" + showList);
					this.list.emit("delite-size-change");
				}
			} else {
				// Desktop version.
				if (showList) {
					this.openDropDown();
				} else {
					this.closeDropDown(true /*refocus*/, suppressChangeEvent);
				}
			}
		},

		/**
		 * True iff the `<input>`'s value was set by user typing.
		 * We only filter the dropdown list when the value was set by the user typing into the `<input>`,
		 * and specifically avoid filtering the list to a single item when the user selects an item from
		 * list and then reopens the dropdown.
		 */
		_valueSetByUserInput: false,

		_setValueAttr: function (val) {
			if (val !== this.value) {
				this._set("value", val);
				this._valueSetByUserInput = false;
			}
		},

		/**
		 * Defines the milliseconds the widget has to wait until a new filter operation starts.
		 * @type {Number}
		 * @default 0
		 */
		filterDelay: 0,

		_prepareInput: function (inputElement) {
			this.on("input", function (evt) {
				// TODO
				// Would be nice to also have an "incrementalFilter" boolean property.
				// On desktop, this would allow to redo the filtering only for "change"
				// events, triggered when pressing ENTER. This would also fit for Chrome/Android,
				// where pressing the search key of the virtual keyboard also triggers a
				// change event. But there's no equivalent on Safari / iOS...

				// save what user typed at each keystroke.
				this.displayedValue = inputElement.value;

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
					this._togglePopupList(inputElement, true);
				}.bind(this), this.filterDelay);

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
				/* jshint maxcomplexity: 16 */
				// deliteful issue #382: prevent the browser from navigating to
				// the previous page when typing backspace in a readonly input
				if (inputElement.readOnly && evt.key === "Backspace") {
					evt.stopPropagation();
					evt.preventDefault();
				} else if (evt.key === "Enter") {
					evt.stopPropagation();
					evt.preventDefault();
					if (this.opened) {
						this.closeDropDown(true/*refocus*/);
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
					if (this._isMobile) {
						this.list.emit("keydown", evt);
					}
					evt.stopPropagation();
					evt.preventDefault();
				}
			}.bind(this), inputElement);
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
		 * Sets the new list's query.
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

		/**
		 * Consists in the default query to apply to the source.
		 * It can be a `function` or a `Object`.
		 * If it is a function, then it's invoked and the list's query will get the return value.
		 * If it is an Object, it's assigned to the list's query directly.
		 * It can be overridden depending of store used and the strategy to apply.
		 */
		defaultQuery: {},

		_getDefaultQuery: function () {
			return (typeof this.defaultQuery === "function") ?
				this.defaultQuery() : this.defaultQuery;
		},

		_setSelectedItems: function () {
			if (this.list.source && this.list.renderItems && this.value !== "") {
				var selectedItems = [],
					presetItems = this.value instanceof Array && this.value.length >= 1 ? this.value : [this.value];
				selectedItems = this.list.renderItems.filter(function (renderItem) {
					return presetItems.indexOf(this._getItemValue(renderItem)) >= 0;
				}.bind(this));

				this.list.selectedItems = selectedItems;
				if (selectedItems.length) {
					this._validateInput();
				}
			}
		},

		openDropDown: dcl.superCall(function (sup) {
			return function () {
				if (this._isMobile) {
					// We are opening the ComboPopup but may or may not want to show the list.
					// TogglePopupList will decide the right thing to do.
					this._togglePopupList(this.inputNode);
				} else {
					// On desktop, we definitely want to display the list.
					// Adjust the dropdown contents to be filtered by the current value of the <input>.
					this.filter(this.inputNode.value);
				}

				this._setSelectedItems();

				if (!this.opened) {
					// On desktop, leave focus in the original <input>.  But on mobile, focus the popup dialog.
					this.focusOnPointerOpen = this.focusOnKeyboardOpen = this._isMobile;

					if (!this._isMobile) {
						this.defer(function () {
							// Avoid losing focus when clicking the arrow (instead of the input element):
							// TODO: isn't this already handled by delite/HasDropDown#_dropDownPointerUpHandler() ?
							this.focusNode.focus();
						}.bind(this), 300);
					}
				}

				var promise = sup.apply(this, arguments);

				return promise.then(function () {
					this.inputNode.setAttribute("aria-controls", this.dropDown.id);

					// Avoid that List gives focus to list items when navigating, which would
					// blur the input field used for entering the filtering criteria.
					this.dropDown.focusDescendants = false;
					if (!this._isMobile) {
						// desktop version
						this._updateScroll(undefined, true);	// sets this.list.navigatedDescendant
						this._setActiveDescendant(this.list.navigatedDescendant);
					} else {
						if (this.hasDownArrow) {
							this.dropDown.inputNode.value = this.displayedValue;
						}
						this.dropDown.focus();
					}
				}.bind(this));
			};
		}),

		closeDropDown: dcl.superCall(function (sup) {
			return function (focus, suppressChangeEvent) {
				this.inputNode.removeAttribute("aria-activedescendant");
				this.inputNode.removeAttribute("aria-controls");

				// Closing the dropdown represents a commit interaction, unless the dropdown closes
				// automatically because the user backspaced, in which case suppressChangeEvent is true.
				if (!suppressChangeEvent) {
					this.handleOnChange(this.value); // emit "change" event
				}

				sup.apply(this, arguments);
			};
		}),

		// HasDropDown#_dropDownKeyUpHandler() override.
		// Do not call openDropDown if widget does not have a down arrow shown (auto-complete mode).
		// In this mode the popup will open when the user typed something and text.length > this.minFilterChars.
		_dropDownKeyUpHandler: dcl.superCall(function (sup) {
			return function () {
				if (this.hasDownArrow) {
					sup.call(this);
				}
			};
		}),

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
						this.list.navigatedDescendant = renderer.renderNode;
					}
				} // null if the list is empty because no item matches the auto-filtering
			}
		},

		_setActiveDescendant: function (nd) {
			if (nd) {
				if (!nd.id) {
					nd.id = "d-combobox-item-" + idCounter++;
				}

				this.inputNode.setAttribute("aria-activedescendant", nd.id);
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
