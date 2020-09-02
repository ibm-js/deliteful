/** @module deliteful/Combobox */
import dcl from "dcl/dcl";
import register from "delite/register";
import HasDropDown from "delite/HasDropDown";
import StoreMap from "delite/StoreMap";
import template from "delite/handlebars!./Combobox/Combobox.html";
import messages from "requirejs-dplugins/i18n!./Combobox/nls/Combobox";
import "./Combobox/Combobox.css";
import string from "dojo/string";
import Filter from "dojo-dstore/Filter";
import FormValueWidget from "delite/FormValueWidget";
import CssState from "delite/CssState";

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
 * In single selection mode, if the property `autoFilter` is set to `true`
 * (default is `false`) the widget allows to type one or more characters which
 * are used for filtering the shown list items. By default, the filtering is
 * case-insensitive, and an item is shown if its label contains the entered
 * string. The default filtering policy can be customized thanks to the
 * `filterMode` and `ignoreCase` properties.
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
const supers = [ HTMLElement, FormValueWidget, CssState, HasDropDown ];
export default register("d-combobox", supers, /** @lends module:deliteful/Combobox# */ {
	declaredClass: "deliteful/Combobox",

	baseClass: "d-combobox",

	template: template,

	/**
	 * Corresponds to the native HTML `<input>` element's attribute.
	 * @member {string}
	 */
	alt: "",

	/**
	 * If `true`, the list of options can be filtered thanks to an editable
	 * input element. Only used if `selectionMode` is "single".
	 * @member {boolean} module:deliteful/Combobox#autoFilter
	 * @default false
	 */
	autoFilter: false,

	/**
	 * Consists in the default query to apply to the source.
	 * It can be a `function` or a `Object`.
	 * If it is a function, then it's invoked and the list's query will get the return value.
	 * If it is an Object, it's assigned to the list's query directly.
	 * It can be overridden depending of store used and the strategy to apply.
	 */
	defaultQuery: {},

	/**
	 * If set to true, the widget will not respond to user input and will not be included in form submission.
	 * FormWidget automatically updates `valueNode`'s and `focusNode`'s `disabled` property to match the widget's
	 * `disabled` property.
	 * @member {boolean}
	 * @default false
	 */
	disabled: false,

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
	 * Displays or not the down arrow button.
	 * @type {boolean}
	 * @default true
	 */
	hasDownArrow: true,

	/**
	 * If `true`, the filtering of list items ignores case when matching possible items.
	 * Only used if `autoFilter` is `true` and `selectionMode` is `"single"`.
	 * @member {boolean} module:deliteful/Combobox#autoFilter
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
	 * - if minFilterChars = 1
	 * -- do not show the dropdown on pointer down.
	 * -- clearing the input field will close the dropdown.
	 * @type {number}
	 * @default 1
	 */
	minFilterChars: 1,

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
	 * Name used when submitting form; same as "name" attribute or plain HTML elements.
	 * @member {string}
	 */
	name: "",

	/**
	 * The text displayed in the OK button when the combobox popup contains such a button.
	 * The default value is provided by the "ok-button-label" key of
	 * the message bundle.
	 * @member {string}
	 * @default "OK"
	 */
	okMsg: messages["ok-button-label"],

	/**
	 * If true, this widget won't respond to user input.  Similar to `disabled` except
	 * `readOnly` form values are submitted.  FormValueWidget automatically updates
	 * `focusNode`'s `readOnly` property to match the widget's `readOnly` property.
	 * @member {boolean}
	 * @default false
	 */
	readOnly: false,

	/**
	 * Sets the `required` property of the focus nodes, or their `aria-required` attribute if they do not support
	 * the `required` property.
	 * @member {boolean}
	 * @default false
	 */
	required: false,

	/**
	 * The value of the placeholder attribute of the input element used
	 * for filtering the list of options. The default value is provided by the
	 * "search-placeholder" key of the message bundle.
	 * @member {string}
	 * @default "Search"
	 */
	searchPlaceHolder: messages["search-placeholder"],

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

	// The Combobox widget is a special component where we don't need to move the
	// aria attributes from the root element to the focusNode. So here we're
	// overriding this property to false, disabling the move procedure.
	moveAriaAttributes: false,

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
		this._inputReadOnly = this.readOnly || !this.autoFilter || this.selectionMode === "multiple";

		// Leave focus in the original <input>, except for multi-select mode, where you need to
		// focus the list to get JAWS to work.
		this.focusOnKeyboardOpen = this.selectionMode === "multiple";

		// If value was specified as a string (like during creation from markup),
		// but selectionMode === multiple, need to convert it to an array.
		if (this.selectionMode === "multiple" && typeof this.value === "string") {
			this.value = this.value ? this.value.split(",") : [];

			// So computeProperties doesn't get called again and oldValues contains "value"
			// but not "displayedValue", which would trigger code below to run.
			this.discardComputing();
		}

		// Set this.displayedValue based on this.value.
		if ("value" in oldValues) {
			if (this.selectionMode === "multiple" && this.value.length === 0) {
				this.displayedValue = this.multipleChoiceNoSelectionMsg;
			} else if (this.selectionMode === "multiple" && this.value.length > 1) {
				this.displayedValue = string.substitute(this.multipleChoiceMsg, { items: this.value.length });
			}
		}
	},

	refreshRendering: function (oldValues) {
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
		}

		if ("value" in oldValues) {
			// Set selected items in dropdown list.  Could alternately do this when dropdown is opened.
			this._setSelectedItems();
		}
	},

	dropDownPosition: function () {
		return [ "below", "above" ];
	},

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
	 * Opens or closes the dropdown as appropriate.
	 */
	_showOrHideList: function (suppressChangeEvent) {
		// Compute whether or not to show the list.
		var inputElement = this.inputNode;
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
			this.filter(this.inputNode.value);

			var promise = sup.apply(this, arguments);

			return promise.then(function () {
				// For single mode, keep focus on <input>, so user can type a search string.
				// But for multiple mode, send focus to the List, to make JAWS work.
				this.dropDown.focusDescendants = this.selectionMode === "multiple";

				// Aria-owns and aria-controls must point to the role=listbox, not the wrapper node.
				// See https://www.w3.org/TR/wai-aria-practices/#combobox.
				this.setAttribute("aria-owns", this.list.widgetId + "-container");
				this.inputNode.setAttribute("aria-controls", this.list.widgetId + "-container");

				this._updateScroll(undefined, true);	// sets this.list.navigatedDescendant
				this._setActiveDescendant(this.list.navigatedDescendant);

				// Avoid spurious error from accessibility DOM scanning tool.
				this.dropDown.tabIndex = -1;
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

			// TODO: destroy dropdown?
		};
	}),

	/**
	 * Search for label of Combobox, so it can be applied to dropdown too.
	 * @returns {any}
	 */
	getLabel: function () {
		var labelNode = (this.focusNode.id &&
			this.ownerDocument.querySelector("label[for=" + this.focusNode.id + "]")) ||
			(this.hasAttribute("aria-labelledby") &&
				this.ownerDocument.getElementById(this.getAttribute("aria-labelledby")));
		return labelNode ? labelNode.textContent.trim() : (this.getAttribute("aria-label") || "");
	},

	loadDropDown: function () {
		var dropDown = this.list;

		dropDown.setAttribute("aria-label", this.getLabel());

		this.dropDown = dropDown; // delite/HasDropDown's property

		return dropDown;
	},


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

	listSelectionChangeHandler: function () {
		this._validateInput();
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

			this.inputNode.setAttribute("aria-activedescendant", nd.id);
		}
	},

	/**
	 * Called when there's a "keydown" event on the <input>.
	 * @param evt
	 */
	inputKeydownHandler: function (evt) {
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
		if (this.list.selectedItems.length > 0) {
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
			this.displayedValue = string.substitute(this.multipleChoiceMsg, { items: n });
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
		return (new Filter()).match(this.labelAttr || this.labelFunc, args.rexExp);
	},

	_getDefaultQuery: function () {
		return (typeof this.defaultQuery === "function") ?
			this.defaultQuery() : this.defaultQuery;
	},

	_setSelectedItems: function () {
		if (this.list.source && this.list.renderItems) {
			var selectedItems = [],
				presetItems = Array.isArray(this.value) && this.value.length >= 1 ? this.value : [ this.value ];
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
			var renderer = this.getRendererByItemId(id);
			if (renderer) {
				this.list.scrollBy({ y: this.list.getBottomDistance(renderer) });
				if (navigate) {
					this.list.navigatedDescendant = this.list.type === "grid" ?
						renderer.firstElementChild : renderer;
				}
			} // null if the list is empty because no item matches the auto-filtering
		}
	},

	getRendererByItemId: function (id) {
		var renderers = Array.from(this.list.querySelectorAll("[role=option]"));
		return renderers.find(renderer => this.list.getIdentity(renderer.item) === id);
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
