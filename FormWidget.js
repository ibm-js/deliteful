define([
	"dcl/dcl",
	"dojo/window", // winUtils.scrollIntoView
	"dojo/dom-style", // domStyle
	"./Widget",
	"./mixins/Invalidating"
], function (dcl, winUtils, domStyle, Widget, Invalidating) {

	// module:
	//		dui/FormWidget

	return dcl([Widget, Invalidating], {
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

		// tabStops: [const] String
		//        Concatenated list of node names that can receive focus during tab operations
		tabStops: "focusNode", // should be "" if the widget's only tab stop is the outer root node

		// disabled: Boolean
		//		Should this widget respond to user input?
		//		In markup, this is specified as "disabled='disabled'", or just "disabled".
		disabled: false,

		preCreate: function () {
			this.addInvalidatingProperties(
				"disabled",
				"tabStops",
				"tabIndex"
			);
		},

		refreshRendering: dcl.after(function (args) {
			// summary:
			//		Handle disabled and tabIndex, across the tabStops and root node.
			//		No special processing is needed for tabStops other than just to refresh disable and tabIndex.
			var props = args[0];
			var self = this;
			var tabStops = this.tabStops.split(/[ ,]/);
			if (props.tabStops || props.disabled) {
				var isDisabled = this.disabled;
				if (this.valueNode && this.valueNode !== this) {
					this.valueNode.disabled = isDisabled; // prevent submit
				}
				tabStops.forEach(
					function (nodeName) {
						var node = self[nodeName];
						if (node !== self) {
							node.disabled = isDisabled;
						}
						// let JAWS know
						node.setAttribute("aria-disabled", "" + isDisabled);
					},
					this
				);
				if (!isDisabled) {
					this.removeAttribute("disabled");
				}
			}
			if (props.tabStops || props.tabIndex || props.disabled) {
				var isRoot = false;
				tabStops.forEach(
					function (nodeName) {
						var node = self[nodeName];
						if (node !== self) {
							if (self.disabled) {
								node.removeAttribute("tabindex");
							} else {
								node.tabIndex = self.tabIndex;
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
			}
			return props; // for after advice
		}),

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
