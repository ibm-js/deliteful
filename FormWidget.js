define([
	"dcl/dcl",
	"dojo/window", // winUtils.scrollIntoView
	"dojo/dom-style", // domStyle
	"./Widget"
], function (dcl, winUtils, domStyle, Widget) {

	// module:
	//		dui/FormWidget

	return dcl(Widget, {
		// summary:
		//		Mixin for widgets that extend HTMLElement, but conceptually correspond
		//		to native HTML elements such as `<checkbox>` or `<button>`,
		//		which can be children of a `<form>` node or a `dui/form/Form` widget.
		//
		// description:
		//		Represents a single HTML element.
		//		All these widgets should have these attributes just like native HTML input elements.
		//		You can set them during widget construction or afterwards, via `dui/Widget.set()`.
		//
		//		They also share some common methods.

		// name: [const] String
		//		Name used when submitting form; same as "name" attribute or plain HTML elements
		name: "",

		// alt: String
		//		Corresponds to the native HTML `<input>` element's attribute.
		alt: "",

		// value: String
		//		Corresponds to the native HTML `<input>` element's attribute.
		value: "",

		// scrollOnFocus: Boolean
		//		On focus, should this widget scroll into view?
		scrollOnFocus: true,

		// tabIndex: Number
		//        The order in which fields are traversed when user hits the tab key
		tabIndex: 0,
		_setTabIndexAttr: function (/*Number*/ value) {
			this._set("tabIndex", value);
			if (!this._postMixInProperties) { return; }
			var isRoot = false;
			this.tabStops.split(/[ ,]/).forEach(
				function (nodeName) {
					var node = this[nodeName];
					if (this[nodeName] !== this) {
						if (this.disabled) {
							node.removeAttribute("tabindex");
						} else {
							node.tabIndex = value;
						}
					} else {
						isRoot = true;
					}
				},
				this
			);
			if (!isRoot) {
				this.removeAttribute("tabindex");
			}
		},

		// tabStops: [const] String
		//        Concatenated list of node names that can receive focus during tab operations
		tabStops: "focusNode", // should be "" if the widget's only tab stop is the outer root node

		// disabled: Boolean
		//		Should this widget respond to user input?
		//		In markup, this is specified as "disabled='disabled'", or just "disabled".
		disabled: false,
		_setDisabledAttr: function (/*Boolean*/ isDisabled) {
			this._set("disabled", isDisabled);
			if (!this._postMixInProperties) { return; }
			if (this.valueNode && this.valueNode !== this) {
				this.valueNode.disabled = isDisabled; // prevent submit
			}
			this.tabStops.split(/[ ,]/).forEach(
				function (nodeName) {
					var node = this[nodeName];
					if (node !== this) {
						node.disabled = isDisabled;
					}
					// let JAWS know
					node.setAttribute("aria-disabled", "" + isDisabled);
				},
				this
			);
			this.setAttribute("aria-disabled", "" + isDisabled);
			if (!isDisabled) {
				this.removeAttribute("disabled");
			}
			this.tabIndex = this.tabIndex; // run tabIndex setter
		},

		_onFocus: dcl.before(function () {
			if (this.scrollOnFocus) {
				this.defer(function () {
					winUtils.scrollIntoView(this);
				}); // without defer, the input caret position can change on mouse click
			}
		}),

		isFocusable: function () {
			// summary:
			//		Tells if this widget is focusable or not.  Used internally by dui.
			// tags:
			//		protected
			return !this.disabled && this.focusNode && (domStyle.get(this, "display") !== "none");
		},

		focus: function () {
			// summary:
			//		Put focus on this widget
			if (!this.disabled && this.focusNode.focus) {
				try {
					this.focusNode.focus();
				} catch (e) {
					// squelch errors from hidden nodes
				}
			}
		},

		createdCallback: dcl.after(function () {
			// summary:
			//		Process interdependent fields: tabStops, tabIndex, disabled
			this._postMixInProperties = true;
			this.disabled = this.disabled; // run disabled setter which also runs tabIndex setter
		})
	});
});
