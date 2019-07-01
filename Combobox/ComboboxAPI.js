/** @module deliteful/Combobox/ComboboxAPI */
define([
	"dcl/dcl",
	"dstore/Filter",
	"dojo/string",
	"decor/ObservableArray",
	"decor/Observable",
	"delite/CssState",
	"delite/Widget",
	"deliteful/list/List",
	"requirejs-dplugins/i18n!./nls/Combobox"
], function (
	dcl,
	Filter,
	string,
	ObservableArray,
	Observable,
	CssState,
	Widget,
	List,
	messages
) {
	/**
	 * Base class for Combobox on desktop, Combobox on mobile, and the ComboPopup dialog used by Combobox on mobile.
	 * Mainly contains the public properties users can set on the <d-combobox> custom element.
	 */
	return dcl([HTMLElement, Widget], /** @lends module:deliteful/ComboboxAPI# */ {
		/**
		 * Corresponds to the native HTML `<input>` element's attribute.
		 * @member {string}
		 */
		alt: "",

		/**
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
		 * Ignored by ComboPopup.
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
		 * The `deliteful/list/List` element which provides and renders the options
		 * shown by the popup of the Combobox.
		 * Note that this property is set by default to a newly created instance of
		 * `deliteful/list/List`.
		 * @member {module:deliteful/list/List} module:deliteful/Combobox#list
		 * @default instance of deliteful/list/List
		 */
		list: null,

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
		 * @type {dstore/Store|decor/ObservableArray|Array} Source set.
		 */
		source: null,

		/**
		 * The order in which fields are traversed when user presses the tab key.
		 * @member {number}
		 * @default 0
		 */
		tabIndex: 0,

		/**
		 * Corresponds to the native HTML `<input>` element's attribute.
		 * @member {string}
		 */
		value: "",

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

		preRender: function () {
			// If the control seems to contain JSON, then parse it as our data source.
			if (!this.firstElementChild && this.textContent.trim()) {
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

		// If no list specified, then create default one.  Do it after arguments parsed but before
		// template instantiated (simply because ComboPopup template references {{list.id}}.
		connectedCallback: dcl.before(function () {
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
		}),

		computeProperties: function (oldValues) {
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
					this.displayedValue = string.substitute(this.multipleChoiceMsg, {items: this.value.length});
				}
			}
		}
	});
});
