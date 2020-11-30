/** @module deliteful/Combobox */
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined";
import dcl from "dcl/dcl";
import has from "ibm-decor/sniff";
import register from "delite/register";
import HasDropDown from "delite/HasDropDown";
import StoreMap from "delite/StoreMap";
import messages from "requirejs-dplugins/i18n!./Combobox/nls/Combobox";
import "./Combobox/Combobox.css";
import string from "dojo/string";
import Filter from "dojo-dstore/Filter";
import LitFormValueWidget from "delite/LitFormValueWidget";
import CssState from "delite/CssState";

// Used in template.
import "./list/List";

const mobile = has("ios") || has("android");

// Counter used to generate unique ids for the dropdown items, so that aria-activedescendant is set to
// a reasonable value.
var idCounter = 1;

function getvalue (map, item, key, store) {
	if (map[key + "Func"]) {
		return map[key + "Func"](item, store);
	} else if (map[key + "Attr"]) {
		return item[map[key + "Attr"]];
	} else {
		return item[key];
	}
}

/**
 * A form-aware and store-aware multichannel widget leveraging the `deliteful/list/List`
 * widget for rendering the options.
 *
 * The corresponding custom tag is `<d-combobox>`.
 *
 * The property `selectionMode` allows to choose between single and multiple
 * choice modes.
 *
 * If the property `autoFilter` is set to `true` (default is `false`)
 * the widget allows to type one or more characters which
 * are used for filtering the shown list items. By default, the filtering is
 * case-insensitive, and an item is shown if its label contains the entered
 * string. The default filtering policy can be customized thanks to the
 * `filterMode` and `ignoreCase` properties.
 *
 * The `value` property of the widget contains:
 *
 * - Single selection mode: the value of the selected list items.  Defaults to `""`.
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
 * A different field can be specified by using attribute mapping for `value`.
 *
 * Remark: the option items must be added, removed or updated exclusively using
 * List's store API.  Direct operations using the DOM API are not supported.
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
 * require(["deliteful/Combobox", ..., "requirejs-domready/domReady!"],
 *   function (Combobox, ...) {
 *     var dataStore = ...; // Create data store
 *     var combobox = new Combobox({source: dataStore, selectionMode: "multiple"}).
 *       placeAt(...);
 *   });
 *
 * @class module:deliteful/Combobox
 */
const supers = [ HTMLElement, LitFormValueWidget, CssState, HasDropDown ];
export default register("d-combobox", supers, /** @lends module:deliteful/Combobox# */ {
	declaredClass: "deliteful/Combobox",

	baseClass: "d-combobox",

	/**
	 * Corresponds to the native HTML `<input>` element's attribute.
	 * @member {string}
	 */
	alt: "",

	/**
	 * If `true`, the list of options can be filtered thanks to an editable
	 * input element.
	 * @member {boolean} module:deliteful/Combobox#autoFilter
	 * @default false
	 */
	autoFilter: false,

	/**
	 * Default query to apply to the source.  It can be a `function` or a `Object`.
	 * If it is a function, then it's invoked and the list's query will get the return value.
	 * If it is an Object, it's assigned to the list's query directly.
	 * It can be overridden depending of store used and the strategy to apply.
	 */
	defaultQuery: {},

	/**
	 * Text displayed by the Combobox (as opposed to the internal value).
	 * @type {string}
	 */
	displayedValue: "",

	/**
	 * Defines the milliseconds the widget has to wait until a new filter operation starts.
	 * @type {Number}
	 * @default 0
	 */
	filterDelay: 0,

	/**
	 * The chosen filter mode. Only used if `autoFilter` is `true`.
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
	 * Displays or not the down arrow button.
	 * @type {boolean}
	 * @default true
	 */
	hasDownArrow: true,

	/**
	 * If `true`, the filtering of list items ignores case when matching possible items.
	 * Only used if `autoFilter` is `true`.
	 * @member {boolean}
	 * @default true
	 */
	ignoreCase: true,

	/**
	 * Minimum number of characters before the dropdown automatically opens.
	 * However, aside the above, depending of its value, the widget behavior changes slightly.
	 * In fact:
	 * - if minFilterChars = 0
	 * -- show the dropdown on pointer down.
	 * -- show the dropdown even if the user clears the input field.
	 * - if minFilterChars >= 1
	 * -- do not show the dropdown on pointer down.
	 * -- clearing the input field will close the dropdown.
	 * @type {number}
	 * @default 1
	 */
	minFilterChars: 1,

	/**
	 * For non-filterable Combobox with selectionMode=multiple,
	 * the text displayed in the input element when no option is selected.
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
	 * For non-filterable Combobox with selectionMode=multiple,
	 * the text displayed in the input element when no option is selected.
	 * The default value is provided by the "multiple-choice-no-selection" key of
	 * the message bundle.
	 * @member {string}
	 * @default "Select option(s)"
	 */
	multipleChoiceNoSelectionMsg: messages["multiple-choice-no-selection"],

	/**
	 * The value of the placeholder attribute of the input element used
	 * for filtering the list of options. The default value is provided by the
	 * "search-placeholder" key of the message bundle.
	 * @member {string}
	 * @default "Search"
	 */
	placeholder: messages["search-placeholder"],

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
	 * Source for the inner list.
	 * @type {dstore/Store|Array} Source set.
	 */
	source: null,

	/**
	 * The order in which fields are traversed when user presses the tab key.
	 * @member {number}
	 * @default 0
	 */
	tabIndex: 0,

	/**
	 * Mapping between the attribute of the item retrieved from the store
	 * and the label attribute expected by the default renderer
	 * @member {string}
	 * @default "label"
	 */
	labelAttr: "label",

	/**
	 * Mapping between the attribute of the item retrieved from the store
	 * and the icon attribute expected by the default renderer
	 * @member {string}
	 * @default "iconclass"
	 */
	iconclassAttr: "iconclass",

	/**
	 * Mapping between the attribute of the item retrieved from the store
	 * and the righttext attribute expected by the default renderer
	 * @member {string}
	 * @default "righttext"
	 */
	righttextAttr: "righttext",

	/**
	 * Mapping between the attribute of the item retrieved from the store
	 * and the righticon attribute expected by the default renderer
	 * @member {string}
	 * @default "righticonclass"
	 */
	righticonclassAttr: "righticonclass",

	/**
	 * Name of the list item attribute that define the category of a list item.
	 * If falsy and categoryFunc is also falsy, the list is not categorized.
	 * @member {string}
	 * @default ""
	 */
	categoryAttr: "",

	/**
	 * A function (or the name of a function) that extracts the category of a list item
	 * from the following input parameters:
	 * - `item`: the list item from the store
	 * - `store`: the store
	 * If falsy and `categoryAttr` is also falsy, the list is not categorized.
	 * see {@link module:delite/StoreMap delite/StoreMap}
	 * @member
	 * @default null
	 */
	categoryFunc: null,

	/**
	 * True iff the `<input>`'s value was set by user typing.
	 * We only filter the dropdown list when the value was set by the user typing into the `<input>`,
	 * and specifically avoid filtering the list to a single item when the user selects an item from
	 * list and then reopens the dropdown.
	 */
	_valueSetByUserInput: false,

	/**
	 * Corresponds to the native HTML `<input>` element's attribute.
	 * @member {string}
	 */
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

	// Node holding user input or currently selected value.
	focusNode: dcl.prop({
		get: function () {
			return this.querySelector("input");
		}
	}),

	// Hidden node used for form submission.
	valueNode: dcl.prop({
		get: function () {
			return this.querySelector("input[hidden]");
		}
	}),

	// Node to set aria-controls etc. attributes on.
	popupStateNode: dcl.prop({
		get: function () {
			return this.querySelector("[role=combobox]");
		}
	}),

	// Tell HasDropDown which button opens the dropdown.
	buttonNode: dcl.prop({
		get: function () {
			return this.querySelector(".d-combobox-arrow");
		}
	}),

	// Used to set list's source and query.  Eventually this should be done from the template.
	list: dcl.prop({
		get: function () {
			return this.querySelector("d-list");
		}
	}),

	/**
	 * Render the Combobox, including the dropdown list.
	 * @returns {TemplateResult}
	 */
	render: function () {
		return html`
			${this.renderAnchor()}
			${this.renderList()}
		`;
	},

	/**
	 * Render the the <input> with the button to open the dropdown.
	 * @returns {TemplateResult}
	 */
	renderAnchor: function () {
		const listbox = this.list && this.list.querySelector("[role=listbox]");

		// The arrow is normally invisible to screen readers, but for mobile the user needs to be able to navigate
		// to it, as they have no other way to open the dropdown without typing in a search string.
		const arrow = this.hasDownArrow ?
			(mobile ? html`<span class="d-combobox-arrow" role="button" aria-label="${messages.toggle}"></span>` :
				html`<span class="d-combobox-arrow" aria-hidden="true"></span>`) : null;

		return html`
			<div class="d-combobox-anchor">
				<input
					id="${this.id || this.widgetId}-input"
					class="d-combobox-input"
					autocomplete="off"
					autocorrect="off"
					autocapitalize="none"
					aria-autocomplete="list"
					aria-controls="${ifDefined(listbox && listbox.id)}"
					aria-expanded="${this.opened}"
					disabled="${ifDefined(this.disabled ? "true" : undefined)}"
					placeholder="${ifDefined(this.placeholder || undefined)}"
					readonly="${ifDefined(this._inputReadOnly ? "true" : undefined)}"
					role="combobox"
					tabindex="${this.tabIndex}"
					type="text"
					.value="${this.displayedValue}"
					@keydown="${this.inputKeydownHandler.bind(this)}"
					@input="${this.inputInputHandler.bind(this)}"
					@change="${this.inputChangeHandler.bind(this)}"
					@click="${this.inputClickHandler.bind(this)}">
				<input hidden name="${this.name}" value="${this.value}"
					disabled="${ifDefined(this.disabled ? "true" : undefined)}">
				${arrow}
			</div>
		`;
	},

	/**
	 * Render an empty list as the dropdown.  Other code will set the list's source and query.
	 */
	renderList: function () {
		return html`
			<d-list
				.ariaLabel="${this.getLabel()}"
				.categoryAttr="${this.categoryAttr}"
				.categoryFunc="${this.categoryFunc}"
				class="d-popup d-combobox-list"
				id="${this.id || this.widgetId}-list"
				.focusDescendants="${false}"
				.itemToRenderItem="${this.itemToRenderItem.bind(this)}"
				.selectionMode="${this.selectionMode === "single" ? "radio" : "multiple"}"
				.showNoItems="${true}"
				style="display: none"
				type="listbox"
				@keynav-child-navigated="${this.listKeynavChildNavigatedHandler.bind(this)}"
				@click="${this.listClickHandler.bind(this)}"
				@execute="${this.listExecuteHandler.bind(this)}"
				@selection-change="${this.listSelectionChangeHandler.bind(this)}"
				@query-success="${this.listQuerySuccessHandler.bind(this)}"
			></d-list>
		`;
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

	beforeInitializeRendering: function () {
		// If the control seems to contain JSON, then parse it as our data source.
		if (!this.firstElementChild && this.textContent.trim()) {
			var data = JSON.parse("[" + this.textContent + "]");
			if (data.length) {
				this.source = data;
				for (var j = 0; j < data.length; j++) {
					if (!data[j].id) {
						data[j].id = Math.random();
					}
				}
			}
			this.textContent = "";
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
						this.parseFunctionAttribute(value, [ "item", "store", "value" ])
				};
			} else {
				return sup.apply(this, arguments);
			}
		};
	}),

	connectedCallback: function () {
		// Preparation for itemToRenderItem() to work.
		StoreMap.prototype.introspectMappedProperties.call(this);
	},

	// Flag used for binding the readonly attribute of the input element in the template
	_inputReadOnly: true,

	// Set aria-hasdropdown=listbox rather than aria-hasdropdown=menu.
	dropDownType: "listbox",

	// Leave focus in the original <input>.
	focusOnPointerOpen: false,
	focusOnKeyboardOpen: false,

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

		if (!this.minFilterChars || this._inputReadOnly) {
			this.toggleDropDown();
		}
	},

	computeProperties: function (oldValues) {
		this._inputReadOnly = this.readOnly || !this.autoFilter;

		// If value was specified as a string (like during creation from markup),
		// but selectionMode === multiple, need to convert it to an array.
		if (this.selectionMode === "multiple" && typeof this.value === "string") {
			this.value = this.value ? this.value.split(",") : [];

			// So computeProperties doesn't get called again and oldValues contains "value"
			// but not "displayedValue", which would trigger code below to run.
			this.discardComputing();
		}

		// Set this.displayedValue based on this.value.
		if ("value" in oldValues && this.selectionMode === "multiple" && !this.autoFilter) {
			if (this.value.length === 0) {
				this.displayedValue = this.multipleChoiceNoSelectionMsg;
			} else if (this.value.length > 1) {
				this.displayedValue = string.substitute(this.multipleChoiceMsg, { items: this.value.length });
			}
		}
	},

	refreshRendering: function (oldValues) {
		if ("value" in oldValues) {
			// Update which list item(s) are selected.
			this._setSelectedItems();
		}
	},

	dropDownPosition: function () {
		return [ "below", "above" ];
	},

	_dropDownClickHandler: dcl.superCall(function (sup) {
		return function () {
			sup.apply(this, arguments);

			// Put focus on the <input>.
			// Except, don't focus the <input> on mobile because we don't want the keyboard to pop up
			// when the user just wants to select a value from the dropdown.
			if (!mobile) {
				this.defer(this.focus.bind(this));
			}
		};
	}),

	// HasDropDown#_dropDownKeyUpHandler() override.
	// Do not call openDropDown if widget does not have a down arrow shown (auto-complete mode).
	// In this mode the popup will open when the user typed something and text.length > this.minFilterChars.
	_dropDownKeyUpHandler: dcl.superCall(function (sup) {
		return function () {
			if (this.hasDownArrow) {
				sup.apply(this, arguments);
			}
		};
	}),

	/**
	 * Opens or closes the dropdown as appropriate.
	 */
	_showOrHideList: function (suppressChangeEvent) {
		// Compute whether or not to show the list.
		var inputElement = this.focusNode;
		var showList = inputElement.value.length >= this.minFilterChars;
		if (showList) {
			this.openDropDown();
		} else {
			this.closeDropDown(true /*refocus*/, suppressChangeEvent);
		}
	},

	openDropDown: dcl.superCall(function (sup) {
		return function () {
			// Adjust the dropdown contents to be filtered by the current value of the <input>.
			this.filter(this.focusNode.value);

			var promise = sup.apply(this, arguments);

			return promise.then(function () {
				// Remove aria-owns set by HasDropDown.  We set aria-controls in template instead.
				this.focusNode.removeAttribute("aria-owns");

				this._updateScroll(undefined, true);	// sets this.list.navigatedDescendant
				this._setActiveDescendant(this.list.navigatedDescendant);
			}.bind(this));
		};
	}),

	closeDropDown: dcl.superCall(function (sup) {
		return function (focus, suppressChangeEvent) {
			this.focusNode.removeAttribute("aria-activedescendant");

			// Closing the dropdown represents a commit interaction, unless the dropdown closes
			// automatically because the user backspaced, in which case suppressChangeEvent is true.
			if (!suppressChangeEvent) {
				this.handleOnChange(this.value); // emit "change" event
			}

			sup.apply(this, arguments);

			// For multi-select with auto-filter, the <input> never shows what the selected value is.
			// To avoid confusion, clear the filter string the user typed.
			if (this.selectionMode === "multiple" && this.autoFilter) {
				this.displayedValue = "";
			}
		};
	}),

	/**
	 * Search for label of Combobox, so it can be applied to dropdown too.
	 * @returns {any}
	 */
	getLabel: function () {
		var inputId = (this.id || this.widgetId) + "-input";
		var labelNode = (inputId &&
			this.ownerDocument.querySelector("label[for=" + inputId + "]")) ||
			(this.hasAttribute("aria-labelledby") &&
				this.ownerDocument.getElementById(this.getAttribute("aria-labelledby")));
		return labelNode ? labelNode.textContent.trim() : (this.getAttribute("aria-label") || "");
	},

	loadDropDown: function () {
		var dropDown = this.list;

		this.dropDown = dropDown; // delite/HasDropDown's property

		return dropDown;
	},

	// Override KeyNav#focusDescendants to not give list items focus when navigating,
	// since that would blur the input field used for entering the filtering criteria.
	focusDescendants: false,

	focus: function () {
		this.focusNode.focus();

		// Set flag used in "input' handler.
		this._justFocused = true;
		this.defer(function () {
			this._justFocused = false;
		});
	},

	listKeynavChildNavigatedHandler: function (evt) {
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
	},

	listClickHandler: function (evt) {
		if (this.selectionMode === "single") {
			var rend = this.list.getEnclosingRenderer(evt.target);
			if (rend && this.isItemRenderer(rend)) {
				evt.preventDefault();
				evt.stopPropagation();
				this.defer(function () {
					// deferred such that the user can see the selection feedback
					// before the dropdown closes.
					this.handleOnChange(this.value);
					this.list.emit("execute");
				}.bind(this), 100); // worth exposing a property for the delay?
			}
		}
	},

	listExecuteHandler: function (evt) {
		// Don't let event bubble to a TooltipDialog containing the Combobox.
		evt.stopPropagation();
	},

	listSelectionChangeHandler: function (evt) {
		this._validateInput(evt);
		this.handleOnInput(this.value); // emit "input" event
	},

	listQuerySuccessHandler: function () {
		this.list.deliver();
		this._setSelectedItems();
	},

	/**
	 * Override hook for subclasses that have drill down items, etc.
	 * Return true for "leaf node" renderers (i.e. renderers where
	 * clicking them should close the dropdown).
	 * @param renderer
	 */
	isItemRenderer: function (renderer) {
		return renderer.getAttribute("role") === "option";
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

			this.focusNode.setAttribute("aria-activedescendant", nd.id);
		}
	},

	/**
	 * Called when there's a "keydown" event on the <input>.
	 * @param evt
	 */
	inputKeydownHandler: function (evt) {
		// deliteful issue #382: prevent the browser from navigating to
		// the previous page when typing backspace in a readonly input
		if (this.focusNode.readOnly && evt.key === "Backspace") {
			evt.stopPropagation();
			evt.preventDefault();
		} else if (evt.key === "Enter" || (evt.key === "Spacebar" && !this.autoFilter)) {
			evt.stopPropagation();
			evt.preventDefault();

			// Delegate handling to the list.  This allows subclasses to implement hierarchical menus etc.
			var activeDescendant = this.opened && this.list.querySelector(".d-active-descendant");
			if (activeDescendant) {
				activeDescendant.click();
			}
		} else if (evt.key === "ArrowDown" || evt.key === "ArrowUp" ||
			evt.key === "PageDown" || evt.key === "PageUp" ||
			evt.key === "Home" || evt.key === "End") {
			evt.stopPropagation();
			evt.preventDefault();
		}
	},

	/**
	 * Called when there's an "input" event on the <input>.
	 * @param evt
	 */
	inputInputHandler: function (evt) {
		// Stop the spurious "input" events emitted while the user types
		// such that only the "input" events emitted via LitFormValueWidget.handleOnInput()
		// bubble to widget's root node.
		evt.stopPropagation();
		evt.preventDefault();

		if (this._justFocused) {
			// Ignore spurious "input" event on IE when focusing an <input> with a placeholder.
			return;
		}

		// save what user typed at each keystroke.
		this.displayedValue = this.focusNode.value;

		// TODO
		// Would be nice to also have an "incrementalFilter" boolean property.
		// On desktop, this would allow to redo the filtering only for "change"
		// events, triggered when pressing ENTER. This would also fit for Chrome/Android,
		// where pressing the search key of the virtual keyboard also triggers a
		// change event. But there's no equivalent on Safari / iOS...

		if (this.selectionMode === "single") {
			// Clear value.  No value until user selects something from dropdown again.
			this.value = "";

			if (this.list.selectedItems.length > 0) {
				this.list.selectedItems = [];
			}

			this.handleOnInput(this.value); // if we just cleared this.value then emit "input" event
		}

		// Must set this for dropdown list to be filtered by value in <input>.
		// Furthermore, it must be done after the code above that clears this.vale.
		this._valueSetByUserInput = true;

		if (this._timeoutHandle !== undefined) {
			this._timeoutHandle.remove();
			delete this._timeoutHandle;
		}
		this._timeoutHandle = this.defer(function () {
			// Note: set suppressChangeEvent=true because we shouldn't get a change event because
			// the dropdown closed just because the user backspaced while typing in the <input>.
			this._showOrHideList(true);
		}.bind(this), this.filterDelay);
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

	_validateInput: function (evt) {
		if (this.selectionMode === "single") {
			this._validateSingle();
		} else {
			this._validateMultiple(evt);
		}
	},

	/**
	 * Called for single-select when the user has selected an option in the dropdown.
	 * @private
	 */
	_validateSingle: function () {
		var selectedItem = this.list.selectedItem;
		// selectedItem non-null because List in radio selection mode, but
		// the List can be empty, so:
		this.displayedValue = selectedItem ? this._getItemLabel(selectedItem) : "";
		this.value = selectedItem ? this._getItemValue(selectedItem) : "";
	},

	/**
	 * Called for multi-select when the user has toggled an option in the dropdown.
	 * @private
	 */
	_validateMultiple: function (evt) {
		// If the list is filtered, this.list.selectedItems is a subset of all the selected items.
		// Therefore, need to operate based on which option was toggled.
		// Update this.value, intentionally creating a new array rather than modifying the old one.
		const toggledValue = this._getItemValue(evt.renderer.item);
		if (this.value.includes(toggledValue)) {
			this.value = this.value.filter(value => value !== toggledValue);
		} else {
			this.value = [...this.value, toggledValue];
		}

		// Set the displayed value to represent the selection, unless filtering is enabled,
		// in which case we shouldn't overwrite the user's filter, so the user can do more filtering.
		if (!this.autoFilter) {
			const selectedItems = this.list.selectedItems;
			const n = selectedItems.length;
			this.displayedValue = n === 0 ? this.multipleChoiceNoSelectionMsg :
				n === 1 ? this._getItemLabel(selectedItems[0]) :
					string.substitute(this.multipleChoiceMsg, { items: n });
		}

		// Make sure valueNode.value is set when LitFormValueWidget.handleOnInput() runs.
		if (this.valueNode) {
			this.valueNode.value = this.value.toString();
		}
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
		return (new Filter()).match(this.labelAttr || this.labelFunc, args.rexExp);
	},

	_getDefaultQuery: function () {
		return (typeof this.defaultQuery === "function") ?
			this.defaultQuery() : this.defaultQuery;
	},

	/**
	 * Mark which item(s) in the dropdown list are selected.
	 * @private
	 */
	_setSelectedItems: function () {
		if (this.list && this.list.source && this.list.renderItems) {
			var selectedItems = [],
				presetItems = Array.isArray(this.value) && this.value.length >= 1 ? this.value : [ this.value ];
			selectedItems = this.list.renderItems.filter(function (renderItem) {
				return presetItems.indexOf(this._getItemValue(renderItem)) >= 0;
			}.bind(this));

			this.list.selectedItems = selectedItems;
		}
	},

	/**
	 * Scrolls the list to either:
	 *
	 * 	1) the specified item
	 *	2) the first selected item
	 *  3) the first item
	 *
	 * If `navigate` is true, navigates to the item that it scrolls to.
	 *
	 * Note: Since List is in focus-less mode, it does not give focus to
	 * navigated items, thus the browser does not autoscroll.
	 * TODO: see deliteful #498
	 * @private
	 */
	_updateScroll: function (item, navigate) {
		if (!item) {
			const selectedItems = this.list.selectedItems;
			item = selectedItems && selectedItems[0];
		}

		if (this.selectionMode === "single") {
			if (item) {
				const renderer = this.getRendererByItemId(this.list.getIdentity(item));

				if (renderer) {
					this.list.scrollBy({ y: this.list.getBottomDistance(renderer) });
					if (navigate) {
						// Don't call navigateTo() in single-select mode; it causes the search string to be overwritten
						// by the navigated value.
						this.list.navigatedDescendant = this.list.type === "grid" ?
							renderer.firstElementChild : renderer;
					}
				} // null if the list is empty because no item matches the auto-filtering
			}
		} else {
			const renderer = item ? this.getRendererByItemId(this.list.getIdentity(item)) : this.getFirstRenderer();

			if (renderer) {
				this.list.scrollBy({ y: this.list.getBottomDistance(renderer) });
				if (navigate) {
					this.list.navigateTo(this.list.type === "grid" ? renderer.firstElementChild : renderer);
				}
			} // null if the list is empty because no item matches the auto-filtering
		}
	},

	getRendererByItemId: function (id) {
		var renderers = Array.from(this.list.querySelectorAll("[role=option]"));
		return renderers.find(renderer => this.list.getIdentity(renderer.item) === id);
	},

	getFirstRenderer: function () {
		return this.list.querySelector("[role=option]");
	},

	// Even though the List (currently) runs the query, Combobox is in charge of converting items to renderItems.
	itemToRenderItem: function (item) {
		const store = this.store;
		const mappedKeys = this._mappedKeys;

		const renderItem = {
			id: this.getIdentity(item),
			__item: item
		};

		for (let i = 0; i < mappedKeys.length; i++) {
			renderItem[mappedKeys[i]] = getvalue(this, item, mappedKeys[i], store);
		}

		if (this.copyAllItemProps) {
			for (let key in item) {
				if (this._itemKeys.indexOf(key) === -1 && item.hasOwnProperty(key)) {
					renderItem[key] = item[key];
				}
			}
		}

		return renderItem;
	},

	getIdentity: function (item) {
		return this.source.getIdentity ? this.source.getIdentity(item) :
			item.id !== undefined ? item.id : this.source.indexOf(item);
	}
});
